import '../styles/globals.css'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { SubscriptionProvider } from '@/context/SubscriptionContext';
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
    //  text-gray-800
    // <div className='bg-zinc-800 text-white'>
    <div className='global-container'>
      <Navbar supabase={supabase} session={session} />
      <SubscriptionProvider>
        <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
          <Component {...pageProps} />
          <Analytics />
        </SessionContextProvider>
      </SubscriptionProvider>
    </div>
  )
}
export default MyApp