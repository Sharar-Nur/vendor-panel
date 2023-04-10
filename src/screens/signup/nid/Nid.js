import React, { useRef, useState } from 'react';
import Button from '../../../components/Button';
import tabIcon1 from '../../../assets/images/name.svg';
import tabIcon1_white from '../../../assets/images/name_white.svg';
import tabIcon2 from '../../../assets/images/id.svg';
import tabIcon2_white from '../../../assets/images/id_white.svg';
import tabIcon3 from '../../../assets/images/account.svg';
import tabIcon3_white from '../../../assets/images/account_white.svg';
import { useLocation } from 'react-router-dom';

const Nid = () => {
    const fileInput = useRef();
    const [file, setFile] = useState();
    const location = useLocation();

    const selectFile = () => {
        fileInput.current.click();
    }

    const handleChange = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    return (
        <div className="w-3/5">
            <h1 className="font-bold text-4xl mb-8">Access camera or Upload Documents for Verifying Identity</h1>
            <div className="flex">
                <div className={`rounded-full border border-primary p-5 ${location.pathname === "/nid-front" ? "bg-primary" : ""}`}>{location.pathname === "/nid-front" ? <img src={tabIcon1_white} alt="" /> : <img src={tabIcon1} alt="" />}</div>
                <hr className="w-5 bg-primary border-none h-px mx-3 mt-9" ></hr>
                <div className={`rounded-full p-5 border border-primary ${location.pathname === "/nid-back" ? "bg-primary" : ""}`}>{location.pathname === "/nid-back" ? <img src={tabIcon2_white} alt="" /> : <img src={tabIcon2} alt="" />}</div>
                <hr className="w-5 bg-primary border-none h-px mx-3 mt-9" ></hr>
                <div className={`rounded-full p-5 border border-primary ${location.pathname === "/selfie" ? "bg-primary" : ""}`}>{location.pathname === "/selfie" ? <img src={tabIcon3_white} alt="" /> : <img src={tabIcon3} alt="" />}</div>
            </div>

            <div className="flex text-sm mt-2">
                <p className="font-bold">Nid (Front)</p>
                <p className="ml-10">NID (Back)</p>
                <p className="ml-10">Selfie Photo</p>
            </div>


            <div className="bg-neutral-100 p-9 text-secondary mt-6">
                <p className="pb-5">Position all 4 corners  of the front side of your NID clearly in the frame and take a picture.</p>
                <img src={file} alt="Preview" className="mb-4" />
                <input type="file" className="hidden" ref={fileInput} onChange={handleChange} />
                <Button onClick={selectFile} type="file" name={file ? "Next" : "Upload NID (Front Side)"} />
            </div>
        </div>
    );
};

export default Nid;