import { useState, useEffect } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase';
import { ADMIN_EMAILS } from '../../../lib/constants';
import { AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isAdmin: false,
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user) {
          setAuthState({
            isAuthenticated: true,
            isAdmin: true, // Temporary: all authenticated users are admins
            user: session.user,
            loading: false,
            error: null
          });
        } else {
          setAuthState(prev => ({
            ...prev,
            loading: false
          }));
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: err as AuthError
        }));
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        setAuthState({
          isAuthenticated: true,
          isAdmin: true, // Temporary: all authenticated users are admins
          user: session.user,
          loading: false,
          error: null
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isAdmin: false,
          user: null,
          loading: false,
          error: null
        });
      }
    });

    // Check session immediately
    checkSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async () => {
    try {
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (signInError) throw signInError;
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setAuthState(prev => ({
        ...prev,
        error: err as AuthError
      }));
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any stored redirects
      localStorage.removeItem('auth_redirect');
      localStorage.removeItem('show_dog_onboarding');

      // Update auth state immediately
      setAuthState({
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('Logout error:', err);
      setAuthState(prev => ({
        ...prev,
        error: err as AuthError
      }));
    }
  };

  return {
    ...authState,
    login,
    logout
  };
};

export default useAuth;