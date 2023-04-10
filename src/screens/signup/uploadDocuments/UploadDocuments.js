import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button';
import { ImArrowRight2 } from "react-icons/im";

const UploadDocuments = () => {
    const fileInput = useRef();
    const [file, setFile] = useState();

    const handleChange = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    const selectFile = () => {
        fileInput.current.click();
    }

    return (
        <div className="w-3/5">
            <h1 className="font-bold text-4xl mb-7">Upload Documents</h1>
            <p className="mb-7">As a <span className="font-semibold">Sole Proprietorship</span> Business, you need to submit and verify these 3 documents</p>
            <div className="bg-neutral-100 px-8 py-10 text-secondary rounded-lg">
                <form action="">
                    <div className="mb-6">
                        <h5 className="text-xl font-semibold mb-2.5">Trade License</h5>
                        <input type="file" className="hidden" ref={fileInput} onChange={handleChange} />
                        <button type="file" className="w-full text-primary border-dashed border-2 border-primary bg-[#E8F4EB] py-2.5 rounded-lg" onClick={selectFile}>Upload Trade License</button>
                    </div>
                    <div className="mb-6">
                        <h5 className="text-xl font-semibold mb-2.5">TIN Certificate</h5>
                        <input type="file" className="hidden" ref={fileInput} onChange={handleChange} />
                        <button type="file" className="w-full text-primary border-dashed border-2 border-primary bg-[#E8F4EB] py-2.5 rounded-lg" onClick={selectFile}>Upload TIN Certificate</button>
                    </div>
                    <div className="mb-6">
                        <h5 className="text-xl font-semibold mb-2.5">Business Logo</h5>
                        <p className="mb-2.5">Upload a Logo/Image that represents your business. Should be a 500x500 px JPEG/JPG/PNG file</p>
                        <input type="file" className="hidden" ref={fileInput} onChange={handleChange} />
                        <button type="file" className="w-full text-primary border-dashed border-2 border-primary bg-[#E8F4EB] py-2.5 rounded-lg" onClick={selectFile}>Upload Logo</button>
                    </div>
                    <Button name="Save" />
                </form>
                <p className="text-[#999999] text-center mb-1">Don’t have all the documents?</p>
                <Link to="/business-types" className="font-bold text-primary text-center block">Change Business Type <ImArrowRight2 className='inline' /></Link>
            </div>
        </div>
    );
};

export default UploadDocuments;