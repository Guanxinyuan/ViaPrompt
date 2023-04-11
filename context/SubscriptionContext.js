import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';

const SubscriptionContext = createContext();

export function useSubscription() {
    return useContext(SubscriptionContext);
}

export function SubscriptionProvider({ children }) {
    const [subscription, setSubscription] = useState(null);
    const session = useSession();

    useEffect(() => {
        if (session) {
            const fetchSubscription = async () => {
                const userSubscription = await getSubscriptionByUserId(session.user.id);
                setSubscription(userSubscription);
            };
            fetchSubscription();
        }
    }, [session]);



    const getSubscriptionByUserId = async (userId) => {
        try {
            const response = await fetch(`/api/payment/get-subscription?user_id=${userId}`);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            return data.data
        } catch (err) {
            console.error('Error fetching subscription:', err);
            throw err;
        }
    };

    const value = {
        subscription,
        setSubscription,
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
}
