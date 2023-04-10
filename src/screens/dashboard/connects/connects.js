import React, { Suspense, useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import $ from "jquery";
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';
import AllConnects from './AllConnects';
import Merchant from './Merchant';
import Consumers from './Consumers';
import DatePickerV2 from "../../../components/date/DatePicker-v2";
import DatePickerRange from "../../../components/date/DatePickerRange";
import moment from 'moment';




export default function Connects() {


    const [currentTab, setCurrentTab] = useState("all-connects");
    let { state } = useLocation();
    const [isFilter, setIsFilter] = useState(false);
    const [reqParam, setReqParam] = useState()



    const handleTab = (tabId, event) => {
        $(".tablinks").removeClass("current");
        $(event.target).addClass("current");
        setCurrentTab(tabId);
        resetFilterData();
    }

    const filterClick = () => {
        $("#filter-toggle-icon").toggleClass("rotate-180");
        $(".custom-btn.filter").toggleClass("active");

        $("#filter-div").toggleClass("need-without-shadow");
        $("#filter-div").toggleClass("no-need-without-shadow");
    }


    const [count, setCount] = useState({
        consumer: 0,
        merchant: 0
    });


    useEffect(() => {

        // Connects Summary
        PostLoginGetApi("shop/connect/count").then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    // setConnectSummary(responseData["data"]);

                    if (responseData["data"].length > 0) {
                        let merchant = responseData["data"].find(obj => obj.user_type === "merchant");
                        let consumer = responseData["data"].find(obj => obj.user_type === "consumer");

                        setCount({ consumer: consumer?.count, merchant: merchant?.count });
                    }
                }
            }
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    useEffect(() => {
        if (state?.from !== null && state?.from !== undefined && state?.from !== "") {
            if (state?.from?.from === "consumers") {
                $(".tablinks").eq(1).trigger("click");

            }
            else if (state?.from?.from === "merchants") {
                $(".tablinks").eq(2).trigger("click");
            }
        }
    }, [state]);

    
    var setDatePicker = () => {
        $("#date-div").hide();
        $("#date-range-div").hide();
    
        $("#fromDate, #toDate, #singleDatePicker").datepicker('setDate', null);
    
    
        var v = $("#date-range-data").val();
        if (v === "custom") {
            $("#date-range-div").show();
        }
        else if (v === "all") {
            $("#date-div").attr("style", "display:flex");
        }
    }

    const filter = () => {

        var from_date = "", to_date = "";

        if ($("#date-range-data").val() === "custom") {
            from_date = $("#fromDate").val();
            to_date = $("#toDate").val();

            if (from_date.length === 0 || to_date.length === 0) {
                from_date = "";
                to_date = "";
            }
        }
        else if ($("#date-range-data").val() === "all") {
            const singleDatePicker = $("#singleDatePicker").val();
            if (singleDatePicker.length !== 0) {
                var nextDate = new Date(singleDatePicker);
                nextDate.setDate(nextDate.getDate() + 1);
                nextDate = nextDate.getFullYear() + "-" + (nextDate.getMonth() + 1) + "-" + nextDate.getDate();
                nextDate = moment(nextDate).format("YYYY-MM-DD");

                from_date = singleDatePicker;

                to_date = nextDate;
            }
        }

        let search = {};

        search.search = $("#search-by").val();
        

        if($("#search-by").val() === "") {
            search.search = "";
        }
        
        
        let dateType = ($('#date-range-data').val())
        


        let dtPicker = ($("#singleDatePicker").val());
        let customdtPicker = $("#fromDate").val() + "-" + $("#toDate").val();
        

        setReqParam({...search})
        setIsFilter(true)
        
    }


    const resetFilterData = () => {
        $("#search-by").val("");
        filter();
        setIsFilter(false);
    }





    return (
        <div className="custom-container w-full px-8 py-10 pt-2  pr-6 flex">


    
            <div className='custom-container-left float-left custom-scroll-auto min-w-[80%] w-full mb-20 pb-[100px] pr-3 text-justify' style={{ boxShadow: "3px 0 0px 0px rgb(0 0 0 / 1%)" }}>

                <div className="text-justify rounded-[5px] py-3">
                    <div className="w-1/2 float-left">
                        <h6 className="text-xl px-4 font-medium pb-0 pl-0 pt-4">Here’s your connects at a glance</h6>
                    </div>

                    <div className="w-1/2 h-[68px] float-left text-right justify-end flex items-center">
                        <Link to="/dashboard/connects/add-new" state={{ from: currentTab }} className="custom-btn mr-2.5 text-center">Add a Connect</Link>

                        <Link to="#" onClick={filterClick} className="custom-btn active filter text-center w-[92px]">Filter</Link>
                        <svg id="filter-toggle-icon" className='static -ml-4' width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" fill="#1A202C" />
                            <path d="M17 19L13 15L17 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="#F5F5F5" />
                        </svg>
                    </div>
                </div>


                <div className="w-full flex overflow-hidden text-left py-4 pt-2">
                    <div className="box hover-black-green  w-1/2 py-5 h-auto mr-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                        <Link to="#" className="block text-base font-medium">
                            Total Consumers
                        </Link>

                        <h3 style={{ fontSize: "22px" }} className="font-semibold  opacity-70">{count.consumer}</h3>
                    </div>


                    <div className="box hover-black-green w-1/2 py-5 h-auto ml-[1%]  bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                        <Link to="#" className="block text-base font-medium">
                            Total Merchants
                        </Link>

                        <h3 style={{ "fontSize": "22px" }} className="font-semibold  opacity-70">{count.merchant}</h3>
                    </div>

                    {/* <div className="box hover-black-green w-[32%] py-5 h-auto ml-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                        <Link to="#" className="block text-base font-medium">
                            Net Sales
                        </Link>

                        <h3 style={{ fontSize: "22px" }} className="font-semibold  opacity-70">#</h3>
                    </div> */}
                </div>



                {/* TAB SWITCHER */}
                <div className="tab w-full">
                    <button className="tablinks current" onClick={(event) => handleTab("all-connects", event)}>All Connects</button>
                    <button className="tablinks" onClick={(event) => handleTab("consumers", event)}>Consumers</button>
                    <button className="tablinks" onClick={(event) => handleTab("merchants", event)}>Merchant</button>
                </div>


                <div className='tabcontentbody py-3 px-0'>
                    <div id="view-profile" className="tabcontent" style={{ display: "block", paddingLeft: "0px", paddingRight: "0px" }}>
                        <Suspense fallback="Loading...">

                            {(() => {
                                switch (currentTab) {
                                    case "all-connects":
                                        return <AllConnects props={reqParam} />
                                    case "consumers":
                                        return <Consumers currentTab={currentTab} props={reqParam}  />;
                                    case "merchants":
                                        return <Merchant currentTab={currentTab} props={reqParam} />;
                                    default:
                                        return <h1>Sorry ! No page found.</h1>
                                }
                            })()}

                        </Suspense>
                    </div>
                </div>

            </div>




            {/* Right Side */}

            <div id="filter-div" className="custom-container-right float-right w-1/5 pl-2 pb-10 pt-4 pr-1 justify-center custom-scroll-auto mb-20 no-need-without-shadow">
                <div className="relative">
                    {/* <h6 className="text-lg px-3 font-base pb-2 pl-2" style={{ boxShadow: "0 3px 0 0 rgb(0 0 0 / 1%)" }}>Filter Transactions</h6> */}
                    <div className="box-full block w-full h-full text-justify  pl-2">
                            <div className="w-full float-left pb-3">
                                <select onChange={setDatePicker} id="date-range-data" className='w-full mt-0 mb-4 bg-[#F5F5F5] rounded border-0' defaultValue="custom">
                                    <option value="all">All Day</option>
                                    <option value="custom">Custom</option>
                                </select>
                                <DatePickerV2 />
                                <DatePickerRange />
                            </div>
                    </div>

                    <div className="box-full flex w-[97%] h-full text-justify py-2 px-2 -mt-2 ml-2 pb-3 mb-4 bg-[#F5F5F5] rounded">
                        <div className="w-full h-full float-left">
                            <select id="search-by-name" className='w-full mt-0 mb-2 bg-[#F5F5F5] rounded border-0'>
                                <option value="name">Search by Name</option>
                                <option value="email">Search by Email</option>
                                <option value="phone">Search by Phone Number</option>
                                <option value="id">Search by Connect ID</option>
                                
                            </select>

                            <input type="text"  id="search-by" autoComplete='off' className="custom-search-fields w-full text-base border-0 rounded placeholder:text-ash" placeholder='Search by Name' />

                            

                        </div>
                    </div>
                    <button onClick={filter} className="custom-btn w-[97%] flow-root float-left ml-2 ">Filter</button>
                    {isFilter && <button onClick={resetFilterData} className="custom-btn ml-2 mt-3 flow-root w-[97%] float-left bg-black text-white border-black" style={{ color: "#FFF" }}>Reset Filter</button>} 
                    
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
    )
}