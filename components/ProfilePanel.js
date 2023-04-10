
import { useState, useEffect } from 'react';
import { useUser, useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

export default function ProfilePanel() {
    const supabase = useSupabaseClient()
    const user = useUser()
    const session = useSession()

    const [loading, setLoading] = useState(true)
    const [edittingUsername, setEdittingUsername] = useState(false)
    const [resettingPassword, setResettingPassword] = useState(false)
    const [isValidOldPassword, setIsValidOldPassword] = useState(true)

    const [updateSuccess, setUpdateSuccess] = useState({
        username: false,
        password: false,
    })

    const [email, setEmail] = useState('');

    const [username, setUsername] = useState('')
    const [newUsername, setNewUsername] = useState('')

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMismatch, setPasswordMismatch] = useState(false)
    const [passwordTooShort, setPasswordTooShort] = useState(false)

    useEffect(() => {
        getProfile()
        console.log('session', session)
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


    const getProfile = async () => {
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
                setEmail(user.email)
                setUsername(data.username)
            }
        } catch (error) {
            console.log('Error loading user data!')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const switchEdittingUsername = () => {
        setUpdateSuccess({ ...updateSuccess, username: false })
        setEdittingUsername(!edittingUsername)
    }

    const switchPasswordReset = () => {
        setUpdateSuccess({ ...updateSuccess, password: false })
        setResettingPassword(!resettingPassword)
    }

    const validateOldPassword = async () => {
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email,
            password: oldPassword,
        });

        signInError ? setIsValidOldPassword(false) : setIsValidOldPassword(true);
        return signInError ? false : true;
    }

    const updateProfile = async (e) => {
        e.preventDefault()
        try {
            const updates = {
                id: user.id,
                username: newUsername,
                updated_at: new Date().toISOString(),
            }
            let { error } = await supabase.from('profiles').upsert(updates)
            if (error) throw error
            setUsername(newUsername)
            setUpdateSuccess({ ...updateSuccess, username: true })
            setTimeout(() => {
                setEdittingUsername(false)
                setNewUsername('')
            }, 700)
        } catch (error) {
            console.log(error)
            console.log('Error updating profile')
        } finally {
            setLoading(false)
        }
    }

    const updatePassword = async (e) => {
        e.preventDefault()
        try {
            if (!await validateOldPassword()) {
                alert('Current password is invalid')
                return
            }
            if (newPassword && newPassword === confirmPassword) {
                let { data, error } = await supabase.auth
                    .updateUser({ password: newPassword })
                if (error) throw error
            }
            setUpdateSuccess({ ...updateSuccess, password: true })
            setTimeout(() => {
                setResettingPassword(false)
                setNewPassword('')
                setConfirmPassword('')
                setOldPassword('')
            }, 700)
        } catch (error) {
            console.log(error)
            console.log('Error updating password')
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="settings-panel w-2/5 ">
            <h2 className="settings-title">Profile</h2>
            <div className="settings-panel-body flex-grow relative">
                <div className="settings-panel-item">
                    <label className="settings-panel-label">Email</label>
                    <p className='settings-panel-value'>{email}</p>
                </div>
                <div className="settings-panel-item">
                    <label className="settings-panel-label">Username</label>
                    {
                        !edittingUsername &&
                        <div className='flex flex-row justify-between items-center'>
                            <p className='settings-panel-value'>{username}</p>
                            <button className="settings-panel-text-button text-sm text-left"
                                onClick={switchEdittingUsername}>
                                Edit
                            </button>
                        </div>
                    }
                </div>
                {
                    edittingUsername && <form className='password-reset-panel' onSubmit={updateProfile}>
                        <div className='flex flex-col'>
                            <div className='account-setting-input-container'>

                                <label className='account-setting-input-label' htmlFor="password">New Username</label>
                                <input
                                    id="newUsername"
                                    placeholder={username}
                                    value={newUsername || ''}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                />
                                {
                                    updateSuccess.username &&
                                    <p className='text-green-500 text-xs'>Success! Profile updated</p>
                                }
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='mt-4 text-center flex flex-col gap-1 items-center'>
                                <div className='w-full flex justify-between'>
                                    <button
                                        type='submit'
                                        className="settings-panel-button w-fit text-sm font-semibold rounded-lg"
                                        disabled={loading}>
                                        {loading ? 'Loading ...' : 'Save'}
                                    </button>
                                    <button
                                        className={`settings-panel-text-button text-sm font-semibold text-red-500 dark:text-red-500 dark:hover:text-red-600`}
                                        onClick={switchEdittingUsername}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                }
                {/* <div className="settings-panel-item">
                    <label className="settings-panel-label">Password</label>
                    <div className='flex flex-row justify-between items-start'>
                        <p className='settings-panel-value'>********</p>
                        <button
                            className="settings-panel-text-button text-xs text-left"
                            onClick={switchPasswordReset}>
                            Reset
                        </button>
                    </div>
                </div>
                <div>


                    {
                        resettingPassword && <form className='password-reset-panel' onSubmit={updatePassword}>
                            <div className='flex flex-col gap-2'>
                                <div className='account-setting-input-container'>

                                    <label className='account-setting-input-label' htmlFor="password">Current Password</label>
                                    <input
                                        id="oldPassword"
                                        type="password"
                                        value={oldPassword || ''}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                    {!isValidOldPassword && <p className='text-red-500 text-xs'>Incorrect Password</p>}
                                </div>

                                <div className='account-setting-input-container'>
                                    <label className='account-setting-input-label' htmlFor="password">New Password</label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword || ''}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    {passwordTooShort && <p className='text-red-500 text-xs'>Password too short</p>}
                                </div>

                                <div className='account-setting-input-container'>
                                    <label className='account-setting-input-label' htmlFor="password">Confirm Password</label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword || ''}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    {
                                        passwordMismatch && <p className='text-red-500 text-xs'>Password mismatch</p>
                                    }
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <div className='mt-4 text-center flex flex-col gap-1 items-center'>
                                    {updateSuccess.password &&
                                        <p className='text-green-500 text-xs'>Success! Profile updated</p>
                                    }
                                    <div className='w-full flex justify-between'>
                                        <button
                                            type='submit'
                                            className="settings-panel-button w-fit text-xs font-semibold"
                                            disabled={loading}>
                                            {loading ? 'Loading ...' : 'Save'}
                                        </button>
                                        <button
                                            className={`settings-panel-text-button text-xs font-semibold text-red-500 dark:text-red-500 dark:hover:text-red-600`}
                                            onClick={switchPasswordReset}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    }
                </div> */}
                <button
                    className="settings-panel-text-button absolute bottom-4 w-fit text-red-500 dark:text-red-500 dark:hover:text-red-600"
                    onClick={() => supabase.auth.signOut()}
                    disabled={loading}>
                    Sign out
                </button>
            </div>
        </div>
    )
}