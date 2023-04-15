import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import FilterDropdown from '@/components/FilterDropdown';
import ColumnDropdown from '@/components/ColumnDropdown';
import FeedbackDropdown from '@/components/FeedbackDropdown';

export default function PromptSearchbar({ filterSetter, querySetter, columnsSetter }) {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null)

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            querySetter(query)
            inputRef.current.focus();
        }
    };

    const handleKeyUp = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            inputRef.current.focus();
        }
    };

    return (
        <div className='sub-header w-full flex flex-row gap-4 items-center text-sm'>
            <div className=' flex flex-grow relative'>
                <input
                    type="text"
                    ref={inputRef}
                    placeholder="Search prompt (Press Enter)"
                    className="search-input placeholder-zinc-500 rounded-lg"
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <MagnifyingGlassIcon className="absolute top-1/2 left-4 w-5 h-5 stroke-1 transform -translate-y-1/2 text-zinc-500" />
            </div>
            <FilterDropdown defaultValue={''} paramSetter={filterSetter} />
            <ColumnDropdown defaultValue={1} paramSetter={columnsSetter} />
            <FeedbackDropdown />
        </div>
    )
}