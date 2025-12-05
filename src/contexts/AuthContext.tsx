import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, type AuthUser } from '@/lib/supabase';

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

  useEffect(() => {
    // Check if user is already logged in from Supabase
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user data from database
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userData && !error) {
            setUser({
              email: userData.email,
              name: userData.name,
              businessName: userData.business_name
            });
          }
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
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔵 Starting login for:', email);
      
      // Try Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Login auth error:', error.message, error);
        
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
        
        alert(`Error login: ${error.message}`);
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
      alert(`Terjadi kesalahan: ${error}`);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string, businessName?: string): Promise<boolean> => {
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
        alert(`Error saat registrasi: ${error.message}`);
        return false;
      }

      console.log('✅ Auth user created:', data.user?.id);
      console.log('Session:', data.session ? 'Created' : 'NULL - Email confirmation required');

      if (data.user) {
        // Insert user data into users table dengan timeout
        console.log('🔵 Inserting user data into database...');
        
        let dataInserted = false;
        
        try {
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

          // Timeout setelah 5 detik (lebih cepat)
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database timeout')), 5000)
          );

          const { error: insertError } = await Promise.race([insertPromise, timeoutPromise]) as any;

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
      alert(`Terjadi kesalahan: ${error}`);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
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
