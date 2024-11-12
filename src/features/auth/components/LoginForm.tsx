import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../../lib/supabase';

interface LoginFormProps {
  redirectTo?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ redirectTo }) => {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: '#2563eb',
              brandAccent: '#1d4ed8',
            },
          },
        },
        className: {
          container: 'supabase-auth-container',
          button: 'supabase-auth-button',
          input: 'supabase-auth-input',
        },
      }}
      providers={['google']}
      redirectTo={redirectTo || `${window.location.origin}/auth/callback`}
      onlyThirdPartyProviders={true}
    />
  );
};

export default LoginForm;