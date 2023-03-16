import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import AccountSettings from '@/components/AccountSettings'

export default function Authenticate() {
    const session = useSession()
    const supabase = useSupabaseClient()

    return (
        <div className='min-h-screen'>
            <div className='auth-container'>
                <div className="container px-10 pt-6 w-full">
                    {!session ? (
                        <Auth
                            supabaseClient={supabase}
                            appearance={{
                                theme: ThemeSupa,
                                style: {
                                    input: { color: 'white' },
                                    button: { fontSize: '14px' },
                                }
                            }}
                            theme="default"
                        />
                    ) : (
                        <div>
                            <AccountSettings session={session} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
