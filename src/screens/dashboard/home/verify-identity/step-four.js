
import React, { useEffect, useState, useContext } from "react";
import { ReactComponent as CloseBtn } from './../../../../assets/icons/close.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import "./../../../../components/FileUpload/style.css";
import ArrowLeft from "./../../../../assets/icons/arrow-left.png";
import uploadFile from "../../../../lib/uploadFile";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RootContext from "../../../../components/context/RootContext";
const StepFour = () => {

    let [pdf, setPdf] = useState([]);
    let navigate = useNavigate();
    const { state } = useLocation();
    const RootContextValue = useContext(RootContext);



    useEffect(() => {
        if (state === null || state.pdf === undefined || state.pdf === "" || state.pdf === null || state.uploadFile === undefined || state.uploadFile === "" || state.uploadFile === null) {
            navigate("/dashboard/verify-identity-step-one");
            return;
        }

        setPdf(state.pdf);
    }, []);


    var uploadPdf = async () => {
        let res = await uploadFile('api/v1/business/upload-verification-document', state.uploadFile, 'document_copy', 'owner_photo');
        if (res.data.code === 200) {
            toast.success("Verified identity successfully.");
            RootContextValue.forceUpdate('verifyIdentity');
            return navigate("/dashboard/home", {
                state: {
                    isReload: 1
                }
            });
        }

        toast.error("Upload Failed. Please Try Again");
    }


    var backToUpload = () => {
        navigate("/dashboard/verify-identity-step-three", {
            state: {
                nid: "upload-done"
            }
        });
    }


    return (
        <div className="font-medium min-h-[100vh] w-[100%] h-[100%]">
            <header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[40px]">
                <Link to="/dashboard/home"><CloseBtn /></Link>
                <p className="text-xl -mr-3">Upload Owner’s Photo</p>
                <div className="mr-3">
                    Step <strong>2</strong> out of <strong>2</strong>
                </div>
            </header>
            <main className="m-auto">
                <div className="block justify-center content-center text-center">
                    <div style={{ height: "600px", display: "grid", alignItems: "center" }}>
                        <img alt="Profile Pic" src={pdf} style={{ maxHeight: "600px", display: "block", margin: "0 auto" }} />
                    </div>

                    <p className="mt-3 text-xl text-[#999999] font-medium">
                        Wrong Photo? Drag & Drop Owner’s Photo
                        <span onClick={backToUpload} className="text-[#158560] ml-2 cursor-pointer">
                            Again <img className="inline-block ml-1" src={ArrowLeft} alt="Arrow Left"></img>
                        </span>
                    </p>
                    <p className="text-lg font-medium"> or </p>
                    <p onClick={uploadPdf} className="upload-kyb-button mt-1 cursor-pointer" style={{ backgroundColor: "#00C52A", width: "160px" }} >Upload Now</p>
                </div>
            </main>
        </div>
    );

};

export default StepFour;