import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Authenticate() {
    const user = useUser();
    const router = useRouter();
    const session = useSession();
    const supabase = useSupabaseClient();

    useEffect(() => {
        if (session) {
            router.push('/settings');
        }
    }, [session]);

    return (
        <div className="min-h-screen ">
            <div className="auth-container">
                <div className="container px-10 pt-6 w-full">
                    <Auth
                        supabaseClient={supabase}
                        appearance={{
                            theme: ThemeSupa,
                        }}
                        theme="default"
                    />
                </div>
            </div>
        </div>
    );
}
