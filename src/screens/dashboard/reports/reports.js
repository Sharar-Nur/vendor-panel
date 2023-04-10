import React, { Suspense, useState } from 'react';
import $ from "jquery";
import SalesReports from './sales-reports';



const Reports = () => {


    const [currentTab, setCurrentTab] = useState("sales-summary");
    const handleTab = (tabId, event) => {
        $(".tablinks").removeClass("current");
        $(event.target).addClass("current");
        setCurrentTab(tabId);
    }



    return (
        <div className=" px-8 py-10 pt-4 block font-montserrat">

            <div className="tab ">
                <button className="tablinks current" onClick={(event) => handleTab("sales-summary", event)}>Sales Summary</button>
            </div>

            <div className='tabcontentbody py-3 px-0'>
                <div id="view-profile" className="tabcontent" style={{ display: "block", paddingInline: "0px" }}>
                    <Suspense fallback="Loading...">
                        {(() => {
                            switch (currentTab) {
                                case "sales-summary":
                                    return <SalesReports></SalesReports>;
                                default:
                                    return <h1>No page found.</h1>;
                            }
                        })()}
                    </Suspense>
                </div>
            </div>


        </div>
    )
}


export default Reports;
