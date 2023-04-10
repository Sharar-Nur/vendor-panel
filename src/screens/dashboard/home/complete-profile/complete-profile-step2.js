
import React, { useEffect, useState } from "react";
import { ReactComponent as CloseBtn } from './../../../../assets/icons/close.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';


import "./../../../../components/FileUpload/style.css";
import ArrowLeft from "./../../../../assets/icons/arrow-left.png";
import uploadFile from "../../../../lib/uploadFile";
import { ToastContainer, toast } from 'react-toastify';


const CompleteProfileStep2 = () => {

    let [nidPdfPreview, setNidPdfPreview] = useState([]);

    let navigate = useNavigate();
    const { state } = useLocation();


    useEffect(() => {
        if (state === null || state.nidPdf === undefined || state.nidPdf === "" || state.nidPdf === null) {
            navigate("/dashboard/complete-profile-step1");
            return;
        }

        setNidPdfPreview(state.nidPdf);
    }, []);


    var uploadPdf = async () => {
        let res = await uploadFile('api/v1/business/upload-verification-document', state.uploadFile, "document_copy", "representative_nid");
        if (res.data.code === 200 ) {
            navigate("/dashboard/complete-profile-step3", {
                state: {
                    nidPdf: "upload-done"
                }
            });
        } else if(res.data.code === 422) {
            toast.error("Document has already uploaded.");
            navigate("/dashboard/complete-profile-step3", {
                state: {
                    nidPdf: "upload-done"
                }
            });
            
        }else{
            toast.error("Upload Failed. Plese Try Again");
            navigate("/dashboard/complete-profile-step1", {
                msg: "failed"
            })
        }
    }


    return (
        <div className="font-medium h-[100vh]">
            <header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[60px]">
                <Link to="/dashboard/home"><CloseBtn /></Link>
                <p className="text-xl -mr-3">Upload Representative's NID</p>
                <div className="mr-3">
                    {/* Step <strong>2</strong> out of <strong>2</strong> */}
                </div>
            </header>
            <main className="m-auto">
                <div className="block justify-center content-center text-center">
                    <embed src={nidPdfPreview} id="form-file-upload" height="650"></embed>
                    <br />
                    <p className="mt-3 text-xl text-[#999999] font-medium">
                        Wrong File? Drag & Drop Representative's NID
                        <Link to={'/dashboard/complete-profile-step1'} className="text-[#158560] ml-2 cursor-pointer">
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

export default CompleteProfileStep2;

