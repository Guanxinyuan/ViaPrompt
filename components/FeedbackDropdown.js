import { useState, useRef, useEffect } from 'react';
import { ChatBubbleBottomCenterIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { supabaseClient } from '@/lib/supabase';
import { useUser } from '@supabase/auth-helpers-react';

export default function FeedbackDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const dropdownRef = useRef(null);
    const user = useUser();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const feedback = e.target.feedback.value;
        const { error } = await supabaseClient.
            from('feedback').
            insert({
                feedback: feedback,
                user_id: user.id
            })
        if (error) {
            alert(error.message)
        } else {
            setSubmitSuccess(true)
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="flex flex-row gap-1 items-center py-1"
                onClick={toggleDropdown}>
                <ChatBubbleBottomCenterIcon className="w-4 text-yellow-500" />
                <span className='text-yellow-500'>Feedback</span>
            </button>
            <div
                className={`option-dropdown w-96 left-1/2 transform -translate-x-1/2 h-fit pt-4
                ${isOpen ? '' : 'hidden'}`}>
                <form
                    className='flex flex-col gap-4 px-4'
                    onSubmit={handleSubmit}>
                    <label
                        htmlFor="feedback"
                        className="block text-sm font-semibold italic text-gray-700 dark:text-white">
                        Your voice is important to us!
                    </label>
                    <textarea
                        id="feedback"
                        name="feedback"
                        className="mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm dark:bg-zinc-800 dark:text-white resize-none focus:outline-none"
                        rows="4"
                        placeholder="Feature request, comment, advice..." />
                    {/* Footer */}
                    <div className='flex h-full justify-end my-2 gap-2 items-center'>
                        {
                            submitSuccess &&
                            <p className='text-xs text-yellow-500'>Thank you for your feedback!</p>
                        }
                        <button
                            type="submit"
                            className="px-4 py-0.5 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div >
    );
}
