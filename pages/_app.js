import '../styles/globals.css'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import Navbar from "@/components/Navbar";

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
    <div>
      <Navbar supabase={supabase} session={session} />
      <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
        <Component {...pageProps} />
      </SessionContextProvider>
    </div>
  )
}
export default MyApp