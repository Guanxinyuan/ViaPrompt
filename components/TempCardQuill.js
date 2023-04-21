import React, { useEffect, useState, memo } from "react";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(import('react-quill'), { ssr: false })

import 'react-quill/dist/quill.snow.css';
import ModeDropdown from '@/components/TaskDropdown';
import ModelDropdown from '@/components/ModelDropdown';
import { PaperAirplaneIcon, ArrowPathIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useUser } from "@supabase/auth-helpers-react";
import { formatISOString } from '@/utils/frontend';
// import './QuillStyles.module.css'

const Card = memo(({ cardData, setCreating, setCards, ...rest }) => {
    const { creating, creatingText, creatingBorder, className, numColumns } = rest
    const user = useUser()
    const [isMade, setIsMade] = useState(cardData && cardData.answer != '' ? true : false);
    const [isEditable, setIsEditable] = useState(!isMade);
    const [isHovered, setIsHovered] = useState(false);
    const [task, setTask] = useState(isMade ? cardData.task : 'optimize');
    const [model, setModel] = useState(isMade ? cardData.model : 'chatgpt');

    const [prompt, setPrompt] = useState(isMade ? cardData.prompt : '');
    const [answer, setAnswer] = useState(isMade ? cardData.answer : '');

    const [orignalContent, setOriginalContent] = useState(isMade ? cardData.answer : '');
    const [content, setContent] = useState(isMade ? cardData.answer : '');

    const [wordCount, setWordCount] = useState(content.split(' ').length || 0);
    const [createdAt, setCreatedAt] = useState(cardData.created_at ? formatISOString(cardData.created_at, 1) : '');


    const [documentDefined, setDocumentDefined] = useState(false);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            setDocumentDefined(true);
        }
    }, []);

    const modeSections = {
        'optimize': { inputSection: 'original', outputSection: 'optimized' },
        'explain': { inputSection: 'original', outputSection: 'explanation' },
        'template': { inputSection: '', outputSection: 'prompt' },
    }

    const [activeSection, setActiveSection] = useState(isMade ? modeSections[task].outputSection : '');

    const modeTextColors = {
        'optimize':
            `text-yellow-500 active:text-yellow-600
        dark:text-yellow-500 dark:active:text-yellow-400`,
        'explain':
            `text-purple-500 active:text-purple-600
        dark:text-purple-500 dark:active:text-purple-400`,
        'template':
            `text-zinc-500 active:text-zinc-600
        dark:text-zinc-500 dark:active:text-zinc-400`,
    }

    const modeBorderColors = {
        'optimize':
            `border-yellow-500 active:border-yellow-600
        dark:border-yellow-500 dark:active:border-yellow-400`,
        'explain':
            `border-purple-500 active:border-purple-600
        dark:border-purple-500 dark:active:border-purple-400`,
        'template':
            `border-zinc-500 active:border-zinc-600
        dark:border-zinc-500 dark:active:border-zinc-400`,
    }

    const modeBackgroundColors = {
        'optimize': 'bg-yellow-500 dark',
        'explain': 'bg-purple-500 dark',
        'template': 'bg-zinc-500 dark',
    }

    const switchEdit = () => {
        if (!creating) setIsEditable(!isEditable)
    }

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const delay = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    const makeLoadingText = () => {
        const baseText = ' your prompt...';
        switch (task) {
            case 'optimize': return 'Optimizing' + baseText;
            case 'explain': return 'Explaining' + baseText;
            case 'template': return 'Saving' + baseText;
        }
    }

    const onCreateHandler = async (e) => {
        e.preventDefault();

        if (creating) return;

        const prompt = getTextContentFromHtmlString(content)
        if (prompt.trim() === "") {
            // alert('Please enter a prompt');
            return;
        }
        switchEdit()
        setCreating(true);

        const loadingText = makeLoadingText();
        const emptyCard = { id: 1, answer: loadingText, task: task, model: model, prompt: 'creating...' }
        setCards((preCards) => [emptyCard, ...preCards]);
        await delay(10000);

        // const response = await fetch(`/api/cards/create`, {
        const response = await fetch('/api/test/testCreate', {
            method: 'POST',
            body: JSON.stringify({
                prompt: prompt.trim(),
                task: task,
                model: model,
                required_credits: 1,
                description: task,
                user_id: user.id
            }),
        })

        const result = await response.json()
        if (result.error) {
            console.log(result.error)
            setCards((preCards) => preCards.slice(1));
            setCreating(false);
            return
        }

        const cardData = { ...result.data.card, answer: result.data.card.answer }
        // const cardData = { id: 1, answer: parseAnswer(task, dummyResponses[task].choices[0].message.content), task: task, model: model, prompt: prompt }
        console.log(cardData)

        setCards((preCards) => [cardData, ...preCards.slice(1)]);
        await delay(1000);
        setCreating(false);

        setContent(activeSection === modeSections[task].inputSection ? cardData.prompt : cardData.answer);
    }

    const updateWordCount = (text) => {
        if (text.trim() === "") {
            setWordCount(0);
        } else {
            setWordCount(text.trim().split(" ").length);
        }
    }

    const onChangeHandler = (content) => {
        const text = getTextContentFromHtmlString(content);
        setContent(content);
        updateWordCount(text);
    };


    const onCancelEdit = (e) => {
        switchEdit()
        setContent(orignalContent)
    }

    useEffect(() => {
        setContent(activeSection === modeSections[task].inputSection ? prompt : answer);
    }, [activeSection]);

    function setCaretPosition(element) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(element, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    useEffect(() => {
        updateWordCount(content)
    }, [content]);

    function getTextContentFromHtmlString(htmlString) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlString;
        return tempElement.textContent || tempElement.innerText || '';
    }

    return (
        <div
            className={`flex flex-col rounded-xl bg-zinc-800 w-full border-t-2 ${modeBorderColors[task]} ${creatingBorder} ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>

            {/* card header */}
            <div className="h-14 flex flex-row justify-between items-center">

                <div className="flex items-center justify-start px-4 gap-2 ">
                    <ModeDropdown defaultValue={task} paramSetter={setTask} isEditable={isEditable} />
                    <ModelDropdown defaultValue={model} paramSetter={setModel} isEditable={isEditable} numColumns={numColumns} />
                </div>
                {
                    !isEditable && content &&
                    <div className="flex items-center justify-end px-4 py-2 gap-2">
                        {
                            modeSections[task].inputSection &&
                            <h2
                                className={`text-sm font-semibold cursor-pointer 
                ${activeSection == modeSections[task].inputSection ? `text-white ${modeTextColors[task]}` : 'text-zinc-400'} `}
                                onClick={() => {
                                    setActiveSection(modeSections[task].inputSection)
                                }}
                            >{modeSections[task].inputSection}</h2>
                        }
                        <h2
                            className={`text-sm font-semibold text-white cursor-pointer
            ${activeSection == modeSections[task].outputSection ? `text-white ${modeTextColors[task]}` : 'text-zinc-400'}`}
                            onClick={() => {
                                setActiveSection(modeSections[task].outputSection)
                            }}
                        >{modeSections[task].outputSection}</h2>
                    </div>
                }
            </div>


            {/* card content */}
            <div className="relative overflow-hidden flex-grow overflow-y-auto px-4 py-4">
                <ReactQuill
                    value={content}
                    theme="snow"
                    formats={['bold', 'italic', 'underline']}
                    className={` prompt-card-body-content cursor-text dark:bg-zinc-800 p-0  dark:text-white text-sm dark:border-zinc-800 dark:placeholder-zinc-400
                ${content?.trim() === '' ? 'empty' : ''}
                ${creatingText}`}
                    placeholder="Enter your prompt here..."
                    readOnly={isMade && !isEditable}
                    onChange={onChangeHandler}
                    modules={{
                        toolbar: false
                    }}
                />


                {/* card footer */}
                <div className="h-6 flex flex-row justify-between mt-4">
                    <div className="flex items-center justify-start text-zinc-400 text-xs">{createdAt}</div>
                    {
                        isHovered || isEditable ?
                            <div className="flex items-center justify-end gap-3">
                                {
                                    // Redo button
                                    (isMade && !isEditable) && <ArrowPathIcon
                                        className={`prompt-card-footer-icon ${isEditable ? 'hidden' : ''} ${creating ? '' : 'cursor-pointer'}`}
                                        onClick={onCreateHandler} />
                                }
                                {
                                    // Edit button
                                    (isMade && !isEditable && activeSection == modeSections[task].inputSection) && <PencilSquareIcon
                                        className={`prompt-card-footer-icon ${isEditable ? 'hidden' : ''} ${creating ? '' : 'cursor-pointer'}`}
                                        onClick={switchEdit} />
                                }
                                {
                                    // Cancel button
                                    (isMade && isEditable) &&
                                    <button
                                        className={`prompt-card-footer-button text-sm dark:text-zinc-400`}
                                        onClick={onCancelEdit}>Cancel
                                    </button>
                                }
                                {
                                    // Submit/create button
                                    (!isMade || isEditable) &&
                                    <div className={` rounded-md w-12 flex justify-center ${modeBackgroundColors[task]}`}><PaperAirplaneIcon
                                        className={`h-5 text-black dark:text-white ${!creating && content.length > 0 ? 'cursor-pointer' : "hover-none"} `}
                                        onClick={onCreateHandler} /></div>
                                }
                            </div>
                            :
                            <div className="flex items-center justify-end gap-3 ">
                                {/* <div className="flex items-center justify-start text-zinc-400 text-xs">{formatISOString(createdAt)}</div> */}

                                {
                                    task != 'explain' ?
                                        <div className="flex items-center justify-start text-zinc-400 text-xs">{wordCount} words</div>
                                        :
                                        <div className="flex items-center justify-start text-zinc-400 text-xs"></div>
                                }
                            </div>
                    }
                </div>

            </div>
        </div>
    );
})

export default Card;