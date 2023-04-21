import { useEffect, useState, memo, useCallback, useRef } from "react";
import TaskDropdown from "@/components/TaskDropdown";
import ModelDropdown from '@/components/ModelDropdown'
import { PaperAirplaneIcon, ArrowPathIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useUser } from "@supabase/auth-helpers-react";
import { formatISOString } from '@/utils/frontend'
import { taskConfig } from "@/config/taskConfig";


const Card = memo(({ cardData, setCreating, setCards, ...rest }) => {
    const { creating, creatingText, creatingBorder, className, numColumns, credits, onCreditsUpdate } = rest
    const user = useUser()
    const requiredCredits = 1
    const [isMade, setIsMade] = useState(cardData && cardData.answer != '' ? true : false);
    const [isEditable, setIsEditable] = useState(!isMade);
    const [isHovered, setIsHovered] = useState(false);
    const [task, setTask] = useState(isMade ? cardData.task : 'optimize');
    const [model, setModel] = useState(isMade ? cardData.model : 'midjourney');

    const [prompt, setPrompt] = useState(isMade ? cardData.prompt : '');
    const [answer, setAnswer] = useState(isMade ? cardData.answer : '');

    const [orignalContent, setOriginalContent] = useState(isMade ? cardData.answer : '');
    const [content, setContent] = useState(isMade ? prompt : '');

    const [wordCount, setWordCount] = useState(content.split(' ').length || 0);
    const [createdAt, setCreatedAt] = useState(cardData.created_at ? formatISOString(cardData.created_at, 1) : '');
    const [activeSection, setActiveSection] = useState(isMade ? taskConfig[task].sections.outputSection : 'prompt');


    const [sectionVisibility, setSectionVisibility] = useState({
        inputSectionActive: false,
        outputSectionActive: true,
    });

    const toggleSectionVisibility = (section) => {
        setSectionVisibility((prevState) => {
            // Check if both sections are currently active or the clicked section is inactive
            if (
                (prevState.inputSectionActive && prevState.outputSectionActive) ||
                !prevState[section]
            ) {
                return {
                    ...prevState,
                    [section]: !prevState[section],
                };
            }
            // If the above conditions are not met, return the current state without changes
            return prevState;
        });
    };


    const switchEdit = () => {
        if (!creating) setIsEditable(!isEditable)
        setSectionVisibility({ inputSectionActive: true, outputSectionActive: false })
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
            case 'template': return 'Saving' + baseText;
        }
    }

    const hasEnoughCredits = () => {
        if (user && credits) {
            return credits.creditsBalance + credits.freeCreditsBalance >= requiredCredits;
        }
    }

    const onCreateHandler = async (e) => {
        e.preventDefault();

        if (creating) return;

        const prompt = content
        if (prompt.trim() === "") {
            // alert('Please enter a prompt');
            return;
        }

        if (!hasEnoughCredits()) {
            alert('You have no credits left. Please upgrade your plan to continue using the app. Have a good day!');
            return;
        }

        switchEdit()
        setCreating(true);

        const loadingText = makeLoadingText();
        const emptyCard = { id: 1, answer: loadingText, task: task, model: model, prompt: 'creating...' }
        setCards((preCards) => [emptyCard, ...preCards]);
        await delay(1000);

        const response = await fetch(`/api/cards/create`, {
            // const response = await fetch('/api/test/testCreate', {
            method: 'POST',
            body: JSON.stringify({
                prompt: prompt.trim(),
                task: task,
                model: model,
                required_credits: requiredCredits,
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

        updateCredits(result.data.credits)
        const cardData = { ...result.data.card, answer: result.data.card.answer }
        console.log(cardData)

        setCards((preCards) => [cardData, ...preCards.slice(1)]);
        await delay(1000);
        setCreating(false);

        setContent(activeSection === taskConfig[task].sections.inputSection ? cardData.prompt : cardData.answer);
    }

    const updateCredits = (credits) => {
        onCreditsUpdate({
            totalFreeCredits: credits.total_free_credits,
            freeCreditsBalance: credits.free_credits_balance,
            totalCredits: credits.total_credits,
            creditsBalance: credits.credits_balance,
        });
    }

    const updateWordCount = (text) => {
        if (text.trim() === "") {
            setWordCount(0);
        } else {
            setWordCount(text.trim().split(" ").length);
        }
    }

    const onChangeHandler = (e) => {
        const cleanedValue = e.target.value.trim();

        if (cleanedValue === '') {
            e.target.value = '';
        }

        setContent(e.target.value);
        updateWordCount(e.target.value);
    };

    const onCancelEdit = (e) => {
        switchEdit()
        setContent(orignalContent)
    }

    useEffect(() => {
        setContent(activeSection === taskConfig[task].sections.inputSection ? prompt : answer);
    }, [activeSection]);


    useEffect(() => {
        updateWordCount(content)
    }, [content]);

    const textAreaInput = useRef(null);
    const textAreaOutput = useRef(null);

    const autoResize = useCallback((textarea, initial = false) => {
        if (!initial) {
            textarea.style.height = "auto";
        }
        textarea.style.height = textarea.scrollHeight + "px";
    }, []);

    useEffect(() => {
        if (textAreaInput.current && sectionVisibility.inputSectionActive) {
            autoResize(textAreaInput.current, false);
        }
        if (textAreaOutput.current && sectionVisibility.outputSectionActive) {
            autoResize(textAreaOutput.current, false);
        }

    }, [autoResize, sectionVisibility]);

    const handleInput = useCallback((event) => {
        autoResize(event.target);
    }, [autoResize]);



    return (
        <div
            className={`flex flex-col rounded-xl bg-white dark:bg-zinc-800 w-full border border-t-2 ${taskConfig[task].borderColor} ${creatingBorder} ${className} border-x-zinc-200 border-b-zinc-200 dark:border-x-zinc-800 dark:border-b-zinc-800`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* card header */}
            <div className="h-14 flex flex-row justify-between items-center">
                <div className="flex items-center justify-start px-4 gap-2 ">
                    <TaskDropdown defaultValue={task} paramSetter={setTask} isEditable={isEditable} />
                    <ModelDropdown defaultValue={model} paramSetter={setModel} isEditable={isEditable} numColumns={numColumns} />
                </div>
                {
                    !isEditable && content &&
                    <div className="flex items-center justify-end px-4 py-2 gap-2">
                        {
                            taskConfig[task].sections.inputSection &&
                            <h2
                                className={`text-sm font-semibold cursor-pointer
    ${sectionVisibility.inputSectionActive ? `text-black dark:text-white ${taskConfig[task].textColor}` : 'text-zinc-500 dark:text-zinc-400'} `}
                                onClick={() => {
                                    toggleSectionVisibility("inputSectionActive");
                                }}
                            >{taskConfig[task].sections.inputSection}</h2>
                        }
                        <h2
                            className={`text-sm font-semibold text-black dark:text-white cursor-pointer
    ${sectionVisibility.outputSectionActive ? `text-black dark:text-white ${taskConfig[task].textColor}` : 'text-zinc-500 dark:text-zinc-400'}`}
                            onClick={() => {
                                toggleSectionVisibility("outputSectionActive");
                            }}
                        >{taskConfig[task].sections.outputSection}</h2>
                    </div>
                }
            </div>

            {/* card content */}

            <div className="relative  flex-grow  px-4 py-2">
                <div className="mb-4">
                    <div className="w-full flex gap-2 items-center p-4">
                        <span className="text-sm font-medium text-zinc-400 dark:text-white min-w-max">Original prompt:</span>
                        <input
                            type="text"
                            className="w-full text-sm text-zinc-600 dark:text-yellow-500 opacity-70 bg-white dark:bg-zinc-800 rounded focus:outline-none text-ellipsis"
                            value={prompt}
                            readOnly
                        />
                    </div>
                </div>
                <div className="flex gap-6">

                    {
                        sectionVisibility.inputSectionActive &&
                        <textarea
                            ref={textAreaInput}
                            className="prompt-card-body-content cursor-text bg-white dark:text-white text-sm whitespace-pre-wrap "
                            placeholder="Write your prompt here..."
                            onChange={onChangeHandler}
                            readOnly={isMade && !isEditable}
                            onInput={handleInput}
                            value={prompt}

                        ></textarea>
                    }
                    {
                        sectionVisibility.outputSectionActive &&
                        <textarea
                            ref={textAreaOutput}
                            className="prompt-card-body-content cursor-text bg-white dark:text-white text-sm whitespace-pre-wrap"
                            placeholder="Write your prompt here..."
                            onChange={onChangeHandler}
                            readOnly={isMade && !isEditable}
                            onInput={handleInput}
                            value={answer}

                        ></textarea>
                    }
                </div>
                {/* card footer */}
                <div className="h-6 flex flex-row justify-between mt-4">
                    <div className="flex items-center justify-start text-zinc-500 dark:text-zinc-400 text-xs">{createdAt}</div>
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
                                    (isMade && !isEditable) && <PencilSquareIcon
                                        className={`prompt-card-footer-icon ${isEditable ? 'hidden' : ''} ${creating ? '' : 'cursor-pointer'}`}
                                        onClick={switchEdit} />
                                }
                                {
                                    // Cancel button
                                    (isMade && isEditable) &&
                                    <button
                                        className={`prompt-card-footer-button text-sm text-zinc-500 dark:text-zinc-400`}
                                        onClick={onCancelEdit}>Cancel
                                    </button>
                                }
                                {
                                    // Submit/create button
                                    (!isMade || isEditable) &&
                                    <div className={`rounded-md w-12 flex justify-center ${taskConfig[task].backgroundColor}`}><PaperAirplaneIcon
                                        className={`h-5 text-black dark:text-white ${!creating && content.length > 0 ? 'cursor-pointer' : "hover-none"} `}
                                        onClick={onCreateHandler} /></div>
                                }
                            </div>
                            :
                            <div className="flex items-center justify-end gap-3 ">
                                <div className="flex items-center justify-start text-zinc-500 dark:text-zinc-400 text-xs">{wordCount} words</div>
                            </div>
                    }
                </div>

            </div>

        </div>
    );
})



export default Card;