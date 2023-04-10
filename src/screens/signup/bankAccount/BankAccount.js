import React from 'react';
import Button from '../../../components/Button';

const BankAccount = () => {
    return (
        <div className="w-3/5">
            <h1 className="font-bold text-4xl mb-5">Bank Account</h1>
            <div className="bg-neutral-100 px-8 py-4 text-secondary rounded-lg">
                <form action="">
                    <div className="mb-2">
                        <h5 className="text-xl font-semibold mb-2">Business Account Name</h5>
                        <input type="text" className="w-full p-3 rounded-lg border border-[#EEEEEE]" placeholder="Your business name" />
                    </div>
                    <div className="mb-2">
                        <h5 className="text-xl font-semibold mb-2">Business Account Info</h5>
                        <input type="text" className="w-full p-3 rounded-lg  mb-4 border border-[#EEEEEE]" placeholder="Account Number" />
                        <input type="text" className="w-full p-3 rounded-lg mb-4 border border-[#EEEEEE]" placeholder="Bank Name" />
                        <input type="text" className="w-full p-3 rounded-lg mb-4 border border-[#EEEEEE]" placeholder="Branch Name" />
                        <input type="text" className="w-full p-3 rounded-lg mb-6 border border-[#EEEEEE]" placeholder="Routing Number" />
                        <Button name="Save" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BankAccount;