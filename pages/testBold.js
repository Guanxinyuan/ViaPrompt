import {
    PaperAirplaneIcon,
    ArrowPathIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState, useRef } from "react";
import ContentEditable from "react-contenteditable";

export default function PromptTextarea({
    contentText,
    lockInput,
    task,
    cardId,
    className,
}) {
    const [content, setContent] = useState(contentText || '');
    const [contentWordCount, setContentWordCount] = useState(
        contentText ? contentText.trim().split(" ").length : 0
    );

    const onRedoHandler = async (e) => {
        const response = await fetch(`/api/cards/update`, {
            method: "PUT",
            body: JSON.stringify({
                cardId: cardId,
                editedPrompt: content,
                task: task,
            }),
        });
        const result = await response.json();
        const message = result.message;
        alert("response: " + message);
    };

    const onSubmitHandler = async (e) => {
        const response = await fetch(`/api/cards/create`, {
            method: "POST",
            body: JSON.stringify({
                originalPrompt: content,
                task: task,
            }),
        });

        const result = await response.json();
        const data = result.data;
        console.log("Data", data);
    };

    const onDeleteHandler = async (e) => {
        const response = await fetch(`/api/cards/delete`, {
            method: "DELETE",
            body: JSON.stringify({
                cardId: cardId,
            }),
        });
        const result = await response.json();
        const message = result.message;
        alert("response: " + message);
    };



    const textRef = useRef(contentText || '');
    const onChangeHandler = (e) => {
        const lastChild = e.target.lastChild;
        if (lastChild && lastChild.tagName === 'BR') {
            lastChild.remove();
        }

        if (e.target.value.trim() === "<br>" && e.target.value === "<br>") {
            console.log('e.target.value.trimmed()', e.target.value.trim())
            e.target.value = '';
        }
        textRef.current = e.target.value

        console.log('e.target.value', e.target.value)
        console.log('textRef.current', textRef.current, textRef.current == '\n<br>')
        if (e.target.value.trim() === "") {
            setContentWordCount(0);
        } else {
            setContentWordCount(e.target.value.trim().split(" ").length);
        }
    };

    useEffect(() => {
        console.log(textRef.current, textRef.current == '')
    }, [textRef.current]);

    return (
        <div className={`prompt-card-body-content-body min-h-full ${className}`}>
            <div className="w-full h-full inline-block overflow-y-hidden rounded-md whitespace-pre">
                <ContentEditable
                    html={textRef.current}
                    tagName="div"
                    className={`prompt-card-body-content`}
                    placeholder="Write your prompt here..."
                    // onInput={onInputHandler}
                    onChange={onChangeHandler}
                />
            </div>
            <div className="prompt-card-body-content-word-count">
                <p id="word-count" className="text-gray-500 text-xs">
                    {contentWordCount} words
                </p>
                <TrashIcon
                    className={`prompt-card-footer-icon text-red-500 dark:text-red-500 ${!cardId ? "hidden" : ""
                        }`}
                    onClick={onDeleteHandler}
                />
                {lockInput ? (
                    <ArrowPathIcon
                        className="prompt-card-footer-icon"
                        onClick={onRedoHandler}
                    />
                ) : (
                    <PaperAirplaneIcon
                        className="prompt-card-footer-icon transform -rotate-45"
                        onClick={onSubmitHandler}
                    />
                )}
            </div>
        </div>
    );
}
