// pages/search/q/[query].js

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const BlurImage = dynamic(() => import('@/components/BlurImage'), { ssr: false });

export default function SearchResults() {
    const router = useRouter();
    const { q } = router.query;
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (q) {
            search();
        }
    }, [router.isReady, q]);

    const search = async () => {
        const response = await fetch(`/api/search?q=${q}`);
        const data = await response.json();
        setResults(data.data);
    }

    return (
        <div className="w-screen">
            <div className="m-auto mx-10 py-16 columns-6 space-y-6 gap-6">
                {results.map((image) => {
                    return <BlurImage key={image.content_id} image={image} />
                })}
            </div>
        </div>
    );
}
