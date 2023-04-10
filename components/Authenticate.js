import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useSubscription } from '@/context/SubscriptionContext';

export default function Authenticate() {
    const user = useUser();
    const router = useRouter();
    const session = useSession();
    const supabase = useSupabaseClient();
    const { setSubscription } = useSubscription(); // Move the hook to the top level

    useEffect(() => {
        if (session) {
            const fetchSubscription = async () => {
                const userSubscription = await getSubscriptionByUserId(user.id);
                setSubscription(userSubscription);
            };

            fetchSubscription();
            router.push('/settings');
        }
    }, [session]);

    const getSubscriptionByUserId = async (userId) => {
        try {
            const response = await fetch(`/api/payment/get-subscription?user_id=${userId}`);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            return data.data;
        } catch (err) {
            console.error('Error fetching subscription:', err.message);
            throw err;
        }
    };

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
