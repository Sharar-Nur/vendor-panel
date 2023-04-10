import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';
import DatePickerV2 from "../../../components/date/DatePicker-v2";
import DatePickerRange from "../../../components/date/DatePickerRange";
import $ from "jquery";
import moment from 'moment';

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


const Invoice = () => {
    const [invoiceList, setInvoiceList] = useState([]);
    const [isFilter, setIsFilter] = useState(false);
    const [reqParam, setReqParam] = useState()
    const navigate = useNavigate();

    useEffect(() => {

        // Get All Connects
        PostLoginGetApi("shop/invoice", reqParam).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {

                    setInvoiceList(responseData["data"]);

                }
            }
        }).catch((err) => {
            console.log(err);
        })

    }, [isFilter, reqParam]);

    const toggleMenu = () => {
        var menu = document.getElementById("dropdown");


        if (menu.classList.contains("hidden")) {
            menu.classList.remove("hidden");
        }
        else {
            menu.classList.add("hidden");
        }
    }

    const filterClick = () => {
        $("#filter-toggle-icon").toggleClass("rotate-180");
        $(".custom-btn.filter").toggleClass("active");

        $("#filter-div").toggleClass("need-without-shadow");
        $("#filter-div").toggleClass("no-need-without-shadow");
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


        if ($("#search-by").val() === "") {
            search.search = "";
        }

        setReqParam({ ...search })
        setIsFilter(true)

    }

    const resetFilterData = () => {
        $("#fromDate, #toDate, #singleDatePicker").datepicker('setDate', null);
        $("#search-by").val("");
        filter();
        setIsFilter(false);
        setDatePicker();
    }


    return (
        <div className="custom-container w-full px-8 py-10 pt-2 pr-6 font-montserrat flex">

            {/* Left Side */}
            <div className="custom-container-left float-left custom-scroll-auto min-w-[80%] w-full mb-20 pb-[100px] pr-3 text-justify" style={{ boxShadow: "3px 0 0px 0px rgb(0 0 0 / 1%)" }} >


                <div className="text-justify rounded-[5px] py-3">
                    <div className="w-1/2 float-left">
                        <h6 className="text-xl px-4 font-medium pb-0 pl-0 pt-4 mb-5">Here’s your invoices at a glance</h6>
                        <h6 className="text-lg font-semibold ">Today</h6>
                    </div>

                    <div className="w-1/2 h-[68px] float-left text-right justify-end flex items-center">

                        <div id="dropdown-wrapper" className="inline-block relative">
                            <button onClick={() => toggleMenu()} className='custom-btn mr-2.5 text-center'>Send Bulk Invoice</button>

                            <div id="dropdown" className="absolute z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                    <li>
                                        <Link to="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Download Invoice Template</Link>
                                    </li>
                                    <li>
                                        <Link to="/dashboard/invoice/upload-invoice" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Upload Bulk Invoice</Link>
                                    </li>

                                </ul>
                            </div>
                        </div>
                        <Link to="/dashboard/create-invoice" className='custom-btn mr-2.5 text-center'>Create an Invoice</Link>


                        <Link to="#" onClick={filterClick} className="custom-btn active filter text-center w-[92px]">Filter</Link>
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
                            Paid
                        </Link>

                        <h3 style={{ fontSize: "22px" }} className="font-semibold  opacity-70">#</h3>
                    </div>


                    <div className="box hover-black-green w-[32%] mr-[1%] py-5 h-auto ml-[1%]  bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                        <Link to="#" className="block text-base font-medium">
                            Outstanding
                        </Link>

                        <h3 style={{ "fontSize": "22px" }} className="font-semibold  opacity-70">#</h3>
                    </div>

                    <div className="box hover-black-green w-[32%] py-5 h-auto ml-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                        <Link to="#" className="block text-base font-medium">
                            Drafts
                        </Link>

                        <h3 style={{ fontSize: "22px" }} className="font-semibold  opacity-70">#</h3>
                    </div>
                </div>




                {/* <div className='flex justify-between '>
                    <div className='flex'>
                        <div className="ml-0.5 mr-[10px]">
                            <div className="inline-flex flex-col justify-center relative text-gray-500">
                                <div className="relative">
                                    <input type="text" className="p-2 pl-10 w-[530px] h-14 rounded border border-neutral-100 bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-none focus:border-transparent" placeholder="Search Invoices" />
                                    <input type="text" name="" id="" />
                                    <svg className="w-6 h-6 absolute left-2.5 top-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <select name="invoice type" id="invoice type" className='h-full mr-[10px] rounded-[3px] bg-neutral-100 border-neutral-100'>
                                <option value="all-invoice">All Invoices</option>
                                <option value="draft">Draft</option>
                                <option value="schedule">Schedule</option>
                                <option value="pending">Pending</option>
                                <option value="expired">Expired</option>
                                <option value="received">Received</option>
                            </select>

                            <select name="time duration" id="time duration" className='h-full rounded-[3px] bg-neutral-100 border-neutral-100'>
                                <option value="all-time">All Time</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div id="dropdown-wrapper" className="inline-block relative">
                            <button onClick={() => toggleMenu()} className='py-[15px] px-5 bg-[#1A202C] rounded-[3px] text-white mr-2.5'>Send Bulk Invoice</button>

                            <div id="dropdown" className="absolute z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                    <li>
                                        <Link to="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Download Invoice Template</Link>
                                    </li>
                                    <li>
                                        <Link to="/dashboard/invoice/upload-invoice" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Upload Bulk Invoice</Link>
                                    </li>

                                </ul>
                            </div>

                        </div>
                        <Link to="/dashboard/create-invoice" className='py-[15px] px-5 text-[#222222] rounded-[3px] border-solid border border-[#1A202C]'>Create an Invoice</Link>

                    </div>

                    <div id="dropdown-wrapper" className="inline-block relative">
                        <button onClick={() => toggleMenu()} className='py-[15px] px-5 bg-[#1A202C] rounded-[3px] text-white mr-2.5'>Send Bulk Invoice</button>

                        <div id="dropdown" className="absolute z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                <li>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Download Invoice Template</a>
                                </li>
                                <li>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Upload Bulk Invoice</a>
                                </li>

                            </ul>
                        </div>

                    </div>
                </div> */}

                <div className="flex flex-col w-full pt-5">
                    {/* DATA TABLE */}
                    <div className='-m-1.5 overflow-x-auto pt-0'>
                        <div className='p-1.5 min-w-full inline-block align-middle'>
                            <div className="border rounded-lg shadow overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 custom-table-hover">
                                    <thead className='bg-neutral-100'>
                                        <tr className='text-left'>
                                            <th scope="col" className="px-6 py-3">Create Date</th>
                                            <th scope="col" className="px-6 py-3">ID</th>
                                            <th scope="col" className="px-6 py-3">Customer</th>
                                            <th scope="col" className="px-6 py-3">Status</th>
                                            <th scope="col" className="px-6 py-3">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-gray-200'>
                                        {(invoiceList.length === 0) &&
                                            <tr key="0">
                                                <td className='px-6 py-1 text-center' colSpan={6}>
                                                    <p className='py-4'>No invoice available</p>
                                                </td>
                                            </tr>
                                        }

                                        {
                                            invoiceList.map((data, index) => (
                                                (data !== null) &&
                                                <tr key={index}>
                                                    <td className='px-6 py-4 border-r-2'>{moment(data.created_at_date).format('DD MMM, YYYY')}</td>
                                                    <td className='px-6 py-4 border-r-2 '><Link to={`/dashboard/invoice/details/${data.id}`} className="cursor-pointer text-green-500">{data.invoice_id}</Link></td>
                                                    <td className='px-6 py-4 border-r-2'>{data.user?.name}</td>
                                                    <td className='px-6 py-4 border-r-2'>{data.status}</td>
                                                    <td className='px-6 py-4 border-r-2'>{data.total_bill_amount}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>

                            </div>

                            {/* <p className='float-left mt-7'>
                                {`Showing ${apiData?.from} - ${apiData?.to} out of ${apiData?.total}`}
                            </p>


                            {(apiData?.next_page_url !== null && apiData?.links?.next_page_url !== "") &&
                                <button onClick={() => pagination(1)} className="custom-btn float-right mt-5">
                                    Next Page&nbsp;&nbsp;&rarr;
                                </button>
                            }

                            {(apiData?.prev_page_url !== null && apiData?.prev_page_url !== "") &&
                                <button onClick={() => pagination(0)} className="custom-btn float-right mt-5 mr-2">
                                    &larr;&nbsp;&nbsp;Previous Page
                                </button>
                            } */}
                        </div>
                    </div>
                </div>
            </div >

            {/* Right Side */}

            <div div id="filter-div" className="custom-container-right float-right w-1/5 pl-2 pb-10 pt-4 pr-1 justify-center custom-scroll-auto mb-20 no-need-without-shadow" >
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
                                <option value="phone">Search by Phone Number</option>
                                <option value="id">Search by Connect ID</option>

                            </select>

                            <input type="text" id="search-by" autoComplete='off' className="custom-search-fields w-full text-base border-0 rounded placeholder:text-ash" placeholder='Search by Name' />



                        </div>
                    </div>
                    <button onClick={filter} className="custom-btn w-[97%] flow-root float-left ml-2 ">Filter</button>
                    {isFilter && <button onClick={resetFilterData} className="custom-btn ml-2 mt-3 flow-root w-[97%] float-left bg-black text-white border-black" style={{ color: "#FFF" }}>Reset Filter</button>}

                </div>
            </div >


            <style>{`
                .custom-scroll-auto { 
                    overflow-x: hidden;
                }

                .tab button:hover::after, .tab button.current::after { 
                    width: 120% !important;
                    margin-left: -10% !important;
                }
            `}</style>

        </div >
    );
};

export default Invoice;