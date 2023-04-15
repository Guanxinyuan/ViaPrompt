import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import DarkModeButton from '@/components/DarkModeButton';
import useColorMode from '@/hooks/useColorMode'
import { BoltIcon, RocketLaunchIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import UserGuideDropdown from './UserGuideDropdown';

// Make buttons board and click to navigate to the given page
export default function Navbar({ supabase, session }) {

    const router = useRouter();
    const [username, setUsername] = useState('')
    const [colorMode, setColorMode] = useColorMode()
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (session) {
            getProfile()
        }
    }, [session])

    useEffect(() => {
        if (colorMode) {

            setIsInitialized(true);
        }
    }, [])

    const getProfile = async () => {
        try {
            const { data, error, status } = await supabase
                .from('profiles')
                .select(`username`)
                .eq('id', session.user.id)
                .single()

            if (error && status !== 406) throw error
            if (data) setUsername(data.username)

        } catch (error) {
            console.log('Error loading user data!')
            console.log(error)
        }
    }

    const handleClick = (e) => {
        router.push(`/${e.target.getAttribute('router-text')}`)
    };


    return (
        <div className='header px-10'>
            <div className='w-1/6 flex justify-left grid grid-cols-2'>
                <p className='font-bold text-lg cursor-pointer' onClick={() => router.push('/')}>Palaxy</p>
                <UserGuideDropdown triggerButtonSize={"w-5 h-5"} />
            </div>
            <div className="flex text-left flex-grow"></div>

            <div className="flex-grow flex flex-row gap-8 justify-end items-center text-center">
                <div className='header-button flex flex-row gap-2 items-center text-sm'>
                    <DarkModeButton colorModeSetter={setColorMode} />
                    {isInitialized && colorMode == 'light' && <p>Dark Mode</p>}
                    {isInitialized && colorMode == 'dark' && <p>Light Mode</p>}
                    {/* <p>Dark Mode</p> */}
                </div>
                <div className='header-button flex flex-row gap-0.5 justify-center items-center cursor-pointer'>
                    <RocketLaunchIcon className="w-5 h-5" />
                    <p className="cursor-pointer " onClick={handleClick} router-text="workspace">Workspace</p>
                </div>
                <div className='header-button '>
                    <BoltIcon className="w-5 h-5" />
                    <p className="cursor-pointer " onClick={handleClick} router-text="pricing">Upgrade</p>
                </div>
                <div>
                    {
                        username ?
                            <p className='header-button rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 py-1 dark:hover:text-white' onClick={() => { router.push(`/settings`) }}>{username}</p>
                            :
                            <p className="header-button" onClick={handleClick} router-text="auth/login">Login</p>

                    }
                </div>
            </div>
        </div>
    );
}
