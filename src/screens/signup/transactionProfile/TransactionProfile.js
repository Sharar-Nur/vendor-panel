import React from 'react';
import Button from '../../../components/Button';

const TransactionProfile = () => {
    return (
        <div className="w-3/5 rounded-lg">
            <h1 className="font-bold text-4xl mb-5">Transaction Profile</h1>
            <div className="bg-neutral-100 px-8 py-4 text-secondary rounded-lg">
                <form action="" className="">
                    <div className="mb-6">
                        <h5 className="text-xl font-semibold mb-2">Nature of Business</h5>
                        <input type="text" className="w-full p-3 rounded-lg border border-[#EEEEEE]" placeholder="Choose from all nature" />
                    </div>
                    <div className="mb-6">
                        <h5 className="text-xl font-semibold mb-2">Estimated Monthly Transaction</h5>
                        <div className="bg-white py-[9px] px-3.5 rounded-lg mb-2.5">
                            <input type="radio" id="0to10lakh" name="monthly_transaction" value="0to10lakh" />
                            <label htmlFor="0to10lakh" className="ml-4">0 - 10 Lakh</label><br></br>
                        </div>
                        <div className="bg-white py-[9px] px-3.5 rounded-lg mb-2.5">
                            <input type="radio" id="10to50lakh" name="monthly_transaction" value="10to50lakh" />
                            <label htmlFor="10to50lakh" className="ml-4">10 - 50 Lakh</label><br></br>
                        </div>
                        <div className="bg-white  py-[9px] px-3.5 rounded-lg">
                            <input type="radio" id="50lakh" name="monthly_transaction" value="50lakh+" />
                            <label htmlFor="50lakh" className="ml-4">50 Lakh +</label><br></br>
                        </div>
                    </div>
                    <div className="mb-6">
                        <h5 className="text-xl font-semibold mb-2">Estimated Number of Transactions per month</h5>
                        <div className="bg-white py-[9px] px-3.5 rounded-lg mb-2.5">
                            <input type="radio" id="0to10lakh" name="monthly_transaction" value="0to10lakh" />
                            <label htmlFor="0to10lakh" className="ml-4">0 - 10 Lakh</label><br></br>
                        </div>
                        <div className="bg-white py-[9px] px-3.5 rounded-lg mb-2.5">
                            <input type="radio" id="10to50lakh" name="monthly_transaction" value="10to50lakh" />
                            <label htmlFor="10to50lakh" className="ml-4">10 - 50 Lakh</label><br></br>
                        </div>
                        <div className="bg-white  py-[9px] px-3.5 rounded-lg">
                            <input type="radio" id="50lakh" name="monthly_transaction" value="50lakh+" />
                            <label htmlFor="50lakh" className="ml-4">50 Lakh +</label><br></br>
                        </div>
                    </div>
                    <div className="mb-6">
                        <h5 className="text-xl font-semibold mb-2">Estimated Highest amount in a single transaction</h5>
                        <div className="bg-white py-[9px] px-3.5 rounded-lg mb-2.5">
                            <input type="radio" id="0to10lakh" name="monthly_transaction" value="0to10lakh" />
                            <label htmlFor="0to10lakh" className="ml-4">0 - 10 Lakh</label><br></br>
                        </div>
                        <div className="bg-white py-[9px] px-3.5 rounded-lg mb-2.5">
                            <input type="radio" id="10to50lakh" name="monthly_transaction" value="10to50lakh" />
                            <label htmlFor="10to50lakh" className="ml-4">10 - 50 Lakh</label><br></br>
                        </div>
                        <div className="bg-white  py-[9px] px-3.5 rounded-lg">
                            <input type="radio" id="50lakh" name="monthly_transaction" value="50lakh+" />
                            <label htmlFor="50lakh" className="ml-4">50 Lakh +</label><br></br>
                        </div>
                    </div>
                    <Button name="Save" />
                </form>

            </div>
        </div>
    );
};

export default TransactionProfile;