import { useState, useRef, useEffect } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { taskConfig } from '@/config/taskConfig';

export default function FilterDropdown({ defaultValue, paramSetter }) {
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

            <div className="h-auto rounded-lg cursor-pointer">
                <button className={`w-fit`}
                    onClick={toggleDropdown}>
                    {selectedOption == defaultValue ?
                        <div className='flex flex-row gap-1 items-center py-1'>
                            <FunnelIcon className='w-4' />
                            <span>Task</span>
                        </div>
                        :
                        <div className='flex w-fit gap-1.5 items-center'>
                            <div className='flex flex-row gap-1 items-center'>
                                <FunnelIcon className='w-4' />
                                <span className='mr-1'>
                                    Task
                                </span>
                            </div>
                            <span className={`task-button w-24 ${taskConfig[selectedOption].buttonColor}`}>{selectedOption}</span></div>}
                </button>
            </div>

            <div className="option-dropdown-container">
                <div className={`option-dropdown w-32 h-fit pt-4 ${isOpen ? '' : 'hidden'} `}>
                    <div className='flex flex-col gap-1 items-center'>
                        {Object.entries(taskConfig).map(([task, config]) => {
                            return (
                                <div key={task} className='py-0.5'>
                                    <button
                                        className={`text-sm font-semibold text-white rounded-md px-2 card-header-option w-24 ${config.buttonColor}}`}
                                        onClick={() => {
                                            selectOption(task)
                                            setIsOpen(false)
                                        }}>
                                        {task}
                                    </button>
                                </div>
                            )
                        })}
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
