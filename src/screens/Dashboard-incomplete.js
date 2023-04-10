import React, { useEffect, useState, useTransition } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import moment from "moment";

import "../styles/Dashboard.css";
import Home from "./dashboard/home/home";
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PostLoginGetApi from "../components/api/PostLoginGetApi";

// Verification Identity
import StepOne from "./dashboard/home/verify-identity/step-one";
import StepTwo from "./dashboard/home/verify-identity/step-two";
import StepThree from "./dashboard/home/verify-identity/step-three";
import StepFour from "./dashboard/home/verify-identity/step-four";

//Submit Business Details
import BusinessDetails from "./dashboard/home/business-details/business-details";


import BusinessStepLogo from './dashboard/home/business-details/business-steps/businessStep5';
import BusinessStepLogoPreviewAndUpload from './dashboard/home/business-details/business-steps/businessStep6';

import UploadDocuments from './dashboard/home/business-details/business-steps/upload-documents';
import UploadDocumentsPreviewAndDownload from './dashboard/home/business-details/business-steps/upload-documents-preview-and-submit';


//complete-profile
import CompleteProfileStep1 from './dashboard/home/complete-profile/complete-profile-step1';
import CompleteProfileStep2 from './dashboard/home/complete-profile/complete-profile-step2';
import CompleteProfileStep3 from './dashboard/home/complete-profile/complete-profile-step3';
import CompleteProfileStep4 from './dashboard/home/complete-profile/complete-profile-step4';
import AutoSettlement from "./dashboard/home/complete-profile/auto-settlement";

//account-approval
import AccountApprovalStep1 from './dashboard/home/account-approval/account-approval-step1';
import AccountApprovalStep2 from './dashboard/home/account-approval/account-approval-step2';


// Logout
import Logout from "./dashboard/Logout";


// Context
import UserBasicInfoContext from "../components/context/UserBasicInfoContext";
import UserTransactionSummeryContext from "../components/context/UserTransactionSummeryContext";
import UserBasicInfoQRContext from "../components/context/UserBasicInfoQRContext";
import AccountBalanceContext from "./../components/context/AccountBalanceContext";


// Context Provider
import IncompleteProfileStepsContextProvider from "./../components/context-provider/IncompleteProfileStepsContextProvider";
import RegistrationRequiredBusinessDocumentsContextProvider from "./../components/context-provider/RegistrationRequiredBusinessDocumentsContextProvider";


// Toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import VerifyKyc from "../components/VerifyKyc";

// Notifications
import RootContext from "../components/context/RootContext";
// import ComingSoon from "../components/CommingSoon";


// View Uploaded Information
import ViewVerifyIdentity from "./dashboard/home/uploaded-document/view-verify-identity";
import ViewBusinessdetails from "./dashboard/home/uploaded-document/view-business-details";
import ViewCompleteProfile from "./dashboard/home/uploaded-document/view-complete-profile";


const DashboardIncomplete = (props) => {

    let location = useLocation();

    let pathName = location.pathname;
    pathName = pathName.split('/');
    let secondIndex = pathName[2];



    const [profile, setProfile] = useState([]);
    // const [transactionSummary, setTransactionSummary] = useState({});
    const [QRInformation, setQRInformation] = useState({});
    const [accountBalanceInformation, setAccountBalanceInformation] = useState({});

    const [isPending, startTransition] = useTransition();



    //force update starts
    const [counter, setCounter] = useState({
        transfer: 0,
        viewProfile: 0,
        verifyIdentity: 0,
        businessDetails1: 0,
        businessDetails2: 0,
        presentativeDetails: 0,
        completeProfileJourney: 0
    });

    const forceUpdate = (param) => {
        setCounter((previousState) => {
            return { ...previousState, [param]: previousState[param] + 1 };
        });
    }
    //force update ends

    useEffect(() => {
        // Get Profile Information 
        setProfile(props.userProfileData);
        startTransition(() => {
            // getSummery();
            getQRinfo();
            userAccountBalance();
        });

    }, [counter?.viewProfile]);


    // const getSummery = async () => {
    //     const reqBody = { date: moment(new Date()).format('YYYY-MM-DD') };
    //     await PostLoginGetApi("user/dashboard-report", reqBody).then((responseJSON) => {
    //         let response = JSON.stringify(responseJSON);
    //         response = JSON.parse(response);

    //         if (response["status"] === 1) {

    //             let responseData = JSON.stringify(response["data"]);
    //             responseData = JSON.parse(responseData);

    //             if (responseData["code"] === 200) {
    //                 setTransactionSummary(responseData["data"]);
    //             }
    //         }

    //     }).catch((err) => {
    //         toast.error("A problem occur. Please try again.");
    //         console.log(err);
    //     });
    // }

    const getQRinfo = async () => {
        await PostLoginGetApi("user/basic-information", { lang: "en" }).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {

                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    setQRInformation(responseData["data"]);
                }
            }

        }).catch((err) => {
            toast.error("A problem occur. Please try again.");
            console.log(err);
        });
    }

    const userAccountBalance = async () => {
        await PostLoginGetApi("user/balances").then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);
            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {

                    let data = JSON.stringify(responseData["data"]);
                    data = JSON.parse(data);

                    setAccountBalanceInformation(data);
                    return;
                }
            }
        });
    }


    const [uploadDetails, setUploadDetails] = useState([]);


    useEffect(() => {
        PostLoginGetApi("api/v1/merchant-details", "", 0).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);
            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    let data = JSON.stringify(responseData["data"]);
                    data = JSON.parse(data);

                    setUploadDetails(data);
                    return;
                }
            }

        }).catch((err) => {
            console.log(err);
        });
    }, []);




    return (
        <>
            <ToastContainer></ToastContainer>
            <Routes>
                <Route path="/dashboard/logout" element={<Logout />} />
            </Routes>

            <RootContext.Provider value={{ forceUpdate: forceUpdate }}>



                {(QRInformation?.business_info?.type_of_organization !== undefined) &&

                    <IncompleteProfileStepsContextProvider
                        isChange={{
                            verifyIdentity: counter.verifyIdentity,
                            businessDetails1: counter.businessDetails1,
                            businessDetails2: counter.businessDetails2,
                            presentativeDetails: counter.presentativeDetails,
                            completeProfileJourney: counter.completeProfileJourney
                        }}>

                        <UserBasicInfoContext.Provider value={profile}>



                            {/* Incomplete Steps */}
                            <Routes>
                                <Route path="/dashboard/verify-identity-step-one" element={<StepOne />}></Route>
                                <Route path="/dashboard/verify-identity-step-two" element={<StepTwo />}></Route>
                                <Route path="/dashboard/verify-identity-step-three" element={<StepThree />}></Route>
                                <Route path="/dashboard/verify-identity-step-four" element={<StepFour />}></Route>
                            </Routes>


                            {/* View Uploaded Document */}
                            <Routes>
                                <Route path="/dashboard/view-verify-identity" element={<ViewVerifyIdentity uploadInfo={uploadDetails} />}></Route>
                                <Route path="/dashboard/view-business-details" element={<ViewBusinessdetails uploadInfo={uploadDetails} />}></Route>
                                <Route path="/dashboard/view-complete-profile" element={<ViewCompleteProfile uploadInfo={uploadDetails} />}></Route>
                            </Routes>


                            {/* Business Details */}
                            <RegistrationRequiredBusinessDocumentsContextProvider organizationType={QRInformation?.business_info?.type_of_organization}>
                                <Routes>
                                    <Route path="/dashboard/business-details" element={<BusinessDetails organizationType={QRInformation?.business_info?.type_of_organization} businessCategory={QRInformation?.business_info?.business_category} />} ></Route>

                                    {/* Upload Documents */}
                                    <Route path="/dashboard/business-details-upload-documents/:file" element={<UploadDocuments />} ></Route>
                                    <Route path="/dashboard/business-details-upload-documents-preview-and-submit/:file" element={<UploadDocumentsPreviewAndDownload />}></Route>

                                    <Route path="/dashboard/business-details-upload-logo" element={<BusinessStepLogo />} ></Route>
                                    <Route path="/dashboard/business-details-upload-logo-preview-and-submit" element={<BusinessStepLogoPreviewAndUpload />} ></Route>

                                </Routes>
                            </RegistrationRequiredBusinessDocumentsContextProvider>



                            {/*Complete Profile */}
                            <Routes>
                                <Route path="/dashboard/complete-profile-step1" element={<CompleteProfileStep1 />}></Route>
                                <Route path="/dashboard/complete-profile-step2" element={<CompleteProfileStep2 />}></Route>
                                <Route path="/dashboard/complete-profile-step3" element={<CompleteProfileStep3 />}></Route>
                                <Route path="/dashboard/complete-profile-step4" element={<CompleteProfileStep4 />}></Route>
                                <Route path="/dashboard/complete-profile-step5" element={<AutoSettlement />}></Route>
                            </Routes>

                            {/* Account Approval */}
                            <Routes>
                                <Route path="/dashboard/account-approval-step1" element={<AccountApprovalStep1 />}></Route>
                                <Route path="/dashboard/account-approval-step2" element={<AccountApprovalStep2 />}></Route>
                            </Routes>


                            <UserBasicInfoQRContext.Provider value={QRInformation}>

                                <div className="flex w-screen h-screen fixed bg-white">

                                    <Sidebar name={secondIndex} />


                                    {/* If Email Not Verified */}
                                    <div className="custom-alert-div warning hidden">
                                        <p>You didn’t verify your email yet. Please verify now.</p>
                                    </div>


                                    <div className="h-screen w-screen">

                                        {/* Top Navbar */}
                                        <Navbar name={secondIndex} />

                                        {/* If PIN Not Set */}
                                        {
                                            QRInformation?.user?.user_has_pin === false &&
                                            <div className="custom-alert-div warning">
                                                <p>You didn’t set your PIN yet. Please set your PIN right after your account is verified.</p>
                                            </div>
                                        }

                                        {/* Main Files */}
                                        {/* <UserTransactionSummeryContext.Provider value={transactionSummary}> */}


                                        <AccountBalanceContext.Provider value={accountBalanceInformation}>

                                            <Routes>
                                                {/* Home Page */}
                                                <Route path="/dashboard/home" element={<Home />} />

                                                {/* <Route path="/dashboard/coming-soon" element={<ComingSoon />} /> */}
                                                <Route path="*" element={<VerifyKyc />} />

                                            </Routes>
                                        </AccountBalanceContext.Provider>

                                        {/* </UserTransactionSummeryContext.Provider> */}

                                    </div>
                                </div>
                            </UserBasicInfoQRContext.Provider>

                        </UserBasicInfoContext.Provider>
                    </IncompleteProfileStepsContextProvider>

                }

            </RootContext.Provider>




        </>
    );
}


export default DashboardIncomplete;
