import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import $ from "jquery";

import PostLoginGetApi from '../../../components/api/PostLoginGetApi';
import PostLoginPostApi from '../../../components/api/PostLoginPostApi';
import { toast } from 'react-toastify';



export default function StoreCategory(props) {

    const showDropDown = event => {
        $(".dropdownDotsHorizontal").hide();
        event.currentTarget.nextSibling.style.display = "block";
    }

    document.addEventListener('scroll', function () {
        $(".dropdownDotsHorizontal").hide();
    }, true);

    $('body').on("click", function (e) {
        if (e.target.parentElement.className !== "") {
            if (e.target.parentElement.className.toString().includes("dropdownMenuIconHorizontalButton mt-2") === false) {
                $(".dropdownDotsHorizontal").hide();
            }
        }
    });

    const [categoryList, setCategoryList] = useState([]);
    const [deleteModal, setDeleteModal] = useState({
        isShow: false,
        id: ""
    });
    const [isRefresh, setIsRefresh] = useState(0);
    const [reqParam, setReqParam] = useState({
        page: 1,
        lang: "en"
    });

    const [apiData, setApiData] = useState({});

    // Get Categories
    useEffect(() => {
        PostLoginGetApi("shop/category", reqParam).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    setDeleteModal(false);
                    setApiData(responseData["data"]);
                    setCategoryList(responseData["data"]?.data);

                }
            }

        }).catch((err) => {
            console.log(err);
        });
    }, [isRefresh, reqParam]);

    const [summary, setSummary] = useState('')
    //summary
    useEffect(() => {
        
        PostLoginGetApi("shop/published-item-summary").then((responseJSON) => {
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


    const deleteCategory = (id) => {
        try {
            PostLoginPostApi("shop/category/" + id, "", 1, 0, 3).then((responseJSON) => {
                var response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    var responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);
                    console.log(responseData);
                    if (responseData["code"] === 200) {
                        setDeleteModal(false);

                        toast.success("Category deleted");

                        setIsRefresh((prevCounter) => {
                            return prevCounter + 1;
                        });

                        return;
                    }

                    toast.error(responseData["messages"].toString());
                    return;

                }
            }).catch((error) => {
                toast.error("A problem occur. Please try again.");
                console.log(error);
            });
        }
        catch (exception) {
            toast.error("A problem occur.");
            console.log(exception);
        }
    }

    const pagination = (next = 1) => {
        if (next === 1) {
            setReqParam({ ...reqParam, page: reqParam.page + 1 });
            return;
        }

        if (reqParam.page > 1) {
            setReqParam({ ...reqParam, page: reqParam.page - 1 });
            return;
        }

        setReqParam({ ...reqParam, page: 1 });
        return;
    }



    return (
        <div className="custom-container w-full font-montserrat flex -mt-4">

            {/** Left Side */}
            <div className="float-left custom-scroll-auto min-w-[80%] w-full mb-20 pb-[100px] pr-3 text-justify" >

                <div className="text-justify rounded-[5px] py-3">
                    <div className="w-1/2 float-left">
                        <h6 className="text-xl px-4 font-medium pb-0 pl-0 pt-5">Here’s your categories at a glance</h6>
                        {/* <h5 className="px-4 pb-0 pl-0 pt-2 text-lg font-semibold">Today</h5> */}
                    </div>

                    <div className="w-1/2 h-[68px] float-left text-right justify-end flex items-center">
                        <Link to={"create-category"} className="custom-btn text-center">Create a Category</Link>
                    </div>
                </div>


                <div className="w-full flex overflow-hidden text-left py-4 pt-2">
                    <div className="box hover-black-green w-[32%] py-5 h-auto mr-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                        <Link to="#" className="block text-base font-medium">
                            Total Store Items
                            <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>

                        <h3 style={{ "fontSize": "22px" }} className="font-semibold  opacity-70">{summary?.net_sales_summary?.total_items}</h3>
                    </div>


                    <div className="box hover-black-green w-[32%] py-5 h-auto ml-[1%] mr-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                        <Link to="#" className="block text-base font-medium">
                            Total Categories
                            <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>

                        <h3 style={{ "fontSize": "22px" }} className="font-semibold  opacity-70">{categoryList.length}</h3>
                    </div>

                    <div className="box hover-black-green w-[32%] py-5 h-auto ml-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                        <Link to="#" className="block text-base font-medium">
                            Net Sales
                            <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>

                        <h3 style={{ fontSize: "22px" }} className="font-semibold  opacity-70">৳ {props?.props?.total_sales}</h3>
                    </div>
                </div>



                {/* DATA TABLE  */}
                <div className='border rounded-lg shadow'>
                    <table className='min-w-full divide-y divide-gray-200 custom-table-hover '>
                        <thead className='bg-neutral-100'>
                            <tr className='text-left '>
                                <th scope="col" className="px-6 py-4" colSpan={3}>Category</th>
                            </tr>
                        </thead>

                        <tbody className='divide-y divide-gray-200'>
                            {(categoryList.length === 0) &&
                                <tr key="0">
                                    <td colSpan={3} className='px-6 py-1 '>
                                        <p className='py-4'>No category available</p>
                                    </td>
                                </tr>
                            }

                            {categoryList.map((data, index) => (
                                <tr key={index}>
                                    <td className='px-6 py-1 '>{data?.name}</td>
                                    <td className='px-6 py-1 w-[160px] text-right'>Assign Items</td>
                                    <td className='px-6 py-1 text-center w-[120px]'>
                                        <button onClick={showDropDown} data-dropdown-toggle="dropdownDotsHorizontal" className="dropdownMenuIconHorizontalButton mt-2">
                                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                                        </button>

                                        <div className="dropdownDotsHorizontal hidden relative z-50">
                                            <div className='absolute -ml-20 -mt-2 border border-[1px solid rgb(245, 245, 245)] bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600'>
                                                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
                                                    <li className='border-b-[1px] border-b-slate-100'>
                                                        <Link to={"edit-category"} state={{ data: data }} className="cursor-pointer block py-2 px-10 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            Edit
                                                        </Link>
                                                    </li>
                                                    <li className='border-b-0 border-b-slate-100'>
                                                        <span onClick={() => setDeleteModal({ isShow: true, id: data.id })} className="cursor-pointer block py-2 px-10 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" >
                                                            Delete
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>


                    {(apiData?.meta?.from) !== undefined &&
                        <>
                            <p className='float-left mt-7'>
                                {`Showing ${apiData?.meta?.from * 1} - ${apiData?.meta?.to * 1} out of ${apiData?.meta?.total * 1}`}
                            </p>


                            {(apiData?.links?.next !== null && apiData?.links?.next !== "") &&
                                <button onClick={() => pagination(1)} className="custom-btn float-right mt-5">
                                    Next Page&nbsp;&nbsp;&rarr;
                                </button>
                            }

                            {(apiData?.links?.prev !== null && apiData?.links?.prev !== "") &&
                                <button onClick={() => pagination(0)} className="custom-btn float-right mt-5 mr-2">
                                    &larr;&nbsp;&nbsp;Previous Page
                                </button>
                            }
                        </>
                    }

                </div>

            </div>

            {/* Popup */}
            {((deleteModal?.isShow === true) && deleteModal.id !== "") ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                            {/*content*/}
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <button type="button" onClick={() => setDeleteModal(false)} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="popup-modal">
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                                <div className="p-6 text-center">
                                    <svg aria-hidden="true" className="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this category?</h3>
                                    <button data-modal-toggle="popup-modal" type="button" onClick={() => deleteCategory(deleteModal.id)} className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                        Yes, I'm sure
                                    </button>
                                    <button data-modal-toggle="popup-modal" type="button" onClick={() => setDeleteModal(false)} className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

        </div>
    )

}
