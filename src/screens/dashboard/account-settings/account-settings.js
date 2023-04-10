import React, { Suspense, useContext, useEffect, useState } from 'react';
import $ from "jquery";


// Context
import UserBasicInfoQRContext from '../../../components/context/UserBasicInfoQRContext';

// Import
import ViewProfile from './view-profile';
import ForgetPin from './forget-pin';
import ChangePin from './change-pin';
import ChangePassword from './change-password';
import ContactUs from './contact-us';
import AutoSettlement from './auto-settlement';




export default function AccountSettings() {

    const [pinTabName, setPinTabName] = useState("Forgot PIN");
    const [currentTab, setCurrentTab] = useState("view-profile");

    const handleTab = (tabId, event) => {
        $(".tablinks").removeClass("current");
        $(event.target).addClass("current");
        setCurrentTab(tabId);
    }

    const UserBasicInfoContextData = useContext(UserBasicInfoQRContext);


    useEffect(() => {

        if (!UserBasicInfoContextData?.user?.user_has_pin) {
            setPinTabName("Set PIN");
            $(".change-pin").addClass('hidden');
            return;
        }
        if (UserBasicInfoContextData?.user?.user_has_pin) {
            setPinTabName("Forgot PIN");
            $(".change-pin").removeClass('hidden');
            return;
        }

        // if pin has been expire
        if (UserBasicInfoContextData?.user?.is_pin_expired === true) {
            setPinTabName("Set New PIN");
            return;
        }


        // check if pin not set
        setPinTabName("Set New PIN ?");

    }, [UserBasicInfoContextData]);


    return (
        <div className="custom-container w-full float-left px-8 py-10 pt-4 block font-montserrat custom-scroll-auto mb-20">

            <div className="tab w-full">
                <button className="tablinks current" onClick={(event) => handleTab("view-profile", event)}>Profile Information</button>
                <button className="tablinks" onClick={(event) => handleTab("forget-pin", event)}>{pinTabName}</button>
                <button className="tablinks change-pin " onClick={(event) => handleTab("change-pin", event)}>Change PIN</button>
                <button className="tablinks" onClick={(event) => handleTab("change-password", event)}>Change Password</button>
                {/* <button className="tablinks" onClick={(event) => handleTab("auto-settlement", event)}>Auto Settlement</button> */}
                <button className="tablinks" onClick={(event) => handleTab("contact-us", event)}>Contact Us</button>
            </div>

            <div className='tabcontentbody py-3'>
                <div id="view-profile" className="tabcontent" style={{ display: "block", paddingLeft: "0px" }}>
                    <Suspense fallback="Loading...">


                        {(() => {
                            switch (currentTab) {
                                case "view-profile":
                                    return <ViewProfile></ViewProfile>
                                case "forget-pin":
                                    return <ForgetPin title={pinTabName}></ForgetPin>
                                case "change-pin":
                                    return <ChangePin></ChangePin>
                                case "change-password":
                                    return <ChangePassword></ChangePassword>
                                    {/* case "auto-settlement":
                                    return <AutoSettlement></AutoSettlement> */}
                                case "contact-us":
                                    return <ContactUs></ContactUs>
                                default:
                                    return <h1>No page found.</h1>
                            }
                        })()}



                    </Suspense>
                </div>
            </div>


        </div>
    )

}
