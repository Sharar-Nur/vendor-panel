import React, {useContext, Suspense, useEffect, useState, useTransition} from "react";
import moment from 'moment';
import $ from "jquery";

// Context
import UserBasicInfoQRContext from '../../components/context/UserBasicInfoQRContext';
import UserBasicInfoContext from "../../components/context/UserBasicInfoContext";
import PostLoginGetApi from "../../components/api/PostLoginGetApi";
import PostLoginPostApi from "../../components/api/PostLoginPostApi";



// QR Code
const QRCode = React.lazy(()=>{return import("qrcode.react")});

const downloadQR = (name="payment-qr") => {
    const canvas = document.getElementById("qr-code");
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = name+".png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}


const Notifications = () => {

    const UserBasicInfoQR = useContext(UserBasicInfoQRContext);
    const UserBasicInfo = useContext(UserBasicInfoContext);

    
    const [isPending, startTransition] = useTransition();

    const [reqParam, setReqParam] = useState({
        page: 1
    });


    const [notificationList, setNotificationList] = useState([]);
    useEffect( () => {
        PostLoginGetApi("user/notifications", reqParam).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if(response["status"]===1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if(responseData["code"] === 200) {
                    setNotificationList(responseData["data"]);
                }
            }
        });
    },[reqParam]);


    useEffect(()=>{
        startTransition(() => {
            setTimeout(()=>{
                PostLoginPostApi("user/notification/read-all").catch((error) => {
                    console.log(error);
                });
            }, 1500);
        });
    },[]);

    const pagination = (next=1) => {
        if(next === 1) {
            setReqParam({page: reqParam.page+1});
            return; 
        }

        if(reqParam.page > 1) {
            setReqParam({page: reqParam.page-1});
            return;
        }
        
        setReqParam({page: 1});
        return;
    }


    return (
        <div className="custom-container w-full float-left px-8 pt-5 pb-20 flex font-montserrat">

            {/* Left Section */}
            <div className="custom-container-left custom-scroll-auto float-left w-4/5 pb-10 pr-8 text-justify" style={{ boxShadow: "3px 0 0px 0px rgb(0 0 0 / 1%)" }}>
                <h6 className="text-xl font-medium">Here’s your notification lists</h6>
                

                {/* Notification Lists */}
                <div className="flow-root mt-2 py-3" style={{borderTop: "1px dotted #F5F5F5"}}>

                    <ul className="notification-list">

                        {(notificationList?.notifications?.length === 0) &&
                            <h5 className="pb-1 text-base font-semibold">You have no notifications yet.</h5>
                        } 

                        {/* <h5 className="pb-1 text-lg font-semibold">Today</h5> */}
                        {(notificationList?.notifications !== undefined ) && notificationList.notifications?.map((val, key) => 
                            <li key={key} className={`px-3 py-1 sm:py-2 rounded-lg cursor-pointer border ${(val?.read_at === null) && `unread`}`}>
                                {/* <div className="flex items-center space-x-4 pl-2" style={{borderLeft: `2px solid ${(val?.title_color)}`}}> */}
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <img className="w-8 h-8 rounded-full" src={val?.icon} alt={val?.title} title={val?.title} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-medium text-gray-900 truncate dark:text-white">
                                            {val?.title} 
                                        </p>
                                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                            {val?.sub_title} /
                                            { (val?.description.includes("Merchant Payment"))?" via Merchant Payment" :
                                                <> {val?.description}</>
                                            }
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-sm font-medium text-gray-900 dark:text-white" title={val?.created_at}>
                                        {moment(val?.created_at).calendar()}
                                    </div>
                                </div>
                            </li>
                        )}

                        {(notificationList?.notifications !== undefined ) && (notificationList.notifications?.["has_next_page"]===true) && 
                            <button onClick={()=>pagination(1)} className="custom-btn float-right mt-5">
                                Next Page
                            </button>
                        }

                        {(reqParam.page > 1) && 
                            <button onClick={()=>pagination(0)} className="custom-btn float-right mt-5 mr-2">
                                Previous Page
                            </button>
                        }
                    </ul>
                </div>
            </div>



            {/* Right Section */}
            <div className="custom-container-right float-right w-1/5 pl-2 custom-scroll-auto pb-10 flex flex-col items-center">
                <p className="text-xl pb-3">Personalized QR code</p>
                <Suspense fallback="loading...">
                    {UserBasicInfoQR?.user?.qr_code_text !== undefined ? <QRCode id="qr-code" value={UserBasicInfoQR.user.qr_code_text} size={150} renderAs="canvas" /> : "Loading.."}
                    
                    <button onClick={()=>downloadQR(UserBasicInfo?.name.toString().replace(" ","-"))} className='mt-3 mb-2 bg-black text-sm text-white hover:bg-white font-medium hover:text-black py-1 px-2 border border-black hover:border-black-500 rounded'>
                        Download QR
                    </button>
                </Suspense>
                

                <div className="box-full w-full mt-4 bg-[#F5F5F5] text-[#222222] text-justify rounded-[5px] px-5 py-3" title="Business Name">
                    <p className="border-b-2 font-semibold">Name</p>
                    <p className="font-medium text-base pt-1 mt-1">{UserBasicInfo?.name}</p>
                </div>

                <div className="box-full w-full mt-4 bg-[#F5F5F5] text-[#222222] text-justify rounded-[5px] px-5 py-3" title="Phone Number">
                    <p className="border-b-2 font-semibold">Mobile Number</p>
                    <p className="font-medium text-base pt-1 mt-1">{UserBasicInfoQR?.user?.mobile_number}</p>
                </div>

                {(UserBasicInfoQR?.business_info?.bussiness_address[0] !== undefined) &&
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

            </div>



            <style>{`
                .notification-list li:not(:first-child) {
                    margin: 10px auto;
                }

                .notification-list li:hover {
                    background-color: rgba(0, 139, 34, 0.04);
                }

                .notification-list li.unread {
                    background-color: rgba(0, 139, 34, 0.06);
                    border: 0.5px solid rgba(194, 227, 202, 1);
                }
            `}</style>

        </div>

    );
}



export default Notifications;