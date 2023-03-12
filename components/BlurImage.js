import dynamic from 'next/dynamic';
import Image from 'next/image';
const PromptModal = dynamic(() => import('@/components/PromptModal'), { ssr: false });
import discordImageLoader from '@/utils/frontend';
import { useEffect, useState, useRef } from 'react';

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function BlurImage({ image }) {
    const [isLoading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [siblingImages, setSiblingImages] = useState();
    const showModalRef = useRef(false);
    const cdnUrl = "d1fnc2wv9zomi3.cloudfront.net"
    // const cdnUrl = "viaprompt.b-cdn.net"

    useEffect(() => {
    }, [])

    useEffect(() => { }, [showModal])


    const handleClick = async () => {
        setShowModal(true);
        if (!siblingImages) {
            const prompt = encodeURIComponent(image.prompt.replace(/'/g, "''"))
            const response = await fetch(`/api/data/siblings?prompt=${prompt}`);
            const data = await response.json()
            setSiblingImages(data.data);
        }
    }

    return (
        <div>
            <div className='relative group'>
                <div className={cn(`w-full overflow-hidden rounded-lg bg-gray-200 rounded-lg cursor-pointer `)} onClick={handleClick}>
                    <Image
                        src={image.gc_url.replace("media.discordapp.net", cdnUrl)}
                        // loader={discordImageLoader}
                        alt={image.prompt}
                        loading="lazy"
                        width={image.gc_width * 0.5}
                        height={image.gc_height * 0.5}
                        responsive
                        quality={30}
                        className={cn(
                            'object-cover object-center',
                            'duration-700 ease-in-out group-hover:opacity-75',
                            isLoading
                                ? 'scale-110 blur-2xl grayscale'
                                : 'scale-100 blur-0 grayscale-0'
                        )}
                        onLoadingComplete={() => setLoading(false)}
                    />
                </div>
                <div
                    className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-lg backdrop-filter text-white p-4 opacity-0 group-hover:opacity-100 cursor-pointer rounded-lg"
                    onClick={handleClick}>
                    <p>{image.prompt}</p>
                </div>

            </div>
            {showModal && siblingImages &&
                <PromptModal images={siblingImages} onCloseModal={() => setShowModal(false)} showModalRef={showModalRef} />
            }
        </div>
    );
}

