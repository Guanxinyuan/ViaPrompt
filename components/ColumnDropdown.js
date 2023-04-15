import { useState, useRef, useEffect } from "react";
import { ViewColumnsIcon } from '@heroicons/react/24/outline';

const ColumnDropdown = ({ defaultValue, paramSetter }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const dropdownRef = useRef(null);

    const options = [1, 2, 3, 4];

    const handleChange = (value) => {
        setSelectedValue(value);
        paramSetter(value);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="w-fit flex items-center gap-1 py-1"
                onClick={() => setIsOpen(!isOpen)}
            >
                <ViewColumnsIcon className="w-4" />
                <span>{selectedValue} Column{selectedValue > 1 ? "s" : ""}</span>
            </button>
            <div className={`option-dropdown-container ${isOpen ? "" : "hidden"}`}>
                <div className="option-dropdown w-36 h-fit py-2">
                    <div className="flex flex-wrap gap-1 items-center justify-center">
                        {options.map((option) => (
                            <button
                                key={option}
                                className={`text-sm font-semibold text-gray-700 dark:text-zinc-400 rounded-md px-2 py-0.5 border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-800 ${option === selectedValue
                                    ? "bg-zinc-400 dark:bg-zinc-700 text-white"
                                    : ""
                                    }`}
                                onClick={() => {
                                    handleChange(option);
                                    setIsOpen(false);
                                }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColumnDropdown;
