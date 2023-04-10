import React, { useState, useEffect } from 'react';
import $ from "jquery";
import BarChart from '../../../components/charts/BarChart';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

import DatePickerV2 from "../../../components/date/DatePicker-v2";
import DatePickerRange from "../../../components/date/DatePickerRange";



const filterClick = () => {
}

var handleTab = (tabId, event) => {
    $(".tabcontent").hide();
    $(".tablinks").removeClass("current");
    $(".tabcontentbody>#" + tabId).show();

    $(event.target).addClass("current");
}


var setData = () => {
    $("#date-range-div").hide();
    var v = $("#date-range-data").val();
    if (v === "custom") {
        $("#date-range-div").show();
    }
}



const SalesReports = () => {


    return (
        <div className="custom-container w-full float-left px-8 py-10 block font-montserrat custom-scroll-auto mb-20">

            <div className="tab w-full">
                <button className="tablinks current" onClick={(event) => handleTab("sales-summary", event)}>Sales Summary</button>
                <button className="tablinks" onClick={(event) => handleTab("item-sales", event)}>Item Sales</button>
                <button className="tablinks" onClick={(event) => handleTab("category-sales", event)}>Category Sales</button>
            </div>

            <div className='tabcontentbody py-3'>


                <div id="sales-summary" className="tabcontent px-0" style={{ display: "block", paddingLeft: "0px" }}>

                    {/** Left Side */}
                    <div className="custom-container-left custom-scroll-auto float-left w-4/5 pb-10 pr-3 text-justify" style={{ boxShadow: "3px 0 0px 0px rgb(0 0 0 / 1%)" }}>

                        <div className="box-full block w-full h-full text-justify rounded-[5px] py-3">

                            <div className="w-1/2 float-left">
                                <h6 className="text-xl px-4 font-medium pb-0 pl-0">Here’s your reports at a glance</h6>
                                <h5 className="px-4 pb-0 pl-0 pt-3 text-lg font-semibold">Today</h5>
                            </div>

                            <div className="w-1/2 h-[68px] float-left text-right justify-end flex items-center">
                                <a href="#" className="custom-btn mr-2 text-center">Export CSV</a>
                                <a href="#" className="custom-btn text-center w-[92px]">Filter</a>

                                <svg onClick={filterClick} className='static -ml-4 hover:cursor-pointer hover:rotate-180' width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" fill="#1A202C" />
                                    <path d="M17 19L13 15L17 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="#F5F5F5" />
                                </svg>

                            </div>
                        </div>


                        <div className="w-full flex overflow-hidden text-left py-4">
                            <div className="box hover-black-green w-[32%] py-5 h-auto mr-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                                <a href="#" className="block text-base font-medium">
                                    Transactions
                                    <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>

                                <h3 style={{ "fontSize": "22px" }} className="font-semibold  opacity-70">7</h3>
                            </div>


                            <div className="box hover-black-green w-[32%] py-5 h-auto ml-[1%] mr-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                                <a href="#" className="block text-base font-medium">
                                    Total Sales
                                    <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>

                                <h3 style={{ "fontSize": "22px" }} className="font-semibold  opacity-70">৳ 5,000.00</h3>
                            </div>

                            <div className="box hover-black-green w-[32%] py-5 h-auto ml-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                                <a href="#" className="block text-base font-medium">
                                    Total Paid
                                    <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>

                                <h3 style={{ "fontSize": "22px" }} className="font-semibold  opacity-70">৳ 2,500.00</h3>
                            </div>
                        </div>

                        <div className='w-full h-[300px] mt-2 mb-5'>
                            <BarChart />
                        </div>


                        <div className='w-full h-auto mt-5 mb-5 flex items-center overflow-x-auto'>
                            <table className="table-auto w-full m-auto h-auto mt-2" border={0}>
                                <thead>
                                    <tr className='bg-[#F5F5F5] mt-2'>
                                        <td className="mt-2 pt-4 pb-4 rounded-l-md pl-4"></td>
                                        <td className="mt-2 pt-4 pb-4 text-center font-semibold">EComm Payments</td>
                                        <td className="mt-2 pt-4 pb-4 text-center font-semibold">QR Offline</td>
                                        <td className="mt-2 pt-4 pb-4 text-center font-semibold">Refund Received</td>
                                        <td className="mt-2 pt-4 pb-4 rounded-r-md text-center font-semibold">Total</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover-black-green">
                                        <td className="mt-2 pt-4 pb-4 border-r-2 border-b-2 rounded-l-md pl-4">
                                            <span className="pointer pointer-success"></span>
                                            Payment Received
                                        </td>
                                        <td className="mt-2 pt-4 pb-4 border-r-2 border-b-2 rounded-r-none text-center">৳ 5,000.00</td>
                                        <td className="mt-2 pt-4 pb-4 border-r-2 border-b-2 rounded-r-none text-center">৳ 0.00</td>
                                        <td className="mt-2 pt-4 pb-4 border-r-2 border-b-2 rounded-r-none text-center">৳ 0.00</td>
                                        <td className="mt-2 pt-4 pb-4 rounded-r-md border-b-2 text-center">৳ 5,000.00</td>
                                    </tr>
                                    
                                </tbody>
                            </table> 

                            

                        </div>




                    </div>


                    {/** Right Side */}
                    <div className="custom-container-right float-right w-1/5 pl-2 pb-10 justify-center -mr-4">

                        <div className="relative">
                            <div className="box-full block w-full h-full text-justify py-3 px-2">

                                <div className="w-full float-left pt-1">
                                    {/* <DatePicker name="all" />
                                            
                                            <br/> */}
                                    <DatePickerV2 />

                                    <select onChange={setData} id="date-range-data" className='w-full mt-4 mb-4'>
                                        <option value="all">All Day</option>
                                        <option value="custom">Custom</option>
                                    </select>


                                    <DatePickerRange />

                                </div>

                            </div>
                        </div>

                    </div>

                </div>

                <div id="item-sales" className="tabcontent">
                    <h3>This is Item Sales Page</h3>
                    <p>This is sales category.</p>
                </div>


                <div id="category-sales" className="tabcontent">
                    <h3>Category Sales</h3>
                    <p>This is sales category.</p>
                </div>
            </div>
        </div>
    );
}



export default SalesReports;

