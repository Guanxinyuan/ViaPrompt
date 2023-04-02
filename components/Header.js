import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import DarkModeButton from '@/components/DarkModeButton';
import { BoltIcon } from '@heroicons/react/24/outline'

// Make buttons board and click to navigate to the given page
export default function Navbar({ supabase, session }) {

    const router = useRouter();
    const [username, setUsername] = useState('')

    useEffect(() => {
        if (session) {
            getProfile()
        }
    }, [session])

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
        <div className='header '>
            <div className='w-1/12 flex justify-center items-center'>
                <p className='font-bold text-xl cursor-pointer' onClick={() => router.push('/')}>Palaxy</p>
            </div>
            <div className="w-4/6 flex text-left">
                {/* <Searchbar /> */}
            </div>

            <div className="w-2/6 grid grid-cols-3 justify-center items-center text-center">
                <div className='flex flex-row gap-2 items-center'>
                    <p>Dark Mode</p>
                    <DarkModeButton />
                </div>
                <div className='header-button text-base flex flex-row justify-center items-center cursor-pointer'>
                    {/* <p className="text-base cursor-pointer " onClick={handleClick} router-text="generate">Prompt Generator</p> */}
                    <BoltIcon className="w-5 h-5" />
                    <p className="text-base cursor-pointer " onClick={handleClick} router-text="upgrade">Upgrade</p>
                </div>
                <div>
                    {
                        username ?
                            <div className=''>
                                <p className="text-base font-bold cursor-pointer" onClick={() => { router.push(`/account`) }}>{username[0].toUpperCase()}</p>
                            </div> :
                            <p className="header-button text-base cursor-pointer" onClick={handleClick} router-text="auth/login">Login</p>

                    }
                </div>
            </div>
        </div>
    );
}
