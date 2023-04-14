import { useState, useRef, useEffect } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';

export default function FilterDropdown({ defaultValue, paramSetter }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultValue);
    const dropdownRef = useRef(null);
    const options = ['optimize', "explain", "template"];

    const modeButtonColor = (option) => {
        switch (option) {
            case "optimize":
                return "bg-yellow-500 active:bg-yellow-700";
            case "decompose":
                return "bg-purple-500 active:bg-purple-700";
            case 'explain':
                return "bg-purple-500 active:bg-purple-700";
            case "template":
                return "bg-gray-500 active:bg-gray-700";
        }
    }

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

            <div className="h-auto rounded-lg cursor-pointer">
                <button className={`w-fit`}
                    onClick={toggleDropdown}>
                    {selectedOption == defaultValue ?
                        <div className='flex flex-row gap-1 items-center py-1'>
                            <FunnelIcon className='w-4' />
                            <span>Mode</span>
                        </div>
                        :
                        <div className='flex w-fit gap-1.5 items-center'>
                            <div className='flex flex-row gap-1 items-center'>
                                <FunnelIcon className='w-4' />
                                <span className='mr-1'>
                                    Mode
                                </span>
                            </div>
                            <span className={`mode-button w-24 ${modeButtonColor(selectedOption)}`}>{selectedOption}</span></div>}
                </button>
            </div>

            <div className="option-dropdown-container">
                <div className={`option-dropdown w-32 h-fit pt-4 ${isOpen ? '' : 'hidden'} `}>
                    <div className='flex flex-col gap-1 items-center'>
                        {options.map((option) => (
                            <div className='py-0.5'>
                                <button
                                    className={`text-sm font-semibold text-white rounded-md px-2 card-header-option w-24 ${modeButtonColor(option)}}`}
                                    onClick={() => {
                                        selectOption(option)
                                        setIsOpen(false)
                                    }}>
                                    {option}
                                </button>
                            </div>
                        ))}
                        <button
                            className={`text-sm font-semibold text-white rounded-md px-2 card-header-option w-24`}
                            onClick={() => {
                                selectOption(defaultValue)
                                setIsOpen(false)
                            }}>
                            reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
