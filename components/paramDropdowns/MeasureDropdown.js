import { useState, useRef, useEffect } from 'react';
import ParamButton from '@/components/paramDropdowns/ParamButton';

export default function MeasureDropdown({ width, height, paramName, minValue, maxValue, step, defaultValue, paramSetter }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {

    }, [value]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };


    const onChangeHandler = (event) => {
        setValue(event.target.value);
        paramSetter(event.target.value);
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
                    {paramName} {value == defaultValue ? '' : <span className='param-span'>{value}</span>}
                </ParamButton>
            </div>
            <div className="relative text-gray-800">
                <div
                    className={`absolute mt-2 z-10 bg-white shadow border border-gray-400 rounded-lg 
                    ${!width || width == 'default' ? 'w-full' : width}
                    ${!height || height == 'default' ? 'h-full' : height}
                    ${isOpen ? 'block' : 'hidden'} `}
                >
                    {paramName != 'Seed' ?
                        <div className="flex flex-col items-center space-y-3 p-4 justify-center ">
                            <label htmlFor="range" className="font-medium text-gray-700">
                                <span className='font-bold'>{paramName}</span>: {value}
                            </label>
                            <input
                                type="range"
                                id="range"
                                name="range"
                                min={minValue}
                                max={maxValue}
                                value={value}
                                step={step}
                                onChange={onChangeHandler}
                                className="border border-black w-2/3 rounded focus:outline-none focus:ring-indigo-500"
                            />
                            <div className="w-2/3 grid grid-cols-3 font-medium text-gray-700">
                                <p className='text-left'>{minValue}</p>
                                <p className='text-center'>{(minValue + maxValue) / 2}</p>
                                <p className='text-right'>{maxValue}</p>
                            </div>
                        </div>
                        :
                        <div className="flex flex-col items-center space-y-3 p-4 justify-center ">
                            <label htmlFor="range" className="font-medium text-gray-700">
                                <span className='font-bold'>{paramName}</span>: {value}
                            </label>
                            <input
                                type="number"
                                value={value}
                                onChange={onChangeHandler}
                                className="px-2 border border-black w-2/3 rounded focus:outline-none focus:ring-indigo-500"
                            />
                            <p className='text-center text-xs font-bold text-yellow-700'>Seed range is {minValue}-{maxValue}</p>
                        </div>
                    }

                </div>
            </div>
        </div>
    );
}
