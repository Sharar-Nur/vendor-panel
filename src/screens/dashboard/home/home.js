import React, { useContext, Suspense, useEffect, useState } from "react";

// Context
import UserBasicInfoQRContext from '../../../components/context/UserBasicInfoQRContext';
import UserBasicInfoContext from "../../../components/context/UserBasicInfoContext";
import IncompleteProfileStepsContext from "../../../components/context/IncompleteProfileStepsContext";


// Pages
import HomeComplete from "./home-complete";
import HomeIncomplete from "./home-incomplete";
import { Link, useLocation, useNavigate } from "react-router-dom";


// Icons
import NameIcon from "./../../../assets/icons/name.svg";
import phoneIcon from "./../../../assets/icons/phone.svg";
import emailIcon from "./../../../assets/icons/email.svg";
import PostLoginGetApi from "../../../components/api/PostLoginGetApi";

// QR Code
const QRCode = React.lazy(() => { return import("qrcode.react") });



const Home = () => {

    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);


    const UserBasicInfoQR = useContext(UserBasicInfoQRContext);
    const UserBasicInfo = useContext(UserBasicInfoContext);
    const IncompleteProfileSteps = useContext(IncompleteProfileStepsContext);
    let { state } = useLocation();

    const [kamInfo, setKamInfo] = useState({
        isLoad: false,
        name: "",
        email: "",
        phone: ""
    });

    const downloadQR = (name = "payment-qr") => {
        const canvas = document.getElementById("qr-code");
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = name + ".png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    if (state?.isReload !== undefined) {
        window.history.replaceState({}, "");
        window.location.reload();
    }

    useEffect(() => {
        setIsProfileComplete(IncompleteProfileSteps?.value?.isProfileComplete);
        setIsEmailVerified(IncompleteProfileSteps?.value?.isEmailVerified);
    }, [IncompleteProfileSteps?.value?.isProfileComplete, IncompleteProfileSteps?.value?.isEmailVerified]);


    // KAM Info
    useEffect(() => {

        PostLoginGetApi("api/v1/kam-details", {}, 0).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response.status === 1) {
                let responseData = JSON.stringify(response.data);
                responseData = JSON.parse(responseData);

                if (responseData.code === 200) {
                    setKamInfo({ isLoad: true, name: responseData.data?.[0]["name"], email: responseData.data?.[0]["email_address"], phone: responseData.data?.[0]["mobile_no"] });
                }
            }

        }).catch((err) => {
            console.log(err);
        });

    }, []);

    return (
        <div className="custom-container w-full float-left px-8 pt-5 pb-20 flex font-montserrat">

            {/* Left Section */}
            <div className="custom-container-left custom-scroll-auto float-left w-4/5 pb-10 pr-3 text-justify" style={{ boxShadow: "3px 0 0px 0px rgb(0 0 0 / 1%)" }}>

                {(() => {
                    switch (isProfileComplete) {
                        case true:
                            return <HomeComplete emailVerified={isEmailVerified}></HomeComplete>;
                        case false:
                            return <HomeIncomplete emailVerified={isEmailVerified}></HomeIncomplete>;
                        default:
                            return (
                                <h1 className="block text-center">
                                    A problem has encountered with your deshi merchant account.<br /> Please <Link className="font-semibold" to="/dashboard/account-settings">contact support</Link> or <Link className="font-semibold" to="/dashboard/logout">login again</Link>.
                                </h1>
                            );
                    }
                })()}

            </div>

            {/* Right Section */}
            <div className="custom-container-right float-right w-1/5 pl-2 custom-scroll-auto pb-10 flex flex-col items-center">


                {/* <div className="box-full w-full min-h-[54px] bg-[#F5F5F5] text-[#222222] text-justify rounded-[5px] px-5 py-3 mb-5">
                    <svg className="display-revert float-left" width="30" height="30" viewBox="0 0 24 24" fill="none" strokeWidth={2} xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.56" d="M3.88426 6.61304C3.88351 6.47028 3.92643 6.33068 4.00726 6.21301C4.8965 4.91778 6.08669 3.85768 7.47573 3.12353C8.86476 2.38939 10.4112 2.00317 11.9823 1.99805C14.5628 2.04781 17.0226 3.10062 18.84 4.93323C20.6575 6.76584 21.6899 9.23419 21.7183 11.8151L20.3293 11.8151C20.2986 9.60544 19.4112 7.49402 17.854 5.92603C16.2968 4.35803 14.1916 3.45596 11.9823 3.41003C10.6357 3.41487 9.31033 3.74629 8.11989 4.37573C6.92945 5.00518 5.90942 5.91388 5.14726 7.02405C5.08605 7.11419 5.00422 7.18842 4.90857 7.2406C4.81291 7.29278 4.70619 7.32144 4.59726 7.3241C4.49011 7.32717 4.38377 7.30456 4.28707 7.2583C4.19038 7.21204 4.10611 7.14346 4.04126 7.0581L4.03326 7.04809C3.93712 6.92342 3.88475 6.77047 3.88426 6.61304Z" fill="black" />
                        <path opacity="0.56" d="M2.28804 12.1816L3.67704 12.1816C3.70617 14.3917 4.59315 16.504 6.15064 18.0723C7.70813 19.6406 9.8142 20.5422 12.024 20.5867C13.3707 20.5821 14.6961 20.2508 15.8866 19.6213C17.0771 18.9919 18.0971 18.083 18.859 16.9727C18.9203 16.8826 19.0022 16.8084 19.0978 16.7562C19.1934 16.7041 19.3001 16.6753 19.409 16.6726C19.5162 16.6696 19.6225 16.6923 19.7192 16.7385C19.8159 16.7848 19.9001 16.8533 19.965 16.9386L19.973 16.9486C20.0694 17.0736 20.1218 17.2269 20.122 17.3846C20.1233 17.5275 20.0803 17.6672 19.999 17.7847C19.1102 19.0808 17.9201 20.1418 16.5308 20.8767C15.1415 21.6116 13.5947 21.9983 12.023 22.0037C9.44218 21.9554 6.98172 20.9033 5.16393 19.0706C3.34615 17.2378 2.31417 14.7688 2.28704 12.1876L2.28804 12.1816Z" fill="black" />
                        <path opacity="0.72" d="M22.961 12.1904L21.216 14.7854C21.1948 14.8176 21.1659 14.844 21.132 14.8623C21.098 14.8805 21.0601 14.8901 21.0215 14.8901C20.983 14.8901 20.945 14.8805 20.9111 14.8623C20.8771 14.844 20.8483 14.8176 20.827 14.7854L19.083 12.1904C19.0589 12.1547 19.0449 12.1131 19.0425 12.0701C19.04 12.027 19.0492 11.9841 19.0691 11.9458C19.0889 11.9076 19.1187 11.8754 19.1553 11.8526C19.1919 11.8298 19.2339 11.8173 19.277 11.8164L22.767 11.8164C22.8101 11.8173 22.8522 11.8298 22.8888 11.8526C22.9254 11.8754 22.9551 11.9076 22.975 11.9458C22.9948 11.9841 23.004 12.027 23.0016 12.0701C22.9991 12.1131 22.9851 12.1547 22.961 12.1904Z" fill="black" />
                        <path opacity="0.72" d="M1.04522 11.8071L2.79022 9.21213C2.81144 9.17995 2.84032 9.15354 2.87426 9.13527C2.90821 9.11699 2.94615 9.10742 2.9847 9.10742C3.02326 9.10742 3.0612 9.11699 3.09515 9.13527C3.12909 9.15354 3.158 9.17995 3.17922 9.21213L4.92422 11.8071C4.94856 11.8429 4.96279 11.8846 4.96539 11.9278C4.96799 11.9709 4.95887 12.014 4.93899 12.0525C4.91911 12.0909 4.88919 12.1232 4.85244 12.146C4.81569 12.1689 4.77347 12.1813 4.73022 12.1821L1.24023 12.1821C1.19689 12.1815 1.1545 12.1692 1.11761 12.1464C1.08072 12.1237 1.05069 12.0913 1.03069 12.0529C1.0107 12.0144 1.0015 11.9713 1.00405 11.928C1.00661 11.8847 1.02084 11.843 1.04522 11.8071Z" fill="black" />
                        <path opacity="0.88" d="M16.5412 15.5898H7.45445C7.2034 15.5898 7 15.7932 7 16.0445C7 16.2954 7.2034 16.4988 7.45445 16.4988H16.541C16.792 16.4988 16.9954 16.2954 16.9954 16.0445C16.9952 15.7932 16.7918 15.5898 16.5412 15.5898Z" fill="black" />
                        <path opacity="0.8" d="M8.02232 14.6816C7.77127 14.6816 7.56787 14.8851 7.56787 15.1363C7.56787 15.3875 7.77127 15.5912 8.02232 15.5912H15.9731C16.2242 15.5912 16.4276 15.3875 16.4276 15.1363C16.4276 14.8851 16.2242 14.6816 15.9731 14.6816H15.8597L15.8597 9.90933H15.9731C16.0989 9.90933 16.2002 9.80758 16.2002 9.6822C16.2002 9.55683 16.0985 9.45508 15.9731 9.45508H8.02233C7.8968 9.45508 7.79532 9.55683 7.79532 9.6822C7.79532 9.80758 7.89701 9.90933 8.02233 9.90933H8.13594L8.13594 14.6814L8.02232 14.6816ZM14.9508 9.90933L14.9508 14.6814H13.5879L13.5879 9.90933H14.9508ZM12.679 9.90933L12.679 14.6814H11.316L11.3161 9.90933H12.679ZM9.04442 9.90933H10.4074L10.4074 14.6814H9.04442L9.04442 9.90933Z" fill="black" />
                        <path d="M7.45446 9.45443H16.541C16.5425 9.45443 16.5442 9.45443 16.5454 9.45443C16.7967 9.45443 16.9999 9.25094 16.9999 8.99976C16.9999 8.80009 16.8714 8.63087 16.6929 8.56956L12.1845 6.53991C12.066 6.4867 11.9305 6.4867 11.8118 6.53991L7.26809 8.58531C7.07256 8.67344 6.96512 8.88588 7.01022 9.09533C7.05511 9.30479 7.24021 9.45443 7.45446 9.45443Z" fill="black" />
                    </svg>

                    <Link to={"/dashboard/instant-transfer/bank-lists"} className="float-left font-semibold pt-1 text-base pl-3">
                        Instant Transfer
                    </Link>
                </div> */}


                {/* <p className="text-xl pb-3">Personalized QR code</p> */}
                {/* <Suspense fallback="loading...">
                    {UserBasicInfoQR?.user?.qr_code_text !== undefined ? <QRCode id="qr-code" value={UserBasicInfoQR.user.qr_code_text} size={150} renderAs="canvas" /> : "Loading.."}

                    <button onClick={() => downloadQR(UserBasicInfo?.name.toString().replace(" ", "-"))} className='mt-3 mb-2 bg-black text-sm text-white hover:bg-white font-medium hover:text-black py-1 px-4 border border-black hover:border-black-500 rounded'>
                        Download Personalized QR
                    </button>
                </Suspense> */}


                <div className="box-full w-full  bg-[#F5F5F5] text-[#222222] text-justify rounded-[5px] px-5 py-3" title="Business Name">
                    <p className="border-b-2 font-semibold">Name</p>
                    <p className="font-medium text-base pt-1 mt-1">{UserBasicInfo?.name}</p>
                </div>

                <div className="box-full w-full mt-4 bg-[#F5F5F5] text-[#222222] text-justify rounded-[5px] px-5 py-3" title="Phone Number">
                    <p className="border-b-2 font-semibold">Mobile Number</p>
                    <p className="font-medium text-base pt-1 mt-1">{UserBasicInfoQR?.user?.mobile_number}</p>
                </div>

                {(UserBasicInfoQR?.business_info?.bussiness_address[0] !== undefined && UserBasicInfoQR?.business_info?.bussiness_address[0] !== "") &&
                    <div className="box-full w-full mt-4 bg-[#F5F5F5] text-[#222222] text-justify rounded-[5px] px-5 py-3" title="Business Address">
                        <p className="border-b-2 font-semibold">Address</p>
                        <p className="font-medium text-base  pt-1 mt-1 text-left">{UserBasicInfoQR?.business_info?.bussiness_address[0]?.address}, {UserBasicInfoQR?.business_info?.bussiness_address[0]?.thana?.name}, {UserBasicInfoQR?.business_info?.bussiness_address[0]?.district?.name} - {UserBasicInfoQR?.business_info?.bussiness_address[0]?.post_code}, {UserBasicInfoQR?.business_info?.bussiness_address[0]?.division?.name}</p>
                    </div>
                }

                {UserBasicInfo?.owner_name && (
                    <div className="box-full w-full mt-4 bg-[#F5F5F5] text-[#222222] text-justify rounded-[5px] px-5 py-3" title="Owner Name">
                        <p className="border-b-2 font-semibold">Owner Name</p>
                        <p className=" font-medium text-base pt-1 mt-1">{UserBasicInfo.owner_name}</p>
                    </div>
                )}


                <div className="box-full w-full mt-4 bg-[#F5F5F5] text-[#222222] text-justify rounded-[5px] px-5 py-3 align-middle" title="Key Account Manager">
                    <p className="border-b-2 font-semibold">KAM Info</p>

                    {(kamInfo.isLoad === true) ?
                        <>
                            <p className="font-medium text-base pt-1 mt-1">
                                <img src={NameIcon} alt="KAM Name" className="h-5 float-left w-5 mt-0.5" />
                                <span className="ml-4">{kamInfo.name}</span>
                            </p>
                            <a href={`mailto:${kamInfo.email}`} className="font-medium text-base block mt-2">
                                <img src={emailIcon} alt="KAM Email" className="h-6 float-left w-6 mt-0.5" />
                                <span className="ml-3">{kamInfo.email}</span>
                            </a>
                            <a href={`tel:${kamInfo.phone}`} className="font-medium text-base block mt-2">
                                <img src={phoneIcon} alt="KAM Phone" className="h-6 float-left w-6 mt-0.5" />
                                <span className="ml-3">{kamInfo.phone}</span>
                            </a>
                        </>
                        :
                        <>
                            <p className="font-medium text-base pt-1 mt-1">No KAM Assigned Yet.</p>
                        </>
                    }
                </div>

            </div>




        </div>

    );
}



export default Home;