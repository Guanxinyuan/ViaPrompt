import { Fragment, useState, useEffect } from 'react';
import Head from 'next/head';
import ProfilePanel from '@/components/ProfilePanel';
import SubscriptionPanel from '@/components/SubscriptionPanel';


export default function SettingsPage() {
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