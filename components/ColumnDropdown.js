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
                                className={`text-sm font-semibold rounded-md px-2 border py-0.5 bg-white dark:text-zinc-400 ${option === selectedValue
                                    ? "bg-zinc-300  dark:bg-zinc-600 dark:border-zinc-600 dark:text-white"
                                    : "border-zinc-300 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white "
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
