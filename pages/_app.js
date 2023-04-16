import '../styles/globals.css'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { CreditsProvider } from '@/context/CreditsContext';
import { Analytics } from '@vercel/analytics/react';
import { useState, useEffect } from 'react'
import Navbar from "@/components/Header";

function MyApp({ Component, pageProps }) {
  const [supabase] = useState(() => createBrowserSupabaseClient())
  const [session, setSession] = useState(null);

  useEffect(() => {
    processSession();
  }, []);

  const processSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    setSession(session);
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }

  return (
    //  text-zinc-800
    // <div className='bg-zinc-800 text-white'>
    <div className='global-container'>
      <Navbar supabase={supabase} session={session} />
      <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
        <SubscriptionProvider>
          <CreditsProvider>
            <Component {...pageProps} />
            <Analytics />
          </CreditsProvider>
        </SubscriptionProvider>
      </SessionContextProvider>
    </div>
  )
}
export default MyApp