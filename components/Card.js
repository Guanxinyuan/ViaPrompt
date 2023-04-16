import { useEffect, useState, memo } from "react";
import ContentEditable from "react-contenteditable";
import TaskDropdown from '@/components/TaskDropdown'
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
    const [content, setContent] = useState(isMade ? cardData.answer : '');

    const [wordCount, setWordCount] = useState(content.split(' ').length || 0);
    const [createdAt, setCreatedAt] = useState(cardData.created_at ? formatISOString(cardData.created_at, 1) : '');
    const [activeSection, setActiveSection] = useState(isMade ? taskConfig[task].sections.outputSection : 'prompt');

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

    const hasEnoughCredits = () => {
        if (user && credits) {
            return credits.creditsBalance + credits.freeCreditsBalance >= requiredCredits;
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
        // Handle rows with only spaces, <br>, or <div><br></div>
        const cleanedValue = e.target.value.replace(/<br>|<div><br><\/div>/g, '').trim();

        if (cleanedValue === '') {
            e.target.value = '';
        }

        setContent(e.target.value);
        updateWordCount(getTextContentFromHtmlString(e.target.value));
    };

    function getTextContentFromHtmlString(htmlString) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlString;
        return tempElement.textContent || tempElement.innerText || '';
    }

    const onCancelEdit = (e) => {
        switchEdit()
        setContent(orignalContent)
    }

    useEffect(() => {
        setContent(activeSection === taskConfig[task].sections.inputSection ? prompt : answer);
    }, [activeSection]);

    function setCaretPosition(element) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(element, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    const onEmptyHandler = (text) => {
        if (text.trim() === '') {
            const contentEditableElement = document.querySelector('.prompt-card-body-content');
            if (contentEditableElement) {
                setCaretPosition(contentEditableElement);
            }
        }
    }

    useEffect(() => {
        onEmptyHandler(content)
        updateWordCount(content)
    }, [content]);

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
                ${activeSection == taskConfig[task].sections.inputSection ? `text-black dark:text-white ${taskConfig[task].textColor}` : 'text-zinc-500 dark:text-zinc-400'} `}
                                onClick={() => {
                                    setActiveSection(taskConfig[task].sections.inputSection)
                                }}
                            >{taskConfig[task].sections.inputSection}</h2>
                        }
                        <h2
                            className={`text-sm font-semibold text-black dark:text-white cursor-pointer
  ${activeSection == taskConfig[task].sections.outputSection ? `text-black dark:text-white ${taskConfig[task].textColor}` : 'text-zinc-500 dark:text-zinc-400'}`}
                            onClick={() => {
                                setActiveSection(taskConfig[task].sections.outputSection)
                            }}
                        >{taskConfig[task].sections.outputSection}</h2>
                    </div>
                }
            </div>

            {/* card content */}
            <div className="relative overflow-hidden flex-grow overflow-y-auto px-4 py-2">
                <ContentEditable
                    html={content}
                    tagName=""
                    className={`prompt-card-body-content cursor-text bg-white dark:bg-zinc-800 dark:border-zinc-800 dark:text-white text-sm whitespace-pre-wrap dark:border-zinc-500
                          ${content?.trim() === '' ? 'empty' : ''}
                          ${creatingText}`}
                    placeholder="Write your prompt here..."
                    onChange={onChangeHandler}
                    disabled={isMade && !isEditable}
                />
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
                                    (isMade && !isEditable && activeSection == taskConfig[task].sections.inputSection) && <PencilSquareIcon
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
                                {
                                    task != 'analyze' ?
                                        <div className="flex items-center justify-start text-zinc-500 dark:text-zinc-400 text-xs">{wordCount} words</div>
                                        :
                                        <div className="flex items-center justify-start text-zinc-500 dark:text-zinc-400 text-xs"></div>
                                }
                            </div>
                    }
                </div>

            </div>

        </div>
    );
})



export default Card;