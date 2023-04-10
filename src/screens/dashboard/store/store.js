import React, { Suspense, useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import $ from "jquery";
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';

import AllItems from './all-items';
import StoreItems from './store-items';
import StoreLocalItems from './store-local-item';
import StoreCategory from './store-category';
import StoreDiscount from './store-discount';
import StoreSettings from './store-settings';
import RequestedItems from './requested-items';
import moment from 'moment';



export default function Store() {

    const [salesSummary, setSalesSummary] = useState({});
    const [currentTab, setCurrentTab] = useState("AllItems");

    const handleTab = (tabId, event) => {
        $(".tablinks").removeClass("current");
        $(event.target).addClass("current");
        setCurrentTab(tabId);
    }

    const filterClick = () => {
        $("#filter-toggle-icon").toggleClass("rotate-180");
        $(".custom-btn.filter").toggleClass("active");

        $("#filter-div").toggleClass("need-without-shadow");
        $("#filter-div").toggleClass("no-need-without-shadow");
    }

    //parent function
    const myParentFunction = (tabName) => {
        // console.log('parent rendering....')
        // setCurrentTab(tabName);
    }


    // Get Summery
    useEffect(() => {

        var today = moment(new Date()).format("YYYY-MM-DD");

        PostLoginGetApi("shop/item/sales/report", { date_from: "2023-01-01", date_to: today }).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    setSalesSummary(responseData["data"]);
                }
            }

        }).catch((err) => {
            console.log(err);
        });
    }, []);



    const { state } = useLocation();
    useEffect(() => {
        if (state?.tab !== null && state?.tab !== undefined && state?.tab !== "") {
            if (state?.tab === "store-category") {
                $(".tablinks").eq(4).trigger("click");
            }
            if (state?.tab === "discount") {
                $(".tablinks").eq(5).trigger("click");
            }
        }
        if (state?.from?.from !== null && state?.from?.from !== undefined && state?.from?.from !== "") {

            if (state?.from?.from === "localItems") {
                $(".tablinks").eq(1).trigger("click");
            }
            if (state?.from?.from === "items") {
                $(".tablinks").eq(2).trigger("click");
            }
            if (state?.from?.from === "RequestedItems") {
                $(".tablinks").eq(3).trigger("click");
            }
        }
    }, [state]);


    return (

        <>
            <div className="custom-container w-full float-left px-8 py-10 pt-4 block font-montserrat custom-scroll-auto mb-20 ">


                {/* TAB SWITCHER */}
                <div className="tab w-full">
                    <button className="tablinks current" onClick={(event) => handleTab("AllItems", event)}>All Items</button>
                    <button className="tablinks" onClick={(event) => handleTab("localItems", event)}>Local Items</button>
                    <button className="tablinks" onClick={(event) => handleTab("items", event)}>Store Items</button>
                    <button className="tablinks" onClick={(event) => handleTab("RequestedItems", event)}>Requested Items</button>

                    <button className="tablinks" onClick={(event) => handleTab("categories", event)}>All Categories</button>
                    <button className="tablinks" onClick={(event) => handleTab("discount", event)}>Discount</button>
                    <button className="tablinks" onClick={(event) => handleTab("settings-and-timing", event)}>Store Settings & Timing</button>
                </div>

                <div className='tabcontentbody py-3 px-0'>
                    <div id="view-profile" className="tabcontent" style={{ display: "block", paddingLeft: "0px", paddingRight: "0px" }}>
                        <Suspense fallback="Loading...">

                            {(() => {
                                switch (currentTab) {
                                    case "AllItems":
                                        return <AllItems props={salesSummary} parentFunc={myParentFunction}></AllItems>;
                                    case "localItems":
                                        return <StoreLocalItems props={salesSummary} currentTab={currentTab} parentFunc={myParentFunction} ></StoreLocalItems>;
                                    case "items":
                                        return <StoreItems props={salesSummary} currentTab={currentTab} parentFunc={myParentFunction}></StoreItems>;
                                    case "RequestedItems":
                                        return <RequestedItems props={salesSummary} currentTab={currentTab} parentFunc={myParentFunction}></RequestedItems>;
                                    case "categories":
                                        return <StoreCategory props={salesSummary} currentTab={currentTab}></StoreCategory>;
                                    case "discount":
                                        return <StoreDiscount></StoreDiscount>;
                                    case "settings-and-timing":
                                        return <StoreSettings></StoreSettings>;
                                    default:
                                        return <>No page found</>;
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
        </>
    )

}