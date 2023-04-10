
import React, { useEffect, useState, useContext } from "react";
import { ReactComponent as CloseBtn } from '../../../../../assets/icons/close.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "../../../../../components/FileUpload/style.css";
import ArrowLeft from "../../../../../assets/icons/arrow-left.png";
import PostLoginPostApi from "../../../../../components/api/PostLoginPostApi";
import { toast } from "react-toastify";
import RootContext from "../../../../../components/context/RootContext";
const BusinessStep6 = () => {

    let [businessLogoForPreview, setBusinessLogoForPreview] = useState([]);
    const RootContextValue = useContext(RootContext);

    let navigate = useNavigate();
    const { state } = useLocation();


    useEffect(() => {
        if (state === null || state.businessLogo === undefined || state.businessLogo === "" || state.businessLogo === null || state.uploadLogo === undefined || state.uploadLogo === "" || state.uploadLogo === null) {
            navigate("/dashboard/business-details");
            return;
        }

        setBusinessLogoForPreview(state.businessLogo);
    }, []);


    var uploadPdf = async () => {
        let requestBody = new FormData();
        requestBody.append("logo", state.uploadLogo);


        await PostLoginPostApi("user/business/photo", requestBody, 1, 1).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    toast.success("Business details added successfully.");

                    RootContextValue.forceUpdate('viewProfile'); // Logo Update
                    RootContextValue.forceUpdate("businessDetails2"); // Steps Update

                    return navigate("/dashboard/home", {
                        state: {
                            isReload: 1
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


    return (
        <div className="font-medium min-h-[100vh] w-[100%] h-[100%]">
            <header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[40px]">
                <Link to="/dashboard/home"><CloseBtn /></Link> {/*will be modified later */}
                <p className="text-xl -mr-3">Upload Business Logo</p>
                <div className="mr-3">
                    Step <strong>{parseInt(state.steps) + 2}</strong> out of <strong>{parseInt(state.steps) + 2}</strong>
                </div>
            </header>
            <main className="m-auto">
                <div className="block justify-center content-center text-center">
                    <div style={{ height: "600px", display: "grid", alignItems: "center" }}>
                        <img alt="Profile Pic" src={businessLogoForPreview} style={{ maxHeight: "600px", display: "block", margin: "0 auto" }} />
                    </div>

                    <p className="mt-3 text-xl text-[#999999] font-medium">
                        Wrong Photo? Drag & Drop Business Logo Here
                        <Link to={"/dashboard/business-details-upload-logo"} state={{ businessLogo: null }} className="text-[#158560] ml-2 cursor-pointer">
                            Again <img className="inline-block ml-1" src={ArrowLeft} alt="Arrow Left"></img>
                        </Link>
                    </p>
                    <p className="text-lg font-medium"> or </p>
                    <p onClick={uploadPdf} className="upload-kyb-button mt-1 cursor-pointer" style={{ backgroundColor: "#00C52A", width: "160px" }} >Upload Now</p>
                </div>
            </main>
        </div>
    );

};

export default BusinessStep6;