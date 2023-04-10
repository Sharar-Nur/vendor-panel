import React from 'react';
import Button from '../../../components/Button';

const BusinessDetails = () => {
    return (
        <div className="w-3/5">
            <h1 className="font-bold text-4xl mb-5">Business Details</h1>
            <div className='bg-neutral-100 px-8 py-4 text-secondary rounded-lg'>
                <form>
                    <div className="mb-2">
                        <h5 className="text-xl font-semibold mb-2">Business Name</h5>
                        <p className="mb-3">Please carefully enter your Business name as per Trade License. It’ll be used as your Account name by default</p>
                        <input type="text" className="w-full p-3 rounded-lg border border-[#EEEEEE]" placeholder="Your business name" />
                    </div>
                    <div className="mb-3">
                        <h5 className="text-xl font-semibold mb-2">Business Category</h5>
                        <input type="text" className="w-full p-3 rounded-lg border border-[#EEEEEE]" placeholder="Choose from all categories" />
                    </div>
                    <div className="mb-2">
                        <h5 className="text-xl font-semibold mb-2">Basic Info</h5>
                        <input type="text" className="w-full p-3 rounded-lg  mb-2 border border-[#EEEEEE]" placeholder="Trade license number" />
                        <input type="tel" className="w-full p-3 rounded-lg mb-2 border border-[#EEEEEE]" placeholder="Business phone number" />
                        <input type="url" className="w-full p-3 rounded-lg mb-2 border border-[#EEEEEE]" placeholder="Facebook page URL" />
                        <input type="url" className="w-full p-3 rounded-lg border border-[#EEEEEE]" placeholder="Website URL" />
                    </div>

                    <div className="mb-4">
                        <h5 className="text-xl font-semibold mb-2">Business Address</h5>
                        <input type="text" className="w-full p-3 rounded-lg mb-2 border border-[#EEEEEE]" placeholder="Current address" />
                        <select name="village/area" id="village/area" className="rounded-lg border border-[#EEEEEE] w-[49.2%] mr-2">
                            <option value="">Village/Area</option>
                            <option value="">Village 1</option>
                            <option value="">Village 2</option>
                            <option value="">Village 3</option>
                        </select>

                        <select name="thana/upazila" id="thana/upazila" className="rounded-lg border border-[#EEEEEE] w-[49.2%] mb-2">
                            <option value="">Thana/Upazila</option>
                            <option value="">Thana 1</option>
                            <option value="">Thana 2</option>
                            <option value="">Thana 3</option>
                        </select>

                        <select name="district/city" id="district/city" className="rounded-lg border border-[#EEEEEE] w-[49.2%] mr-2">
                            <option value="">District/City</option>
                            <option value="">City 1</option>
                            <option value="">City 2</option>
                            <option value="">City 3</option>
                        </select>

                        <select name="division" id="division" className="rounded-lg border border-[#EEEEEE] w-[49.2%]">
                            <option value="">Division</option>
                            <option value="">Division 1</option>
                            <option value="">Division 2</option>
                            <option value="">Division 3</option>
                        </select>
                    </div>
                    <Button name="Save" />
                </form>
            </div>
        </div>
    );
};

export default BusinessDetails;