import { useState, useRef, useEffect } from 'react';

export default function ModeDropdown({ width, height, options, defaultValue, paramSetter, lockInput }) {
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
        <div className="relative border col-span-1" ref={dropdownRef}>

            <div className="h-auto rounded-lg cursor-pointer">
                <button className={`mode-button py-1
                ${lockInput ? 'opacity-70' : ''}
                ${!width || width == 'default' ? 'w-full' : width}
                ${selectedOption == "Optimize" ? '' : selectedOption == "Decompose" ? 'bg-purple-500 active:bg-purple-700' : 'bg-gray-500 active:bg-gray-700'}`}
                    onClick={toggleDropdown}>
                    {selectedOption}
                </button>
            </div>
            {
                !lockInput &&
                <div className="option-dropdown-container">

                    <div className={`option-dropdown
                    ${!width || width == 'default' ? 'w-full' : 'w-44'}
                    ${!height || height == 'default' ? 'h-fit' : height}
                    ${isOpen ? '' : 'hidden'} `}>
                        <p className='text-xs'>
                            <span className='font-bold'>Step 1: </span>Select a mode to operate.
                            <span className='cursor-pointer' onClick={() => alert('Example page here')}> View examples ↗</span>
                        </p>
                        {options.map((option) => (
                            <div className='py-1'>
                                <button
                                    className={`mode-button ${width} ${option == "Optimize" ? 'bg-yellow-500' :
                                        option == "Decompose" ? 'bg-purple-500' : 'bg-gray-500'}`}
                                    onClick={() => {
                                        selectOption(option)
                                        setIsOpen(false)
                                    }}>
                                    {option}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
}
