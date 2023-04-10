import React, { useState } from 'react';
import $ from "jquery";
import { Suspense } from 'react';
import AllOrders from './AllOrders';
import OrderSummary from './OrderSummary';
import VerifyOtp from './VerifyOtp';

const Orders = () => {
    const [currentTab, setCurrentTab] = useState("orders");

    const handleTab = (tabId, event) => {
        $(".tablinks").removeClass("current");
        $(event.target).addClass("current");
        setCurrentTab(tabId);
    }




    return (
        <div className='custom-container w-full float-left px-8 py-10 pt-4 block font-montserrat custom-scroll-auto mb-20'>

            {/* TAB SWITCHER */}
            <div className="tab w-full">
                <button className="tablinks current" onClick={(event) => handleTab("orders", event)}>Orders</button>
                <button className="tablinks" onClick={(event) => handleTab("summary", event)}>Summary</button>
            </div>

            <div className='tabcontentbody py-3 px-0'>
                <div id="view-profile" className="tabcontent" style={{ display: "block", paddingLeft: "0px", paddingRight: "0px" }}>
                    <Suspense fallback="Loading...">

                        {(() => {
                            switch (currentTab) {
                                case "orders":
                                    return <AllOrders></AllOrders>;
                                case "summary":
                                    return <OrderSummary></OrderSummary>;
                                default:
                                    return <h1>Sorry ! No page found.</h1>
                            }
                        })()}

                    </Suspense>

                </div>
            </div>

            <style>{`
                .custom-scroll-auto { 
                    overflow-x: hidden;
                }

                .tab button:hover::after, .tab button.current::after { 
                    width: 120% !important;
                    margin-left: -10% !important;
                }
                `}</style>
        </div>



    );
};

export default Orders;