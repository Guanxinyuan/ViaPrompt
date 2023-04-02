import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import FilterDropdown from '@/components/FilterDropdown';

export default function PromptSearchbar({ filterSetter, querySetter }) {
    const [query, setQuery] = useState('');
    useEffect(() => { }, [query])

    const handleSearch = async () => {
        // handle search logic
        querySetter(query)

    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            handleSearch();
        }
    };

    return (
        <div className='sub-header w-full flex flex-row gap-4 items-center text-sm'>
            <div className='w-2/3 flex relative'>
                <input
                    type="search"
                    placeholder="Search prompt (Press Enter)"
                    className="search-input"
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <MagnifyingGlassIcon className="absolute top-1/2 left-4 w-5 h-5 stroke-1 transform -translate-y-1/2 text-gray-600" />
            </div>
            <FilterDropdown width={'w-24'} height={"default"} options={['Optimize', "Decompose", "Template"]} defaultValue={''} paramSetter={filterSetter} />
        </div>
    )
}