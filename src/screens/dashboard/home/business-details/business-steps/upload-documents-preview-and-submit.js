
import React, { useContext, useEffect, useState } from "react";
import { ReactComponent as CloseBtn } from '../../../../../assets/icons/close.svg';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import '../../../../../components/FileUpload/style.css';
import ArrowLeft from '../../../../../assets/icons/arrow-left.png';
import { toast } from "react-toastify";

import PostLoginPostApi from "../../../../../components/api/PostLoginPostApi";
import RootContext from "../../../../../components/context/RootContext";

const UploadDocumentsPreviewAndSubmit = () => {

    const RootContextValue = useContext(RootContext);
    let [uploadedFileForPreview, setUploadedFileForPreview] = useState([]);

    let navigate = useNavigate();
    let { file } = useParams();


    const { state } = useLocation();
    const [docInfo, setDocInfo] = useState([]);


    useEffect(() => {
        if (state === null || state?.uploadedFile === undefined || state?.uploadedFile === "" || state?.uploadedFile === null || state?.docInfo === undefined || state?.docInfo === "" || state?.docInfo === null) {
            return navigate("/dashboard/business-details");
        }

        setDocInfo(state.docInfo[parseInt(file) - 1]);
        setUploadedFileForPreview(state.uploadedFile);
    }, []);


    var submitUploadFile = async () => {

        let uploadedSessionData = window.localStorage.getItem("UploadedArr");
        if (uploadedSessionData === null) {
            return navigate("/dashboard/business-details");
        }


        let uploadedSessionDataArr = JSON.parse(uploadedSessionData);
        if (uploadedSessionDataArr.types === undefined) {
            uploadedSessionDataArr.types = [];
        }
        if (uploadedSessionDataArr.files === undefined) {
            uploadedSessionDataArr.files = [];
        }

        uploadedSessionDataArr.types.push(docInfo.code);
        uploadedSessionDataArr.files.push(uploadedFileForPreview);

        if (uploadedSessionDataArr.types.length > state.docInfo.length) {
            toast.error("You have already uploaded the required documents.");
            return navigate("/dashboard/home");
        }

        if (uploadedSessionDataArr.types.length < state.docInfo.length) {
            window.localStorage.setItem("UploadedArr", JSON.stringify(uploadedSessionDataArr));
            return navigate("/dashboard/business-details-upload-documents/" + parseInt(parseInt(file) + 1), {
                state: {
                    docInfo: state.docInfo
                }
            });
        }



        if (uploadedSessionDataArr.types.length === state.docInfo.length) {
            let requestBody = new FormData();
            requestBody.append("business_owner_type_id", uploadedSessionDataArr.business_owner_type_id);
            requestBody.append("business_category_id", uploadedSessionDataArr.business_category_id);

            uploadedSessionDataArr.types.map(((val, index) => {
                requestBody.append("documents[" + index + "][type]", val);
                requestBody.append("documents[" + index + "][atttachment]", uploadedSessionDataArr.files[index]);

            }));

            await PostLoginPostApi("api/v1/auth/upload/business-docs", requestBody, 0, 1).then((responseJSON) => {
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {
                        window.localStorage.removeItem("UploadedArr");


                        RootContextValue.forceUpdate("businessDetails1");

                        return navigate("/dashboard/business-details-upload-logo", {
                            state: {
                                steps: (parseInt(state.docInfo.length) * 2),
                                uploadDynamicDoc: true
                            }
                        });
                    }

                    toast.error(responseData["messages"].toString());
                    return;
                }

                toast.error("A problem occur while uploading your data. Please try again.");
                return;

            }).catch((error) => {
                toast.error("A problem occur while sending your data. Please try again.");
                console.log(error);
            });
        }

        return;
    }


    return (
        <div className="font-medium min-h-[100vh] w-[100%] h-[100%]">

            <header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[60px]">
                <Link to="/dashboard/home"><CloseBtn /></Link>
                <p className="text-xl -mr-3">Preview {docInfo.code}</p>
                <div className="mr-3">
                    Step <strong>{parseInt(parseInt(file) * 2)}</strong> out of <strong>{((parseInt(state.docInfo.length) * 2) + 2)}</strong>
                </div>
            </header>
            <main className="m-auto">
                <div className="block justify-center content-center text-center">
                    {(uploadedFileForPreview.includes("data:image/")) ?
                        <div style={{ height: "600px", display: "grid", alignItems: "center" }}>
                            <img alt="Profile Pic" src={uploadedFileForPreview} style={{ maxHeight: "600px", display: "block", margin: "0 auto" }} />
                        </div>
                        :
                        <embed src={uploadedFileForPreview} id="form-file-upload" height="650"></embed>
                    }
                    <br />
                    <p className="mt-3 text-xl text-[#999999] font-medium">
                        Wrong File? Drag & Drop {docInfo.code} Here
                        <Link to={'/dashboard/business-details-upload-documents/' + file} state={{ docInfo: state.docInfo }} className="text-[#158560] ml-2 cursor-pointer">
                            Again
                            <img className="inline-block ml-1" src={ArrowLeft} alt="Arrow Left"></img>
                        </Link>
                    </p>
                    <p className="text-lg font-medium"> or </p>
                    <p onClick={submitUploadFile} className="upload-kyb-button mt-1 cursor-pointer" style={{ backgroundColor: "#00C52A", width: "160px" }} >Upload Now</p>

                </div>
            </main>
        </div>
    );

};

export default UploadDocumentsPreviewAndSubmit;