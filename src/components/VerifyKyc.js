import React, {useContext, Suspense } from "react";
import {Link} from "react-router-dom";

// Context
import UserBasicInfoQRContext from "./context/UserBasicInfoQRContext";
import UserBasicInfoContext from "./context/UserBasicInfoContext";

// Modal Window
import ModalWindow from "./ModalWindow";


// QR Code
const QRCode = React.lazy(() => { return import("qrcode.react") });


const VerifyKyc = () => {

    const UserBasicInfoQR = useContext(UserBasicInfoQRContext);
    const UserBasicInfo = useContext(UserBasicInfoContext);



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




    return (
        <Suspense fallback="">
        <div className="custom-container w-full float-left pr-8 pl-4 pt-5 pb-20 flex font-montserrat">

            <div className="custom-container-left custom-scroll-auto float-left w-4/5 pb-10 text-justify p-6 mb-7 rounded-md" style={{ background: "rgb(245, 245, 245, .8)",boxShadow: "3px 0 0px 0px rgb(0 0 0 / 1%)" }}>
                <ModalWindow 
                title="KYB Pending" 
                message={
                    <>
                        If you submitted all the required documents from home page. Please wait up to 48 hours to approve your account.
                    </>
                }>
                </ModalWindow>
            </div>


            <div className="custom-container-right float-right w-1/5 pl-2 custom-scroll-auto pb-10 flex flex-col items-center">

                <p className="text-xl pb-3">Personalized QR CODE</p>

                <Suspense fallback="loading...">
                    {UserBasicInfoQR?.user?.qr_code_text !== undefined ? <QRCode id="qr-code" value={UserBasicInfoQR.user.qr_code_text} size={150} renderAs="canvas" /> : "Loading.."}

                    <button onClick={() => downloadQR(UserBasicInfo?.name.toString().replace(" ", "-"))} className='mt-3 mb-2 bg-black text-sm text-white hover:bg-white font-medium hover:text-black py-1 px-2 border border-black hover:border-black-500 rounded'>
                        Download QR
                    </button>
                </Suspense>



                <div className="box-full w-full mt-4 min-h-[75px] bg-[#F5F5F5] text-[#222222] text-justify rounded-[5px] px-5 py-3" title="Business Name">
                    
                    <p className="border-b-2 font-semibold">Name</p>
                    <p className="font-medium text-base pt-1 mt-1">{UserBasicInfo?.name}</p>
                </div>

                <div className="box-full w-full mt-4 min-h-[75px] bg-[#F5F5F5] text-[#222222] text-justify rounded-[5px] px-5 py-3" title="Phone Number">
                    
                    <p className="border-b-2 font-semibold">Mobile Number</p>
                    <p className="font-medium text-base pt-1 mt-1">{UserBasicInfoQR?.user?.mobile_number}</p>
                </div>


                {(UserBasicInfoQR?.business_info?.bussiness_address[0] !== undefined) &&
                <div className="box-full w-full mt-4 bg-[#F5F5F5] text-[#222222] text-justify rounded-[5px] px-5 py-3" title="Business Address">
                    <p className="border-b-2 font-semibold">Address</p>
                    <p className="font-medium text-base  pt-1 mt-1">{UserBasicInfoQR?.business_info?.bussiness_address[0]?.address}, {UserBasicInfoQR?.business_info?.bussiness_address[0]?.thana?.name}, {UserBasicInfoQR?.business_info?.bussiness_address[0]?.district?.name} - {UserBasicInfoQR?.business_info?.bussiness_address[0]?.post_code}, {UserBasicInfoQR?.business_info?.bussiness_address[0]?.division?.name}</p>
                </div>
                }


                {UserBasicInfo?.owner_name ?
                    (
                        <div className="box-full w-full mt-4 min-h-[75px] bg-[#F5F5F5] text-[#222222] text-justify rounded-[5px] px-5 py-3" title="Owner Name">
                            
                            <p className="border-b-2 font-semibold">Owner Name</p>

                            <p className=" font-medium text-base pt-1 mt-1">{UserBasicInfo?.owner_name}</p>
                        </div>
                    ) : ""}

                

            </div>
        </div>
        </Suspense>
    );
}



export default VerifyKyc;