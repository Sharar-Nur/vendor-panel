
import React, { useEffect, useState,useContext } from "react";
import {ReactComponent as CloseBtn} from "../../../../assets/icons/close.svg";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "../../../../components/FileUpload/style.css";
import ArrowLeft from "../../../../assets/icons/arrow-left.png";
import uploadFile from "../../../../lib/uploadFile";
import { ToastContainer, toast } from 'react-toastify';
import RootContext from "../../../../components/context/RootContext";

const AccountApprovalStep2 = () => {

    const rootContextValue = useContext(RootContext);

    let [signedDocPreview, setSignedDocPreview] = useState([]);

    let navigate = useNavigate();
    const { state } = useLocation();


    useEffect(() => {
        if (state === null || state.signedDoc === undefined || state.signedDoc === "" || state.signedDoc === null) {
            navigate("/dashboard/account-approval-step1");
            return;
        }

        setSignedDocPreview(state.signedDoc);
    }, []);


    var uploadPdf = async () => {
        let res = await uploadFile('api/v1/kyb/signed-doc-upload', state.uploadFile, 'signed_document' );
        if(res.data.code === 200){
            rootContextValue.forceUpdate('completeProfileJourney');
            toast.success("Signed document updated successfully.");
            return navigate("/dashboard/home");
        }
        else {
            toast.error("Upload Failed. Plese Try Again");
            return navigate("/dashboard/account-approval-step1", {
                state: {
                    msg: 'failed'
                }
            });
        }
    }


    return (
        <div className="font-medium h-[100vh]">
            <header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[60px]">
                <Link to="/dashboard/home"><CloseBtn /></Link>  {/* will be modified later */}
                <p className="text-xl -mr-3">Upload Signed Document</p>
                <div className="mr-3">
                    {/* Step <strong>2</strong> out of <strong>6</strong> */}
                </div>
            </header>
            <main className="m-auto">
                <div className="block justify-center content-center text-center">
                    <embed src={signedDocPreview} id="form-file-upload" height="650"></embed>
                    <br />
                    <p className="mt-3 text-xl text-[#999999] font-medium">
                        Wrong File? Drag & Drop KYC Document Here
                        <Link to={'/dashboard/account-approval-step1'} className="text-[#158560] ml-2 cursor-pointer">
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

export default AccountApprovalStep2;