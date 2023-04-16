import { useState, useEffect, useRef } from 'react';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import { taskConfig } from '@/config/taskConfig';
import { aiModelConfig } from '@/config/aiModelConfig';

export default function UserGuideDropdown({ ...rest }) {

    const { triggerButtonSize } = rest;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const buttonRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
            buttonRef.current && !buttonRef.current.contains(event.target)) {
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
        <div>
            <div className="relative" ref={buttonRef}>
                <button
                    className="flex flex-row gap-1 items-center py-1"
                    onClick={toggleDropdown}>
                    <LightBulbIcon className={`text-yellow-500 ${!triggerButtonSize ? 'w-4' : triggerButtonSize}`} />
                    <span className='text-yellow-500'>Use Guide</span>

                </button>
            </div>
            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                    <div className="fixed z-10 inset-0 flex items-center justify-center">
                        <div className="relative">
                            <div className={`option-dropdown w-[60vw] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-fit flex flex-col gap-5 px-8 pt-5 pb-8 rounded-2xl`}>

                                <h1 className='text-center font-semibold text-xl'>Palaxy User Guide</h1>

                                {/* Task section */}
                                <div className='p-4 rounded-xl dark:bg-zinc-800'>
                                    <h4 className="text-md mb-2 flex items-center">
                                        <span className='font-semibold'>Tasks:</span>
                                        <span className='ml-2 text-sm underline'> the prompt-related features that evolve your efficiency in prompt engineering</span>
                                    </h4>
                                    <div className='pl-5'>
                                        {
                                            Object.entries(taskConfig).map(([task, config]) => (
                                                <div key={task} className="mt-1 ">
                                                    <div className='py-0.5 gap-4 flex items-center'>
                                                        <button className={`text-sm font-semibold text-white rounded-md px-2 card-header-option min-w-[96px] ${config.buttonColor}}`}
                                                        >
                                                            {task}
                                                        </button>
                                                        <p className='text-sm'>{config.description}</p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>

                                {/* Model section */}
                                <div className="p-4 rounded-xl dark:bg-zinc-800">
                                    <h4 className="text-md mb-2 flex items-center">
                                        <span className='font-semibold'>AI models:</span>
                                        <span className='ml-2 text-sm underline'> the popular AI models where your spells will work</span>
                                    </h4>
                                    <div className="list-disc pl-5">
                                        {Object.entries(aiModelConfig).map(([model, config]) => (
                                            <div key={model} className='model-option-item'>
                                                <div className="flex flex-row items-center ml-auto gap-2 pt-1.5 ">
                                                    <img src={config.logo.url}
                                                        className={`card-header-icon ${config.logo.darkable && "dark:invert"} `}
                                                    />
                                                    <p className="text-sm font-semibold">{config.name}</p>
                                                    <p className='text-sm px-2 py-1'>
                                                        {config.description}
                                                    </p>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="fixed inset-0 bg-gray-500 opacity-30"
                            onClick={toggleDropdown}
                        />
                    </div>
                </>
            )}
        </div>
    );

}

