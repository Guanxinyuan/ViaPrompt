import { PaperAirplaneIcon, ArrowPathIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState, useRef } from "react";
import ContentEditable from "react-contenteditable";

export default function InputTextarea({ contentText, lockInput, mode, cardId, className }) {

    const [content, setContent] = useState(contentText);
    const [contentWordCount, setContentWordCount] = useState(contentText ? contentText.trim().split(' ').length : 0);
    const [editActive, setEditActive] = useState(!lockInput);

    const onChangeHandler = (e) => {
        setContent(e.target.value)
        if (e.target.value.trim() === '') {
            setContentWordCount(0);
        } else {
            setContentWordCount(e.target.value.trim().split(' ').length);
        }
    }

    const switchEdit = () => {
        setEditActive(!editActive)
    }

    const savePrompt = async (e) => {
        switchEdit()
        alert('prompt saved')
    }

    const onSaveHandler = async (e) => {
        console.log(content, mode)
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

        switchEdit()
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
                    disabled={!editActive}
                    tagName="div"
                    className={`prompt-card-body-content ${content === null || content.trim() === '' ? 'before-visible' : 'before-hidden'}`}
                    onChange={onChangeHandler}
                />
            </div>
            <div class="prompt-card-body-content-word-count">
                <p id="word-count" className='text-gray-500 text-xs'>{contentWordCount} words</p>
                {
                    editActive && mode && mode == 'Template' &&
                    <div className="flex flex-row gap-2">
                        <button
                            className="prompt-card-button bg-gray-500 font-normal"
                            onClick={switchEdit}>Cancel
                        </button>
                        <button
                            className="prompt-card-button"
                            onClick={onSaveHandler}>Save
                        </button>
                    </div>

                }
                <TrashIcon
                    className={`w-6 cursor-pointer text-red-500 ${editActive ? 'hidden' : ''}`}
                    onClick={onDeleteHandler} />
                {
                    lockInput ?
                        <PencilSquareIcon
                            className={`w-6 cursor-pointer text-black ${editActive ? 'hidden' : ''}`}
                            onClick={switchEdit} />
                        :
                        <PaperAirplaneIcon
                            className="w-6 transform -rotate-45 cursor-pointer text-black"
                            onClick={onSubmitHandler} />
                }
            </div>
        </div>
    )
}