import React, { useEffect, useState, useContext, Suspense } from "react";
import PostLoginGetApi from "../../../components/api/PostLoginGetApi";
import { useLocation } from "react-router-dom";

import { Link } from "react-router-dom";
import $ from "jquery";

// Context
import UserTransactionSummeryContext from "../../../components/context/UserTransactionSummeryContext";

import IncompleteProfileStepsContext from "../../../components/context/IncompleteProfileStepsContext";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// QR Code
const QRCode = React.lazy(() => { return import("qrcode.react") });



const HomeIncomplete = () => {


    const IncompleteProfileSteps = useContext(IncompleteProfileStepsContext);

    const transactionSummery = useContext(UserTransactionSummeryContext);

    const [completeSteps, setCompleteSteps] = useState({
        count: 0,
        data: {}
    });



    const { state } = useLocation();

    useEffect(() => {

        window.localStorage.removeItem("UploadedArr");

        if (state === null) {
            return;
        }

        window.history.replaceState({}, "");
    }, [state]);


    const [balance, setBalance] = useState({
        accountNumber: "",
        currency: "",
        balance: ""
    });


    var [refresh, setRefresh] = useState(0);

    // Refresh Icon Click Event
    const refreshIconClick = (event) => {
        $("#top-balance").find("div").hide();
        $("#top-balance>.loading").show();
        setRefresh((previousState) => {
            return refresh = previousState + 1;
        });
    }

    // Profile Complete Flags
    useEffect(() => {
        if (IncompleteProfileSteps?.value?.isError === false) {
            setCompleteSteps({ ...completeSteps, data: IncompleteProfileSteps?.value });

            // Set Count
            if (IncompleteProfileSteps?.value?.data?.owner_nid === true && IncompleteProfileSteps?.value?.data?.owner_photo === true) {
                setCompleteSteps((prevCount) => ({ ...completeSteps, count: prevCount.count + 1 }));
                $("#verified-identity-incomplete").hide();
                $("#verified-identity-complete").show();
            }

            if (IncompleteProfileSteps?.value?.data?.business_details === true && IncompleteProfileSteps?.value?.data?.business_details_documents === true) {
                setCompleteSteps((prevCount) => ({ ...completeSteps, count: prevCount.count + 1 }));
                $("#incomplete-business-details").hide();
                $("#complete-business-details").show();
            }

            if (IncompleteProfileSteps?.value?.data?.complete_profile === true) {
                setCompleteSteps((prevCount) => ({ ...completeSteps, count: prevCount.count + 1 }));
                $("#incomplete-profile").hide();
                $("#complete-profile").show();
            }

            if (IncompleteProfileSteps?.value?.data?.account_approval === true) {
                setCompleteSteps((prevCount) => ({ ...completeSteps, count: prevCount.count + 1 }));
                $("#incomplete-approval").hide();
                $("#complete-approval").show();
            }
        }

    }, [IncompleteProfileSteps?.value]);


    // Total Balance 
    useEffect(() => {
        setTimeout(() => {
            $("#top-balance").find("div").show();
            $("#top-balance>.loading").hide();
        }, 500);

        PostLoginGetApi("user/balances").then((responseJSON) => {
            var response = JSON.stringify(responseJSON);
            response = JSON.parse(response);
            if (response["status"] === 1) {
                var responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);
                if (responseData["code"] === 200) {
                    let data = JSON.stringify(responseData["data"]);
                    data = JSON.parse(data);


                    if (data["balances"][0]["is_active"] === 1) {
                        setBalance({ accountNumber: data["balances"][0]["account_no"], currency: data["balances"][0]["currency"], balance: data["balances"][0]["balance"].substring(1) });
                    }


                }
            }
        });

    }, [refresh]);


    const toggleModal = () => {
        document.getElementById('popup-modal').classList.toggle('hidden');
    }

    return (
        <>

            {/* Popup Model */}
            <div id="popup-modal" tabIndex="-1" className="hidden overflow-y-auto align-middle text-center overflow-x-hidden bg-[rgb(239,246,255,0.5)]  fixed right-0 left-0 z-50 md:inset-0 h-modal md:h-full">
                <div className="relative p-4 w-full max-w-lg h-full m-auto top-1/3 md:h-auto">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                        <button type="button" onClick={toggleModal} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="popup-modal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-6 text-center">
                            <h3 className="mt-7 mb-7 text-base font-normal text-gray-500 dark:text-gray-400">
                                To view your submitted document,<br />
                                please contact Deshi via <br />
                            </h3>

                            <a href="mailto:support@deshipay.com" type="button" className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                support@deshipay.com
                            </a>

                            <a href="tel:+8809617343434" type="button" className="text-white bg-gray-500 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-white-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                                +880 961 734 3434
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/* Popup Model End */}

            {/** First Div --- SUMMARY */}
            <div id="top-balance" className="box-full w-full h-[159px] bg-[#F5F5F5] text-[#222222] p-6 px-8 text-justify rounded-[5px]">
                <p className="font-medium text-base px-4 pb-4 pl-0 pr-0">
                    Account No. {balance && balance.accountNumber}

                    <span onClick={refreshIconClick} className="refresh-icon-svg float-right cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.55 21.67C18.84 20.54 22 16.64 22 12C22 6.48 17.56 2 12 2C5.33 2 2 7.56 2 7.56M2 7.56V3M2 7.56H4.01H6.44" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12C2 17.52 6.48 22 12 22" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3" />
                        </svg>
                    </span>
                </p>
                <hr style={{ "border": "1px solid #DDDDDD", "borderRadius": "5px" }} />

                <div className="w-2/3 float-left">
                    <p className="font-normal text-base px-4 pb-0 pl-0 pt-4 mb-2.5">Account Balance</p>
                    <h2 style={{ "fontSize": "24px", "fontWeight": "600", "marginTop": "-4px" }} className="font-bold px-4 pl-0 pt-0">{balance && balance.balance} {balance && balance.currency}</h2>
                </div>

                <div className="loading w-2/3 pt-4 font-semibold float-left hidden">
                    loading...
                </div>
            </div>

            {/* Profile Incomplete Fields */}
            <div className="flow-root pt-8 text-xl w-full px-1">
                <p className="float-left">Profile not Complete</p>
                <p className="float-right">{completeSteps.count} / 4</p>
            </div>


            {/* incomplete profile details */}
            <Link id="verified-identity-incomplete" to={"/dashboard/verify-identity-step-one"} className="incomplete-profile-steps rounded-lg items-center cursor-pointer my-3" >
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="50" rx="5" fill="white" />
                    <path d="M30.7811 18.7903C30.8075 21.9407 28.2008 24.5744 25.0123 24.5838C21.8443 24.5932 19.237 22.017 19.2188 18.8161C19.2006 15.6253 21.7668 13.0397 24.9747 13.0174C28.1738 12.995 30.7664 15.573 30.7811 18.7903ZM24.9647 23.1724C27.3301 23.2235 29.3597 21.245 29.3815 18.8326C29.4026 16.473 27.5022 14.4863 25.105 14.4258C22.6645 14.3642 20.6924 16.2646 20.6231 18.7157C20.5556 21.0958 22.5371 23.183 24.9647 23.1724Z" fill="#444444" />
                    <path d="M18.696 36.9822C18.416 36.9229 18.1312 36.8806 17.8571 36.8014C16.1539 36.3088 15.0865 34.9996 15.012 33.2124C14.9345 31.3584 15.1376 29.5302 15.8427 27.7935C16.2983 26.6722 16.9588 25.7029 18.0666 25.1099C18.75 24.7441 19.4833 24.5715 20.2495 24.5862C20.4914 24.5909 20.7456 24.713 20.9663 24.8334C21.3221 25.0265 21.6515 25.2672 21.9967 25.4804C24.004 26.7203 26.0124 26.7185 28.018 25.4762C28.2968 25.3036 28.581 25.1369 28.8422 24.9408C29.3225 24.5809 29.8503 24.5363 30.421 24.6197C31.9774 24.8486 33.077 25.7011 33.8185 27.0614C34.4802 28.2755 34.7784 29.5947 34.9105 30.9539C34.9786 31.6519 35.0109 32.3564 35.0021 33.0574C34.9768 35.151 33.5396 36.7092 31.4572 36.9388C31.4055 36.9446 31.3556 36.9675 31.3045 36.9828C27.1027 36.9822 22.8996 36.9822 18.696 36.9822ZM24.9962 35.5761C26.8708 35.5761 28.7454 35.5779 30.62 35.5743C30.8771 35.5737 31.1355 35.5585 31.3903 35.5291C32.5615 35.3923 33.4175 34.5774 33.5602 33.4167C33.6764 32.4739 33.5872 31.5292 33.4533 30.5928C33.3136 29.6165 33.0852 28.663 32.6108 27.7841C32.0513 26.7467 31.2435 26.0727 30.0223 26.0029C29.9143 25.9964 29.7875 26.024 29.6953 26.0792C29.3407 26.2917 28.999 26.526 28.6473 26.7438C27.6827 27.3409 26.6342 27.706 25.5034 27.7929C23.9547 27.9127 22.5397 27.4906 21.2364 26.6645C20.9264 26.4684 20.6199 26.2671 20.3082 26.0727C20.2442 26.0328 20.1655 25.9888 20.0957 25.9917C19.3371 26.0269 18.6561 26.263 18.1095 26.8095C17.6727 27.2463 17.3627 27.7706 17.1349 28.3395C16.5173 29.8836 16.3646 31.5052 16.4157 33.1449C16.4509 34.2739 17.078 35.0929 18.0813 35.3947C18.4782 35.5139 18.9085 35.5655 19.3248 35.5691C21.2158 35.5861 23.1057 35.5761 24.9962 35.5761Z" fill="#444444" />
                </svg>
                <div className="grid pl-4 text-justify float-left w-full">
                    <p className="font-semibold text-base w-full">Verify Identity</p>
                    <p className="font-medium text-base color-[#8B8F97] w-full">You need to verify your identity. Please complete your profile.</p>
                </div>
                <div className="flex mr-2 arrow">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </div>
            </Link>


            {/* Complete Profile Details */}
            <Link id="verified-identity-complete" to={"/dashboard/view-verify-identity"} style={{ display: "none" }} className="incomplete-profile-steps complete bg-[#E8F3EF] rounded-lg items-center cursor-pointer my-3">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="50" rx="5" fill="#00C52A" />
                    <path d="M31.71 20.21C31.617 20.1163 31.5064 20.0419 31.3846 19.9911C31.2627 19.9403 31.132 19.9142 31 19.9142C30.868 19.9142 30.7373 19.9403 30.6154 19.9911C30.4936 20.0419 30.383 20.1163 30.29 20.21L22.84 27.67L19.71 24.53C19.6135 24.4367 19.4995 24.3634 19.3747 24.3142C19.2498 24.265 19.1165 24.2409 18.9823 24.2432C18.8482 24.2455 18.7157 24.2743 18.5927 24.3278C18.4696 24.3812 18.3582 24.4585 18.265 24.555C18.1718 24.6515 18.0985 24.7654 18.0493 24.8903C18.0001 25.0152 17.9759 25.1485 17.9782 25.2827C17.9806 25.4168 18.0093 25.5493 18.0628 25.6723C18.1163 25.7954 18.1935 25.9067 18.29 26L22.13 29.84C22.223 29.9337 22.3336 30.0081 22.4554 30.0589C22.5773 30.1096 22.708 30.1358 22.84 30.1358C22.972 30.1358 23.1027 30.1096 23.2246 30.0589C23.3464 30.0081 23.457 29.9337 23.55 29.84L31.71 21.68C31.8115 21.5863 31.8925 21.4727 31.9479 21.3462C32.0033 21.2197 32.0319 21.0831 32.0319 20.945C32.0319 20.8069 32.0033 20.6703 31.9479 20.5438C31.8925 20.4173 31.8115 20.3036 31.71 20.21Z" fill="white" />
                </svg>

                <div className="grid pl-4 text-justify float-left w-full">
                    <p className="font-semibold text-base w-full">Verify Identity</p>
                    <p className="font-medium text-base color-[#8B8F97] w-full">You need to verify your identity. Please complete your profile.</p>
                </div>
                <div className="flex mr-2 arrow">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </div>
            </Link>

            {/* incomplete business details  */}
            <Link id="incomplete-business-details" to={"/dashboard/business-details"} className="incomplete-profile-steps rounded-lg items-center cursor-pointer my-3">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="50" rx="5" fill="white" />
                    <path d="M31.7481 37C27.2481 37 22.7481 37 18.2481 37C18.0831 36.9625 17.9181 36.925 17.7531 36.8875C16.1931 36.475 15.1431 35.11 15.1431 33.445C15.1356 30.565 15.1431 27.685 15.1431 24.7975C15.1431 24.625 15.0981 24.535 14.9406 24.4525C14.0856 23.965 13.5606 23.2375 13.4631 22.2475C13.4031 21.625 13.4256 20.9875 13.4331 20.3575C13.4331 20.17 13.4781 19.9675 13.5531 19.795C14.4606 17.725 15.3756 15.67 16.2906 13.6075C16.4106 13.3225 16.5906 13.105 16.8906 13C22.2981 13 27.7056 13 33.1131 13C33.4131 13.105 33.5856 13.3225 33.7131 13.6075C34.6206 15.67 35.5431 17.725 36.4506 19.7875C36.5181 19.9375 36.5631 20.1025 36.5631 20.26C36.5781 20.815 36.5856 21.37 36.5631 21.925C36.5256 23.05 36.0156 23.905 35.0331 24.4675C34.8906 24.55 34.8531 24.625 34.8531 24.775C34.8606 26.065 34.8531 27.355 34.8531 28.6375C34.8531 30.28 34.8681 31.915 34.8456 33.5575C34.8231 35.155 33.7656 36.4825 32.2431 36.88C32.0856 36.925 31.9131 36.9625 31.7481 37ZM20.3856 35.4625C20.3856 35.38 20.3856 35.2825 20.3856 35.1925C20.3856 33.1 20.3856 31.0075 20.3856 28.915C20.3856 28.3375 20.6781 28.0525 21.2481 28.0525C23.7456 28.0525 26.2506 28.0525 28.7481 28.0525C28.8306 28.0525 28.9206 28.0525 29.0031 28.0675C29.3931 28.1425 29.6106 28.45 29.6106 28.915C29.6106 31.0075 29.6106 33.1 29.6106 35.1925C29.6106 35.29 29.6106 35.3875 29.6106 35.4925C30.2706 35.4925 30.9006 35.5075 31.5231 35.485C31.7256 35.4775 31.9431 35.4175 32.1306 35.335C32.9556 34.96 33.3531 34.3075 33.3531 33.4C33.3531 30.61 33.3531 27.82 33.3531 25.03C33.3531 24.9625 33.3456 24.895 33.3456 24.805C32.6181 24.7075 31.9956 24.4 31.4931 23.86C30.8856 24.475 30.1806 24.8125 29.3256 24.8125C28.4706 24.8125 27.7581 24.475 27.1581 23.86C26.5581 24.4825 25.8456 24.8125 24.9981 24.8125C24.1431 24.8125 23.4306 24.4675 22.8306 23.86C22.2231 24.475 21.5181 24.8125 20.6631 24.8125C19.8081 24.8125 19.0956 24.4675 18.4956 23.86C18.0456 24.3325 17.5206 24.6475 16.8906 24.7525C16.6656 24.79 16.6206 24.8725 16.6281 25.0825C16.6356 26.8375 16.6356 28.6 16.6356 30.355C16.6356 31.435 16.6206 32.515 16.6431 33.5875C16.6656 34.5325 17.3481 35.335 18.2856 35.44C18.9681 35.53 19.6581 35.4625 20.3856 35.4625ZM15.3606 19.435C21.7956 19.435 28.2156 19.435 34.6506 19.435C34.6131 19.3375 34.5831 19.27 34.5531 19.195C33.8856 17.7025 33.2181 16.2025 32.5581 14.7025C32.4906 14.5375 32.4081 14.4925 32.2281 14.4925C27.4131 14.5 22.5906 14.5 17.7756 14.4925C17.6031 14.4925 17.5206 14.5375 17.4456 14.7025C16.7856 16.21 16.1106 17.71 15.4431 19.2175C15.4131 19.285 15.3906 19.3525 15.3606 19.435ZM21.9006 29.56C21.9006 31.5475 21.9006 33.52 21.9006 35.4925C23.9781 35.4925 26.0331 35.4925 28.0956 35.4925C28.0956 33.5125 28.0956 31.54 28.0956 29.56C26.0256 29.56 23.9781 29.56 21.9006 29.56ZM32.2506 20.95C32.2506 21.34 32.2281 21.7 32.2581 22.06C32.3106 22.72 32.8431 23.245 33.4806 23.3125C34.1706 23.3875 34.8306 22.99 34.9881 22.3225C35.0931 21.88 35.0631 21.4075 35.1006 20.9575C34.1181 20.95 33.1956 20.95 32.2506 20.95ZM17.7831 20.9725C16.8081 20.9725 15.8781 20.9725 14.9556 20.9725C14.9556 21.3775 14.9181 21.7675 14.9631 22.15C15.0456 22.795 15.6081 23.2825 16.2381 23.3125C16.9356 23.35 17.5506 22.9375 17.6856 22.2775C17.7831 21.8575 17.7531 21.415 17.7831 20.9725ZM27.9156 20.9725C27.9156 21.3325 27.9006 21.67 27.9231 22.0075C27.9681 22.6975 28.5156 23.2525 29.1756 23.3125C29.8956 23.38 30.5631 22.9375 30.6906 22.24C30.7656 21.835 30.7056 21.4075 30.7056 20.9725C29.7831 20.9725 28.8606 20.9725 27.9156 20.9725ZM19.2681 20.9725C19.2681 21.3325 19.2531 21.67 19.2681 22.0075C19.3056 22.7125 19.8831 23.2825 20.5656 23.32C21.3081 23.3575 21.9456 22.8925 22.0506 22.1725C22.1031 21.7825 22.0581 21.385 22.0581 20.9725C21.1356 20.9725 20.2131 20.9725 19.2681 20.9725ZM23.5881 20.965C23.5881 21.31 23.5806 21.6325 23.5881 21.9475C23.6031 22.6375 24.1356 23.2225 24.8106 23.305C25.5231 23.3875 26.2056 22.96 26.3481 22.2625C26.4306 21.8425 26.4006 21.4 26.4306 20.9575C25.4556 20.965 24.5406 20.965 23.5881 20.965Z" fill="#444444" />
                </svg>

                <div className="grid pl-4 text-justify float-left w-full">
                    <p className="font-semibold text-base w-full">Business Details</p>
                    <p className="font-medium text-base color-[#8B8F97] w-full">We need to know more about your business. Please complete your profile.</p>
                </div>
                <div className="flex mr-2 arrow">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </div>
            </Link>


            {/* complete business details */}
            <Link id="complete-business-details" to={"/dashboard/view-business-details"} style={{ display: "none" }} className="incomplete-profile-steps complete bg-[#E8F3EF] rounded-lg items-center cursor-pointer my-3">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="50" rx="5" fill="#00C52A" />
                    <path d="M31.71 20.21C31.617 20.1163 31.5064 20.0419 31.3846 19.9911C31.2627 19.9403 31.132 19.9142 31 19.9142C30.868 19.9142 30.7373 19.9403 30.6154 19.9911C30.4936 20.0419 30.383 20.1163 30.29 20.21L22.84 27.67L19.71 24.53C19.6135 24.4367 19.4995 24.3634 19.3747 24.3142C19.2498 24.265 19.1165 24.2409 18.9823 24.2432C18.8482 24.2455 18.7157 24.2743 18.5927 24.3278C18.4696 24.3812 18.3582 24.4585 18.265 24.555C18.1718 24.6515 18.0985 24.7654 18.0493 24.8903C18.0001 25.0152 17.9759 25.1485 17.9782 25.2827C17.9806 25.4168 18.0093 25.5493 18.0628 25.6723C18.1163 25.7954 18.1935 25.9067 18.29 26L22.13 29.84C22.223 29.9337 22.3336 30.0081 22.4554 30.0589C22.5773 30.1096 22.708 30.1358 22.84 30.1358C22.972 30.1358 23.1027 30.1096 23.2246 30.0589C23.3464 30.0081 23.457 29.9337 23.55 29.84L31.71 21.68C31.8115 21.5863 31.8925 21.4727 31.9479 21.3462C32.0033 21.2197 32.0319 21.0831 32.0319 20.945C32.0319 20.8069 32.0033 20.6703 31.9479 20.5438C31.8925 20.4173 31.8115 20.3036 31.71 20.21Z" fill="white" />
                </svg>

                <div className="grid pl-4 text-justify float-left w-full">
                    <p className="font-semibold text-base w-full">Business Details</p>
                    <p className="font-medium text-base color-[#8B8F97] w-full">We need to know more about your business. Please complete your profile.</p>
                </div>
                <div className="flex mr-2 arrow">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </div>
            </Link>



            {/*incomplete profile */}
            <Link id="incomplete-profile" to={"/dashboard/complete-profile-step1"} className="incomplete-profile-steps rounded-lg items-center cursor-pointer my-3">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="50" rx="5" fill="white" />
                    <g clipPath="url(#clip0_108_1989)">
                        <path d="M30.8868 19.4537C30.7455 22.9716 27.8552 25.704 24.421 25.5662C20.8924 25.4248 18.2185 22.5232 18.3506 18.9811C18.4784 15.5589 21.4508 12.8558 24.9193 13.0057C28.2965 13.1521 31.0218 16.0966 30.8868 19.4537ZM20.0564 19.2752C20.0528 21.7999 22.1076 23.8633 24.6202 23.859C27.1256 23.8548 29.1704 21.8078 29.1804 19.2952C29.1904 16.7791 27.1313 14.7143 24.613 14.715C22.1069 14.715 20.0599 16.7634 20.0564 19.2752Z" fill="#444444" />
                        <path d="M20.8581 36.4402C18.899 36.4402 16.9398 36.4424 14.9806 36.4395C13.9553 36.4374 13.1806 35.8419 12.9779 34.8952C12.9357 34.6974 12.9343 34.4875 12.9372 34.2833C12.9464 33.6057 12.9079 32.9217 12.995 32.2534C13.1421 31.1189 13.8004 30.2521 14.6372 29.5174C15.8467 28.4557 17.2832 27.8174 18.8047 27.369C21.6642 26.5251 24.5787 26.3623 27.5282 26.7514C28.0509 26.82 28.3843 27.2376 28.3129 27.711C28.2372 28.2137 27.8202 28.5064 27.2833 28.4407C24.4566 28.0959 21.6685 28.2401 18.9418 29.1176C17.7644 29.4967 16.6585 30.0215 15.7153 30.8426C15.0013 31.4637 14.5608 32.2091 14.64 33.2023C14.6707 33.5921 14.6536 33.9877 14.6422 34.3797C14.635 34.6353 14.7457 34.731 14.992 34.7295C15.963 34.7245 16.9334 34.7274 17.9044 34.7274C20.8524 34.7274 23.7998 34.7281 26.7478 34.726C27.0134 34.726 27.264 34.7509 27.4661 34.9473C27.7089 35.1836 27.8124 35.4642 27.7196 35.7969C27.6282 36.1247 27.4147 36.3381 27.0798 36.4088C26.9506 36.436 26.815 36.4402 26.6821 36.4402C24.7408 36.4402 22.7995 36.4402 20.8581 36.4402Z" fill="#444444" />
                        <path d="M32.7732 25.2913C32.936 25.3377 33.2373 25.3891 33.5086 25.5084C34.2819 25.8482 35.0451 26.2109 35.8077 26.5743C36.9693 27.127 37.367 28.2379 36.8229 29.4082C36.0318 31.1125 35.2322 32.8125 34.4454 34.5189C34.1976 35.0558 33.8185 35.4356 33.2751 35.6663C32.317 36.0718 31.3652 36.4924 30.4085 36.9015C29.8294 37.1492 29.3346 36.9186 29.1526 36.3167C28.8463 35.3021 28.5457 34.2861 28.2437 33.2701C28.0902 32.7532 28.1223 32.2498 28.3508 31.7593C29.1704 29.9993 29.9837 28.2365 30.8104 26.4801C31.171 25.7176 31.7922 25.332 32.7732 25.2913ZM30.5406 34.9837C31.2745 34.6645 31.9764 34.364 32.6718 34.0505C32.7582 34.0112 32.836 33.912 32.8782 33.822C33.6864 32.0978 34.4896 30.3706 35.2907 28.6435C35.4092 28.3879 35.3664 28.2644 35.1201 28.148C34.3568 27.7874 33.5914 27.4297 32.8253 27.0763C32.574 26.9599 32.4548 27.0049 32.3362 27.2591C31.5309 28.9848 30.7269 30.7112 29.928 32.4398C29.8865 32.5297 29.858 32.6532 29.8837 32.7439C30.0907 33.4786 30.3121 34.2104 30.5406 34.9837Z" fill="#444444" />
                    </g>
                    <defs>
                        <clipPath id="clip0_108_1989">
                            <rect width="24.1271" height="24" fill="white" transform="translate(12.9365 13)" />
                        </clipPath>
                    </defs>
                </svg>
                <div className="grid pl-4 text-justify float-left w-full">
                    <p className="font-semibold text-base w-full">Complete Profile</p>
                    <p className="font-medium text-base color-[#8B8F97] w-full">You need to verify your identity. Please complete your profile.</p>
                </div>
                <div className="flex mr-2 arrow">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </div>
            </Link>

            {/* complete-profile  */}
            <Link id="complete-profile" to={"/dashboard/view-complete-profile"} style={{ display: "none" }} className="incomplete-profile-steps complete bg-[#E8F3EF] rounded-lg items-center cursor-pointer my-3">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="50" rx="5" fill="#00C52A" />
                    <path d="M31.71 20.21C31.617 20.1163 31.5064 20.0419 31.3846 19.9911C31.2627 19.9403 31.132 19.9142 31 19.9142C30.868 19.9142 30.7373 19.9403 30.6154 19.9911C30.4936 20.0419 30.383 20.1163 30.29 20.21L22.84 27.67L19.71 24.53C19.6135 24.4367 19.4995 24.3634 19.3747 24.3142C19.2498 24.265 19.1165 24.2409 18.9823 24.2432C18.8482 24.2455 18.7157 24.2743 18.5927 24.3278C18.4696 24.3812 18.3582 24.4585 18.265 24.555C18.1718 24.6515 18.0985 24.7654 18.0493 24.8903C18.0001 25.0152 17.9759 25.1485 17.9782 25.2827C17.9806 25.4168 18.0093 25.5493 18.0628 25.6723C18.1163 25.7954 18.1935 25.9067 18.29 26L22.13 29.84C22.223 29.9337 22.3336 30.0081 22.4554 30.0589C22.5773 30.1096 22.708 30.1358 22.84 30.1358C22.972 30.1358 23.1027 30.1096 23.2246 30.0589C23.3464 30.0081 23.457 29.9337 23.55 29.84L31.71 21.68C31.8115 21.5863 31.8925 21.4727 31.9479 21.3462C32.0033 21.2197 32.0319 21.0831 32.0319 20.945C32.0319 20.8069 32.0033 20.6703 31.9479 20.5438C31.8925 20.4173 31.8115 20.3036 31.71 20.21Z" fill="white" />
                </svg>
                <div className="grid pl-4 text-justify float-left w-full">
                    <p className="font-semibold text-base w-full">Complete Profile</p>
                    <p className="font-medium text-base color-[#8B8F97] w-full">You need to verify your identity. Please complete your profile.</p>
                </div>
                <div className="flex mr-2 arrow">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </div>
            </Link>



            {/* incomplete Account Approval */}
            <Link to={"/dashboard/account-approval-step1"} id="incomplete-approval" className="incomplete-profile-steps rounded-lg items-center cursor-pointer my-3">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="50" rx="5" fill="white" />
                    <g clipPath="url(#clip0_108_2003)">
                        <path d="M24.7206 13C24.9075 13 25.095 13 25.2819 13C25.9006 13.1112 26.3675 13.4775 26.8094 13.895C27.1213 14.1894 27.4575 14.4581 27.7681 14.7537C27.9119 14.89 28.0563 14.9325 28.2488 14.9156C29.0563 14.845 29.8644 14.785 30.6725 14.725C31.8563 14.6375 32.7238 15.2762 33 16.4331C33.1556 17.0856 33.3169 17.7362 33.4675 18.39C33.5013 18.5369 33.5669 18.6344 33.7 18.7125C34.4256 19.1394 35.1463 19.5731 35.8669 20.0081C36.8906 20.6256 37.2306 21.6613 36.7756 22.7725C36.495 23.4581 36.2075 24.1406 35.935 24.8287C35.8975 24.9237 35.8981 25.0588 35.9356 25.1538C36.2081 25.8425 36.4963 26.5244 36.7769 27.21C37.2313 28.3206 36.8888 29.3569 35.865 29.9737C35.1444 30.4081 34.4244 30.8444 33.6981 31.2694C33.5631 31.3487 33.5013 31.4463 33.4675 31.5925C33.3213 32.2231 33.1375 32.8463 33.02 33.4813C32.8338 34.485 31.9763 35.4169 30.5288 35.2556C29.7469 35.1687 28.96 35.125 28.1744 35.075C28.0731 35.0688 27.9463 35.1156 27.8669 35.1812C27.5069 35.48 27.1519 35.7863 26.8106 36.1063C26.3669 36.5213 25.8988 36.8862 25.2819 37C25.095 37 24.9075 37 24.7206 37C24.1044 36.8862 23.6363 36.5219 23.1925 36.1069C22.8513 35.7875 22.4969 35.4813 22.1356 35.1838C22.0513 35.1144 21.9144 35.0694 21.8056 35.0763C20.9588 35.13 20.1131 35.2138 19.2656 35.2606C18.1088 35.3238 17.2706 34.6819 17.0019 33.5569C16.8444 32.8975 16.6925 32.2362 16.5206 31.5806C16.4894 31.4619 16.3944 31.33 16.2906 31.2656C15.5619 30.8156 14.8225 30.3825 14.0881 29.9419C13.5381 29.6119 13.1869 29.1388 13.0631 28.5031C13.0575 28.4744 13.0375 28.4481 13.0244 28.4213C13.0244 28.2181 13.0244 28.015 13.0244 27.8119C13.1113 27.5644 13.1888 27.3131 13.2863 27.07C13.5438 26.4281 13.815 25.7925 14.0675 25.1488C14.1044 25.0544 14.1019 24.92 14.065 24.825C13.7256 23.9431 13.3738 23.0662 13.025 22.1875C13.025 21.9688 13.025 21.75 13.025 21.5312C13.0381 21.5131 13.0588 21.4963 13.0631 21.4762C13.1956 20.8037 13.5831 20.3263 14.1681 19.9875C14.8088 19.6169 15.445 19.2394 16.0738 18.8488C16.1856 18.7794 16.29 18.6469 16.3313 18.5212C16.5825 17.7594 16.8163 16.9913 17.0531 16.2244C17.3581 15.2381 18.2331 14.64 19.2619 14.7194C20.1006 14.7838 20.94 14.8469 21.7781 14.9169C21.9425 14.9306 22.0713 14.9025 22.1988 14.7831C22.5288 14.4738 22.8819 14.1894 23.2106 13.8788C23.6475 13.4663 24.1119 13.1112 24.7206 13ZM19.4763 16.1431C18.6938 16.0963 18.5331 16.2056 18.3369 16.8312C18.0825 17.6419 17.8206 18.4506 17.5769 19.265C17.4931 19.545 17.3425 19.7438 17.0913 19.89C16.3569 20.3175 15.63 20.7569 14.9 21.1906C14.4269 21.4713 14.3281 21.7581 14.5375 22.2675C14.8513 23.0319 15.16 23.7987 15.4869 24.5581C15.6131 24.8512 15.6169 25.1187 15.4906 25.4131C15.1613 26.1794 14.8494 26.9538 14.5325 27.725C14.3306 28.2169 14.4319 28.5131 14.8906 28.7863C15.7138 29.2769 16.5356 29.7706 17.3613 30.2569C17.5988 30.3969 17.7375 30.5912 17.8 30.8594C17.975 31.6112 18.1594 32.3612 18.3419 33.1112C18.4981 33.7525 18.7094 33.9025 19.3681 33.8494C20.2613 33.7775 21.1556 33.71 22.0481 33.6319C22.3388 33.6062 22.5781 33.6825 22.7963 33.8794C23.3469 34.3756 23.9063 34.8619 24.4644 35.35C24.8394 35.6775 25.17 35.675 25.5456 35.3456C26.0794 34.8775 26.6206 34.4169 27.1413 33.9344C27.41 33.685 27.6956 33.6031 28.0563 33.6388C28.9556 33.7269 29.8581 33.7919 30.76 33.855C31.2831 33.8912 31.5219 33.7031 31.6438 33.195C31.8281 32.4294 32.0219 31.6656 32.1944 30.8969C32.2613 30.5988 32.4169 30.3981 32.6756 30.2456C33.4881 29.7675 34.2944 29.2781 35.1031 28.7931C35.5856 28.5031 35.6769 28.2213 35.46 27.6944C35.1419 26.9231 34.8288 26.15 34.5031 25.3819C34.3888 25.1119 34.3906 24.8619 34.505 24.5925C34.8281 23.8319 35.1375 23.0656 35.4519 22.3013C35.68 21.7469 35.5931 21.4794 35.0788 21.17C34.2706 20.6838 33.4631 20.1969 32.6513 19.7175C32.4069 19.5731 32.2631 19.3787 32.1994 19.0994C32.0213 18.3162 31.8275 17.5363 31.6381 16.7556C31.5294 16.3075 31.2613 16.0887 30.8481 16.1194C29.8531 16.1925 28.8581 16.2675 27.8638 16.3494C27.6144 16.37 27.4063 16.3031 27.2206 16.1375C26.6731 15.6494 26.1225 15.165 25.5738 14.6781C25.1669 14.3169 24.845 14.3138 24.44 14.6712C23.89 15.1562 23.3394 15.6413 22.7925 16.13C22.6006 16.3013 22.3875 16.3706 22.1288 16.3494C21.2038 16.2706 20.2781 16.2044 19.4763 16.1431Z" fill="#444444" />
                        <path d="M24.9906 32.7325C20.7375 32.7269 17.2738 29.2444 17.2831 24.9837C17.2925 20.7206 20.7681 17.2556 25.0225 17.2675C29.2675 17.2794 32.7219 20.7519 32.7188 25.0037C32.7163 29.2656 29.2438 32.7381 24.9906 32.7325ZM18.6863 24.9969C18.6844 28.4769 21.515 31.3212 24.9856 31.3269C28.4706 31.3325 31.3138 28.4925 31.3156 25.0031C31.3175 21.5231 28.4863 18.6794 25.015 18.6737C21.5288 18.6681 18.6881 21.5062 18.6863 24.9969Z" fill="#444444" />
                        <path d="M24.275 26.1281C24.3756 26.0319 24.4375 25.975 24.4975 25.915C25.6444 24.7662 26.7925 23.6181 27.9369 22.4669C28.13 22.2725 28.3456 22.1512 28.6244 22.1994C29.1312 22.2869 29.3706 22.8569 29.0831 23.285C29.0312 23.3619 28.9637 23.4294 28.8981 23.495C27.57 24.8269 26.2412 26.1581 24.9125 27.4894C24.4806 27.9219 24.1187 27.9219 23.6881 27.4912C22.8056 26.6075 21.9219 25.7256 21.0425 24.8387C20.6162 24.4081 20.7675 23.7637 21.325 23.6181C21.6106 23.5437 21.8419 23.65 22.0425 23.8519C22.7256 24.5375 23.4106 25.2212 24.0931 25.9069C24.1537 25.9681 24.2025 26.0394 24.275 26.1281Z" fill="#444444" />
                    </g>
                    <defs>
                        <clipPath id="clip0_108_2003">
                            <rect width="23.95" height="24" fill="white" transform="translate(13.025 13)" />
                        </clipPath>
                    </defs>
                </svg>

                <div className="grid pl-4 text-justify float-left w-full">
                    <p className="font-semibold text-base w-full">Account Approval</p>
                    <p className="font-medium text-base color-[#8B8F97] w-full">You need to verify your identity. Please complete your profile.</p>
                </div>
                <div className="flex mr-2 arrow">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </div>
            </Link>


            {/* complete account approval */}
            <div onClick={toggleModal} style={{ display: 'none' }} id="complete-approval" className="incomplete-profile-steps complete bg-[#E8F3EF] rounded-lg items-center cursor-pointer my-3">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="50" rx="5" fill="#00C52A" />
                    <path d="M31.71 20.21C31.617 20.1163 31.5064 20.0419 31.3846 19.9911C31.2627 19.9403 31.132 19.9142 31 19.9142C30.868 19.9142 30.7373 19.9403 30.6154 19.9911C30.4936 20.0419 30.383 20.1163 30.29 20.21L22.84 27.67L19.71 24.53C19.6135 24.4367 19.4995 24.3634 19.3747 24.3142C19.2498 24.265 19.1165 24.2409 18.9823 24.2432C18.8482 24.2455 18.7157 24.2743 18.5927 24.3278C18.4696 24.3812 18.3582 24.4585 18.265 24.555C18.1718 24.6515 18.0985 24.7654 18.0493 24.8903C18.0001 25.0152 17.9759 25.1485 17.9782 25.2827C17.9806 25.4168 18.0093 25.5493 18.0628 25.6723C18.1163 25.7954 18.1935 25.9067 18.29 26L22.13 29.84C22.223 29.9337 22.3336 30.0081 22.4554 30.0589C22.5773 30.1096 22.708 30.1358 22.84 30.1358C22.972 30.1358 23.1027 30.1096 23.2246 30.0589C23.3464 30.0081 23.457 29.9337 23.55 29.84L31.71 21.68C31.8115 21.5863 31.8925 21.4727 31.9479 21.3462C32.0033 21.2197 32.0319 21.0831 32.0319 20.945C32.0319 20.8069 32.0033 20.6703 31.9479 20.5438C31.8925 20.4173 31.8115 20.3036 31.71 20.21Z" fill="white" />
                </svg>

                <div className="grid pl-4 text-justify float-left w-full">
                    <p className="font-semibold text-base w-full">Account Approval</p>
                    <p className="font-medium text-base color-[#8B8F97] w-full">You need to verify your identity. Please complete your profile.</p>
                </div>
                <div className="flex mr-2 arrow">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </div>
            </div>

        </>
    );
}



export default HomeIncomplete;