import { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProfilePanel from '@/components/ProfilePanel';
import SubscriptionPanel from '@/components/SubscriptionPanel';
import { useSubscription } from '@/context/SubscriptionContext';
import { useSession } from '@supabase/auth-helpers-react';


export default function SettingsPage() {
    const { subscription } = useSubscription();
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push('/auth/login');
        }
    }, [session]);


    return (
        <Fragment>
            <Head>
                <title>User Account</title>
                <meta name="description" content="User account information and billing" />
            </Head>

            <div className="w-full min-h-screen mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className='w-3/5 h-max mx-auto flex flex-row gap-6 p-4'>
                    <ProfilePanel />
                    <SubscriptionPanel />
                </div>
            </div>
        </Fragment>
    );
};