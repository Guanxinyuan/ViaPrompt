import { useState, useRef, useEffect } from 'react';

export default function ModeDropdown({ defaultValue, paramSetter, isEditable }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultValue);
    const dropdownRef = useRef(null);

    const options = ["optimize", "explain", "template"]

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

            <div className="flex rounded-lg cursor-pointer">
                <button className={`text-sm font-semibold text-white rounded-md px-2 card-header-option w-24
                 ${modeButtonColor(selectedOption)}}`}
                    onClick={toggleDropdown}>
                    {selectedOption}
                </button>
            </div>
            {
                isEditable &&
                <div className="option-dropdown-container">

                    <div className={`option-dropdown w-32 h-fit ${isOpen ? '' : 'hidden'} `}>
                        <p className='text-xs'>Select a task with your prompt.</p>
                        <div className='flex flex-col'>
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
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
