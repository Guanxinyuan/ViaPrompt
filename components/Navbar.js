import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import Searchbar from '@/components/Searchbar'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'


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
        console.log('session in navbar: ', session)
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
        <div className='flex flex-row justify-items-baseline container mx-auto py-4 w-full border-b-2 border-zinc-700'>
            <div className='w-1/12 flex justify-center items-center'>
                <p className='font-bold text-xl cursor-pointer' onClick={() => router.push('/')}>Palaxy</p>
            </div>
            <div className="w-4/6 flex text-left">
                {/* <Searchbar /> */}
            </div>

            <div className="w-2/6 grid grid-cols-3 justify-center items-center text-center">

                <div className='text-base flex justify-center items-center cursor-pointer'>
                    {/* <p className="w-fit" onClick={handleClick} router-text="">Database</p> */}
                </div>
                <div className='text-base flex justify-center items-center cursor-pointer'>
                    <p className="text-base cursor-pointer " onClick={handleClick} router-text="generate">Prompt Generator</p>
                </div>
                <div>
                    {
                        username ?
                            <div className=''>
                                <p className="text-base font-bold cursor-pointer" onClick={() => { router.push(`/account`) }}>{username[0].toUpperCase()}</p>
                            </div> :
                            <p className="text-base cursor-pointer" onClick={handleClick} router-text="auth/login">Login</p>

                    }
                </div>
            </div>
        </div>
    );
}
