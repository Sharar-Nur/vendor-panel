import React, { useEffect, useState, useContext, Suspense, useRef } from 'react';
import $ from "jquery";


import PostLoginPostApi from '../../../components/api/PostLoginPostApi';


// Context
import UserBasicInfoContext from '../../../components/context/UserBasicInfoContext';
import UserBasicInfoQRContext from '../../../components/context/UserBasicInfoQRContext';

// Toast
import { toast } from 'react-toastify';
import defaultLogo from './../../../assets/images/default-logo.png';
import RootContext from '../../../components/context/RootContext';

// const QRCode = React.lazy(() => { return import("qrcode.react") });

export default function ViewProfile() {


    const rootContextValue = useContext(RootContext);

    const fileInput = useRef();
    const [file, setFile] = useState();
    const [fileData, setFileData] = useState();

    const selectFile = () => {
        $("#logo-submit-btn").hide();
        fileInput.current.click();
    }

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg" || file.type === "image/svg") {
            setFile(URL.createObjectURL(e.target.files[0]));
            setFileData(file);

            $("#logo-submit-btn").show();
            $("#logo-submit-cancel-btn").show();
            return;
        }

        toast.error("Please choose valid file type.");
    }

    const cancelUpload = (e) => {
        $("#logo-submit-btn").hide();
        $("#logo-submit-cancel-btn").hide();

        fileInput.current.value = "";
        setFile(UserBasicInfoQR.business_info?.bussiness_logo);
    }

    const uploadLogo = async () => {
        let reqBody = new FormData();
        reqBody.append("logo", fileData);


        $("#logo-submit-btn").hide();
        $("#logo-submit-cancel-btn").hide();


        try {
            await PostLoginPostApi("user/business/photo", reqBody, 1, 1).then((responseJSON) => {
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {
                        toast.success("Logo upload successfully.");
                        setTimeout(() => {
                            rootContextValue.forceUpdate('viewProfile');
                        }, 1500);
                        return;
                    }

                    setFile(userData.logo);
                    toast.error(responseData["messages"].toString());
                    return;
                }

                toast.error("A problem occur. Please try again.");
                return;
            }).catch((error) => {
                console.log(error);
            });
        }
        catch (exception) {
            toast.error("A problem occur while requesting. Please try again.");
            console.log(exception);
        }
        finally {
            $("#logo-submit-btn").hide();
        }
    }


    const [profile, setProfile] = useState([]);
    const [otherInfo, setOtherInfo] = useState([]);

    const userData = useContext(UserBasicInfoContext);


    const UserBasicInfoQR = useContext(UserBasicInfoQRContext);

    const [qrInfo, setQrInfo] = useState({});



    useEffect(() => {
        if (UserBasicInfoQR.length === 0) {
            return;
        }


        if (UserBasicInfoQR.business_info?.bussiness_logo !== undefined && UserBasicInfoQR.business_info?.bussiness_logo !== "") {
            setFile(UserBasicInfoQR.business_info?.bussiness_logo);
        }

        setQrInfo(UserBasicInfoQR);
    }, [UserBasicInfoQR, qrInfo]);


    useEffect(() => {

        if (userData?.length === 0) {
            return;
        }

        if (userData?.logo !== undefined && userData?.logo !== "") {
            setFile(userData?.logo);
        }


        setProfile(userData);
    }, [userData]);


    if (profile?.length === 0) {
        return (<>Loading...</>);
    }

    return (
        <div className=" w-full pb-10 pt-0">

            <h1 className="font-bold text-lg mb-3 px-2">Profile Information</h1>

            <div className="flow-root w-full py-3 bg-white px-1 rounded-md" style={{ boxShadow: "0px 4px 10px rgb(0 0 0 / 5%)", border: "1px solid rgb(243 243 243)" }}>
                <p className="float-left text-xl px-4 font-medium pb-0 pl-4">Business Information</p>
            </div>
            <table className="custom-details-table w-full mt-0 mb-2">
                <tbody>
                    <tr>
                        <td className="font-semibold text-base">
                            Business Logo
                        </td>
                        <td className="px-5 text-base">
                            <div className='flex items-center'>
                                <img src={file ? file : defaultLogo} alt="Business Logo" className='h-[100px] max-w-[100px] float-left mr-6 py-3' />
                                <input type="file" ref={fileInput} onChange={handleChange} className='hidden'></input>
                                <button id="logo-submit-btn" onClick={uploadLogo} className='hidden bg-[#00D632] text-sm text-white hover:bg-transparent font-medium hover:text-[#00D632] py-1 px-3 border border-[#00D632] hover:border-[#00D632] rounded'>Upload</button>
                                <button id="logo-submit-cancel-btn" onClick={cancelUpload} className='hidden ml-3 mr-2 bg-red-600 text-sm hover:bg-transparent text-white font-medium hover:text-red-600 py-1 px-2 border border-red hover:border-red-500 rounded'>Cancel</button>

                                <button id="logo-submit-change-btn" onClick={selectFile} className='block ml-1 bg-transparent text-sm hover:bg-black text-black font-medium hover:text-white py-1 px-2 border border-black hover:border-transparent rounded'>Change Logo</button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="font-semibold text-base">Business Name</td>
                        <td className="px-5 text-base">
                            {(UserBasicInfoQR.business_info.bussiness_name === null || UserBasicInfoQR.business_info.bussiness_name === "") ? UserBasicInfoQR.user?.name : UserBasicInfoQR.business_info.bussiness_name}
                        </td>
                    </tr>
                    <tr>
                        <td className="font-semibold text-base">Phone</td>
                        <td className="px-5 text-base">{UserBasicInfoQR.user?.mobile_number}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold text-base">Email Address</td>
                        <td className="px-5 text-base">{UserBasicInfoQR.business_info.bussiness_email}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold text-base">Address</td>
                        <td className="px-5 text-base">
                            {(UserBasicInfoQR.business_info.bussiness_address[0] !== undefined) &&
                                <>
                                    {UserBasicInfoQR.business_info.bussiness_address[0]?.address}, {UserBasicInfoQR.business_info.bussiness_address[0]?.thana?.name}, {UserBasicInfoQR.business_info.bussiness_address[0]?.district?.name} - {UserBasicInfoQR.business_info.bussiness_address[0]?.post_code}, {UserBasicInfoQR.business_info.bussiness_address[0]?.division?.name}
                                </>
                            }
                        </td>
                    </tr>
                    {/* <tr>
                        <td className="font-semibold text-base">QR Code</td>
                        <td className="px-5 text-base py-2">
                            <Suspense fallback="loading...">
                                <QRCode value={(qrInfo?.user?.qr_code_text !== undefined)? qrInfo?.user?.qr_code_text : ""} size={200} />
                            </Suspense>
                        </td>
                    </tr> */}
                </tbody>
            </table>

            <div className="flow-root w-full mt-3 py-3 bg-white px-1 rounded-md" style={{ boxShadow: "0px 4px 10px rgb(0 0 0 / 5%)", border: "1px solid rgb(243 243 243)" }}>
                <p className="float-left text-xl px-4 font-medium pb-0 pl-4">Business Owner Information</p>
            </div>

            <table className="custom-details-table w-full mt-0 mb-2">
                <tbody>
                    <tr>
                        <td className="font-semibold text-base">Owner Photo</td>
                        <td className="px-5 text-base">
                            <img src={qrInfo?.user?.profile_thumbnail ? qrInfo?.user?.profile_thumbnail : defaultLogo} alt="Owner" className='h-[100px] max-w-[100px] float-left mr-6 py-1' />
                        </td>
                    </tr>
                    <tr>
                        <td className="font-semibold text-base">Owner Name</td>
                        <td className="px-5 text-base">{userData?.owner_name}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold text-base">Father Name</td>
                        <td className="px-5 text-base">{userData?.fathers_name}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold text-base">Mother Name</td>
                        <td className="px-5 text-base">{userData?.mothers_name}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold text-base">Gender</td>
                        <td className="px-5 text-base" style={{ textTransform: "capitalize" }}>{userData?.gender}</td>
                    </tr>
                    {/* <tr>
                        <td className="font-semibold text-base">Date of Birthday</td>
                        <td className="px-5 text-base">{userData?.dob}</td>
                    </tr> */}
                    {/* <tr>
                        <td className="font-semibold text-base">NID No.</td>
                        <td className="px-5 text-base">{userData?.nid}</td>
                    </tr> */}
                </tbody>
            </table>

        </div>
    )
}
