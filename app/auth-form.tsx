'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { useEffect, useState } from 'react'

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>()
  const [url, setUrl] = useState('');

  useEffect(() => {
    // This code runs on the client side only
    setUrl(window.location.href);
  }, []);

  
  return (
    <Auth
      supabaseClient={supabase}
      view="magic_link"
      appearance={{ theme: ThemeSupa }}
      theme="dark"
      showLinks={false}
      providers={[]}
      redirectTo={`${url}auth/callback`}
    />
  )
}