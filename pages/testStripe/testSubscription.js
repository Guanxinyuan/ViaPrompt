import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export default function testStripe() {
    const [subscriptions, setSubscriptions] = useState([]);
    const supabaseClient = useSupabaseClient();

    const fetchSubscription = async () => {
        const { data: subscriptions } = await supabaseClient
            .from('subscriptions')
            .select('*')
        console.log('subscriptions', subscriptions)
        setSubscriptions(subscriptions)
    }
    useEffect(() => {
        fetchSubscription()
    }, [])

    return (
        <div className="min-h-screen text-black flex justify-center items-center">
            <div>
                {subscriptions.map((subscription) => (
                    <div key={subscription.subscription_id}>
                        <h2>{subscription.subscription_id}</h2>
                    </div>
                ))}
            </div>
        </div>

    )
}