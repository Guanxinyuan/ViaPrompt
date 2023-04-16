import { useState, useRef, useEffect } from 'react';
import { taskConfig } from '@/config/taskConfig';

export default function TaskDropdown({ defaultValue, paramSetter, isEditable }) {
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
            <div className="flex rounded-lg cursor-pointer">
                <button className={`text-sm font-semibold text-white rounded-md px-2 card-header-option w-24
                    ${taskConfig[selectedOption].buttonColor}`}
                    onClick={toggleDropdown}>
                    {selectedOption}
                </button>
            </div>
            {
                isEditable &&
                <div className="option-dropdown-container">

                    <div className={`option-dropdown w-32 h-fit ${isOpen ? '' : 'hidden'} `}>
                        <p className='text-xs'>Select a task with your prompt.</p>
                        <div className='flex flex-col gap-1'>

                            {
                                Object.entries(taskConfig).map(([task, config]) => {
                                    return (
                                        <div className='py-0.5'>
                                            <button
                                                className={`text-sm font-semibold text-white rounded-md px-2 card-header-option w-24 ${config.buttonColor}`}
                                                onClick={() => {
                                                    selectOption(task)
                                                    setIsOpen(false)
                                                }}>
                                                {task}
                                            </button>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
