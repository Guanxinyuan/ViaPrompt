import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@/lib/supabase';
import { useUser } from '@supabase/auth-helpers-react';

const CreditsContext = createContext();

export function useCredits() {
    return useContext(CreditsContext);
}

export function CreditsProvider({ children }) {
    const [credits, setCredits] = useState(null);
    const session = useSession();
    const user = useUser();

    useEffect(() => {
        if (session && user) {
            fetchCredits();
        }
    }, [session, user]);

    const fetchCredits = useCallback(async () => {
        try {
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('total_free_credits, free_credits_balance, total_credits, credits_balance')
                .eq('id', user.id)
                .single();

            if (error) {
                throw error

            }

            setCredits({
                totalFreeCredits: data.total_free_credits,
                freeCreditsBalance: data.free_credits_balance,
                totalCredits: data.total_credits,
                creditsBalance: data.credits_balance,
            });
        } catch (err) {
            console.error('Error fetching credits:', err);
            throw err;
        }
    }, [user]);


    const value = {
        credits,
        setCredits,
    };

    return (
        <CreditsContext.Provider value={value}>
            {children}
        </CreditsContext.Provider>
    );
}
