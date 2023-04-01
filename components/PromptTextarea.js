import { PaperAirplaneIcon, ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import ContentEditable from 'react-contenteditable'

export default function PromptTextarea({ contentText, lockInput, mode, cardId, className }) {

    const [content, setContent] = useState(contentText);
    const [contentWordCount, setContentWordCount] = useState(contentText ? contentText.trim().split(' ').length : 0);

    const onChangeHandler = (e) => {
        setContent(e.target.value)
        if (e.target.value.trim() === '') {
            setContentWordCount(0);
        } else {
            setContentWordCount(e.target.value.trim().split(' ').length);
        }

    }

    const onRedoHandler = async (e) => {
        const response = await fetch(`/api/cards/update`, {
            method: 'PUT',
            body: JSON.stringify({
                cardId: cardId,
                editedPrompt: content,
                mode: mode,
            }),
        });
        const result = await response.json();
        const message = result.message;
        alert('response: ' + message)
    }

    const onSubmitHandler = async (e) => {
        const response = await fetch(`/api/cards/create`, {
            method: 'POST',
            body: JSON.stringify({
                originalPrompt: content,
                mode: mode,
            }),
        });

        const result = await response.json();
        const data = result.data;
        console.log('Data', data)
    }

    const onDeleteHandler = async (e) => {
        const response = await fetch(`/api/cards/delete`, {
            method: 'DELETE',
            body: JSON.stringify({
                cardId: cardId,
            }),
        });
        const result = await response.json();
        const message = result.message;
        alert('response: ' + message)
    }

    return (
        <div className={`prompt-card-body-content-body min-h-full ${className}`}>
            <div className="w-full h-full inline-block overflow-y-hidden rounded-md">
                <ContentEditable
                    html={content}
                    disabled={lockInput}
                    tagName="div"
                    className={`prompt-card-body-content ${content === null || content.trim() === '' ? 'before-visible' : 'before-hidden'}`}
                    onChange={onChangeHandler}
                // onBlur={onInputHandler}
                />
            </div>
            <div class="prompt-card-body-content-word-count">
                <p id="word-count" className='text-gray-500 text-xs'>{contentWordCount} words</p>
                <TrashIcon
                    className={`w-6 cursor-pointer text-red-500 ${!cardId ? 'hidden' : ''}`}
                    onClick={onDeleteHandler} />
                {
                    lockInput ?
                        <ArrowPathIcon
                            className='w-6 transform rotate-45 cursor-pointer text-black'
                            onClick={onRedoHandler} /> :
                        <PaperAirplaneIcon
                            className='w-6 transform -rotate-45 cursor-pointer text-black'
                            onClick={onSubmitHandler} />
                }

            </div>
        </div>
    )
}