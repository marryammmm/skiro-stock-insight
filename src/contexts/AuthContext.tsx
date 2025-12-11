import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, type AuthUser } from '@/lib/supabase';

interface User {
  email: string;
  name: string;
  businessName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, businessName?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastAuthError, setLastAuthError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  // Utility: clear client-side Supabase storage to fix stuck sessions
  const clearSupabaseClientStorage = async () => {
    try {
      await supabase.auth.signOut().catch(() => {});
      const toRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.includes('supabase') || key.startsWith('sb-') || key.startsWith('security_')) {
          toRemove.push(key);
        }
      }
      toRemove.forEach(k => { try { localStorage.removeItem(k); } catch {} });
      try { sessionStorage.clear(); } catch {}
      try {
        // @ts-ignore IndexedDB databases API may not exist in all browsers
        if (indexedDB && indexedDB.databases) {
          // @ts-ignore
          const dbs = await indexedDB.databases();
          (dbs || []).forEach((db: any) => {
            if (db?.name) {
              try { indexedDB.deleteDatabase(db.name); } catch {}
            }
          });
        }
      } catch {}
    } catch {}
  };

  useEffect(() => {
    // Configuration check
    if (!isSupabaseConfigured) {
      setConfigError('Supabase belum dikonfigurasi. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY terisi.');
      setIsLoading(false);
      return;
    }

    // Check if user is already logged in from Supabase, with a hard timeout
    const checkAuth = async () => {
      try {
        const getSessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3000));
        const result: any = await Promise.race([getSessionPromise, timeoutPromise]);
        const session = result?.data?.session;
        
        if (session?.user) {
          // Get user data from database, with fallback if blocked by RLS or errors
          try {
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (userData) {
              setUser({
                email: userData.email,
                name: userData.name,
                businessName: userData.business_name
              });
            } else {
              // Fallback to auth session user
              setUser({
                email: session.user.email || '',
                name: (session.user as any)?.user_metadata?.name || 'User',
                businessName: (session.user as any)?.user_metadata?.business_name || undefined
              });
            }
          } catch (_) {
            setUser({
              email: session.user.email || '',
              name: (session.user as any)?.user_metadata?.name || 'User',
              businessName: (session.user as any)?.user_metadata?.business_name || undefined
            });
          }
        } else {
          // No session: ensure UI can continue
          setUser(null);
        }
      } catch (e) {
        console.error('Auth check error:', e);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userData && !fetchError) {
            setUser({
              email: userData.email,
              name: userData.name,
              businessName: userData.business_name
            });
          } else {
            // Fallback to auth session user
            setUser({
              email: session.user.email || '',
              name: (session.user as any)?.user_metadata?.name || 'User',
              businessName: (session.user as any)?.user_metadata?.business_name || undefined
            });
          }
        } catch (_) {
          setUser({
            email: session.user.email || '',
            name: (session.user as any)?.user_metadata?.name || 'User',
            businessName: (session.user as any)?.user_metadata?.business_name || undefined
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        if (lastAuthError) {
          // After an auth error leading to sign out, ensure cleanup
          clearSupabaseClientStorage();
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [lastAuthError]);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!isSupabaseConfigured) {
      alert('Supabase belum dikonfigurasi. Set environment variables terlebih dahulu.');
      return false;
    }
    try {
      console.log('🔵 Starting login for:', email);
      
      // Try Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Login auth error:', error.message, error);
        setLastAuthError(error.message || 'Login error');
        
        // Cek apakah user belum konfirmasi email
        if (error.message.includes('Email not confirmed')) {
          alert('Email belum dikonfirmasi. Cek inbox email Anda atau matikan email confirmation di Supabase.');
          return false;
        }
        
        // Cek apakah credential salah
        if (error.message.includes('Invalid login credentials')) {
          alert('Email atau password salah. Pastikan Anda sudah registrasi.');
          return false;
        }
        
        // Smart retry once after cleanup
        console.log('🧹 Attempting cleanup and single retry for login...');
        await clearSupabaseClientStorage();
        const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({ email, password });
        if (retryError) {
          alert(`Error login: ${retryError.message}`);
          return false;
        }
        console.log('✅ Retry auth successful, user ID:', retryData.user?.id);
        // Continue to user fetch flow using retryData
        const authUser = retryData.user;
        if (authUser) {
          const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();
          if (fetchError || !userData) {
            setUser({
              email: authUser.email || email,
              name: authUser.user_metadata?.name || 'User',
              businessName: authUser.user_metadata?.business_name || null
            });
            alert('Login berhasil setelah retry! Data profil belum lengkap, silakan update di dashboard.');
            return true;
          }
          setUser({
            email: userData.email,
            name: userData.name,
            businessName: userData.business_name
          });
          return true;
        }
        return false;
      }

      console.log('✅ Auth successful, user ID:', data.user?.id);

      // Get user data from database
      if (data.user) {
        console.log('🔵 Fetching user data from database...');
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (fetchError) {
          console.error('⚠️ User data not found in public.users, using auth data:', fetchError);
          
          // Fallback: gunakan data dari auth.users saja
          setUser({
            email: data.user.email || email,
            name: data.user.user_metadata?.name || 'User',
            businessName: data.user.user_metadata?.business_name || null
          });
          
          console.log('⚠️ Login berhasil dengan data minimal. Silakan update profil di dashboard.');
          alert('Login berhasil! Data profil Anda tidak lengkap, silakan update di dashboard.');
          return true;
        }
        
        if (userData) {
          console.log('✅ User data found:', userData.name);
          setUser({
            email: userData.email,
            name: userData.name,
            businessName: userData.business_name
          });
          return true;
        }
      }
      
      console.error('❌ No user data returned');
      return false;
    } catch (error) {
      console.error('❌ Login exception:', error);
      setLastAuthError(String(error));
      alert(`Terjadi kesalahan: ${error}`);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string, businessName?: string): Promise<boolean> => {
    if (!isSupabaseConfigured) {
      alert('Supabase belum dikonfigurasi. Set environment variables terlebih dahulu.');
      return false;
    }
    try {
      console.log('🔵 Starting signup process for:', email);
      
      // Create auth user in Supabase with options
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            business_name: businessName || null,
          }
        }
      });

      if (error) {
        console.error('❌ Signup auth error:', error.message, error);
        setLastAuthError(error.message || 'Signup error');
        // Smart retry once after cleanup
        console.log('🧹 Attempting cleanup and single retry for signup...');
        await clearSupabaseClientStorage();
        const { data: retryData, error: retryError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, business_name: businessName || null } }
        });
        if (retryError) {
          alert(`Error saat registrasi: ${retryError.message}`);
          return false;
        }
        // Continue with retryData below by emulating success path
        const retryUser = retryData.user;
        if (retryUser) {
          setUser({ email: retryUser.email || email, name, businessName });
          console.log('✅ Signup successful after retry!');
          return true;
        }
        alert('Registrasi gagal setelah retry.');
        return false;
      }

      console.log('✅ Auth user created:', data.user?.id);
      console.log('Session:', data.session ? 'Created' : 'NULL - Email confirmation required');

      if (data.user) {
        // Insert user data into users table dengan timeout
        console.log('🔵 Inserting user data into database...');
        
        let dataInserted = false;
        
        try {
          console.log('📝 Preparing to insert user data...');
          const insertPromise = supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                email: email,
                name: name,
                business_name: businessName || null,
              }
            ]);

          console.log('📝 Waiting for database response (5s timeout)...');
          // Timeout setelah 5 detik (lebih cepat)
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database timeout')), 5000)
          );

          const { error: insertError } = await Promise.race([insertPromise, timeoutPromise]) as any;
          console.log('📝 Database response received');

          if (insertError) {
            console.error('⚠️ Error inserting user data:', insertError.message, insertError);
            console.log('⚠️ Continuing signup without public.users data...');
            dataInserted = false;
          } else {
            console.log('✅ User data inserted successfully');
            dataInserted = true;
          }
        } catch (timeoutError: any) {
          console.error('⚠️ Database insert timeout - RLS policy might be blocking');
          console.log('⚠️ Continuing signup without public.users data...');
          dataInserted = false;
        }
        
        // Set user state (gunakan data dari auth.user)
        setUser({ 
          email: data.user.email || email, 
          name: name, 
          businessName: businessName 
        });
        
        // SELALU BERHASIL jika auth user terbuat
        console.log('✅ Signup successful! Auth user created.');
        
        if (!dataInserted) {
          console.log('⚠️ Note: User profile data not saved to public.users (RLS issue)');
        }
        
        // Jika tidak ada session (email confirmation required)
        if (!data.session) {
          console.log('⚠️ Email confirmation required - but user can still login');
        }
        
        return true;
      }
      
      console.error('❌ No user data returned from signup');
      return false;
    } catch (error) {
      console.error('❌ Signup exception:', error);
      setLastAuthError(String(error));
      alert(`Terjadi kesalahan: ${error}`);
      return false;
    }
  };

  const logout = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      return;
    }
    try {
      await supabase.auth.signOut();
      await clearSupabaseClientStorage();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
