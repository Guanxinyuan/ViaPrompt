import { useState, useRef, useEffect } from 'react';
import ParamButton from '@/components/paramDropdowns/ParamButton';

export default function SizeDropdown({ width, height, paramName, paramSetter }) {
    const defaultValue = 'Default (1024 x 1024)'
    const options = {
        "Default (1024 x 1024)": "1024px x 1024px, aspect-ratio 1:1",
        "16:9": "Today'standard ratio for film and display",
        "9:16": "Used for mobile images, such as Instagram and Snapchat",
        "4:3": "Used to be the aspect ratio of 35mm celluloid film, TVs and monitors",
        "4:5": "Instagram portrait",
        "2:1": "Frequently used in video streaming"
    }
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultValue);
    const [aspectWidth, setAspectWidth] = useState(0);
    const [aspectHeight, setAspectHeight] = useState(0);

    const dropdownRef = useRef(null);

    useEffect(() => {

    }, [selectedOption]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (selectedOption == 'Custom') {
            paramSetter(`${aspectWidth}:${aspectHeight}`);
        }
    }, [aspectWidth, aspectHeight]);


    const selectOption = (option) => {
        setSelectedOption(option);
        if (option != "Custom") {
            paramSetter(option);
        } else {
            paramSetter(`${aspectWidth}:${aspectHeight}`);
        }
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

            <div className="h-auto rounded-lg cursor-pointer"
                onClick={toggleDropdown}
            >
                <ParamButton>
                    {paramName} {selectedOption == defaultValue ? '' : <span className='param-span'>{selectedOption}</span>}
                </ParamButton>
            </div>
            <div className="option-dropdown-container">
                <div className={`option-dropdown
                    ${!width || width == 'default' ? 'w-full' : width}
                    ${!height || height == 'default' ? 'h-full' : height}
                    ${isOpen ? 'block' : 'hidden'} `}>
                    {Object.keys(options).map((option) => (
                        <div key={option}
                            className="param-option"
                            onClick={() => selectOption(option)}>
                            {option}
                        </div>
                    ))}
                    <div key='custom'
                        className="flex flex-col py-2 px-3 w-full cursor-pointer hover:bg-zinc-300"
                        onClick={() => selectOption("Custom")}>
                        <p className='text-center text-sm font-bold'>Custom Aspect-Ratio</p>
                        <div className='flex flex-row gap-2 rounded-lg px-3 py-2 hover:bg-zinc-300 cursor-pointer'>
                            <input
                                type="number"
                                className='px-2 border border-black w-1/2 rounded-lg'
                                value={aspectWidth}
                                onChange={(e) => setAspectWidth(e.target.value)} />
                            <p>:</p>
                            <input
                                type="number"
                                className='px-2 border border-black w-1/2 rounded-lg'
                                value={aspectHeight}
                                onChange={(e) => setAspectHeight(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
