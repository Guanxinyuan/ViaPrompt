import { useState, useRef, useEffect } from 'react';
import useColorMode from '@/hooks/useColorMode';

export default function ModelDropdown({ defaultValue, paramSetter, isEditable, ...rest }) {
    const { numColumns } = rest;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultValue);
    const [colorMode] = useColorMode();
    const options = ["chatgpt", "gpt-3", "gpt-4", "midjourney", "stable diffusion", "dalle"]

    const modelInfoDict = {
        'midjourney': {
            name: 'Midjourney', description: '', logo: {
                url: '/logos/mj.png',
                darkable: true
            }
        },
        'chatgpt': {
            name: 'ChatGPT', description: '', logo: {
                url: '/logos/chatgpt.svg',
            }
        },
        'gpt-3': {
            name: 'GPT-3', description: '', logo: {
                url: '/logos/gpt-3.svg',
            }
        },
        'gpt-4': {
            name: 'GPT-4', description: '', logo: {
                url: '/logos/gpt-4.svg',
                darkable: true
            }
        },
        'stable diffusion': {
            name: 'Stable Diffusion', description: '', logo: {
                url: '/logos/sd.png',
            }
        },
        'dalle': {
            name: 'Dalle', description: '', logo: {
                url: '/logos/dalle.png',
            }
        },
    }
    const dropdownRef = useRef(null);

    useEffect(() => {
    }, [selectedOption]);


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectOption = (option) => {
        setSelectedOption(option);
        paramSetter(option);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
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
            <div
                className="model-button"
                onClick={toggleDropdown}>
                <img src={modelInfoDict[selectedOption].logo.url}
                    className={`card-header-icon ${modelInfoDict[selectedOption].logo.darkable && "dark:invert"} `} />

                {numColumns <= 2 && (
                    <p className="text-sm  font-semibold">{modelInfoDict[selectedOption].name} Prompt</p>
                )}
                {numColumns == 3 && (
                    <p className="text-sm  font-semibold">{modelInfoDict[selectedOption].name}</p>
                )}
            </div>
            {
                isEditable &&
                <div className="option-dropdown-container">
                    <div className={`option-dropdown  w-44 ${isOpen ? 'block' : 'hidden'} `}>
                        <p className='text-xs pb-2 px-2'>Select an AI model your prompt will be used in.</p>
                        {options.map((option) => (
                            <div className='model-option-item'
                                onClick={() => {
                                    selectOption(option)
                                    setIsOpen(false)
                                }}>
                                <div className="flex flex-row items-center ml-auto gap-2 px-2 pt-1.5 ">
                                    <img src={modelInfoDict[option].logo.url}
                                        className={`card-header-icon ${modelInfoDict[option].logo.darkable && "dark:invert"} `} />
                                    <p className="text-sm">{modelInfoDict[option].name}</p>
                                </div>
                                <p className='text-sm px-4 py-1'>
                                    {modelInfoDict[option].description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
}
