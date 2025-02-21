import { React, useState } from 'react';
import '../assets/styles/Payment.css';
import OrderDetails from '@/components/OrderDetails';

const Payment = () => {
    const [selectedPayment, setSelectedPayment] = useState('');

    const handlePaymentChange = (event) => {
        setSelectedPayment(event.target.id);
    };

    return (
        <>
            <div className='flex justify-around items-center mx-8 my-4'>
                <div className='w-[65%] flex flex-col'>
                    <div className='cartTitle rounded-[20px] px-2 pl-4 py-1 mb-4'>Payment Options</div>
                    <div>
                        <form className='paymentOpt flex flex-col gap-4 mt-4'>
                            <label htmlFor="upiOpt" className={`flex gap-4 mx-4 p-4 border rounded cursor-pointer ${selectedPayment === 'upiOpt' ? 'paymentOptSelected' : 'paymentOptUnSelected'}`} onClick={() => setSelectedPayment('upiOpt')}>
                                <input type="radio" name="payment" id="upiOpt" checked={selectedPayment === 'upiOpt'} onChange={handlePaymentChange} className="hidden" />
                                <span>UPI</span>
                            </label>
                            <label htmlFor="cardOpt" className={`flex gap-4 mx-4 p-4 border rounded cursor-pointer ${selectedPayment === 'cardOpt' ? 'paymentOptSelected' : 'paymentOptUnSelected'}`} onClick={() => setSelectedPayment('cardOpt')}>
                                <input type="radio" name="payment" id="cardOpt" checked={selectedPayment === 'cardOpt'} onChange={handlePaymentChange} className="hidden" />
                                <span>Credit Card, Debit Card</span>
                            </label>
                            <label htmlFor="codOpt" className={`flex gap-4 mx-4 p-4 border rounded cursor-pointer ${selectedPayment === 'codOpt' ? 'paymentOptSelected' : 'paymentOptUnSelected'}`} onClick={() => setSelectedPayment('codOpt')}>
                                <input type="radio" name="payment" id="codOpt" checked={selectedPayment === 'codOpt'} onChange={handlePaymentChange} className="hidden" />
                                <span>Cash on Delivery</span>
                            </label>
                        </form>
                    </div>
                </div>

                <OrderDetails/>

            </div>
        </>
    );
}

export default Payment;
