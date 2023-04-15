import { useState, useEffect, useRef } from 'react';
import { LightBulbIcon } from '@heroicons/react/24/outline';

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


    const tasks = [
        { name: 'optimize', description: 'Creating satisfying prompts costs time and resources of testings. Now, type in your prompt, wait for a quick optimization, and bang you get the perfect prompt in a flash.' },
        { name: 'analyze', description: 'Best prompts have patterns. This feature breaks down great prompts into essential components, so you can rebuild from success and create your winning ones.' },
        { name: 'memo', description: 'Random inspirations matter. You can simply take a note of your favorite prompts effortlessly with the memo feature, allowing you to build a valuable collection of ideas and inspiration for future use.' },
    ];

    const aiModels = {

        'chatgpt': {
            name: 'ChatGPT',
            description: "The language model always ready for a chat - from translation to coding and everything in between.",
            logo: {
                url: '/logos/chatgpt.svg',
            }
        },
        'gpt-3': {
            name: 'GPT-3',
            description: "The text-generating wizard that'll make you forget it's all machine-generated.",
            logo: {
                url: '/logos/gpt-3.svg',
            }
        },
        'gpt-4': {
            name: 'GPT-4',
            description: 'The newer, better, stronger, faster cousin of GPT-3 that will leave you wondering what else it can do.',
            logo: {
                url: '/logos/gpt-4.svg',
                darkable: true
            }
        },
        'midjourney': {
            name: 'Midjourney',
            description: "The text-to-image model that'll make you want to speak in pictures (natural langauge friendly).",
            logo: {
                url: '/logos/mj.png',
                darkable: true
            }
        },
        'stable diffusion': {
            name: 'Stable Diffusion',
            description: 'The AI model that brings images to life - and does it with stability.',
            logo: {
                url: '/logos/sd.png',
            }
        },
        'dalle': {
            name: 'Dalle',
            description: 'The artistic genius that turns your words into stunning visual masterpieces.',
            logo: {
                url: '/logos/dalle.png',
            }
        },
    }

    const modeButtonColor = (option) => {
        switch (option) {
            case "optimize":
                return "bg-yellow-500 active:bg-yellow-700";
            case 'analyze':
                return "bg-purple-500 active:bg-purple-700";
            case "memo":
                return "bg-gray-500 active:bg-gray-700";
        }
    }

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
                                        {tasks.map((task) => (
                                            <div key={task.name} className="mt-1 ">
                                                <div className='py-0.5 gap-4 flex items-center'>
                                                    <button className={`text-sm font-semibold text-white rounded-md px-2 card-header-option min-w-[96px] ${modeButtonColor(task.name)}}`}
                                                    >
                                                        {task.name}
                                                    </button>
                                                    <p className='text-sm'>{task.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Model section */}
                                <div className="p-4 rounded-xl dark:bg-zinc-800">
                                    <h4 className="text-md mb-2 flex items-center">
                                        <span className='font-semibold'>AI models:</span>
                                        <span className='ml-2 text-sm underline'> the popular AI models where your spells will work</span>
                                    </h4>
                                    <div className="list-disc pl-5">
                                        {Object.entries(aiModels).map(([_, model]) => (
                                            <div className='model-option-item'>
                                                <div className="flex flex-row items-center ml-auto gap-2 pt-1.5 ">
                                                    <img src={model.logo.url}
                                                        className={`card-header-icon ${model.logo.darkable && "dark:invert"} `}
                                                    />
                                                    <p className="text-sm font-semibold">{model.name}</p>
                                                    <p className='text-sm px-2 py-1'>
                                                        {model.description}
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

