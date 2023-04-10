
import React, { useContext, useEffect, useState } from "react";
import { ReactComponent as CloseBtn } from './../../../../assets/icons/close.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import "./../../../../components/FileUpload/style.css";
import ArrowLeft from "./../../../../assets/icons/arrow-left.png";
import uploadFile from '../../../../lib/uploadFile';
import RootContext from "../../../../components/context/RootContext";

import { toast } from 'react-toastify';
const StepTwo = () => {

    const RootContextValue = useContext(RootContext);
    
    let [pdf, setPdf] = useState([]);
    let navigate = useNavigate();
    const { state } = useLocation();


    useEffect(() => {
        if (state === null || state.pdf === undefined || state.pdf === "" || state.pdf === null) {
            navigate("/dashboard/verify-identity-step-one");
            return;
        }

        setPdf(state.pdf);
    }, []);


    var uploadPdf = async () => {
        
        let res = await uploadFile('api/v1/business/upload-verification-document', state.uploadFile, "document_copy", "owner_nid");

        if (res.data.code === 200 || res.data.code === 422 ) {
            
            RootContextValue.forceUpdate('verifyIdentity');
            navigate("/dashboard/verify-identity-step-three", {
                state: {
                    nid: "upload-done"
                }
            });
        }else{
            toast.error("Upload Failed. Please Try Again");
            navigate("/dashboard/verify-identity-step-one", {
                state: {
                    msg: 'failed'
                }
            });
        }
    }


    return (
        <div className="font-medium min-h-[100vh] w-[100%] h-[100%]">
            <header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[60px]">
                <Link to="/dashboard/home"><CloseBtn /></Link>
                <p className="text-xl -mr-3">Upload Owner’s NID</p>
                <div className="mr-3">
                    Step <strong>2</strong> out of <strong>2</strong>
                </div>
            </header>
            <main className="m-auto">
                <div className="block justify-center content-center text-center">
                    <embed src={pdf} id="form-file-upload" height="650"></embed>
                    <br />
                    <p className="mt-3 text-xl text-[#999999] font-medium">
                        Wrong File? Drag & Drop Owner’s NID
                        <Link to={'/dashboard/verify-identity-step-one'} className="text-[#158560] ml-2 cursor-pointer">
                            Again
                            <img className="inline-block ml-1" src={ArrowLeft} alt="Arrow Left"></img>
                        </Link>
                    </p>
                    <p className="text-lg font-medium"> or </p>
                    <p onClick={uploadPdf} className="upload-kyb-button mt-1 cursor-pointer" style={{ backgroundColor: "#00C52A", width: "160px" }} >Upload Now</p>

                </div>
            </main>
        </div>
    );

};

export default StepTwo;