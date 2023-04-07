
import { useState, useRef, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import { PaperAirplaneIcon, ArrowPathIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import ModeDropdownTemp from '@/components/ModeDropdownTemp'
import ModelDropdownTemp from '@/components/ModelDropdownTemp'

export function Card({ cardData, className }) {
    const [isMade, setIsMade] = useState(cardData && cardData.answer ? true : false);
    const [isEditable, setIsEditable] = useState(!isMade);
    const [isHovered, setIsHovered] = useState(false);
    const [mode, setMode] = useState(isMade ? cardData.mode : 'optimize');
    const [model, setModel] = useState(isMade ? cardData.model : 'chatgpt');

    const [prompt, setPrompt] = useState(isMade ? cardData.prompt : '');
    const [answer, setAnswer] = useState(isMade ? cardData.answer : '');
    const textRef = useRef(isMade ? answer : '');
    const [wordCount, setWordCount] = useState(textRef.current.split(' ').length);

    const modeSections = {
        'optimize': { inputSection: 'original', outputSection: 'optimized' },
        'explain': { inputSection: 'original', outputSection: 'explanation' },
        'template': { inputSection: '', outputSection: 'prompt' },
    }
    const [activeSection, setActiveSection] = useState(cardData ? modeSections[mode].outputSection : '');

    const switchEdit = () => {
        setIsEditable(!isEditable)
    }

    const modeColors = {
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

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const onChangeHandler = (e) => {
        const lastChild = e.target.value.lastChild;
        console.log('lastChild', lastChild)
        if (lastChild && lastChild.tagName === 'BR') {
            lastChild.remove();
        }
        // this handles rows with only spaces
        if (e.target.value.trim() === "<br>" && e.target.value === "<br>") {
            console.log('e.target.value.trimmed() 1', e.target.value.trim())
            e.target.value = '';
        }
        // this handles only \n exists 
        if (e.target.value.trim() === "<div><br></div>") {
            console.log('e.target.value.trimmed() 2', e.target.value.trim())
            e.target.value = '';
        }
        textRef.current = e.target.value

        console.log('e.target.value', e.target.value)
        console.log('textRef.current', textRef.current, textRef.current == '\n<br>')
        if (e.target.value.trim() === "") {
            setWordCount(0);
        } else {
            setWordCount(e.target.value.trim().split(" ").length);
        }
    };

    function setCaretPosition(element) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(element, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    const onEmptyHandler = () => {
        console.log('called')
        if (textRef.current.trim() === '') {
            const contentEditableElement = document.querySelector('.prompt-card-body-content');
            if (contentEditableElement) {
                console.log('Recursor')
                setCaretPosition(contentEditableElement);
            }
        }
    }

    useEffect(() => {
        onEmptyHandler()
    }, [textRef.current]);

    function getTextContentFromHtmlString(htmlString) {
        console.log(textRef.current)
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlString;
        return tempElement.textContent || tempElement.innerText || '';
    }

    const onCreateHandler = async (e) => {
        const prompt = getTextContentFromHtmlString(textRef.current)

        const response = await fetch(`/api/test/testSupabase`, {
            method: "POST",
            body: JSON.stringify({
                prompt: prompt,
                mode: mode || 'optimize',
                model: model
            }),
        });
        const cardData = await response.json();
        alert(`answer: ${cardData.answer}`);
    }

    return (
        <div
            className="flex flex-col rounded-lg bg-zinc-800 w-full "
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>

            {/* card header */}
            <div className="h-14 flex flex-row justify-between items-center">

                <div className="flex items-center justify-start px-4 gap-2 ">
                    <ModeDropdownTemp defaultValue={mode} paramSetter={setMode} isEditable={isEditable} />
                    <ModelDropdownTemp defaultValue={model} paramSetter={setModel} isEditable={isEditable} />
                </div>
                {
                    !isEditable &&
                    <div className="flex items-center justify-end px-4 py-2 gap-2">
                        {
                            modeSections[mode].inputSection &&
                            <h2
                                className={`text-sm font-semibold cursor-pointer 
                                ${activeSection == modeSections[mode].inputSection ? 'text-white' : 'text-zinc-400'} `}
                                onClick={() => {
                                    setActiveSection(modeSections[mode].inputSection)
                                    textRef.current = prompt
                                }}
                            >{modeSections[mode].inputSection}</h2>
                        }
                        <h2
                            className={`text-sm font-semibold text-white cursor-pointer
                            ${activeSection == modeSections[mode].outputSection ? 'text-white' : 'text-zinc-400'}`}
                            onClick={() => {
                                setActiveSection(modeSections[mode].outputSection)
                                textRef.current = answer
                            }}
                        >{modeSections[mode].outputSection}</h2>
                    </div>
                }
            </div>

            {/* card content */}
            <div className="relative overflow-hidden flex-grow overflow-y-auto px-4 py-4">
                <ContentEditable
                    html={textRef.current}
                    tagName=""
                    className={`prompt-card-body-content cursor-text dark:bg-zinc-800 p-0 dark:border-zinc-800 dark:text-white text-sm 
                            ${textRef.current.trim() === '' ? 'empty' : ''}`}
                    placeholder="Write your prompt here..."
                    onChange={onChangeHandler}
                    disabled={isMade && !isEditable}
                />

                {/* card footer */}
                <div className="h-6 flex flex-row justify-between mt-4">
                    <div className="flex items-center justify-start text-gray-400 text-xs">{wordCount} words</div>
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
                                    (isEditable) &&
                                    <button
                                        className="prompt-card-footer-button text-sm dark:text-zinc-400"
                                        onClick={switchEdit}>Cancel
                                    </button>
                                }
                                {
                                    (!isMade || isEditable) && <PaperAirplaneIcon
                                        className={`prompt-card-footer-icon ${modeColors[mode]}`}
                                        onClick={() => {
                                            onCreateHandler()
                                            switchEdit()
                                        }} />
                                }
                            </div>
                            :
                            <div className="px-4 flex items-center justify-end gap-3 "></div>
                    }
                </div>
            </div>
            {/* card footer */}

        </div>
    );
};

export default function MasonryLayout() {
    const [cards, setCards] = useState([
        { id: 0, answer: '', mode: '', model: '', prompt: '' },
        { id: 1, answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', mode: 'optimize', model: 'gpt-4', prompt: 'Prompt: Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { id: 2, answer: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce tincidunt orci ac gravida iaculis.', mode: 'explain', model: 'gpt-3', prompt: 'Prompt: Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce tincidunt orci ac gravida iaculis.' },
        { id: 3, answer: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.', mode: 'template', model: 'stable diffusion', prompt: 'Prompt: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.' },
        {
            id: 4, answer: `Aliquam pharetra, felis nec convallis lobortis, nisi orci viverra nulla, id pretium nulla libero at mauris. 
        Aliquam pharetra, felis nec convallis lobortis, nisi orci viverra nulla, id pretium nulla libero at mauris.`, mode: 'optimize', model: 'dalle', prompt: 'Prompt: Aliquam pharetra, felis nec convallis lobortis, nisi orci viverra nulla, id pretium nulla libero at mauris.'
        },
        { id: 5, answer: 'Morbi in tellus eget nisl consequat cursus eu ac nibh.', mode: 'explain', model: 'lexica', prompt: 'Prompt: Morbi in tellus eget nisl consequat cursus eu ac nibh.' },
        { id: 6, answer: 'Suspendisse potenti.', mode: 'template', model: 'chatgpt', prompt: 'Prompt: Suspendisse potenti.' },
    ]);
    const [columns, setColumns] = useState([]);

    const buildColumns = (arr, n) => {
        let subArrays = [];
        for (let i = 0; i < arr.length; i += n) {
            subArrays.push(arr.slice(i, i + n));
        }
        return subArrays[0].map((_, colIndex) => subArrays.map(row => row[colIndex]));
    }

    useEffect(() => {
        const columns = buildColumns(cards, 4);
        console.log('subArrays in useEffect', columns)
        setColumns(columns)
    }, [])

    return (
        // <div className="mansonry columns-3 gap-6 text-black min-h-screen my-8 mx-8 border">
        <div className="masonry min-h-screen gap-6 mx-10 py-10">
            {columns.map((column, i) => (
                <div key={i} className="items-start space-y-6">
                    {column.filter((item) => item !== undefined).map((card) => (
                        <Card cardData={card} />
                    ))}
                </div>
            ))}
        </div>
    );
};