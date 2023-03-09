
import { createClient } from '@supabase/supabase-js';
import BlurImage from '@/components/BlurImage';
import { useEffect } from 'react';


export default function Gallery(props) {
    const images = props.images;
    useEffect(() => {
        console.log('props', props)
        console.log('images', images)
    }, [])

    return (
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {/* {images.map((image) => (
                    <BlurImage key={image.content_id} image={image} />
                ))} */}
            </div>
        </div>
    );
}

export async function getStaticProps() {
    const response = await fetch('https://myapi.com/images');
    const images = await response.json();

    return {
        props: {
            images: images,
        },
    };
}
