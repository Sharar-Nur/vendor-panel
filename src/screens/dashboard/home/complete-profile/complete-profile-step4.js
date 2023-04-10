
import React, {useContext, useEffect, useState} from "react";
import {ReactComponent as CloseBtn} from "../../../../assets/icons/close.svg";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "../../../../components/FileUpload/style.css";
import ArrowLeft from "../../../../assets/icons/arrow-left.png";
import uploadFile from "../../../../lib/uploadFile";
import { toast } from 'react-toastify';
import RootContext from "../../../../components/context/RootContext";

const CompleteProfileStep4 = () => {
    const RootContextValue = useContext(RootContext);

    let [representativePhotoPreview,setRepresentativePhotoPreview] = useState([]);

    let navigate = useNavigate();
    const { state } = useLocation();


    useEffect(()=>{
        if (state === null || state.representativePhoto === undefined || state.representativePhoto === "" || state.representativePhoto === null) {
            navigate("/dashboard/complete-profile-step3");
            return;
        }

        setRepresentativePhotoPreview(state.representativePhoto);
    },[]);

    
    var uploadPdf = async () => {
        let res = await uploadFile('api/v1/business/upload-verification-document', state.uploadFile, "document_copy", "representative_photo");
        if(res.data.code === 200){
            RootContextValue.forceUpdate('presentativeDetails');
            toast.success("Complete Profile verified successfully.");
            navigate("/dashboard/complete-profile-step5");
        }else{
            toast.error('Upload Failed. Please Try Again');
            navigate('/dashboard/complete-profile-step3');
            return;
        }

    }


    var backToUpload = () => {
        navigate("/dashboard/complete-profile-step3", {
            state: {
                representativePhoto: null
            }
        });
    }


    return (
        <div className="font-medium min-h-[100vh] w-[100%] h-[100%]">
            <header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[40px]">
                <Link to="/dashboard/home"><CloseBtn /></Link> 
                <p className="text-xl -mr-3">Upload representative's Photo</p>
                <div className="mr-3">
                    {/* Step <strong>6</strong> out of <strong>6</strong> */}
                </div>
            </header>
            <main className="m-auto">
                <div className="block justify-center content-center text-center">
                    <div style={{height: "600px", display: "grid", alignItems: "center" }}>
                        <img alt="Profile Pic" src={representativePhotoPreview} style={{maxHeight: "600px", display: "block", margin: "0 auto"}} />
                    </div>

                    <p className="mt-3 text-xl text-[#999999] font-medium">
                        Wrong Photo? Drag & Drop representative's Photo Here
                        <span onClick={backToUpload} className="text-[#158560] ml-2 cursor-pointer">
                            Again <img className="inline-block ml-1" src={ArrowLeft} alt="Arrow Left"></img>
                        </span>
                    </p>
                    <p className="text-lg font-medium"> or </p>
                    <p onClick={uploadPdf} className="upload-kyb-button mt-1 cursor-pointer" style={{backgroundColor: "#00C52A", width: "160px"}} >Upload Now</p>
                </div>
            </main>
        </div>
    );

};

export default CompleteProfileStep4;