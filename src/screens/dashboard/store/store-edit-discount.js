import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as CloseBtn } from './../../../assets/icons/close.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Popup from '../../../components/Popup';
import Button from "../../../components/Button";
import dropdownIcon from "./../../../assets/icons/dropdown.svg";
import deleteIcon from "./../../../assets/icons/delete.svg";
import dropupIcon from "./../../../assets/icons/dropup.svg";
import CustomDate from "../../../components/date/CustomDate";
import CustomEndDate from "../../../components/date/CustomEndDate";
import PostLoginGetApi from "../../../components/api/PostLoginGetApi";
import $ from "jquery";
import { toast } from 'react-toastify';
import PostLoginPostApi from "../../../components/api/PostLoginPostApi";
import moment from "moment/moment";





const StoreEditDiscount = () => {
    const state = useLocation();
    const navigate = useNavigate();
    const discountName = useRef('')
    const discountAmount = useRef('')
    const redeemAmount = useRef('')
    const [itemList, setItemList] = useState([]);
    const [applyIC, setApplyIC] = useState(0);


    const [prevData, setPrevData] = useState({});


    const [selectedItemCategory, setSelectedItemCategory] = useState({
        category: [],
        item: []
    });

    useEffect(() => {
        if (state?.state?.discountInfo === null || state?.state?.discountInfo === undefined || state?.state?.discountInfo === "") {
            toast.error("No Discount Selected.");
            return navigate("/dashboard/store");
        }

        let data = JSON.parse(state?.state?.discountInfo);
        setPrevData(data);

        setInput({ ...input, name: data.title });
        setRedeemValue(data.max_use);
        setDiscountInput(data.amount);


        if(data.discount_schedule !== null && data.discount_schedule !== undefined ) {
            setScheduleDays(data.discount_schedule);
        }

        if(data.categories.length > 0 || data.items.length > 0) {
            setApplyIC(1);
        }
 

    }, [state]);


    const [categoryList, setCategoryList] = useState([]);


    useEffect(() => {

        const fetchData = async () => {

            // eslint-disable-next-line no-array-constructor
            let categoriesArr = new Array();

            // eslint-disable-next-line no-array-constructor
            let itemsArr = new Array();

            // Get Category lists
            await PostLoginGetApi("shop/category").then((responseJSON) => {
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);
                    if (responseData["code"] === 200) {
                        setCategoryList(responseData["data"]?.data);

                        // eslint-disable-next-line array-callback-return
                        prevData?.categories?.map((categoriesId, _index) => {
                            let categoriesName = responseData["data"]?.data.find(obj => obj.id === parseInt(categoriesId));
                            categoriesArr.push({ id: categoriesId, name: categoriesName?.name, description: "" });
                        });
                    }
                }

            }).catch((err) => {
                console.log(err);
            });


            // Get Items list
            await PostLoginGetApi("shop/item").then((responseJSON) => {
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {
                        setItemList(responseData["data"]?.data);

                        // eslint-disable-next-line array-callback-return
                        prevData?.items?.map((itemsId, _index) => {
                            let itemsName = responseData["data"]?.data.find(obj => obj.id === parseInt(itemsId));
                            itemsArr.push({ id: itemsId, name: itemsName?.name, description: "" });
                        });

                    }
                }
            }).catch((err) => {
                console.log(err);
            });

            setSelectedItemCategory({ category: categoriesArr, item: itemsArr });
        }

        fetchData();







    }, [prevData]);






    const formSubmitHandler = (event) => {
        event.preventDefault();

        let amount_type = 1;
        if ($("input[type='radio'][name='discount_type']:checked").val() === "amount") {
            amount_type = 0;
        }


        let catArr = [];
        // eslint-disable-next-line array-callback-return
        selectedItemCategory.category.map((data) => {
            catArr.push(parseInt(data.id));
        });


        let itemArr = [];
        // eslint-disable-next-line array-callback-return
        selectedItemCategory.item.map((data) => {
            itemArr.push(parseInt(data.id));
        });


        let duration_type = "2";

        if ($("input[type='radio'][name='discount_dates']:checked").val() === "forever") {
            duration_type = 1;
        }

        let start_date_d = $("#fromDate").val() + " " + $("#startTime").val() + ":00";
        let end_date_d = $("#toDate").val() + " " + $("#endTime").val() + ":00";
        if (duration_type === 1 ) {
            start_date_d = "";
            end_date_d = "";
        }





        let dataObj = {
            "categories": catArr,
            "items": itemArr,
            "title": discountName.current.value,
            "is_percentage": amount_type,
            "amount": discountAmount.current.value,
            "discount_schedule": scheduleDays,
            "duration_type": duration_type,
            "start_date": start_date_d.substring(0, 19),
            "end_date": end_date_d.substring(0, 19),
            "max_use": redeemAmount.current.value,
            "use_count": "0"
        };




        PostLoginPostApi('shop/discount/' + prevData?.id, JSON.stringify(dataObj), 1, 0, 2).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    toast.success("Discount update successfully.");
                    navigate("/dashboard/store", {
                        state: {
                            tab: "discount"
                        }
                    });
                    return;
                }

                toast.error(responseData["messages"].toString() + "");

            }
        }).catch((err) => {
            toast.error('A problem occur. Please try again.');
            console.log(err);
        });

    }



    const [editInstruction, setEditInstruction] = useState({
        eligibleItems: false,
        editDatetime: false,
        editDaytime: false,
    });

    const hours = [
        "01 : 00", "01 : 15", "01 : 30", "01 : 45", "02 : 00", "02 : 15", "02 : 30", "02 : 45", "03 : 00", "03 : 15", "03 : 30", "03 : 45", "04 : 00", "04 : 15", "04 : 30", "04 : 45", "05 : 00", "05 : 15", "05 : 30", "05 : 45", "06 : 00", "06 : 15", "06 : 30", "06 : 45", "07 : 00", "07 : 15", "07 : 30", "07 : 45", "08 : 00", "08 : 15", "08 : 30", "08 : 45", "09 : 00", "09 : 15", "09 : 30", "09 : 45", "10 : 00", "10 : 15", "10 : 30", "10 : 45", "11 : 00", "11 : 15", "11 : 30", "11 : 45", "12 : 00", "12 : 15", "12 : 30", "12 : 45"
    ];


    const [checked, setChecked] = useState(false);
    const [ticked, setTicked] = useState(false);
    const [redeemValue, setRedeemValue] = useState('');
    const [discountInput, setDiscountInput] = useState('');


    const openInstructionModel = (id) => {
        switch (id) {
            case 1:
                setEditInstruction({ eligibleItems: true });
                break;
            case 2:
                setEditInstruction({ editDaytime: true });
                setTimeout(() => {
                    if (scheduleDays?.Saturday !== undefined) {
                        $(".days_range").eq(0).attr("style", "display: flex");
                    }
                    if (scheduleDays?.Sunday !== undefined) {
                        $(".days_range").eq(1).attr("style", "display: flex");
                    }
                    if (scheduleDays?.Monday !== undefined) {
                        $(".days_range").eq(2).attr("style", "display: flex");
                    }
                    if (scheduleDays?.Tuesday !== undefined) {
                        $(".days_range").eq(3).attr("style", "display: flex");
                    }
                    if (scheduleDays?.Wednesday !== undefined) {
                        $(".days_range").eq(4).attr("style", "display: flex");
                    }
                    if (scheduleDays?.Thursday !== undefined) {
                        $(".days_range").eq(5).attr("style", "display: flex");
                    }
                    if (scheduleDays?.Friday !== undefined) {
                        $(".days_range").eq(6).attr("style", "display: flex");
                    }
                }, 500);
                break;
            case 3:
                setEditInstruction({ editDatetime: true });
                break;

            default:
                break;
        }
    }

    const closeInstructionModel = () => {
        setEditInstruction({ eligibleItems: false, editDatetime: false, editDaytime: false });
    }


    const [input, setInput] = useState({
        name: "",
        amount: ""
    });


    const handleChange = event => {
        const result = event.target.value.replace(/\D/g, '');

        $("#redeemLimit").val(result);

    };

    var discountAmountHandle = (e) => {
        const re = /^[0-9]*(\.[0-9]{0,2})?$/;
        const dt = $("input[type='radio'][name='discount_type']:checked").val();
        if (e.value === '' || re.test(e.value)) {
            if (dt === "percentage" && e.value > 100) {
                return;
            }

            setDiscountInput(e.value);
        }
    }

    const setDiscountAmount = () => {
        setDiscountInput("");
    }




    const submitItemCategory = () => {
        // Category
        // eslint-disable-next-line no-array-constructor
        let catArr = new Array();
        $(".categoryListSelect").each((i) => {
            if ($(".categoryListSelect").eq(i).prop("checked") === true) {
                const catClass = $(".categoryListSelect").eq(i);
                catArr.push({ id: catClass.attr("data-category-id"), name: catClass.val(), description: catClass.attr("data-cat-desc") });
            }
        });

        // Items
        // eslint-disable-next-line no-array-constructor
        let itemArr = new Array();
        $(".itemListSelect").each((i) => {
            if ($(".itemListSelect").eq(i).prop("checked") === true) {
                const catClass = $(".itemListSelect").eq(i);
                itemArr.push({ id: catClass.attr("data-item-id"), name: catClass.val(), description: catClass.attr("data-item-desc") });
            }
        });


        setSelectedItemCategory({ category: catArr, item: itemArr });
        closeInstructionModel();
    }


    const lowStockSwitch = (event) => {
        $("#redeem_alert_div").hide();
        if (event.target.checked === true) {
            $("#redeem_alert_div").show();
        }
    }


    const eligibleItemSwitch = (event) => {
        $("#add_eligible_div, #eligibleLinkButton").hide();
        if (event.target.checked === true) {
            $("#add_eligible_div, #eligibleLinkButton").show();
        }
    }

    const durationSwitch = (event) => {
        $("#duration_change_div, #duration_daterange").hide();
        if (event.target.checked === true) {
            $("#duration_change_div").attr("style", "display: flex");
            changeClick();
        }
    }
    const discountScheduleSwitch = (event) => {
        if (event.target.checked === true) {
            $("#days_schedule_switch, #edit_day_time").show();
        }
        else { 
            $("#days_schedule_switch, #edit_day_time").hide();
            setScheduleDays({});
        }
    }

    const changeClick = () => {
        $("#duration_daterange").hide();
        if ($("input[type='radio'][name='discount_dates']").prop("checked") === false) {
            $("#duration_daterange").show();
        }
    }




    const toggleTimeSchedule = (event) => {
        const currentInputId = event.target.id;
        $("#" + currentInputId).parent().parent().find(".days_range").attr("style", "display: none");


        // Day Selected
        if ($("#" + currentInputId).prop("checked") === true) {
            $("#" + currentInputId).parent().parent().find(".days_range").attr("style", "display: flex");
        }
    }

    const [scheduleDays, setScheduleDays] = useState({});
    const submitSelectedDays = () => {
        let arr = {};

        $(".days").each((i) => {
            let cb = $(".days").eq(i).find("input[type='checkbox']");

            if (cb.prop("checked") === true) {
                let startTime = $(".days").eq(i).find("select[name='start-time1']");
                let startTime2 = $(".days").eq(i).find("select[name='start-time2']");
                let endTime = $(".days").eq(i).find("select[name='end-time1']");
                let endTime2 = $(".days").eq(i).find("select[name='end-time2']");


                let st = (startTime.val().replace(" ", "") + " " + startTime2.val());
                let et = (endTime.val().replace(" ", "") + " " + endTime2.val());
                arr[cb.val().toString()[0].toUpperCase() + cb.val().toString().slice(1)] = { "start_time": st, "end_time": et };

            }
        });

        setScheduleDays(arr);
        closeInstructionModel();
    }


    useEffect(() => {
        if (selectedItemCategory?.category?.length > 0) {
            setChecked(true);
        }
        else {
            setChecked(false);
        }

        if (selectedItemCategory?.item?.length > 0) {
            setTicked(true);
        }
        else {
            setTicked(false);
        }

    }, [selectedItemCategory]);




    return (
        <div className="font-medium min-h-[100vh] w-[100%]  custom-container-left custom-scroll-auto">
            <div className="font-medium pb-[60px]">
                <header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[60px]">
                    <Link to="/dashboard/store" state={{ tab: "discount" }}><CloseBtn /></Link>
                    <p className="text-xl text-black ">Edit Discount</p>
                    <div>
                        {/* <input type="button" value="Edit" className="bg-[#00D632] text-white py-2 px-4 rounded-sm hover:cursor-pointer hover:bg-green-500"></input> */}
                    </div>
                </header>
                <main className="max-w-3xl m-auto">
                    <div className="flex justify-center ">
                        <form action='' autoComplete="off" method='POST' className="w-full" onSubmit={(event) => formSubmitHandler(event)}  >

                            <h3 className="text-lg mb-[10px] font-semibold">Discount Information</h3>

                            <div className="relative py-2 mb-1">
                                <input type="text" name="name" id="name" ref={discountName} value={input.name} title="" placeholder=" " onChange={(e) => setInput({ ...input, name: e.currentTarget.value })} className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />

                                <label htmlFor="name" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Discount Name</label>
                            </div>
                            <div className="relative py-2 mb-1">
                                <input type="text" name="amount" id="amount" ref={discountAmount} value={discountInput} title="" placeholder=" " onChange={(e) => discountAmountHandle(e.target)} className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer -z-50" required />

                                <label htmlFor="amount" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Discount Amount</label>

                                {(prevData.is_percentage === true || prevData.is_percentage === false) &&

                                    (prevData.is_percentage === true) ?
                                    <ul className="items-center float-right -mt-[44px] w-[120px] text-sm font-medium text-gray-900 bg-white rounded-lg  sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white z-50">
                                        <label htmlFor="discount_type_1" className="flex items-center w-full z-10 ">
                                            <input type="radio" name="discount_type" id="discount_type_1" onChange={setDiscountAmount} value="percentage" defaultChecked />
                                            <span></span>
                                            <span className="py-2 text-lg inline-block">%</span>
                                        </label>

                                        <label htmlFor="discount_type_2" className="flex items-center w-full z-50 ">
                                            <input type="radio" name="discount_type" id="discount_type_2" onChange={setDiscountAmount} value="amount" />
                                            <span></span>
                                            <span className="py-2 pt-3 text-sm inline-block">৳</span>
                                        </label>
                                    </ul>
                                    :
                                    <ul className="items-center float-right -mt-[44px] w-[120px] text-sm font-medium text-gray-900 bg-white rounded-lg  sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white z-50">
                                        <label htmlFor="discount_type_1" className="flex items-center w-full z-10 ">
                                            <input type="radio" name="discount_type" id="discount_type_1" onChange={setDiscountAmount} value="percentage" />
                                            <span></span>
                                            <span className="py-2 text-lg inline-block">%</span>
                                        </label>

                                        <label htmlFor="discount_type_2" className="flex items-center w-full z-50 ">
                                            <input type="radio" name="discount_type" id="discount_type_2" onChange={setDiscountAmount} value="amount" defaultChecked />
                                            <span></span>
                                            <span className="py-2 pt-3 text-sm inline-block">৳</span>
                                        </label>
                                    </ul>

                                }
                            </div>


                            <div className="bg-[#EDEDED] h-[.8px] my-7 "></div>

                            <label className="toggle my-1">
                                {(prevData.categories) && <input id="apply_item_or_category" name="apply_item_or_category" onChange={(event) => eligibleItemSwitch(event)} className="toggle-checkbox" type="checkbox" defaultChecked={applyIC} />}
                                <div className="toggle-switch"></div>
                                <span className="toggle-label">&nbsp;Apply to Specific Items or Categories</span>
                            </label>


                            {(prevData.categories?.length === 0 && prevData.items?.length === 0) ?
                                <div className='hidden border rounded-lg shadow mt-6 mb-2' id="add_eligible_div">
                                    <table className='min-w-full divide-y divide-gray-200 '>
                                        <thead className='bg-neutral-100'>
                                            <tr className=' text-center'>

                                                <th scope="col" className="px-6 py-3  text-left" style={{ width: "500px" }}>Name</th>
                                                <th scope="col" className="px-6 py-3  text-center" style={{ width: "200px" }}>Type</th>

                                                {/* <th scope="col" className="px-8 py-3 text-center " style={{ width: "100px" }}>Remove</th> */}
                                            </tr>
                                        </thead>


                                        <tbody className='divide-y divide-gray-200' style={{ fontSize: "14px" }}>
                                            {selectedItemCategory.category.map((data, index) =>
                                                <tr key={`cat-${index}`} id={`cat-${index}`}>
                                                    <td className='px-6 py-4 border-r-2 text-left' style={{ borderRight: "2px solid #e5e7eb" }}>{data.name}</td>
                                                    <td className='px-6 py-4 text-center'>Category</td>
                                                    {/* <td className='grid px-6 py-4 justify-items-center ' > 
                                                        <img src={deleteIcon} alt="Delete Icon" className="cursor-pointer" onClick={()=>removeItemCategory(`cat`, index)} /> 
                                                    </td> */}
                                                </tr>
                                            )}

                                            {selectedItemCategory.item.map((data, index) =>
                                                <tr key={`item-${index}`} id={`item-${index}`}>
                                                    <td className='px-6 py-4 border-r-2  text-left' style={{ borderRight: "2px solid #e5e7eb" }}>{data.name}</td>
                                                    <td className='px-6 py-4 text-center'>Item </td>
                                                    {/* <td className='grid px-6 py-4 justify-items-center' > 
                                                        <img src={deleteIcon} alt="Delete Icon" className="cursor-pointer" onClick={()=>removeItemCategory(`item`, index)} /> 
                                                    </td> */}
                                                </tr>
                                            )}

                                        </tbody>
                                    </table>
                                </div>
                                :
                                <div className=' border rounded-lg shadow mt-6 mb-2' id="add_eligible_div">
                                    <table className='min-w-full divide-y divide-gray-200 '>
                                        <thead className='bg-neutral-100'>
                                            <tr className=' text-center'>

                                                <th scope="col" className="px-6 py-3  text-left" style={{ width: "500px" }}>Name</th>
                                                <th scope="col" className="px-6 py-3  text-center" style={{ width: "200px" }}>Type</th>

                                                {/* <th scope="col" className="px-8 py-3 text-center " style={{ width: "100px" }}>Remove</th> */}
                                            </tr>
                                        </thead>


                                        <tbody className='divide-y divide-gray-200' style={{ fontSize: "14px" }}>
                                            {selectedItemCategory.category.map((data, index) =>
                                                <tr key={`cat-${index}`} id={`cat-${index}`}>

                                                    <td className='px-6 py-4 border-r-2 text-left' style={{ borderRight: "2px solid #e5e7eb" }}>{data.name}</td>
                                                    <td className='px-6 py-4 text-center'>Category</td>
                                                    {/* <td className='grid px-6 py-4 justify-items-center'> 
                                                        <img src={deleteIcon} alt="Delete Icon" className="cursor-pointer" onClick={()=>removeItemCategory(`cat`, index)} /> 
                                                    </td> */}
                                                </tr>
                                            )}

                                            {selectedItemCategory.item.map((data, index) =>
                                                <tr key={`item-${index}`} id={`item-${index}`}>

                                                    <td className='px-6 py-4 border-r-2  text-left' style={{ borderRight: "2px solid #e5e7eb" }}>{data.name}</td>
                                                    <td className='px-6 py-4 text-center'>Item </td>
                                                    {/* <td className='grid px-6 py-4 justify-items-center' > 
                                                        <img src={deleteIcon} alt="Delete Icon" className="cursor-pointer" onClick={()=>removeItemCategory(`item`, index)} /> 
                                                    </td> */}
                                                </tr>
                                            )}

                                        </tbody>
                                    </table>
                                </div>
                            }

                            {(editInstruction.eligibleItems) &&
                                <div>
                                    <Popup content={


                                        <div className=" p-5 font-medium">
                                            <div className="flex justify-between">
                                                <h3 className="text-xl text-black">Select Items</h3>
                                                <CloseBtn className="cursor-pointer" onClick={() => closeInstructionModel()} />
                                            </div>

                                            <div className="bg-[#EDEDED] h-[.8px] my-4"></div>

                                            {/* 

                                            <div className="relative py-2 mb-5  pb-1 ">
                                                <input type="text" name="name" id="name" title="" placeholder="Search Item/Category" className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" />
                                            </div> */}



                                            <div className="checkList">
                                                <div className="list-container">
                                                    <div className="mr-[6px] flex justify-between">
                                                        <div className="flex items-center">
                                                            {(selectedItemCategory.category.length > 0) ?

                                                                <input type="checkbox" id="group1" value="1" className="mr-2.5 text-primary focus:ring-primary border-dark-white" defaultChecked="checked" onChange={() => setChecked(!checked)} />
                                                                :
                                                                <input type="checkbox" id="group1" value="1" className="mr-2.5 text-primary focus:ring-primary border-dark-white" onChange={() => setChecked(!checked)} />
                                                            }
                                                            <label htmlFor="group1" className="text-secondary font-semibold">Category </label>
                                                        </div>
                                                        {checked === true ?
                                                            <img src={dropdownIcon} alt="" />
                                                            :
                                                            <img src={dropupIcon} alt="" />
                                                        }
                                                    </div>

                                                    <div className="bg-[#EDEDED] h-[.8px] my-2.5 "></div>

                                                    {checked === true &&
                                                        <div className='mb-5 ml-4 mt-2'>
                                                            {categoryList.map((data, index) =>
                                                                <div key={index} className="mr-[30px]">
                                                                    {(selectedItemCategory.category.find((categoryList) => categoryList.name === data.name)) ?
                                                                        <input type="checkbox" value={data.name}
                                                                            data-category-id={data.id} defaultChecked="checked" data-cat-desc={data.description} id={`item${index}`} className="mr-2.5 text-primary focus:ring-primary border-dark-white categoryListSelect"
                                                                        />
                                                                        :
                                                                        <input type="checkbox" value={data.name}
                                                                            data-category-id={data.id} data-cat-desc={data.description} id={`item${index}`} className="mr-2.5 text-primary focus:ring-primary border-dark-white categoryListSelect"
                                                                        />
                                                                    }
                                                                    <label className="text-secondary" htmlFor={`item${index}`} >{data.name}</label>
                                                                </div>
                                                            )}
                                                        </div>
                                                    }

                                                    <div className="bg-[#EDEDED] h-[.8px] my-2.5"></div>
                                                    <div className="mr-[6px] flex justify-between">
                                                        <div className="flex items-center">
                                                            {(selectedItemCategory.item.length > 0) ?
                                                                <input type="checkbox" value="2" className="mr-2.5 text-primary focus:ring-primary border-dark-white"
                                                                    id="group2" defaultChecked="checked" onChange={() => setTicked(!ticked)} />
                                                                :
                                                                <input type="checkbox" value="2" className="mr-2.5 text-primary focus:ring-primary border-dark-white"
                                                                    id="group2" onChange={() => setTicked(!ticked)} />
                                                            }
                                                            <label htmlFor="group2" className="text-secondary font-semibold">Items </label>
                                                        </div>
                                                        {ticked === true ?
                                                            <img src={dropdownIcon} alt="Dropdown icon" />
                                                            :
                                                            <img src={dropupIcon} alt="Drop up icon" />
                                                        }
                                                    </div>
                                                    <div className="bg-[#EDEDED] h-[.8px] mt-2 mb-5"></div>
                                                    {ticked === true &&
                                                        <div className='mb-5 ml-4 -mt-2'>
                                                            {itemList.map((data, index) =>
                                                                <div key={index} className="mr-[30px]">
                                                                    {(selectedItemCategory.item.find((itemList) => itemList.name === data.name)) ?
                                                                        <input type="checkbox" value={data.name} data-item-id={data.id} data-item-desc={data.description} name={data.name} defaultChecked id={`item2${index}`} className="mr-2.5 text-primary focus:ring-primary border-dark-white itemListSelect" />
                                                                        :
                                                                        <input type="checkbox" value={data.name} data-item-id={data.id} data-item-desc={data.description} name={data.name} id={`item2${index}`} className="mr-2.5 text-primary focus:ring-primary border-dark-white itemListSelect" />
                                                                    }

                                                                    <label className="text-secondary" htmlFor={`item2${index}`}>{data.name}</label>
                                                                </div>
                                                            )}

                                                        </div>
                                                    }
                                                </div>
                                            </div>

                                            <button type="button" onClick={() => submitItemCategory()} className="text-white bg-black py-3 text-base rounded cursor-pointer w-full hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-wait">
                                                Save
                                            </button>



                                        </div>}

                                    />
                                </div>
                            }

                            <p to="#" id="eligibleLinkButton" onClick={() => openInstructionModel(1)} className=' text-[#0774E9] text-[15px] font-medium flex items-center py-1 cursor-pointer'>
                                Add Eligible Items or Categories
                                &nbsp;
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline">
                                    <path d="M11.0007 6.21301C10.8238 6.21301 10.6543 6.28325 10.5292 6.40827C10.4042 6.53329 10.334 6.70286 10.334 6.87967V11.6663C10.334 11.8432 10.2637 12.0127 10.1387 12.1377C10.0137 12.2628 9.84413 12.333 9.66732 12.333H2.33398C2.15717 12.333 1.9876 12.2628 1.86258 12.1377C1.73756 12.0127 1.66732 11.8432 1.66732 11.6663V4.33301C1.66732 4.1562 1.73756 3.98663 1.86258 3.8616C1.9876 3.73658 2.15717 3.66634 2.33398 3.66634H7.12065C7.29746 3.66634 7.46703 3.5961 7.59206 3.47108C7.71708 3.34605 7.78732 3.17649 7.78732 2.99967C7.78732 2.82286 7.71708 2.65329 7.59206 2.52827C7.46703 2.40325 7.29746 2.33301 7.12065 2.33301H2.33398C1.80355 2.33301 1.29484 2.54372 0.919771 2.91879C0.544698 3.29387 0.333984 3.80257 0.333984 4.33301V11.6663C0.333984 12.1968 0.544698 12.7055 0.919771 13.0806C1.29484 13.4556 1.80355 13.6663 2.33398 13.6663H9.66732C10.1978 13.6663 10.7065 13.4556 11.0815 13.0806C11.4566 12.7055 11.6673 12.1968 11.6673 11.6663V6.87967C11.6673 6.70286 11.5971 6.53329 11.4721 6.40827C11.347 6.28325 11.1775 6.21301 11.0007 6.21301ZM13.614 0.746341C13.5463 0.583442 13.4169 0.453991 13.254 0.386341C13.1738 0.35218 13.0878 0.334061 13.0007 0.333008H9.00065C8.82384 0.333008 8.65427 0.403246 8.52925 0.52827C8.40422 0.653294 8.33398 0.822863 8.33398 0.999674C8.33398 1.17649 8.40422 1.34605 8.52925 1.47108C8.65427 1.5961 8.82384 1.66634 9.00065 1.66634H11.394L4.52732 8.52634C4.46483 8.58832 4.41524 8.66205 4.38139 8.74329C4.34754 8.82453 4.33012 8.91167 4.33012 8.99967C4.33012 9.08768 4.34754 9.17482 4.38139 9.25606C4.41524 9.3373 4.46483 9.41103 4.52732 9.47301C4.58929 9.53549 4.66303 9.58509 4.74427 9.61894C4.82551 9.65278 4.91264 9.67021 5.00065 9.67021C5.08866 9.67021 5.1758 9.65278 5.25704 9.61894C5.33828 9.58509 5.41201 9.53549 5.47398 9.47301L12.334 2.60634V4.99967C12.334 5.17649 12.4042 5.34605 12.5292 5.47108C12.6543 5.5961 12.8238 5.66634 13.0007 5.66634C13.1775 5.66634 13.347 5.5961 13.4721 5.47108C13.5971 5.34605 13.6673 5.17649 13.6673 4.99967V0.999674C13.6663 0.912556 13.6481 0.826489 13.614 0.746341Z" fill="#0774E9" />
                                </svg>
                            </p>


                            <div className="bg-[#EDEDED] h-[.8px] my-7"></div>

                            <h3 className="text-xl mb-[15px] font-medium">Discount Schedule</h3>
                            <label className="toggle my-1">
                                <input id="set_days_schedule" name="set_days_schedule" onClick={(event) => discountScheduleSwitch(event)} className="toggle-checkbox" type="checkbox" defaultChecked={prevData.discount_schedule} />
                                <div className="toggle-switch"></div>
                                <span className="toggle-label">&nbsp;Set a Days Schedule</span>
                            </label>
                            <div className="ml-[51px] -mt-1 pb-1 text-sm text-gray-500">Set the days of the week and times of day this discount is available. (Example: Happy Hour)</div>
                                
                                {(Object.keys(scheduleDays).length !== 0) ?
                                    <div className='border rounded-lg shadow mt-2 mb-2' id="days_schedule_switch">
                                        <table className='min-w-full divide-y divide-gray-200 '>
                                            <thead className='bg-neutral-100'>
                                                <tr className='text-left'>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Sun</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Mon</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Tue</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Wed</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Thu</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Fri</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Sat</th>
                                                </tr>
                                            </thead>
                                            <tbody className='divide-y divide-gray-200' style={{ fontSize: "14px" }}>
                                                <tr>

                                                    <td className='px-3 py-4 border-r-2  text-center' style={{ borderRight: "2px solid #e5e7eb" }}>
                                                        {(scheduleDays.Sunday !== undefined) ?
                                                            <>
                                                                {moment(scheduleDays.Sunday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays.Sunday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </> :
                                                            <>-</>
                                                        }
                                                    </td>
                                                    <td className='px-3 py-4 border-r-2  text-center'>
                                                        {(scheduleDays.Monday !== undefined) ?
                                                            <>
                                                                {moment(scheduleDays.Monday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays.Monday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </> :
                                                            <>-</>
                                                        }
                                                    </td>
                                                    <td className='px-3 py-4 border-r-2  text-center'>
                                                        {(scheduleDays.Tuesday !== undefined) ?
                                                            <>
                                                                {moment(scheduleDays.Tuesday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays.Tuesday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </> :
                                                            <>-</>
                                                        }
                                                    </td>
                                                    <td className='px-3 py-4 border-r-2  text-center'>
                                                        {(scheduleDays.Wednesday !== undefined) ?
                                                            <>
                                                                {moment(scheduleDays.Wednesday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays.Wednesday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </> :
                                                            <>-</>
                                                        }
                                                    </td>
                                                    <td className='px-3 py-4 border-r-2  text-center'>
                                                        {(scheduleDays.Thursday !== undefined) ?
                                                            <>
                                                                {moment(scheduleDays.Thursday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays.Thursday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </> :
                                                            <>-</>
                                                        }
                                                    </td>
                                                    <td className='px-3 py-4 text-center'>
                                                        {(scheduleDays.Friday !== undefined) ?
                                                            <>
                                                                {moment(scheduleDays.Friday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays.Friday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </> :
                                                            <>-</>
                                                        }
                                                    </td>
                                                    <td className='px-3 py-2 border-r-2  text-center' style={{ borderLeft: "2px solid #e5e7eb" }}>
                                                        {(scheduleDays.Saturday !== undefined) ?
                                                            <>
                                                                {moment(scheduleDays.Saturday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays.Saturday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </> :
                                                            <>-</>
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    :
                                    <div className='hidden border rounded-lg shadow mt-2 mb-2' id="days_schedule_switch">
                                        <table className='min-w-full divide-y divide-gray-200 '>
                                            <thead className='bg-neutral-100'>
                                                <tr className='text-left'>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Sun</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Mon</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Tue</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Wed</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Thu</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Fri</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Sat</th>
                                                </tr>
                                            </thead>
                                            <tbody className='divide-y divide-gray-200' style={{ fontSize: "14px" }}>
                                                <tr>

                                                    <td className='px-3 py-4 border-r-2  text-center' style={{ borderRight: "2px solid #e5e7eb" }}>
                                                        {(scheduleDays.Sunday !== undefined) ?
                                                            <>
                                                                {moment(scheduleDays.Sunday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays.Sunday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </> :
                                                            <>-</>
                                                        }
                                                    </td>
                                                    <td className='px-3 py-4 border-r-2  text-center'>
                                                        {(scheduleDays.Monday !== undefined) ?
                                                            <>
                                                                {moment(scheduleDays.Monday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays.Monday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </> :
                                                            <>-</>
                                                        }
                                                    </td>
                                                    <td className='px-3 py-4 border-r-2  text-center'>
                                                        {(scheduleDays.Tuesday !== undefined) ?
                                                            <>
                                                                {moment(scheduleDays.Tuesday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays.Tuesday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </> :
                                                            <>-</>
                                                        }
                                                    </td>
                                                    <td className='px-3 py-4 border-r-2  text-center'>
                                                        {(scheduleDays.Wednesday !== undefined) ?
                                                            <>
                                                                {moment(scheduleDays.Wednesday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays.Wednesday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </> :
                                                            <>-</>
                                                        }
                                                    </td>
                                                    <td className='px-3 py-4 border-r-2  text-center'>
                                                        {(scheduleDays.Thursday !== undefined) ?
                                                            <>
                                                                {moment(scheduleDays.Thursday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays.Thursday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </> :
                                                            <>-</>
                                                        }
                                                    </td>
                                                    <td className='px-3 py-4 text-center'>
                                                        {(scheduleDays.Friday !== undefined) ?
                                                            <>
                                                                {moment(scheduleDays.Friday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays.Friday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </> :
                                                            <>-</>
                                                        }
                                                    </td>
                                                    <td className='px-3 py-2 border-r-2  text-center' style={{ borderLeft: "2px solid #e5e7eb" }}>
                                                        {(scheduleDays.Saturday !== undefined) ?
                                                            <>
                                                                {moment(scheduleDays.Saturday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays.Saturday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </> :
                                                            <>-</>
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                }
                            
                            {(editInstruction.editDaytime) &&
                                <div>
                                    <Popup content={
                                        <div className="p-5 font-medium">
                                            <div className="flex justify-between mb-2">
                                                <h3 className="text-xl text-black">Edit Days & Times</h3>
                                                <CloseBtn className="cursor-pointer" onClick={() => closeInstructionModel(2)} />
                                            </div>

                                            <hr />


                                            <div className="relative py-2 mb-1">

                                                <div className="days block py-2">
                                                    <div className='flex items-center'>
                                                        {scheduleDays.Saturday !== undefined ?
                                                            <input type="checkbox" defaultChecked="checked" id="sat" value="saturday" name='sat' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white check_class" />
                                                            :
                                                            <input type="checkbox" id="sat" value="saturday" name='sat' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white check_class" />
                                                        }

                                                        <label htmlFor="sat" className="text-secondary font-semibold">Saturday </label>
                                                    </div>


                                                    <div className='py-2 flex align-middle items-center days_range'>

                                                        <select name="start-time1" className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm' defaultValue={moment(scheduleDays.Saturday?.start_time, "hh:mm A").format("hh : mm")} >
                                                            {hours.map((data, index) =>
                                                                <option key={index} value={data}>{data}</option>
                                                            )}
                                                        </select>
                                                        <select name="start-time2" defaultValue={moment(scheduleDays.Saturday?.start_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>

                                                        <svg className='mx-4' width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect y="0.5" width="10" height="2" fill="#999999" />
                                                        </svg>


                                                        <select name="end-time1" className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'
                                                            defaultValue={moment(scheduleDays.Saturday?.end_time, "hh:mm A").format("hh : mm")} >
                                                            {hours.map((data, index) =>
                                                                <option key={index} value={data}>{data}</option>
                                                            )}
                                                        </select>
                                                        <select name="end-time2" defaultValue={moment(scheduleDays.Saturday?.end_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>
                                                    </div>
                                                </div>


                                                <div className="days block py-2">
                                                    <div className='flex items-center'>
                                                        {scheduleDays.Sunday !== undefined ?
                                                            <input type="checkbox" defaultChecked="checked" id="sun" value="sunday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white check_class" />
                                                            :
                                                            <input type="checkbox" id="sun" value="sunday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white check_class" />
                                                        }
                                                        <label htmlFor="sun" className="text-secondary font-semibold">Sunday </label>
                                                    </div>

                                                    <div className='py-2 flex align-middle items-center days_range'>
                                                        <select name="start-time1" defaultValue={moment(scheduleDays.Sunday?.start_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                            {hours.map((data, index) =>
                                                                <option key={index} value={data}>{data}</option>
                                                            )}
                                                        </select>
                                                        <select name="start-time2" defaultValue={moment(scheduleDays.Saturday?.start_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>

                                                        <svg className='mx-4' width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect y="0.5" width="10" height="2" fill="#999999" />
                                                        </svg>


                                                        <select name="end-time1" defaultValue={moment(scheduleDays.Sunday?.end_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                            {hours.map((data, index) =>
                                                                <option key={index} value={data}>{data}</option>
                                                            )}
                                                        </select>
                                                        <select name="end-time2" defaultValue={moment(scheduleDays.Saturday?.end_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="days block py-2">
                                                    <div className='flex items-center'>
                                                        {scheduleDays.Monday !== undefined ?
                                                            <input type="checkbox" defaultChecked="checked" id="mon" value="monday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white check_class" />
                                                            :
                                                            <input type="checkbox" id="mon" value="monday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white check_class" />
                                                        }
                                                        <label htmlFor="mon" className="text-secondary font-semibold">Monday </label>
                                                    </div>

                                                    <div className='py-2 flex align-middle items-center days_range'>
                                                        <select name="start-time1" defaultValue={moment(scheduleDays.Monday?.start_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                            {hours.map((data, index) =>
                                                                <option key={index} value={data}>{data}</option>
                                                            )}
                                                        </select>
                                                        <select name="start-time2" defaultValue={moment(scheduleDays.Monday?.start_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>

                                                        <svg className='mx-4' width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect y="0.5" width="10" height="2" fill="#999999" />
                                                        </svg>


                                                        <select name="end-time1" defaultValue={moment(scheduleDays.Monday?.end_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                            {hours.map((data, index) =>
                                                                <option key={index} value={data}>{data}</option>
                                                            )}
                                                        </select>
                                                        <select name="end-time2" defaultValue={moment(scheduleDays.Monday?.end_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="days block py-2">
                                                    <div className='flex items-center'>
                                                        {scheduleDays.Tuesday !== undefined ?
                                                            <input type="checkbox" defaultChecked="checked" id="tue" value="tuesday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                            :
                                                            <input type="checkbox" id="tue" value="tuesday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                        }
                                                        <label htmlFor="tue" className="text-secondary font-semibold">Tuesday </label>
                                                    </div>

                                                    <div className='py-2 flex align-middle items-center days_range'>
                                                        <select name="start-time1" defaultValue={moment(scheduleDays.Tuesday?.start_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                            {hours.map((data, index) =>
                                                                <option key={index} value={data}>{data}</option>
                                                            )}
                                                        </select>
                                                        <select name="start-time2" defaultValue={moment(scheduleDays.Tuesday?.start_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>

                                                        <svg className='mx-4' width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect y="0.5" width="10" height="2" fill="#999999" />
                                                        </svg>


                                                        <select name="end-time1" defaultValue={moment(scheduleDays.Tuesday?.end_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                            {hours.map((data, index) =>
                                                                <option key={index} value={data}>{data}</option>
                                                            )}
                                                        </select>
                                                        <select name="end-time2" defaultValue={moment(scheduleDays.Tuesday?.end_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="days block py-2">
                                                    <div className='flex items-center'>
                                                        {scheduleDays.Wednesday !== undefined ?
                                                            <input type="checkbox" defaultChecked="checked" id="wed" value="wednesday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                            :
                                                            <input type="checkbox" id="wed" value="wednesday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                        }
                                                        <label htmlFor="wed" className="text-secondary font-semibold">Wednesday </label>
                                                    </div>

                                                    <div className='py-2 flex align-middle items-center days_range'>
                                                        <select name="start-time1" defaultValue={moment(scheduleDays.Wednesday?.start_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                            {hours.map((data, index) =>
                                                                <option key={index} value={data}>{data}</option>
                                                            )}
                                                        </select>
                                                        <select name="start-time2" defaultValue={moment(scheduleDays.Wednesday?.start_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>

                                                        <svg className='mx-4' width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect y="0.5" width="10" height="2" fill="#999999" />
                                                        </svg>


                                                        <select name="end-time1" defaultValue={moment(scheduleDays.Wednesday?.end_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                            {hours.map((data, index) =>
                                                                <option key={index} value={data}>{data}</option>
                                                            )}
                                                        </select>
                                                        <select name="end-time2" defaultValue={moment(scheduleDays.Wednesday?.end_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>
                                                    </div>
                                                </div>


                                                <div className="days block py-2">
                                                    <div className='flex items-center'>
                                                        {scheduleDays.Thursday !== undefined ?
                                                            <input type="checkbox" defaultChecked="checked" id="thu" value="thursday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                            :
                                                            <input type="checkbox" id="thu" value="thursday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                        }
                                                        <label htmlFor="thu" className="text-secondary font-semibold">Thursday </label>
                                                    </div>

                                                    <div className='py-2 flex align-middle items-center days_range'>
                                                        <select name="start-time1" defaultValue={moment(scheduleDays.Thursday?.start_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                            {hours.map((data, index) =>
                                                                <option key={index} value={data}>{data}</option>
                                                            )}
                                                        </select>
                                                        <select name="start-time2" defaultValue={moment(scheduleDays.Thursday?.start_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>

                                                        <svg className='mx-4' width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect y="0.5" width="10" height="2" fill="#999999" />
                                                        </svg>


                                                        <select name="end-time1" defaultValue={moment(scheduleDays.Thursday?.end_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                            {hours.map((data, index) =>
                                                                <option key={index} value={data}>{data}</option>
                                                            )}
                                                        </select>
                                                        <select name="end-time2" defaultValue={moment(scheduleDays.Thursday?.end_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="days block py-2">
                                                    <div className='flex items-center'>
                                                        {scheduleDays.Friday !== undefined ?
                                                            <input type="checkbox" defaultChecked="checked" id="fri" value="friday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                            :
                                                            <input type="checkbox" id="fri" value="friday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                        }
                                                        <label htmlFor="fri" className="text-secondary font-semibold">Friday </label>
                                                    </div>

                                                    <div className='py-2 flex align-middle items-center days_range'>
                                                        <select name="start-time1" defaultValue={moment(scheduleDays.Friday?.start_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                            {hours.map((data, index) =>
                                                                <option key={index} value={data}>{data}</option>
                                                            )}
                                                        </select>
                                                        <select name="start-time2" defaultValue={moment(scheduleDays.Friday?.start_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>

                                                        <svg className='mx-4' width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect y="0.5" width="10" height="2" fill="#999999" />
                                                        </svg>


                                                        <select name="end-time1" defaultValue={moment(scheduleDays.Friday?.end_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                            {hours.map((data, index) =>
                                                                <option key={index} value={data}>{data}</option>
                                                            )}
                                                        </select>
                                                        <select name="end-time2" defaultValue={moment(scheduleDays.Friday?.end_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>


                                            <button type="button" onClick={() => submitSelectedDays()} className="text-white bg-black py-3 text-base rounded cursor-pointer w-full hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-wait">
                                                Save
                                            </button>

                                        </div>
                                    }

                                    />
                                </div>
                            }

                            <p id="edit_day_time" onClick={() => openInstructionModel(2)} className={`${scheduleDays.length !== 0 ? "flex items-center" : "hidden"}  text-[#0774E9] text-base font-medium mt-2 cursor-pointer`} >
                                Edit Day & Time
                                &nbsp;
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline">
                                    <path d="M11.0007 6.21301C10.8238 6.21301 10.6543 6.28325 10.5292 6.40827C10.4042 6.53329 10.334 6.70286 10.334 6.87967V11.6663C10.334 11.8432 10.2637 12.0127 10.1387 12.1377C10.0137 12.2628 9.84413 12.333 9.66732 12.333H2.33398C2.15717 12.333 1.9876 12.2628 1.86258 12.1377C1.73756 12.0127 1.66732 11.8432 1.66732 11.6663V4.33301C1.66732 4.1562 1.73756 3.98663 1.86258 3.8616C1.9876 3.73658 2.15717 3.66634 2.33398 3.66634H7.12065C7.29746 3.66634 7.46703 3.5961 7.59206 3.47108C7.71708 3.34605 7.78732 3.17649 7.78732 2.99967C7.78732 2.82286 7.71708 2.65329 7.59206 2.52827C7.46703 2.40325 7.29746 2.33301 7.12065 2.33301H2.33398C1.80355 2.33301 1.29484 2.54372 0.919771 2.91879C0.544698 3.29387 0.333984 3.80257 0.333984 4.33301V11.6663C0.333984 12.1968 0.544698 12.7055 0.919771 13.0806C1.29484 13.4556 1.80355 13.6663 2.33398 13.6663H9.66732C10.1978 13.6663 10.7065 13.4556 11.0815 13.0806C11.4566 12.7055 11.6673 12.1968 11.6673 11.6663V6.87967C11.6673 6.70286 11.5971 6.53329 11.4721 6.40827C11.347 6.28325 11.1775 6.21301 11.0007 6.21301ZM13.614 0.746341C13.5463 0.583442 13.4169 0.453991 13.254 0.386341C13.1738 0.35218 13.0878 0.334061 13.0007 0.333008H9.00065C8.82384 0.333008 8.65427 0.403246 8.52925 0.52827C8.40422 0.653294 8.33398 0.822863 8.33398 0.999674C8.33398 1.17649 8.40422 1.34605 8.52925 1.47108C8.65427 1.5961 8.82384 1.66634 9.00065 1.66634H11.394L4.52732 8.52634C4.46483 8.58832 4.41524 8.66205 4.38139 8.74329C4.34754 8.82453 4.33012 8.91167 4.33012 8.99967C4.33012 9.08768 4.34754 9.17482 4.38139 9.25606C4.41524 9.3373 4.46483 9.41103 4.52732 9.47301C4.58929 9.53549 4.66303 9.58509 4.74427 9.61894C4.82551 9.65278 4.91264 9.67021 5.00065 9.67021C5.08866 9.67021 5.1758 9.65278 5.25704 9.61894C5.33828 9.58509 5.41201 9.53549 5.47398 9.47301L12.334 2.60634V4.99967C12.334 5.17649 12.4042 5.34605 12.5292 5.47108C12.6543 5.5961 12.8238 5.66634 13.0007 5.66634C13.1775 5.66634 13.347 5.5961 13.4721 5.47108C13.5971 5.34605 13.6673 5.17649 13.6673 4.99967V0.999674C13.6663 0.912556 13.6481 0.826489 13.614 0.746341Z" fill="#0774E9" />
                                </svg>
                            </p>

                            <div className="bg-[#EDEDED] h-[.8px] my-7"></div>

                            {(prevData.duration_type) &&
                                <>
                                    <label className="toggle">
                                        <input id="set_days_schedule" name="set_days_schedule" onChange={(event) => durationSwitch(event)} className="toggle-checkbox" type="checkbox" defaultChecked={prevData.duration_type > 0 ? true : false} />
                                        <div className="toggle-switch"></div>
                                        <span className="toggle-label">&nbsp;Duration</span>
                                    </label>
                                    <div className="ml-[51px] mt-0.5 pb-1 text-sm text-gray-500">Set the dates this discount is available. (Example: Seasonal Sale)</div>


                                    <div className={prevData.duration_type > 0 ? 'block' : 'hidden'} id="duration_change_div">
                                        <ul className="items-center float-right w-full text-sm font-medium text-gray-900 bg-white rounded-lg  dark:bg-gray-700 dark:border-gray-600 dark:text-white  pl-9">

                                            {
                                                prevData.duration_type === 1 ?
                                                    <>
                                                        <label htmlFor="discount_dates" className="block items-center w-full ">
                                                            <input type="radio" onChange={changeClick} name="discount_dates" id="discount_dates" value="forever" defaultChecked={true} />
                                                            <span></span>
                                                            <span className=" text-[15px] inline-block">Forever</span>
                                                        </label>
                                                        <label htmlFor="discount_dates2" className="block items-center w-full  -mt-2">
                                                            <input type="radio" onChange={changeClick} name="discount_dates" id="discount_dates2" value="range" />
                                                            <span></span>
                                                            <span className="text-[15px] inline-block">Set Date Range</span>
                                                        </label>
                                                    </>
                                                    :
                                                    <>
                                                        <label htmlFor="discount_dates" className="block items-center w-full ">
                                                            <input type="radio" onChange={changeClick} name="discount_dates" id="discount_dates" value="forever" />
                                                            <span></span>
                                                            <span className=" text-[15px] inline-block">Forever</span>
                                                        </label>
                                                        <label htmlFor="discount_dates2" className="block items-center w-full  -mt-2">
                                                            <input type="radio" onChange={changeClick} name="discount_dates" id="discount_dates2" value="range" defaultChecked={true} />
                                                            <span></span>
                                                            <span className="text-[15px] inline-block">Set Date Range</span>
                                                        </label>
                                                    </>
                                            }
                                        </ul>
                                    </div>



                                    <div id="duration_daterange" className={`${prevData.duration_type === 2 ? "block" : "hidden"} h-[180px] w-full py-2 mb-1 pb-1 mt-2`}>
                                        
                                        <div className="p-2">
                                            <span className="">Start Date & Time</span>
                                            <div className="flex pr-4">
                                                <div className="dateRange">
                                                    <CustomDate startDate={prevData.start_date}></CustomDate>
                                                </div>
                                                <input id="startTime" type="time" name="start-time" className="w-full float-left text-center border-none bg-[#F5F5F5] rounded-r" placeholder="Set Time" defaultValue={moment(prevData.start_date, "YYYY-MM-DD HH:mm:ss").format("HH:mm") + ""} />


                                            </div>
                                        </div>

                                        <div className="p-2">
                                            <span className="">End Date & Time</span>
                                            <div className="flex pr-4">
                                                <div className="dateRange" >
                                                    <CustomEndDate endDate={prevData.end_date}></CustomEndDate>
                                                </div>

                                                <input id="endTime" type="time" name="end-time" className="w-full ml-1 float-left text-center border-none bg-[#F5F5F5] rounded-r" placeholder="Set Time" defaultValue={moment(prevData.end_date, "YYYY-MM-DD HH:mm:ss").format("HH:mm") + ""} />
                                            </div>
                                        </div>
                                    </div>

                                </>
                            }





                            <div className="bg-[#EDEDED] h-[.8px] my-10 "></div>

                            <h3 className="text-xl mb-[15px] font-medium ">Redemption Limit</h3>
                            <label className="toggle my-1">

                                {(prevData.max_use) &&
                                    <input id="set_redeem_limit" name="set_redeem_limit" onChange={(event) => lowStockSwitch(event)} className="toggle-checkbox" type="checkbox" defaultChecked={prevData.max_use > 0 ? true : false} />
                                }
                                <div className="toggle-switch"></div>
                                <span className="toggle-label">&nbsp;Set Redeem Number</span>
                            </label>
                            <div className="ml-[51px] -mt-1 pb-1 text-sm text-gray-500">Set the limit of total number of times this coupon can be redeemed</div>



                            {prevData.max_use > 0 && <div className=" relative py-2 mb-1 ml-[51px] -mt-1 pb-1" id="redeem_alert_div">
                                <label className="toggle my-1">
                                    <span className="-mt-1 pb-1">&nbsp;Redeem Limit</span>
                                </label>
                                <input ref={redeemAmount} id="redeemLimit" name="redeemLimit" type="text" title="" defaultValue={prevData.max_use} placeholder="Enter your redeem value" className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    onChange={handleChange} />

                                <div className="float-right -mt-[44px] mr-5 text-sm font-medium text-gray-500 bg-white rounded-lg  sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white z-50">

                                    <label htmlFor="discount_type_2" className="flex float-right w-full z-50 ">

                                        <span className="py-2 pt-3 text-sm inline-block">Times</span>
                                    </label>
                                </div>
                            </div>
                            }


                            <div className="bg-[#EDEDED] h-[.8px] my-7"></div>

                            {/* <h3 className="text-xl mb-[15px] font-medium">Codes</h3>
                            <label className="toggle my-1">
                                <input id="set_coupon_codes" name="set_coupon_codes" className="toggle-checkbox" type="checkbox" defaultChecked />
                                <div className="toggle-switch"></div>
                                <span className="toggle-label">&nbsp;Use Coupon Codes</span>
                            </label>
                            <div className="ml-[51px] -mt-1 pb-1 text-sm text-gray-500">Set the limit of total number of timesthis coupon can be redeemed</div>
                            <label className="toggle my-1">
                                <span className="ml-[51px] -mt-1 pb-1">&nbsp;Code</span>
                            </label>
                            
                            <div className="relative py-2 mb-1 ml-[51px] -mt-1 pb-1">
                                <input type="text" placeholder="BOGO20" className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required /> 
                            </div>
                            <div className="ml-[51px] -mt-1 pb-1 text-sm text-gray-500">If left blank, We’ll generate automatically</div>

                            <div className="bg-[#EDEDED] h-[.8px] my-7"></div> */}

                            <Button type="submit" className="mt-4" name="Update"></Button>
                        </form>
                    </div>
                </main>

            </div >

            <style>{`
                * :disabled {
                    background-color: #F5F5F5 !important;
                }

                label > input[type='radio'], input[type="radio"] {
                    display: none;
                }

                label > input[type="radio"] + *::before {
                    color: #158560 !important;
                    content: " ";
                    display: inline-grid;
                    width: 1.1rem;
                    height: 1.1rem;
                    border-radius: 50%;
                    border-style: solid;
                    border-width: 0.1rem;
                    border-color: #158560;
                    margin-top: 5px;
                }

                label > input[type="radio"]:checked + *::before {
                    background: radial-gradient(#158560 0%, #158560 40%, transparent 50%, transparent);;
                    border-color: #158560;
                }

                label > input[type="radio"] + * {
                    display: inline-block;
                    padding: 0.5rem;
                }


                #option-1:checked:checked ~ .option-1,
                #option-2:checked:checked ~ .option-2,
                #option-3:checked:checked ~ .option-3,
                #option-4:checked:checked ~ .option-4{
                    border-color: #158560;
                    background: #158560;
                }
                #option-1:checked:checked ~ .option-1 .dot,
                #option-2:checked:checked ~ .option-2 .dot,
                #option-3:checked:checked ~ .option-3 .dot,
                #option-4:checked:checked ~ .option-4 .dot{
                    background: #fff;
                }
                #option-1:checked:checked ~ .option-1 .dot::before,
                #option-2:checked:checked ~ .option-2 .dot::before,
                #option-3:checked:checked ~ .option-3 .dot::before,
                #option-4:checked:checked ~ .option-4 .dot::before{
                    opacity: 1;
                    transform: scale(1);
                }
                .wrapper .option span{
                    font-size: 17px;
                    color: #808080;
                }
                #option-1:checked:checked ~ .option-1 span,
                #option-2:checked:checked ~ .option-2 span,
                #option-3:checked:checked ~ .option-3 span,
                #option-4:checked:checked ~ .option-4 span{
                    color: #fff;
                }


                {/* Toggle Switcher */}
                .toggle {
                    cursor: pointer;
                    display: inline-block;
                }

                .toggle-switch {
                    display: inline-block;
                    background: #ccc;
                    border-radius: 16px;
                    width: 42px;
                    height: 23px;
                    position: relative;
                    vertical-align: middle;
                    transition: background 0.25s;
                }
                .toggle-switch:before, .toggle-switch:after {
                    content: "";
                }
                .toggle-switch:before {
                    display: block;
                    background: linear-gradient(to bottom, #fff 0%, #eee 100%);
                    border-radius: 50%;
                    box-shadow: 0 0 0 1px rgb(0 0 0 / 25%);
                    width: 17px;
                    height: 17px;
                    position: absolute;
                    top: 3px;
                    left: 4px;
                    transition: left 0.25s;
                }
                .toggle:hover .toggle-switch:before {
                    background: linear-gradient(to bottom, #fff 0%, #fff 100%);
                    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
                }
                .toggle-checkbox:checked + .toggle-switch {
                    background: #158560;

                }
                .toggle-checkbox:checked + .toggle-switch:before {
                    left: 22px;
                }

                .toggle-checkbox {
                    position: absolute;
                    visibility: hidden;
                }

                .toggle-label {
                    margin-left: 5px;
                    position: relative;
                    top: 2px;
                    font-size: 16px;
                }

                {/* Toggle Switcher End */}


                    
                .days_range {
                    display: none;
                }

            `}</style>

        </div >

    );
};

export default StoreEditDiscount;