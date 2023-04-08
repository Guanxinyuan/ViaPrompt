import { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import ModeDropdownTemp from '@/components/ModeDropdownTemp'
import ModelDropdownTemp from '@/components/ModelDropdownTemp'
import { PaperAirplaneIcon, ArrowPathIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { dummyResponses } from "@/data/cards";
import { parseAnswer } from '@/utils/parseAnswer'
import { renderToStaticMarkup } from "react-dom/server";

export default function TempCard({ cardData, setLoading, setCards, ...rest }) {
    const { loadingText, loadingBorder } = rest
    const [isMade, setIsMade] = useState(cardData && cardData.answer != '' ? true : false);
    const [isEditable, setIsEditable] = useState(!isMade);
    const [isHovered, setIsHovered] = useState(false);
    const [mode, setMode] = useState(isMade ? cardData.mode : 'optimize');
    const [model, setModel] = useState(isMade ? cardData.model : 'chatgpt');

    const [prompt, setPrompt] = useState(isMade ? cardData.prompt : '');
    const [answer, setAnswer] = useState(isMade ? cardData.answer : '');

    const [content, setContent] = useState(isMade ? cardData.answer : '');

    const [wordCount, setWordCount] = useState(content.split(' ').length || 0);

    const modeSections = {
        'optimize': { inputSection: 'original', outputSection: 'optimized' },
        'explain': { inputSection: 'original', outputSection: 'explanation' },
        'template': { inputSection: '', outputSection: 'prompt' },
    }

    const [activeSection, setActiveSection] = useState(isMade ? modeSections[mode].outputSection : '');

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
        setIsEditable(!isEditable)
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

    const onCreateHandler = async (e) => {
        const prompt = getTextContentFromHtmlString(content)
        if (prompt.trim() === "") {
            // alert('Please enter a prompt');
            return;
        }
        switchEdit()
        setLoading(true);
        const emptyCard = { id: 1, answer: 'Loading...', mode: mode, model: model, prompt: 'Loading...' }
        setCards((preCards) => [emptyCard, ...preCards]);
        await delay(3000);

        // const response = await fetch(`/api/test/testSupabase`, {
        //     method: "POST",
        //     body: JSON.stringify({
        //         prompt: prompt,
        //         mode: mode || 'optimize',
        //         model: model || 'chatgpt',
        //     }),
        // });
        // const cardData = await response.json();
        const cardData = { id: 1, answer: parseAnswer(mode, dummyResponses[mode].choices[0].message.content), mode: mode, model: model, prompt: prompt }
        console.log(cardData)

        setCards((preCards) => [cardData, ...preCards.slice(1)]);
        await delay(1000);
        setLoading(false);

        setContent(activeSection === modeSections[mode].inputSection ? cardData.prompt : cardData.answer);
    }

    const updateWordCount = (text) => {
        if (text.trim() === "") {
            setWordCount(0);
        } else {
            setWordCount(text.trim().split(" ").length);
        }
    }

    const onChangeHandler = (e) => {
        // this handles rows with only spaces
        if (e.target.value.trim() === "<br>" && e.target.value === "<br>") {
            e.target.value = '';
        }
        // this handles only \n exists 
        if (e.target.value.trim() === "<div><br></div>") {
            e.target.value = '';
        }
        setContent(e.target.value);
        updateWordCount(getTextContentFromHtmlString(e.target.value))
    };

    useEffect(() => {
        setContent(activeSection === modeSections[mode].inputSection ? prompt : answer);
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

    function getTextContentFromHtmlString(htmlString) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlString;
        return tempElement.textContent || tempElement.innerText || '';
    }

    useEffect(() => {
        if (mode == 'explain') {
            const parsedJson = JSON.parse(dummyResponses[mode].choices[0].message.content)
            console.log(`in parseExplain, parsedJson: ${parsedJson}`)
            const parsedContentPairs = Object.keys(parsedJson).map((key) => {
                if (parsedJson[key] !== null) {
                    const newKey = key.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
                    const value = Array.isArray(parsedJson[key]) ? parsedJson[key].join(", ") : parsedJson[key];
                    return [newKey, value];
                }
            })

            const newContentDict = {};
            for (let i = 0; i < parsedContentPairs.length; i++) {
                if (parsedContentPairs[i]) {
                    newContentDict[parsedContentPairs[i][0]] = parsedContentPairs[i][1];
                }
            }
            const filteredContentDict = Object.fromEntries(
                Object.entries(newContentDict).filter(([key, value]) => {
                    const emptyList = [null, undefined, '', 'N/A', "null", "undefined"]
                    return emptyList.includes(value) ? null : value
                })
            )
            const newContent = renderToStaticMarkup(
                <div className="flex flex-col gap-1">
                    {
                        Object.keys(filteredContentDict).map((key) => {
                            return (
                                <div key={key} className="flex mb-1 items-start gap-2">
                                    <span className="inline-block px-2 py-0.5 text-xs font-medium text-white bg-zinc-700 rounded-md">{key}</span>
                                    <span className="flex-grow">{newContentDict[key]}</span>
                                </div>
                            );
                        })

                    }
                </div>
            )
            setContent(newContent)
        }
    }, []);

    return (
        <div
            className={`flex flex-col rounded-lg bg-zinc-800 w-full border-t-2 ${modeBorderColors[mode]} ${loadingBorder}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>

            {/* card header */}
            <div className="h-14 flex flex-row justify-between items-center">

                <div className="flex items-center justify-start px-4 gap-2 ">
                    <ModeDropdownTemp defaultValue={mode} paramSetter={setMode} isEditable={isEditable} />
                    <ModelDropdownTemp defaultValue={model} paramSetter={setModel} isEditable={isEditable} />
                </div>
                {
                    !isEditable && content &&
                    <div className="flex items-center justify-end px-4 py-2 gap-2">
                        {
                            modeSections[mode].inputSection &&
                            <h2
                                className={`text-sm font-semibold cursor-pointer 
                ${activeSection == modeSections[mode].inputSection ? `text-white ${modeTextColors[mode]}` : 'text-zinc-400'} `}
                                onClick={() => {
                                    setActiveSection(modeSections[mode].inputSection)
                                }}
                            >{modeSections[mode].inputSection}</h2>
                        }
                        <h2
                            className={`text-sm font-semibold text-white cursor-pointer
            ${activeSection == modeSections[mode].outputSection ? `text-white ${modeTextColors[mode]}` : 'text-zinc-400'}`}
                            onClick={() => {
                                setActiveSection(modeSections[mode].outputSection)
                            }}
                        >{modeSections[mode].outputSection}</h2>
                    </div>
                }
            </div>


            {/* card content */}
            <div className="relative overflow-hidden flex-grow overflow-y-auto px-4 py-4">
                <ContentEditable
                    html={content}
                    tagName=""
                    className={`prompt-card-body-content cursor-text dark:bg-zinc-800 p-0 dark:border-zinc-800 dark:text-white text-sm 
                            ${content?.trim() === '' ? 'empty' : ''}
                            ${loadingText}`}
                    placeholder="Write your prompt here..."
                    onChange={onChangeHandler}
                    disabled={isMade && !isEditable}
                />

                {/* card footer */}
                <div className="h-6 flex flex-row justify-between mt-4">
                    {
                        mode != 'explain' ?
                            <div className="flex items-center justify-start text-gray-400 text-xs">{wordCount} words</div>
                            :
                            <div className="flex items-center justify-start text-gray-400 text-xs"></div>
                    }
                    {
                        isHovered || isEditable ?
                            <div className="flex items-center justify-end gap-3">
                                {
                                    (isMade && !isEditable) && <ArrowPathIcon
                                        className="prompt-card-footer-icon"
                                        onClick={onCreateHandler} />
                                }
                                {
                                    (isMade && !isEditable) && <PencilSquareIcon
                                        className={`prompt-card-footer-icon ${isEditable ? 'hidden' : ''}`}
                                        onClick={switchEdit} />
                                }
                                {
                                    (isMade && isEditable) &&
                                    <button
                                        className="prompt-card-footer-button text-sm dark:text-zinc-400"
                                        onClick={switchEdit}>Cancel
                                    </button>
                                }
                                {
                                    (!isMade || isEditable) &&
                                    <div className={` rounded-md w-12 flex justify-center ${modeBackgroundColors[mode]}`}><PaperAirplaneIcon
                                        className={`h-5 text-black dark:text-white ${content.length > 0 ? 'cursor-pointer' : "hover-none"} `}
                                        onClick={onCreateHandler} /></div>
                                }
                            </div>
                            :
                            <div className="px-4 flex items-center justify-end gap-3 "></div>
                    }
                </div>

            </div>
        </div>
    );
};