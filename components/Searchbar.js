import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function Searchbar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    useEffect(() => { }, [query])

    const handleSearch = async () => {
        // handle search logic
        if (query) {
            router.push(`/search?q=${query}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            handleSearch();
        }
    };

    return (
        <div className='w-full flex relative'>
            <input
                type="search"
                placeholder="Search prompt..."
                className="w-full px-3 py-2 pl-12 text-zinc-700 bg-zinc-200 rounded-2xl focus:outline-none focus:bg-zinc-200 focus:ring-2 focus:ring-blue-500 hover:bg-zinc-300"
                onKeyDown={handleKeyDown}
                onChange={(e) => setQuery(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute top-1/2 left-4 w-6 h-6 stroke-2 transform -translate-y-1/2 text-zinc-600" />
        </div>
    )
}