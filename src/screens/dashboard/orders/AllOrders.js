import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import $ from "jquery";
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';

const AllOrders = () => {

    const [orderList, setOrderList] = useState([]);
    const [summary, setSummary] = useState('')
    const [isFilter, setIsFilter] = useState(false);
    const [reqParam, setReqParam] = useState()

    // PAGINATION
    const perPageData = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [apiDataAdditional, setApiDataAdditional] = useState();
    const [isNextPage, setIsNextPage] = useState(false);
    const [isPrevPage, setIsPrevPage] = useState(false);
    const [totalPage, setTotalPage] = useState(1);
    const [tempBeneficiaryActiveList, setTempBeneficiaryActiveList] = useState([]);



    const filterClick = () => {

        $("#filter-toggle-icon").toggleClass("rotate-180");
        $(".custom-btn.filter").toggleClass("active");

        $("#filter-div").toggleClass("need-without-shadow");
        $("#filter-div").toggleClass("no-need-without-shadow");
    }



    useEffect(() => {

        // Get All Orders List
        PostLoginGetApi("shop/manage/orders").then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    setTotalPage(Math.ceil(responseData["data"].length / perPageData));
                    setOrderList(responseData["data"]);

                }
            }
        }).catch((err) => {
            console.log(err);
        })

    }, [isFilter, reqParam]);



    useEffect(() => {

        if (orderList.length > perPageData) {
            setIsNextPage(true);
        }

        if (currentPage >= totalPage) {
            setIsNextPage(false);
        }


        if ((currentPage > 1) && (currentPage <= totalPage)) {
            setIsPrevPage(true);
        }
        else {
            setIsPrevPage(false);
        }


        let startPoint = parseInt((currentPage - 1) * perPageData) + 1;
        let endPoint = parseInt(startPoint + perPageData - 1);
        if (endPoint > orderList.length) {
            endPoint = orderList.length;
        }

        startPoint = Math.min(startPoint, orderList.length);

        setApiDataAdditional("Showing " + startPoint + " - " + endPoint + " out of " + orderList.length);
        setTempBeneficiaryActiveList(orderList.slice(startPoint - 1, endPoint));

    }, [orderList, currentPage, totalPage]);


    useEffect(() => {

        // Get order summary
        PostLoginGetApi("shop/order-summary").then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    setSummary(responseData["data"]);
                }
            }
        }).catch((err) => {
            console.log(err);
        })

    }, []);


    const pagination = (next = 1) => {
        setCurrentPage(next);
    }


    const filter = () => {

        let search = {};

        search.search = $("#all-status").val();

        if ($("#all-status").val() === "") {
            search.search = "";
        }
        let order_status = $("#all-status").val();
        if (order_status.length === 0) {
            order_status = "";
        }



        setReqParam({ ...reqParam, ...search });
        setIsFilter(true)


    }



    const resetFilterData = () => {

        $("#all-status").val('all')
        $("#search-by-customer-name").val("");


        filter();
        setIsFilter(false);
    }


    return (
        <div className="custom-container w-full font-montserrat flex">

            {/** Left Side */}

            <div className="custom-container-left float-left custom-scroll-auto min-w-[80%] w-full pr-3 pb-20 text-justify" style={{ boxShadow: "3px 0 0px 0px rgb(0 0 0 / 1%)" }}>

                <div className="text-justify rounded-[5px] py-3 pt-0">
                    <div className="w-1/2 float-left">
                        <h6 className="text-xl px-4 font-medium pb-0 pl-0 pt-4 mb-5">Here’s your orders at a glance</h6>
                        <h6 className='text-lg font-medium mb-5'>Today</h6>
                    </div>

                    <div className="w-1/2 h-[68px] float-left text-right justify-end flex items-center">


                        <Link to="#" onClick={filterClick} className="custom-btn filter text-center w-[92px]">Filter</Link>
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
                            Total Orders
                        </Link>

                        <h3 style={{ fontSize: "22px" }} className="font-semibold  opacity-70">{orderList.length}</h3>
                    </div>


                    <div className="box hover-black-green w-1/2 py-5 h-auto ml-[1%]  bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                        <Link to="#" className="block text-base font-medium">
                            Total Accepted
                        </Link>

                        <h3 style={{ "fontSize": "22px" }} className="font-semibold  opacity-70">{summary.accepted_orders}</h3>
                    </div>

                    <div className="box hover-black-green w-[32%] py-5 h-auto ml-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                        <Link to="#" className="block text-base font-medium">
                            Cancelled Orders
                        </Link>

                        <h3 style={{ fontSize: "22px" }} className="font-semibold  opacity-70">{summary.canceled_orders}</h3>
                    </div>
                </div>


                {/* DATA TABLE */}
                <div className="flex flex-col w-full pt-5">
                    <div className='-m-1.5 overflow-x-auto pt-0'>
                        <div className='p-1.5 min-w-full inline-block align-middle'>
                            <div className="border rounded-lg shadow overflow-hidden">

                                <table className="min-w-full divide-y divide-gray-200 custom-table-hover">
                                    <thead className='bg-neutral-100'>
                                        <tr className='text-left'>
                                            <th scope="col" className="px-6 py-3">Customer Details</th>
                                            <th scope="col" className="px-6 py-3">Trnx ID</th>
                                            <th scope="col" className="px-6 py-3">Items</th>
                                            <th scope="col" className="px-6 py-3">Type</th>
                                            <th scope="col" className="px-6 py-3">Status</th>
                                            <th scope="col" className="px-6 py-3">Date</th>
                                            <th scope="col" className="px-6 py-3">Amount</th>

                                        </tr>
                                        <tr></tr>
                                    </thead>
                                    <tbody className='divide-y divide-gray-200'>
                                        {(orderList.length === 0) &&
                                            <tr key="0">
                                                <td className='px-6 py-1 text-center' colSpan={7}>
                                                    <p className='py-4'>No Orders available</p>
                                                </td>
                                            </tr>
                                        }

                                        {tempBeneficiaryActiveList.map((data, index) => (
                                            (data !== null) &&
                                            <tr key={index}>
                                                <td className='px-6 py-4 border-r-2'>

                                                    {data.user_photo}

                                                    <p>{data.user_name}</p>
                                                    <p>{data.user_mobile}</p>

                                                </td>
                                                <td className='px-6 py-4 border-r-2 text-[#0774E9]'><Link to={`/dashboard/orders/order-invoice/${data.id}`} className='cursor-pointer'>{data.transaction_id}</Link></td>
                                                <td className='px-6 py-4 border-r-2'>{data.items_count + " Items"} </td>
                                                <td className='px-6 py-4 border-r-2'>{data.order_type_alias}</td>
                                                <td className='px-6 py-4 border-r-2 text-[#FAA819]'><Link to="#" className='cursor-pointer'>{data.status}</Link></td>
                                                <td className='px-6 py-4 border-r-2 '>{data.created_at_date}</td>
                                                <td className='px-6 py-4 border-r-2 '>{"৳ " + data.total_price}</td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                            {/* Pagination */}
                            <p className='float-left mt-3 pt-2'>
                                {apiDataAdditional}
                            </p>


                            {(isNextPage === true) &&
                                <button onClick={() => pagination((currentPage + 1))} className="custom-btn float-right mt-5 pr-2 ml-3">
                                    Next Page&nbsp;&nbsp;&rarr;
                                </button>
                            }

                            {(isPrevPage === true) &&
                                <button onClick={() => pagination((currentPage - 1))} className="custom-btn float-right mt-5 mr-0">
                                    &larr;&nbsp;&nbsp;Previous Page
                                </button>
                            }

                        </div>
                    </div>
                </div>


            </div>







            {/* Right Side */}

            <div id="filter-div" className="custom-container-right float-right w-1/5 pl-2 pb-10 pt-4 pr-1 justify-center custom-scroll-auto mb-20 no-need-without-shadow">
                <div className="relative">
                    {/* <h6 className="text-lg px-3 font-base pb-2 pl-2" style={{ boxShadow: "0 3px 0 0 rgb(0 0 0 / 1%)" }}>Filter Transactions</h6> */}
                    <div className="box-full block w-full h-full text-justify  pl-2">
                        <div className="w-full float-left pb-3">
                            <select id="all-status" className='w-full mt-0 mb-4 bg-[#F5F5F5] rounded border-0'>
                                <option value="all">All Statuses</option>
                                <option value="pending">Waiting For Accept</option>
                                <option value="accepted">Accepted</option>
                                <option value="ready">Ready for Pick-up</option>
                                <option value="delivered">Delivered</option>
                                <option value="refunded">Refunded</option>
                                {/* {(orderList.length === 0) ? (
                                        <></>
                                    ) : (
                                        <>
                                            {orderList.map(val => (
                                                <option  key={val} value={val?.id}>{val?.status}</option>
                                            ))}
                                        </>
                                    )} */}
                            </select>
                        </div>
                    </div>

                    <div className="box-full flex w-[97%] h-full text-justify py-2 px-2 -mt-2 ml-2 pb-3 mb-4 bg-[#F5F5F5] rounded">
                        <div className="w-full h-full float-left">
                            <select className='w-full mt-0 mb-2 bg-[#F5F5F5] rounded border-0' defaultValue="customer-name">
                                <option value="customer-name">Search by Name</option>

                            </select>

                            <input type="text" id="search-by-customer-name" autoComplete='off' className="custom-search-fields w-full text-base border-0 rounded placeholder:text-ash" placeholder='Search by Name' />



                        </div>
                    </div>
                    <button onClick={filter} className="custom-btn w-[97%] flow-root float-left ml-2 ">Filter</button>
                    {isFilter && <button onClick={resetFilterData} className="custom-btn ml-2 mt-3 flow-root w-[97%] float-left bg-black text-white border-black" style={{ color: "#FFF" }}>Reset Filter</button>}

                </div>
            </div>
        </div>
    );
};

export default AllOrders;