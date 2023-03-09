import { useState, useEffect } from 'react';
import ModalImage from '@/components/ModalImage';
import { getClosestRatio } from '@/utils/calc';

export default function PromptModal({ images, onCloseModal }) {

    const [currentImage, setCurrentImage] = useState(0);

    const closeModal = () => {
        onCloseModal()
    };

    return (
        <div className="flex items-center justify-center">
            <div className="fixed z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <div
                    className="absolute z-50 bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-1/3 sm:w-3/5 h-5/6 flex flex-row"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                    {/* Left column */}
                    <div className="w-1/2 p-6 flex flex-col">
                        <div className='w-full h-1/2'>
                            <h3 className="text-base font-bold leading-6 text-gray-900" id="modal-headline">
                                Prompt
                            </h3>
                            <div className="mt-2 relative h-3/5">
                                <textarea
                                    className="w-full h-full p-3 border border-black text-gray-500 text-sm rounded-lg resize-none mb-4 overflow-auto"
                                    value={images[currentImage].prompt}
                                    readOnly
                                ></textarea>
                                <button
                                    className="absolute bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold rounded-lg px-2 py-1 right-2 bottom-2"
                                >C</button>
                            </div>
                        </div>
                        <div className='w-full h-1/4'>
                            <h3 className="text-base font-bold leading-6 text-gray-900" id="modal-headline">
                                Model
                            </h3>
                            <div className="mt-2 relative h-1/5">
                                <p className='text-sm text-gray-500'>{images[currentImage].model}</p>
                            </div>
                        </div>
                        <div className='w-full h-1/4'>
                            <h3 className="text-base font-bold leading-6 text-gray-900" id="modal-headline">
                                Dimensions
                            </h3>
                            <div className="mt-2 relative h-1/5">
                                <p className='text-sm text-gray-500'>{images[currentImage].gc_width} x {images[currentImage].gc_height}</p>
                            </div>
                        </div>
                        <div className='w-full h-1/4'>
                            <h3 className="text-base font-bold leading-6 text-gray-900" id="modal-headline">
                                Creation Type
                            </h3>
                            <div className="mt-2 relative h-1/5">
                                <p className='text-sm text-gray-500'>{images[currentImage].type}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="w-1/2 p-6 overflow-y-auto">
                        <div className='mb-4'>
                            <ModalImage image={images[currentImage]} />
                        </div>
                        {images.length > 1 &&
                            <div className={`grid grid-cols-5 gap-2`}>
                                {
                                    images.map((image, index) => {
                                        if (index === currentImage) {
                                            return <div className='cursor-pointer'>
                                                <ModalImage image={image} current={true} />
                                            </div>
                                        }
                                        return <div className='cursor-pointer' onClick={() => setCurrentImage(index)} >
                                            <ModalImage image={image} current={false} />
                                        </div>
                                    })
                                }
                            </div>
                        }
                    </div>
                </div>

                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-gray-500 opacity-75"
                    onClick={closeModal}
                />
            </div>
        </div>
    );
}
