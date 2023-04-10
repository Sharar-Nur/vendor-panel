import React, { useEffect, useState, useTransition } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import moment from "moment";

import "../styles/Dashboard.css";
import Home from "./dashboard/home/home";
import CreateInvoice from "./dashboard/invoice/CreateInvoice";

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


// complete-profile
import CompleteProfileStep1 from './dashboard/home/complete-profile/complete-profile-step1';
import CompleteProfileStep2 from './dashboard/home/complete-profile/complete-profile-step2';
import CompleteProfileStep3 from './dashboard/home/complete-profile/complete-profile-step3';
import CompleteProfileStep4 from './dashboard/home/complete-profile/complete-profile-step4';


// account-approval
import AccountApprovalStep1 from './dashboard/home/account-approval/account-approval-step1';
import AccountApprovalStep2 from './dashboard/home/account-approval/account-approval-step2';


// Pages
import Reports from "./dashboard/reports/reports";
import Transactions from "./dashboard/transactions/transactions";
import TransactionsDetails from "./dashboard/transactions/transaction-details";
import RefundStepOne from "./dashboard/transactions/refund/refund-step-one";
import RefundStepTwo from "./dashboard/transactions/refund/refund-step-two";



// import Transfer Page
import Transfer from './dashboard/transfer/transfer';
import BankTransferStepOne from "./dashboard/transfer/bank-transfer/bank-transfer-step-one";
import BankTransferStepTwo from "./dashboard/transfer/bank-transfer/bank-transfer-step-two";


// import profile pages
import AccountSettings from "./dashboard/account-settings/account-settings";


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

//Coming soon
import ComingSoon from "../components/CommingSoon";

//notifications
import AllNotifications from "./dashboard/notifications/AllNotifications";
import Notifications from "./dashboard/notifications";


// Counter Landing Page
import Counter from "./dashboard/counter/Counter";

// Online Counters
import CreateCounter from "./dashboard/counter/create-counter";
import OnlineCounterDetails from "./dashboard/counter/online-counter-details";
import EditOnlineCounter from "./dashboard/counter/edit-online-counter";

// Offline Counters
import CreateOfflineCounter from "./dashboard/counter/create-offline-counter";
import OfflineCounterDetails from "./dashboard/counter/offline-counter-details";
import EditOfflineCounter from "./dashboard/counter/edit-offline-counter";


// Store
import Store from "./dashboard/store/store";
import StoreCreateDiscount from "./dashboard/store/store-create-discount";
import StoreEditDiscount from "./dashboard/store/store-edit-discount";
import StoreCreateCategory from "./dashboard/store/store-create-category";
import StoreEditCategory from "./dashboard/store/store-edit-category";
import StoreItemAdd from "./dashboard/store/store-item-add";
import StoreItemsDetails from "./dashboard/store/StoreItemsDetails";

// Voucher
import Voucher from "../components/Voucher";

// Connects
import Connects from "./dashboard/connects/connects";
import AddNewConnect from "./dashboard/connects/AddNewConnect";

// Root Context
import RootContext from "../components/context/RootContext";
import ViewConnect from "./dashboard/connects/ViewConnect";
import ConnectDetails from "./dashboard/connects/ConnectDetails";


// Instant Transfer
import BankLists from "./dashboard/instant-transfer/bank-lists";
import BankAdd from "./dashboard/instant-transfer/bank-add";
import InstantTransfer from "./dashboard/instant-transfer/instant-transfer";
import StoreEditItem from "./dashboard/store/store-edit-item";
import InstantTransferStep2 from "./dashboard/instant-transfer/instant-transfer-step2";
import StoreDuplicateItem from "./dashboard/store/store-duplicate-item";
import Orders from "./dashboard/orders/Orders";
import OrderInvoice from "./dashboard/orders/OrderInvoice";
import preLoginGetApi from "../components/api/PreLoginGetApi";
import Invoice from "./dashboard/invoice/Invoice";


// Test Purpose
import GoogleMap from "./dashboard/store/google-map";
import InvoicePreview from "./dashboard/invoice/InvoicePreview";
import UploadInvoice from "./dashboard/invoice/UploadInvoice";
import InvoiceDetails from "./dashboard/invoice/invoiceDetails";


const Dashboard = (props) => {

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
    const [counter, setCounter] = useState({ transfer: 0, viewProfile: 0, balances: 0 });
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

    }, [props.userProfileData]);

    // const getSummery = async () => {
    //     const reqBody = { date: moment(new Date()).format('YYYY-MM-DD') };
    //     await PostLoginGetApi("user/dashboard-report", reqBody).then((responseJSON) => {
    //         let response = JSON.stringify(responseJSON);6
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


    const [categoryName, setCategoryName] = useState("");
    useEffect(() => {
        preLoginGetApi("api/v1/business/categories").then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {

                    let c = responseData["data"]["categories"].filter(data => parseInt(data.id) === parseInt(QRInformation?.business_info?.business_category))
                    if (c.length === 1) {
                        setCategoryName(c[0]["name"]);
                    }
                }
            }
        }).catch((error) => {
            console.log(error);
        });
    }, [QRInformation?.business_info?.business_category]);


    // For Invoice preview clear session storage without others pages


    if (location.pathname !== "/dashboard/create-invoice" && location.pathname !== "/dashboard/invoice/preview") {
        sessionStorage.clear();
    }



    return (
        <>
            <ToastContainer></ToastContainer>
            <Routes>
                <Route path="/dashboard/logout" element={<Logout />} />
            </Routes>

            <RootContext.Provider value={{ forceUpdate: forceUpdate }}>


                {(QRInformation?.business_info?.type_of_organization === undefined) ? <>Loading...</> :
                    <IncompleteProfileStepsContextProvider>
                        <UserBasicInfoContext.Provider value={profile}>
                            <UserBasicInfoQRContext.Provider value={QRInformation}>

                                {/* <Routes>

                                    <Route exact path="/dashboard/transaction-details" element={<TransactionsDetails />} />
                                    <Route exact path="/dashboard/transaction/refund-step-one" element={<RefundStepOne />} />
                                    <Route exact path="/dashboard/transaction/refund-step-two" element={<RefundStepTwo />} />

                                    <Route exact path="/dashboard/transfer/bank-transfer-step-one" element={<BankTransferStepOne />} />
                                    <Route exact path="/dashboard/transfer/bank-transfer-step-two" element={<BankTransferStepTwo />} />
                                </Routes> */}


                                {/* Instant Transfer */}
                                {/* <Routes>
                                    <Route path="/dashboard/instant-transfer/bank-lists" element={<BankLists />} />
                                    <Route path="/dashboard/instant-transfer/bank-add" element={<BankAdd />} />
                                    <Route path="/dashboard/instant-transfer/transfer" element={<InstantTransfer />} />
                                    <Route path="/dashboard/instant-transfer/transfer/confirm" element={<InstantTransferStep2 />} />
                                </Routes> */}

                                {/* Connects */}
                                <Routes>
                                    <Route exact path="/dashboard/connects/add-new" element={<AddNewConnect />}></Route>
                                    <Route path="/dashboard/connects/view-connect" element={<ConnectDetails />}></Route>
                                    <Route path="/dashboard/connects/connect-details/:id" element={<ViewConnect />}></Route>
                                </Routes>

                                {/* Stores Popups */}
                                <Routes>
                                    <Route exact path="/dashboard/store/add-item" element={<StoreItemAdd />}></Route>
                                    <Route exact path="/dashboard/store/create-category" element={<StoreCreateCategory />}></Route>
                                    <Route exact path="/dashboard/store/edit-category" element={<StoreEditCategory />}></Route>
                                    <Route path="/dashboard/store/items-details" element={<StoreItemsDetails />} ></Route>
                                    <Route path="/dashboard/store/edit-item/:id" element={<StoreEditItem />} ></Route>
                                    <Route path="/dashboard/store/duplicate-item/:id" element={<StoreDuplicateItem />} ></Route>
                                </Routes>

                                <Routes>
                                    <Route path="/dashboard/create-invoice" element={<CreateInvoice />} />
                                    <Route path="/dashboard/invoice/preview" element={<InvoicePreview props={profile} />} />
                                    <Route path="/dashboard/invoice/upload-invoice" element={<UploadInvoice />} />
                                    <Route path="/dashboard/invoice/details/:id" element={<InvoiceDetails />} />
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
                                </Routes>

                                {/* Account Approval */}
                                <Routes>
                                    <Route path="/dashboard/account-approval-step1" element={<AccountApprovalStep1 />}></Route>
                                    <Route path="/dashboard/account-approval-step2" element={<AccountApprovalStep2 />}></Route>
                                </Routes>


                                {/* Counter */}
                                {/* <Routes>
                                    <Route path="/dashboard/counter/create" element={<CreateCounter businessCategory={QRInformation?.business_info?.business_category} />} ></Route>
                                    <Route path="/dashboard/counter/edit" element={<EditOnlineCounter businessCategory={QRInformation?.business_info?.business_category} />} ></Route>

                                    <Route path="/dashboard/counter/offline/create" element={<CreateOfflineCounter />}></Route>
                                    <Route path="/dashboard/counter/offline/edit" element={<EditOfflineCounter />} ></Route>

                                    <Route path="/dashboard/store/discount/create" element={<StoreCreateDiscount />} ></Route>
                                    <Route path="/dashboard/store/discount/edit" element={<StoreEditDiscount />} ></Route>

                                </Routes> */}


                                {/* Order */}

                                <Routes>
                                    <Route path="/dashboard/orders/order-invoice/:id" element={<OrderInvoice category={categoryName} />} ></Route>
                                </Routes>



                                <div className="flex w-screen min-h-full h-screen fixed bg-white">


                                    <Sidebar name={secondIndex} />





                                    <div className="h-screen w-screen">

                                        {/* Top Navbar */}
                                        <Navbar name={secondIndex} />


                                        {/* Main Files */}

                                        {/* If Email Not Verified */}
                                        <div className="custom-alert-div warning hidden">
                                            <p>You didn’t verify your email yet. Please verify now.</p>
                                        </div>


                                        {/* If PIN Not Set */}
                                        {
                                            QRInformation?.user?.user_has_pin === false &&
                                            <div className="custom-alert-div warning">
                                                <p>You didn’t set your PIN yet. Please set your PIN right after your account is verified.</p>
                                            </div>
                                        }

                                        {/* <UserTransactionSummeryContext.Provider value={transactionSummary}> */}
                                        <AccountBalanceContext.Provider value={accountBalanceInformation}>
                                            <Routes>
                                                <Route path="/dashboard/home" element={<Home />} />
                                                <Route path="/dashboard/all-notifications" element={<AllNotifications />} />
                                                <Route path="/dashboard/notifications" element={<Notifications />} />



                                                {/* Counter */}


                                                {/* Store */}
                                                <Route path="/dashboard/store" element={<Store></Store>}></Route>

                                                {/* Connects */}
                                                <Route path="/dashboard/connects" element={<Connects></Connects>}></Route>
                                                <Route path="/dashboard/connects" element={<Connects></Connects>}></Route>

                                                {/* Reports */}
                                                <Route path="/dashboard/reports" element={<Reports />} />


                                                {/* <Route path="/dashboard/transactions" element={<Transactions />} />
                                                    <Route path="/dashboard/transfer" element={<Transfer />} /> */}
                                                <Route path="/dashboard/account-settings" element={<AccountSettings />} />

                                                <Route path="/dashboard/coming-soon" element={<ComingSoon />} />

                                                <Route path="/dashboard/invoice" element={<Invoice />} />

                                                <Route path="/dashboard/voucher" element={<Voucher />} />


                                                {/* Orders */}
                                                <Route path="/dashboard/orders" element={<Orders />} />

                                                <Route path="/dashboard/google-map" element={<GoogleMap />}></Route>


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
    )
}


export default Dashboard;
