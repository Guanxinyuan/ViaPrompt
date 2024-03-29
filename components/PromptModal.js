import { useState } from 'react';
import dynamic from 'next/dynamic';
const ModalImage = dynamic(() => import('@/components/ModalImage'), { ssr: false });

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
                            <h3 className="text-base font-bold leading-6 text-zinc-900" id="modal-headline">
                                Prompt
                            </h3>
                            <div className="mt-2 relative h-3/5">
                                <textarea
                                    className="w-full h-full p-3 border border-black text-zinc-500 text-sm rounded-lg resize-none mb-4 overflow-auto"
                                    value={images[currentImage].prompt}
                                    readOnly
                                ></textarea>
                                <button
                                    className="absolute bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold rounded-lg px-2 py-1 right-2 bottom-2"
                                >C</button>
                            </div>
                        </div>
                        <div className='w-full h-1/4'>
                            <h3 className="text-base font-bold leading-6 text-zinc-900" id="modal-headline">
                                Model
                            </h3>
                            <div className="mt-2 relative h-1/5">
                                <p className='text-sm text-zinc-500'>{images[currentImage].model}</p>
                            </div>
                        </div>
                        <div className='w-full h-1/4'>
                            <h3 className="text-base font-bold leading-6 text-zinc-900" id="modal-headline">
                                Dimensions
                            </h3>
                            <div className="mt-2 relative h-1/5">
                                <p className='text-sm text-zinc-500'>{images[currentImage].gc_width} x {images[currentImage].gc_height}</p>
                            </div>
                        </div>
                        <div className='w-full h-1/4'>
                            <h3 className="text-base font-bold leading-6 text-zinc-900" id="modal-headline">
                                Creation Type
                            </h3>
                            <div className="mt-2 relative h-1/5">
                                <p className='text-sm text-zinc-500'>{images[currentImage].type}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="w-1/2 p-6 overflow-y-auto">
                        <div className='mb-4'>
                            <ModalImage key={currentImage.content_id} image={images[currentImage]} />
                        </div>
                        {images.length > 1 &&
                            <div className={`grid grid-cols-5 gap-2`}>
                                {
                                    images.map((image, index) => {
                                        if (index === currentImage) {
                                            return <div className='cursor-pointer'>
                                                <ModalImage key={image.content_id} image={image} current={true} />
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
                    className="fixed inset-0 bg-zinc-500 opacity-75"
                    onClick={closeModal}
                />
            </div>
        </div>
    );
}


// export default function Home() {
//     const qualities = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
//     return (
//       <div className="w-screen h-screen columns-5">
//         {
//           qualities.map((quality) => {
//             return (
//               <TestImage quality={quality} />
//             )
//           })
//         }
//       </div>
//     )
//   }
  
//   const TestImage = ({ quality }) => {
//     const img_url = "https://media.discordapp.net/attachments/989268300473192561/1080611147075571732/luanafmagalhaes_Matthew_Daddario_with_big_blue_eyes_wearing_goa_039c0d48-f1f0-4488-be96-76e2bc0fd13d.png"
  
//     return (
//       <div className="flex">
//         <p>{quality}</p>
//         <Image
//           src={img_url}
//           loader={discordImageLoader}
//           loading="lazy"
//           width={200}
//           height={200}
//           responsive
//           quality={quality}
//           className={cn(
//             'object-cover object-center',
//             'duration-700 ease-in-out group-hover:opacity-75',
//             isLoading
//               ? 'scale-110 blur-2xl grayscale'
//               : 'scale-100 blur-0 grayscale-0'
//           )}
//           onLoadingComplete={() => setLoading(false)} />
//       </div>
//     )
//   }