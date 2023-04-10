import { useState, useRef, useEffect } from 'react';
// import MidjourneyIcon from '/logos/mj.png';

export default function ModelDropdown({ defaultValue, paramSetter, isEditable }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultValue);
    const options = ["chatgpt", "gpt-4", "gpt-3", "midjourney", "stable diffusion", "dalle", "lexica"]

    const modelInfoDict = {
        'midjourney': { logo: '/logos/mj.png', name: 'Midjourney', description: '' },
        'chatgpt': { logo: '/logos/chatgpt.svg', name: 'ChatGPT', description: '' },
        'gpt-4': { logo: '/logos/openai.svg', name: 'GPT-4', description: '' },
        'gpt-3': { logo: '/logos/openai-nobg.svg', name: 'GPT-3', description: '' },
        'stable diffusion': { logo: '/logos/sd.png', name: 'Stable Diffusion', description: '' },
        'lexica': { logo: '/logos/lexica.png', name: 'Lexica', description: '' },
        'dalle': { logo: '/logos/dalle.png', name: 'Dalle', description: '' },
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
                <img src={modelInfoDict[selectedOption].logo} className='card-header-option' />
                {/* <p className="text-xs">{modelInfoDict[selectedOption].name}</p> */}
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
                                    <img src={modelInfoDict[option].logo} className='card-header-option' />
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
