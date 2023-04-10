import React, { useState } from 'react';
import BlackButton from '../../../components/BlackButton';
import Popup from '../../../components/Popup';
import { ReactComponent as CloseBtn } from '../../../assets/icons/close.svg'

const StoreTest = () => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }
    return (
        <div>
            <input
                type="button"
                value="Click to Open Popup"
                onClick={togglePopup}
                className="px-5 py-2.5 bg-primary text-white rounded" />
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            {isOpen && <Popup
                content={
                    <div className="pt-10 pb-6 px-5 font-medium">
                        <div className="flex justify-between">
                            <h3 className="text-xl">Edit Contact Details</h3>
                            <CloseBtn onClick={togglePopup} className="cursor-pointer" />
                        </div>
                        <hr className="bg-dark-white my-5" />
                        <h4 className="mb-[15px]">Address</h4>
                        <form action="">
                            <div>
                                <input type="text" name="address" placeholder="Full Address" className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" />
                            </div>
                            <div>
                                <input type="text" name="address2" placeholder="Address Line 2" className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" />
                            </div>
                            <div>
                                <select name="district" id="district" className="w-full mb-2.5 rounded border-solid border border-dark-white" defaultValue={""} required>
                                    <option value="" disabled className="hidden">Select your option</option>
                                    <option value="Dhaka" className="text-secondary">Dhaka</option>
                                    <option value="Khulna" className="text-secondary">Khulna</option>
                                    <option value="Barishal" className="text-secondary">Barishal</option>
                                    <option value="Chittagong" className="text-secondary">Chittagong</option>
                                </select>
                            </div>
                            <div>
                                <input type="text" name="zipOrPostal" placeholder="Zip/Postal Code" className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" />
                            </div>
                            <div>
                                <input type="text" name="number" placeholder="Phone Number" className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" />
                            </div>
                            <div>
                                <input type="text" name="email" placeholder="Email Address" className="w-full mb-5 rounded border-solid border border-dark-white placeholder:text-ash" />
                            </div>
                            <BlackButton name="Save" />
                        </form>
                    </div>}
            />}
        </div>
    );
};

export default StoreTest;