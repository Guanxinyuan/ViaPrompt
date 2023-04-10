import { useState } from 'react';
import dynamic from 'next/dynamic';
import PayPalButton from '@/components/PayPalButton';

export function PaymentBoard() {
    return (
        <div className='flex justify-center mt-4'>
            <div className='payment-board'>
                <div className='flex flex-col gap-1 justify-center items-center'>
                    <PayPalButton fundingSource={'paypal'} color={'gold'} />
                    {/* <PayPalButtonTemp fundingSource={'card'} color={'white'} /> */}
                </div>
                <p className='text-xs text-center text-gray-500'>
                    By subscribing, you agree to our <a href='#' className='underline'>terms</a>.
                </p>
            </div>
        </div>
    )
}

export default function PaymentModal({ subscriptionInfo, onCloseModal }) {

    const { title, features, price } = subscriptionInfo;

    const closeModal = () => {
        onCloseModal()
    };

    return (
        <div className="flex items-center justify-center">
            <div className="fixed z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <div
                    className="payment-modal flex-col py-4  rounded-2xl"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                    <div className="subscription-card w-3/4 pb-2">
                        <div className="flex items-center justify-between">
                            <h2 className="subscription-card-title text-lg">{title}</h2>
                        </div>
                        <div className='subscription-card-price-section'>
                            <p className="subscription-card-price text-3xl">{price}</p>
                            <span>Monthly</span>
                        </div>
                        <div className='flex flex-col gap-4'>
                            <ul className="subscription-card-feature-section list-none checklist">
                                {
                                    features.map((feature, index) => {
                                        return <li key={index}>{feature}</li>
                                    })
                                }
                            </ul>
                            <p className='subscription-card-feature-title text-xs'>Cancel anytime</p>
                        </div>
                    </div>
                    <PaymentBoard />
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