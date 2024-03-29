import { createContext, useContext, useState, useEffect } from 'react';
import { useSupabaseClient, useUser, useSession } from '@supabase/auth-helpers-react';


const SubscriptionContext = createContext();

export function useSubscription() {
    return useContext(SubscriptionContext);
}

export function SubscriptionProvider({ children }) {
    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const session = useSession();
    const user = useUser();
    const supabaseClient = useSupabaseClient();

    useEffect(() => {
        if (session && user) {
            const fetchSubscription = async () => {
                const userSubscription = await getSubscriptionByUserId(user.id);
                setSubscription(userSubscription);

                setIsLoading(false);
            };
            fetchSubscription();
        }
    }, [session, user]);



    // const getSubscriptionByUserId = async (userId) => {
    //     try {
    //         const response = await fetch(`/api/payment/get-subscription?user_id=${userId}`);
    //         const data = await response.json();

    //         if (!data.success) {
    //             throw new Error(data.message);
    //         }

    //         return data.data
    //     } catch (err) {
    //         console.error('Error fetching subscription:', err);
    //         throw err;
    //     }
    // };

    const getSubscriptionByUserId = async (userId) => {
        try {
            const { data, error } = await supabaseClient
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error) {
                throw new Error('Error fetching subscription:', error);
            }

            return data

        } catch (error) {
            console.error('Error fetching subscription:', error);
            throw error;
        }
    };

    const value = {
        subscription,
        setSubscription,
        isLoading,
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
}
