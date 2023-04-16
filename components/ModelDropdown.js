import { useState, useRef, useEffect } from 'react';
import useColorMode from '@/hooks/useColorMode';
import { aiModelConfig } from '@/config/aiModelConfig';

export default function ModelDropdown({ defaultValue, paramSetter, isEditable, ...rest }) {
    const { numColumns } = rest;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultValue);
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
                <img src={aiModelConfig[selectedOption].logo.url}
                    className={`card-header-icon ${aiModelConfig[selectedOption].logo.darkable && "dark:invert"} `} />

                {numColumns <= 3 && (
                    <p className="text-sm font-semibold text-zinc-600 dark:text-white">{aiModelConfig[selectedOption].name}</p>
                )}
            </div>
            {
                isEditable &&
                <div className="option-dropdown-container">
                    <div className={`option-dropdown  w-44 ${isOpen ? 'block' : 'hidden'} `}>
                        <p className='text-xs pb-2 px-2'>Select an AI model your prompt will be used in.</p>
                        {Object.entries(aiModelConfig).map(([task, config]) => (
                            <div key={task} className='model-option-item'
                                onClick={() => {
                                    selectOption(task)
                                    setIsOpen(false)
                                }}>
                                <div className="flex flex-row items-center ml-auto gap-2 px-2 pt-1.5 ">
                                    <img src={config.logo.url}
                                        className={`card-header-icon ${config.logo.darkable && "dark:invert"} `} />
                                    <p className="text-sm font-medium">{config.name}</p>
                                </div>
                                <p className='text-sm px-4 py-1' />
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
}
