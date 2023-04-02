import { useState, useRef, useEffect } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';

export default function FilterDropdown({ width, height, options, defaultValue, paramSetter }) {
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
        <div className="relative col-span-1" ref={dropdownRef}>

            <div className="h-auto rounded-lg cursor-pointer">
                <button className={`
                ${!width || width == 'default' ? 'w-fit' : 'w-fit'}`}
                    onClick={toggleDropdown}>
                    {selectedOption == defaultValue ?
                        <div className='flex flex-row gap-1 items-center py-1'>
                            <FunnelIcon className='w-4' />
                            <span>Filter</span>
                        </div>
                        :
                        <div className='flex w-fit gap-1.5 items-center'>
                            <div className='flex flex-row gap-1 items-center'>
                                <FunnelIcon className='w-4' />
                                <span className='mr-1'>
                                    Filter by
                                </span>
                            </div>
                            <span className={`mode-button ${width}
                            ${selectedOption == "Optimize" ? '' : selectedOption == "Decompose" ? 'bg-purple-500 active:bg-purple-700' : 'bg-gray-500 active:bg-gray-700'}`}>{selectedOption}</span></div>}
                </button>
            </div>

            <div className="option-dropdown-container">

                <div className={`option-dropdown
                    ${!width || width == 'default' ? 'w-fit' : 'w-26'}
                    ${!height || height == 'default' ? 'h-fit' : height}
                    ${isOpen ? '' : 'hidden'} `}>
                    {options.map((option) => (
                        <button
                            className={`mode-button ${width} ${option == "Optimize" ? 'bg-yellow-500' :
                                option == "Decompose" ? 'bg-purple-500' : 'bg-gray-500'}`}
                            onClick={() => {
                                selectOption(option)
                                setIsOpen(false)
                            }}>
                            {option}
                        </button>
                    ))}
                    <button
                        className={`mode-button ${width} text-black bg-white dark:bg-zinc-900 dark:text-white`}
                        onClick={() => {
                            selectOption(defaultValue)
                            setIsOpen(false)
                        }}>
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
