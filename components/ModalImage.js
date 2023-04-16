import Image from 'next/image';
import discordImageLoader from '@/utils/frontend';
import { useState } from 'react';

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function ModalImage({ image, current }) {
    const [isLoading, setLoading] = useState(true);


    return (
        <div>
            <div className={cn('w-full overflow--hidden rounded-lg bg-zinc-200',
                current ? 'border-2 border-yellow-500' : '')}>
                <Image
                    alt=""
                    src={image.gc_url}
                    loader={discordImageLoader}
                    loading="lazy"
                    width={image.gc_width}
                    height={image.gc_height}
                    // fill
                    className={cn(
                        'object-cover object-center',
                        'duration-700 ease-in-out group-hover:opacity-75',
                        'rounded-lg',
                        isLoading
                            ? 'scale-110 blur-2xl grayscale'
                            : 'scale-100 blur-0 grayscale-0',
                    )}
                    onLoadingComplete={() => setLoading(false)}
                />
            </div>
        </div>
    );
}

