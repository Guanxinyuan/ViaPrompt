import { useState, useRef, useEffect } from 'react';
// import MidjourneyIcon from '/logos/mj.png';

export default function ModelDropdown({ options, defaultValue, paramSetter, lockInput }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultValue);
    const modelImageDict = {
        'Midjourney V4': '/logos/mj.png',
        'ChatGPT': 'logos/chatgpt.svg',
        'GPT-4': 'logos/openai.svg',
        'GPT-3': 'logos/openai-nobg.svg',
        "Stable Diffusion": 'logos/sd.png',
        "Lexica": 'logos/lexica.png',
        "Dalle": 'logos/dalle.png',
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
        <div className="relative col-start-3 col-span-2" ref={dropdownRef}>
            <div
                className="model-button"
                onClick={toggleDropdown}>
                <img src={modelImageDict[selectedOption]} className='model-icon' />
                <p className={`py-1`}>{selectedOption}</p>
            </div>
            {
                !lockInput &&
                <div className="option-dropdown-container">
                    <div className={`option-dropdown w-full ${isOpen ? 'block' : 'hidden'} `}>
                        <p className='text-xs pb-2 px-2'>
                            <span className='font-semibold'>Step 2: </span>Select an AI model for prompting.
                            <span className='cursor-pointer' onClick={() => alert('model example page')}> View examples ↗</span></p>
                        {options.map((option) => (
                            <div className='model-option-item'
                                onClick={() => {
                                    selectOption(option)
                                    setIsOpen(false)
                                }}>
                                <div className="flex flex-row items-center ml-auto gap-2 px-2 pt-2">
                                    <img src={modelImageDict[option]} className='w-6' />
                                    <p className="">{option}</p>
                                </div>
                                <p className='text-xs px-4 py-1'>
                                    {option == 'ChatGPT' && ""}
                                    {option == 'GPT 4' && ""}
                                    {option == 'GPT 3' && ""}
                                    {option == 'Midjourney V4' && ""}
                                    {option == 'Stable Diffusion' && ""}
                                    {option == 'Dalle' && ""}
                                    {option == 'Lexica' && ""}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
}
