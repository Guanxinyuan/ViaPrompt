import { useState } from 'react';
export default function Parameters({ onCloseModal }) {
    const [showPopup, setShowPopup] = useState(false);

    const closeModal = () => {
        onCloseModal()
    };

    const handleSizeClick = () => {
        setShowPopup(!showPopup);
    }

    return (
        <div className="flex items-center justify-center">
            <div className="fixed z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <div
                    className="absolute z-50 bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-1/3 sm:w-3/5 h-5/6 flex flex-row"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                </div>

                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-zinc-500 opacity-75"
                    onClick={closeModal}
                />
            </div>
        </div>
    )
}