import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Account({ session }) {
    const supabase = useSupabaseClient()
    const user = useUser()
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMismatch, setPasswordMismatch] = useState(false)
    const [passwordTooShort, setPasswordTooShort] = useState(false)
    const [updateSuccess, setUpdateSuccess] = useState(false)

    useEffect(() => {
        getProfile()
    }, [session])


    useEffect(() => { }, [updateSuccess])

    useEffect(() => {
        if (newPassword.length > 0) {
            if (newPassword.length < 6) {
                setPasswordTooShort(true)
            } else {
                setPasswordTooShort(false)
            }
        } else {
            setPasswordTooShort(false)
        }
    }, [newPassword])


    useEffect(() => {
        if (newPassword.length > 0) {
            if (confirmPassword.length > 0) {
                if (newPassword !== confirmPassword) {
                    setPasswordMismatch(true)
                } else {
                    setPasswordMismatch(false)
                }
            } else {
                setPasswordMismatch(false)
            }
        } else {
            setPasswordMismatch(false)
        }
    }, [newPassword, confirmPassword])


    async function getProfile() {
        try {
            setLoading(true)

            let { data, error, status } = await supabase
                .from('profiles')
                .select(`username`)
                .eq('id', user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setUsername(data.username)
            }
        } catch (error) {
            console.log('Error loading user data!')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile({ username }) {

        setLoading(true)
        const updates = {
            id: user.id,
            username,
            updated_at: new Date().toISOString(),
        }
        let { error } = await supabase.from('profiles').upsert(updates)
        if (error) throw error
    }


    async function updatePassword({ newPassword }) {

        let { data, error } = await supabase.auth
            .updateUser({ password: newPassword })
        if (error) throw error

    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {

            await updateProfile({ username })
            if (newPassword && newPassword === confirmPassword) {
                await updatePassword({ newPassword })
            }
            setUpdateSuccess(true)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="form-widget flex flex-col gap-5 pt-2 pb-10 text-sm">
            <div className='flex flex-col gap-1'>
                <label className='font-bold' htmlFor="email">Email *</label>
                <input readOnly className='text-gray-600 border border-gray-500 px-2 py-1 rounded-md' id="email" type="text" value={session.user.email} />
            </div>
            <div className='flex flex-col gap-1'>
                <label className='font-bold text-sm' htmlFor="username">Username *</label>
                <input
                    className='text-gray-600 border border-gray-500 px-2 py-1 rounded-md'
                    id="username"
                    type="text"
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className='flex flex-col gap-1'>
                <label className='font-bold' htmlFor="password">Password *</label>
                <input
                    className='text-gray-600 border border-gray-500 px-2 py-1 rounded-md'
                    id="password"
                    type="password"
                    readOnly
                    value={"????????"}
                />
            </div>

            <div className='flex flex-col gap-1'>
                <label className='font-bold' htmlFor="password">New Password</label>
                <input
                    className='text-gray-600 border border-gray-500 px-2 py-1 rounded-md'
                    id="newPassword"
                    type="password"
                    value={newPassword || ''}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                {passwordTooShort && <p className='text-red-500 text-xs'>Password too short</p>}
            </div>

            <div className='flex flex-col gap-1'>
                <label className='font-bold' htmlFor="password">Confirm Password</label>
                <input
                    className='text-gray-600 border border-gray-500 px-2 py-1 rounded-md'
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword || ''}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {
                    passwordMismatch && <p className='text-red-500 text-xs'>Password mismatch</p>
                }
            </div>

            <div className='flex flex-col gap-2'>
                <div className='mt-4 text-center flex flex-col gap-1'>
                    {updateSuccess &&
                        <p className='text-green-500 text-xs'>Success! Profile updated</p>
                    }
                    <button
                        className="button font-bold block cursor-pointer px-2 py-2 rounded-md items-center justify-center bg-yellow-400 w-full hover:bg-yellow-500"
                        onClick={onSubmitHandler}
                        disabled={loading}
                    >
                        {loading ? 'LOADING ...' : 'UPDATE'}
                    </button>
                </div>

                <div>
                    <button
                        className="button font-bold block cursor-pointer px-2 py-2 rounded-md items-center justify-center bg-gray-500 w-full hover:bg-gray-700 text-white"
                        onClick={() => supabase.auth.signOut()}
                        disabled={loading}
                    >
                        SIGN OUT
                    </button>
                </div>
            </div>

        </div>
    )
}