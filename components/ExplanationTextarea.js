import { PaperAirplaneIcon, ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import { renderToStaticMarkup } from 'react-dom/server';

export default function PromptTextarea({ contentDict, lockInput, mode, cardId, className }) {

    const [content, setContent] = useState(contentDict ? contentDict : {});

    useEffect(() => {
    }, [content])

    useEffect(() => {
        parseContent()
    }, [])


    const parseContent = () => {
        const parsedContentPairs = Object.keys(content).map((key) => {
            if (content[key] !== null) {
                const newKey = key.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
                const value = Array.isArray(content[key]) ? content[key].join(", ") : content[key];
                return [newKey, value];
            }
        })

        console.log('parsedContentPairs', parsedContentPairs)
        const newContentDict = {};
        for (let i = 0; i < parsedContentPairs.length; i++) {
            if (parsedContentPairs[i]) {
                newContentDict[parsedContentPairs[i][0]] = parsedContentPairs[i][1];
            }
        }
        console.log('newContentDict', newContentDict)
        setContent(newContentDict);
    }

    const onSubmitHandler = async (e) => {
        alert('request sent')
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
                    html={renderToStaticMarkup(
                        <div>
                            {
                                Object.keys(content).map((key) => {
                                    return (
                                        <div key={key} className="flex mb-1 items-start ">
                                            <div className="rounded-full bg-gray-500 h-4 flex items-center justify-center mr-1.5 mt-0.5">
                                                <span className="decomposed-component-title">{key}</span>
                                            </div>
                                            <div className="flex-grow">
                                                <div className="decomposed-component-value">{content[key]}</div>
                                            </div>
                                        </div>
                                    );
                                })

                            }
                        </div>
                    )
                    }
                    disabled={lockInput}
                    tagName="div"
                    className={`prompt-card-body-content ${!Object.keys(content).length ? 'before-visible' : 'before-hidden'}`}

                />

            </div>

            <div class="prompt-card-body-content-word-count">

                <TrashIcon
                    className={`prompt-card-footer-icon text-red-500 dark:text-red-500`}
                    onClick={onDeleteHandler} />
                {
                    lockInput ?
                        <ArrowPathIcon
                            className='prompt-card-footer-icon'
                            onClick={onRedoHandler} /> :
                        <PaperAirplaneIcon
                            className='prompt-card-footer-icon transform -rotate-45'
                            onClick={onSubmitHandler} />
                }

            </div>
        </div >
    )
}