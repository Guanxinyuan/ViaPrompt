import { useState, useRef, useEffect } from 'react';
import ParamButton from '@/components/paramDropdowns/ParamButton';

export default function Dropdown({ width, height, paramName, options, defaultValue, paramSetter }) {
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
        // setIsOpen(false);
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
                className="h-auto rounded-lg cursor-pointer"
                onClick={toggleDropdown}
            >
                <ParamButton>
                    {paramName} {selectedOption == defaultValue ? '' : <span className='rounded bg-gray-700 px-3 mx-1'>{selectedOption}</span>}
                </ParamButton>
            </div>
            <div className="relative text-gray-800">
                <div className={`absolute mt-2 z-50 bg-white shadow rounded-lg 
                    ${!width || width == 'default' ? 'w-full' : width}
                    ${!height || height == 'default' ? 'h-full' : height}
                    ${isOpen ? 'block' : 'hidden'} `}>
                    {options.map((option) => (
                        <div
                            key={option}
                            className=" bg-white rounded-lg px-3 py-2 hover:bg-gray-300 cursor-pointer"
                            onClick={() => selectOption(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
