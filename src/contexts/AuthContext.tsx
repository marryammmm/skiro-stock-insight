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
          console.error('❌ Error fetching user data:', fetchError);
          alert('User ditemukan di Auth tapi tidak ada di database. Coba registrasi ulang.');
          return false;
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

          // Timeout setelah 10 detik
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database timeout - lebih dari 10 detik')), 10000)
          );

          const { error: insertError } = await Promise.race([insertPromise, timeoutPromise]) as any;

          if (insertError) {
            console.error('❌ Error inserting user data:', insertError.message, insertError);
            
            // Cek apakah duplicate entry
            if (insertError.code === '23505') {
              alert('Email sudah terdaftar. Silakan login atau gunakan email lain.');
              return false;
            }
            
            alert(`Error menyimpan data: ${insertError.message}\n\nPeriksa RLS policy di Supabase!`);
            return false;
          }

          console.log('✅ User data inserted successfully');
        } catch (timeoutError: any) {
          console.error('❌ Database insert timeout:', timeoutError);
          alert('Database insert terlalu lama! Kemungkinan masalah RLS Policy.\n\nAkun sudah dibuat di auth.users, tapi gagal insert ke public.users.');
          return false;
        }
        
        // Set user state
        setUser({ email, name, businessName });
        
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
