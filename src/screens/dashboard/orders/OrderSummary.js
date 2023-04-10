import React, { Suspense, useState } from 'react';
import $ from "jquery";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import moment from 'moment';
import { CSVLink } from "react-csv";

import DatePickerV2 from "../../../components/date/DatePicker-v2";
import DatePickerRange from "../../../components/date/DatePickerRange";
import BarChart from '../../../components/charts/BarChart';




const filterClick = () => {
    $("#filter-toggle-icon").toggleClass("rotate-180");
    $(".custom-btn.filter").toggleClass("active");

    $("#filter-div").toggleClass("need-without-shadow");
    $("#filter-div").toggleClass("no-need-without-shadow");
}


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

const OrderSummary = () => {
    const [csvData, setCsvData] = useState([]);

    const [reqParam, setReqParam] = useState({
        page: 1,
        lang: "en"
    });

    const [isFilter, setIsFilter] = useState(false);


    const filter = () => {

    }


    const resetFilterData = () => {
        return;
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="custom-container w-full h-screen pb-10 font-montserrat flex ">

                {/** Left Side */}
                <div className="custom-container-left float-left custom-scroll-auto min-w-[80%] w-full h-screen mb-20 pb-[150px] pr-3 text-justify" style={{ boxShadow: "3px 0 0px 0px rgb(0 0 0 / 1%)" }}>

                    <div className="text-justify rounded-[5px] py-3 pt-0">
                        <div className="w-1/2 float-left">
                            <h6 className="text-xl px-4 font-medium pb-0 pl-0">Here’s your order summary at a glance</h6>
                            <h5 className="px-4 pb-0 pl-0 pt-2 text-lg font-semibold">Today</h5>
                        </div>

                        <div className="w-1/2 h-[68px] float-left text-right justify-end flex items-center">
                            <CSVLink className="custom-btn mr-2 text-center" filename={"sales-reports.csv"} data={csvData} >Export CSV</CSVLink>
                            <Link to="#" onClick={filterClick} className="custom-btn filter text-center w-[92px] active">Filter</Link>
                            <svg id="filter-toggle-icon" className='static -ml-4' width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" fill="#1A202C" />
                                <path d="M17 19L13 15L17 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="#F5F5F5" />
                            </svg>
                        </div>
                    </div>


                    <div className="w-full flex overflow-hidden text-left py-4 pt-2">
                        <div className="box hover-black-green w-[32%] py-5 h-auto mr-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                            <Link to="#" className="block text-base font-medium">
                                Total Orders
                                <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>

                            <h3 style={{ "fontSize": "22px" }} className="font-semibold  opacity-70">0</h3>
                        </div>


                        <div className="box hover-black-green w-[32%] py-5 h-auto ml-[1%] mr-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                            <Link to="#" className="block text-base font-medium">
                                Total Accepted
                                <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>

                            <h3 style={{ "fontSize": "22px" }} className="font-semibold  opacity-70">৳ 0</h3>
                        </div>

                        <div className="box hover-black-green w-[32%] py-5 h-auto ml-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                            <Link to="#" className="block text-base font-medium">
                                Cancelled Orders
                                <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>

                            <h3 style={{ "fontSize": "22px" }} className="font-semibold  opacity-70">৳ 0</h3>
                        </div>
                    </div>

                    <div className='w-full h-[300px] mt-2 mb-5 relative'>
                        <BarChart />
                    </div>


                    <div className='w-full max-w-full h-auto mt-5 mb-5 flex items-center overflow-x-auto'>
                        <table className="table-auto w-full m-auto h-auto mt-2" border={0}>
                            <thead>
                                <tr className='bg-[#F5F5F5] mt-2'>
                                    <td className="mt-2 pt-4 pb-4 rounded-l-md pl-4 font-semibold">No. of Order</td>
                                    <td className="mt-2 pt-4 pb-4 text-center font-semibold">Accepted Order</td>
                                    <td className="mt-2 pt-4 pb-4 text-center font-semibold">Pick-up Order</td>
                                    <td className="mt-2 pt-4 pb-4 text-center font-semibold">Dine-in Order</td>
                                    <td className="mt-2 pt-4 pb-4 text-center font-semibold">Delivery Order</td>
                                    <td className="mt-2 pt-4 pb-4 text-center font-semibold">Declined Order</td>
                                    <td className="mt-2 pt-4 pb-4 rounded-r-md text-center font-semibold">Refund Order</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover-black-green border-b-2">
                                    <td className="mt-2 pt-4 pb-4 border-r-2 rounded-l-md pl-4">
                                        <span className="pointer pointer-success"></span>
                                        Payment Received
                                    </td>
                                    <td className="mt-2 pt-4 pb-4 border-r-2 rounded-r-none text-center">৳ 5,000.00</td>
                                    <td className="mt-2 pt-4 pb-4 border-r-2 rounded-r-none text-center">৳ 0.00</td>
                                    <td className="mt-2 pt-4 pb-4 border-r-2 rounded-r-none text-center">৳ 0.00</td>
                                    <td className="mt-2 pt-4 pb-4 border-r-2 rounded-r-none text-center">৳ #</td>
                                    <td className="mt-2 pt-4 pb-4 border-r-2 rounded-r-none text-center">৳ #</td>
                                    <td className="mt-2 pt-4 pb-4 rounded-r-md text-center">৳ #</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>

                </div>



                {/** Right Side */}
                <div id="filter-div" style={{ overflowX: "hidden" }} className="custom-container-right custom-scroll-auto h-screen float-right w-1/5 pl-2 pb-10 pt-4 pr-0 justify-center mb-20 need-without-shadow">
                    <div style={{ overflowX: "hidden" }} className="relative custom-scroll-auto h-[350px]">
                        <h6 className="text-lg px-3 font-base pb-2 pl-2" style={{ boxShadow: "0 3px 0 0 rgb(0 0 0 / 1%)" }}>Filter Sales Summary</h6>

                        <div className="box-full w-full  text-justify py-2 pl-2 pr-1">
                            <div className="w-full float-left pt-2 mb-6">
                                <select onChange={setDatePicker} id="date-range-data" className='w-full mt-0 mb-4 bg-[#F5F5F5] rounded border-0' defaultValue="custom">
                                    <option value="all">All Day</option>
                                    <option value="custom">Custom</option>
                                </select>
                                <DatePickerV2 />
                                <DatePickerRange />
                            </div>
                        </div>

                        <div className="box-full w-full  text-justify py-2 pl-3 pr-1">
                            <button onClick={filter} className="custom-btn box-full w-full text-center py-1 pl-2 pr-1">Filter</button>

                            {isFilter && <button onClick={resetFilterData} className="custom-btn bg-black text-white border-black mt-3 box-full w-full text-center py-2 pl-2 pr-1" style={{ color: "#FFF" }}>Reset Filter</button>}
                        </div>
                    </div>
                </div>

            </div>

        </Suspense>
    );
};

export default OrderSummary;