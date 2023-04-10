import React, { useEffect, useState } from 'react';
import { ReactComponent as CloseBtn } from '../../../assets/icons/close.svg'
import Button from './components/Button';
import { Link, useLocation, useNavigate } from "react-router-dom";
import BlackButton from '../../../components/BlackButton';
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus.svg'
import deleteIcon from "../../../assets//icons/delete.svg";
import { useForm } from 'react-hook-form';
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';
import PostLoginPostApi from '../../../components/api/PostLoginPostApi';
import Select from 'react-select';
import $ from "jquery";
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import moment from 'moment';
import useFormPersist from "react-hook-form-persist";
import { ReactSearchAutocomplete } from 'react-search-autocomplete';


const Invoice = () => {

    const { register, handleSubmit, watch, setValue } = useForm();
    const [connectList, setConnectList] = useState([]);
    const [itemList, setItemList] = useState([]);

    const [options, setOptions] = useState([]);
    const [options2, setOptions2] = useState([]);

    const [connectDetails, setConnectDetails] = useState();
    const [itWorks, setItWorks] = useState(false);
    const [defaultPhoneNum, setDefaultPhoneNum] = useState('');

    let location = useLocation();

    const navigate = useNavigate();

    useFormPersist(
        "form",
        { watch, setValue },

    );


    useEffect(() => {
        // Get All Connects
        PostLoginGetApi("shop/connect").then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    setConnectList(responseData["data"]?.data);
                    let numArray = [];
                    responseData["data"]?.data.map(data => numArray.push({ value: data?.user?.mobile_no, label: data?.user?.mobile_no, data: data?.user }));
                    setOptions2(numArray);
                }
            }
        }).catch((err) => {
            console.log(err);
        });


        // PostLoginGetApi("shop/item").then((responseJSON) => {
        //     let response = JSON.stringify(responseJSON);
        //     response = JSON.parse(response);

        //     if (response["status"] === 1) {
        //         let responseData = JSON.stringify(response["data"]);
        //         responseData = JSON.parse(responseData);


        //         if (responseData["code"] === 200) {
        //             let arr = [];
        //             responseData["data"]?.data.map(data => arr.push({ value: data?.name, label: data?.name, data: data }));
        //             setOptions(arr)
        //         }
        //     }
        // }).catch((err) => {
        //     console.log(err);
        // });

    }, []);


    useEffect(() => {
        if (connectList.length > 0) {
            let oldConnectionDetails = sessionStorage.getItem('connectDetails');
            if (oldConnectionDetails !== undefined) {
                let data = JSON.parse(oldConnectionDetails);
                let obj = { "value": data?.user?.mobile_no, "label": data?.user?.mobile_no, "data": data };
                setDefaultPhoneNum(obj);
                handleInputChange(obj);
            }
        }
    }, [connectList]);


    const onSubmit = (data) => {

        let reqBody = new FormData();

        // Other Information
        reqBody.append("connect_id", connectDetails?.id);
        // reqBody.append("customer_name", data.customer_name);
        // reqBody.append("customer_email", data.email);

        // eslint-disable-next-line array-callback-return
        itemList.map((data, index) => {
            reqBody.append("items[" + index + "][id]", data?.id);
            reqBody.append("items[" + index + "][quantity]", data?.quantity);
        });

        reqBody.append("final_bill_amount", $("#subTotal").text().substring(1));
        reqBody.append("discount_amount", $("#discount").text().substring(1));
        reqBody.append("delivery_charge_amount", $("#delivery_charge").text().substring(1));
        reqBody.append("vat_tax_amount", $("#tax").text().substring(1));
        reqBody.append("total_bill_amount", $("#grandTotal").text().substring(1));


        data.notification_method = data.notification_method.toString();
        var nmArr = data.notification_method.split(',');
        // eslint-disable-next-line array-callback-return
        nmArr.map(data => {
            reqBody.append("notification_method[]", data);
        });

        reqBody.append("expire_after", data.expire_days);
        reqBody.append("title", data.invoice_title);
        reqBody.append("custom_invoice_id", data.invoice_id);
        reqBody.append("notes", data.note);
        reqBody.append("due_date", "2023-03-01");
        // reqBody.append("set_reminder", data.set_reminder);
        reqBody.append("schedule_at_date", data.date);
        reqBody.append("schedule_at_time", moment(data.time, 'HH:mm').format('HH:mm:ss'));



        // Create Invoice
        PostLoginPostApi("shop/invoice", reqBody, 1, 1).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    setConnectList(responseData["data"]?.data);
                    toast.success("Invoice created successfully.");
                    return navigate("/dashboard/invoice");
                }

                toast.error("Please fill up all the fields.");
            }
        }).catch((err) => {
            console.log(err);
        })

        sessionStorage.clear()
    }



    const handleProduct = async (event) => {

        let data = event.data;

        if (itemList.find(element => element?.id === data?.id)) {
            return;
        }
        data.quantity = 1;
        setItemList([...itemList, data]);
    }

    useEffect(() => {
        const arr = JSON.parse(sessionStorage.getItem("items"));
        if (arr !== null) {
            setItemList(arr);
        }
    }, []);


    const handleQuantityChange = async (index) => {
        let quantity = $(".product_quantity").eq(index).val();
        if (quantity === "" || isNaN(quantity)) {
            return;
        }

        let tempArr = [...itemList];
        tempArr[index].quantity = parseInt(quantity * 1);

        setItemList(tempArr);
    }


    const handleSelectedItemRemove = async (id) => {
        let tempArr = itemList.filter(function (item) { return item.id !== id });
        setItemList(tempArr);
    }


    useEffect(() => {
        let subTotal = 0;
        // eslint-disable-next-line array-callback-return
        itemList.map((val, i) => {
            let unit_price = parseFloat(val?.unit_price);


            let quantity = val?.quantity;
            if (quantity === "") { quantity = 1; }
            quantity = parseInt(quantity);

            let total = parseFloat(unit_price * quantity);
            $(".unit_total").eq(i).html("৳ " + total.toFixed(2));
            subTotal += total;
        });

        $("#subTotal, #grandTotal").html("৳ " + subTotal.toFixed(2));

        if (itemList.length > 0) {
            window.sessionStorage.setItem("items", JSON.stringify(itemList));
        }


    }, [itemList]);



    const getConnectDetails = async (id) => {
        await PostLoginGetApi(`shop/connect/${id}`).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    setConnectDetails(responseData["data"]);
                }
            }
        }).catch((err) => {
            console.log(err);
        });
    }


    const handleInputChange = async (event) => {
        setConnectDetails();

        let val = event?.value;

        if (val?.length === 11 || val?.length === 14) {

            const connectId = await connectList.find((data) => (data?.user?.mobile_no === val));

            if (connectId !== undefined) {
                // Now Call API to get other information from Connect
                getConnectDetails(connectId.id);
            }
            else {
                await PostLoginPostApi("shop/connect", JSON.stringify({ "mobile_no": val })).then((responseJSON) => {
                    let response = JSON.stringify(responseJSON);
                    response = JSON.parse(response);

                    if (response["status"] === 1) {
                        let responseData = JSON.stringify(response["data"]);
                        responseData = JSON.parse(responseData);

                        if (responseData["code"] === 200) {
                            toast.success("Connect added successfully.");
                            getConnectDetails(responseData.data?.id);
                            return;
                        }

                        toast.error(responseData["messages"].toString());
                        return;
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }

        }
    }

    const handleClick = (val) => {
        $("#days-expire").attr("data-value");
        setItWorks(val.val());
    }


    const [searchItem, setSearchItem] = useState("");
    // ReactSearchAutocomplete
    const searchProduct = (e) => {
        setSearchItem(e);
    }


    useEffect(() => {
        // if (searchItem.length === 0) {
        //     setOptions([]);
        //     return;
        // }

        PostLoginGetApi("shop/item", { search: searchItem }).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);


                if (responseData["code"] === 200) {
                    let arr = [];
                    responseData["data"]?.data.map(data => arr.push({ id: data?.id, name: data?.name, data: data }));
                    setOptions(arr);
                }
            }
        }).catch((err) => {
            console.log(err);
        });
    }, [searchItem]);


    const formatResult = (options) => {
        return (
            <>
                <span style={{ display: 'block', textAlign: 'left' }}>{options.name}</span>
            </>
        )
    }




    return (
        <div className="font-medium pb-[60px]">
            <header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[60px]">
                <Link to="/dashboard/invoice"><CloseBtn /></Link>
                <p className="text-xl ml-80">New Invoice</p>
                <div className='flex items-center justify-center'>
                    <Link to="/dashboard/invoice/preview" state={
                        {
                            "connect": connectDetails,
                            "items": itemList,
                            "invoice_id": watch("invoice_id"),
                            "invoice_details": watch(),
                        }
                    } className="px-5 py-2.5 rounded-[3px] cursor-pointer bg-[#DDDDDD] text-secondary">Show Preview</Link>
                    <Button name="Save as Draft" margin="10px" />
                    {/* <input name="Send" onClick={handleSubmit(onSubmit)} value="Send" className='' /> */}
                    <input type="button" value="Send" onClick={handleSubmit(onSubmit)} className="bg-[#00D632] text-white py-2.5 px-5 rounded-[3px]  hover:cursor-pointer hover:bg-green-500"></input>
                </div>
            </header>
            <main className="max-w-2xl m-auto">
                <div className="flex justify-center">
                    <form className="max-w-2xl w-full" >
                        <h3 className="text-xl mb-[15px]">Customer Information</h3>
                        <div>
                            <CreatableSelect isClearable onChange={(event) => handleInputChange(event)}
                                options={options2} id="select-phone-number"
                                className="mb-2.5 placeholder:text-black" placeholder={defaultPhoneNum.value ? defaultPhoneNum.value : "Find or add customer name"} required />
                        </div>
                        {connectDetails &&
                            <>
                                <div>
                                    <input type="text" readOnly disabled name="customer_name" placeholder="Find or add customer name" value={connectDetails.user?.name} className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" />
                                </div>
                                <div>
                                    <input type="email" readOnly disabled name="email" placeholder="Customer email" defaultValue={connectDetails.user?.email} className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" />
                                </div>
                                <p className="font-normal text-ash">Account Type: <span className="font-medium text-black">{connectDetails.user?.user_type.toString()[0].toUpperCase() + connectDetails.user?.user_type.toString().slice(1)}</span></p>
                            </>
                        }

                        {/* <hr className="my-[30px]" /> */}


                        <h3 className="text-xl mb-[15px] mt-6">Item/Service Details</h3>

                        <div className="">
                            <header className="App-header">
                                <div className='w-full'>
                                    <ReactSearchAutocomplete
                                        items={options}
                                        onSearch={(e) => searchProduct(e)}
                                        autoFocus
                                        formatResult={formatResult}
                                        placeholder="Add product"
                                        onSelect={(e) => handleProduct(e)}
                                    />
                                </div>
                            </header>
                        </div>

                        {/* 
                        <input
                            autoFocus
                            type='text'
                            autoComplete='off'
                            className='live-search-field'
                            placeholder='Search here...'
                            onChange={(e) => setSearchTerm(e.target.value)}
                        /> */}

                        <table className="w-full mt-5">
                            <tbody id="product-list">
                                <tr className="bg-neutral-100">
                                    <th className="py-2.5 text-start font-medium pl-5">Product Name</th>
                                    <th className="font-medium">Unit</th>
                                    <th className="font-medium">Qty</th>
                                    <th className="font-medium">Price</th>
                                    <th className="font-medium">Total</th>
                                </tr>

                                {itemList.map((val, index) => (
                                    <tr key={index} className="border-x border-dark-white border-b" id={`item_no_${val?.id}`}>
                                        <td className="py-2.5 px-5">
                                            <p className="flex" style={{ alignItems: "baseline" }}>
                                                <img className="remove-item-button" src={deleteIcon} alt="Remove Item" onClick={() => handleSelectedItemRemove(val?.id)} style={{ cursor: 'pointer', height: '15px', marginLeft: "-10px", marginTop: "-4px" }} />&nbsp; {val?.name}
                                            </p>
                                            <span className="text-secondary font-normal"></span>
                                        </td>
                                        <td className="text-center text-secondary">{val?.unit}</td>
                                        <td className="text-center">
                                            <input type="text" className="product_quantity max-w-[60px] text-center border-none" defaultValue={1} onChange={() => handleQuantityChange(index)} />
                                        </td>
                                        <td className="text-center unit_price">{val?.unit_price}</td>
                                        <td className="text-center unit_total">৳ {val?.unit_price}</td>
                                    </tr>
                                ))}
                            </tbody>


                            {itemList.length > 0 &&
                                <tfoot>
                                    <tr>
                                        <td colSpan={5} className="border-x border-dark-white">
                                            <div className="flex justify-between border-b border-neutral-100 py-2.5 ml-4 mr-7">
                                                <p>Sub Total</p>
                                                <p id="subTotal" {...register("subTotal")}></p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5} className="border-x border-dark-white">
                                            <div className="flex justify-between border-b border-neutral-100 py-2.5 ml-4 mr-7 ">
                                                <p>Discount</p>
                                                <p id="discount">৳ 0</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5} className="border-x border-dark-white">
                                            <div className="flex justify-between border-b border-neutral-100 py-2.5 ml-4 mr-7  ">
                                                <p>Delivery Charge</p>
                                                <p id="delivery_charge">৳ 0</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5} className="border-x border-dark-white">
                                            <div className="flex justify-between border-neutral-100 py-2.5 ml-4 mr-7  ">
                                                <p>Tax</p>
                                                <p id="tax">৳ 0</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="bg-neutral-100 font-semibold">
                                        <td colSpan={5}>
                                            <div className="flex justify-between border-neutral-100 py-2.5 ml-4 mr-7  ">
                                                <p>Total</p>
                                                <p id="grandTotal"></p>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            }
                        </table>


                        {/* <div className="border-x border-dark-white w-full py-2.5 px-5">
                            <div className="flex justify-between">
                                <p>Sub-Total</p>
                                <p>৳ 713.00</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Discount</p>
                                <p>৳ 0</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Delivery Charge</p>
                                <p>৳ 0</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Tax</p>
                                <p>৳ 0</p>
                            </div>
                        </div> */}


                        <hr className="my-[30px]" />
                        <h3 className="text-xl mb-[15px]">Sending Method</h3>


                        <div className="flex">
                            <div className="mr-[30px]">
                                <input type="checkbox" placeholder='deshi' {...register("notification_method", { required: true })} name="notification_method" id="notification_method_deshi" value="Deshi" className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                <label htmlFor="notification_method_deshi" className="text-secondary">Deshi</label>
                            </div>
                            <div className="mr-[30px]">
                                <input type="checkbox" {...register("notification_method")} value="SMS" name="notification_method" className="mr-2.5 text-primary  focus:ring-primary border-dark-white" id="notification_method_sms" />
                                <label htmlFor='notification_method_sms' className="text-secondary">SMS</label>
                            </div>
                            <div className="mr-[30px]">
                                <input type="checkbox"  {...register("notification_method")} value="Email" name="notification_method" className="mr-2.5 text-primary  focus:ring-primary border-dark-white" id="notification_method_email" />
                                <label htmlFor='notification_method_email' className="text-secondary">Email</label>
                            </div>
                        </div>
                        <hr className="my-[30px]" />


                        <h3 className="text-xl mb-[15px]">Expire After</h3>

                        <div>
                            <div className='flex items-center mb-[15px]'>
                                <input type="radio" name="expire_days" {...register("expire_days", { required: true })} onClick={() => handleClick(false)} value="7 Days" id="seven-days" className='mr-3 text-primary focus:ring-primary' />
                                <label htmlFor="seven-days" className='mr-[30px]'>7 Days</label>

                                <input type="radio" name="expire_days" {...register("expire_days")} onClick={() => handleClick(false)} value="10 Days" id="ten-days" className='mr-3 text-primary focus:ring-primary' />
                                <label htmlFor="ten-days" className='mr-[30px]'>10 Days</label>

                                <input type="radio" name="expire_days" {...register("expire_days")} onClick={() => handleClick(false)} value="15 Days" id="fifteen-days" className='mr-3 text-primary focus:ring-primary' />
                                <label htmlFor="fifteen-days" className='mr-[30px]'>15 Days</label>

                                <input type="radio" name="expire_days" {...register("expire_days")} onClick={() => handleClick(false)} value="30 Days" id="thirty-days" className='mr-3 text-primary focus:ring-primary' />
                                <label htmlFor="thirty-days" className='mr-[30px]'>30 Days</label>

                                <input type="radio" name="other" {...register("expire_days")} onClick={() => handleClick(true)} value="other" id="other" className='mr-3 text-primary focus:ring-primary' />
                                <label htmlFor="other" className='mr-[30px]'>Other</label>
                            </div>

                            {itWorks &&
                                <div>
                                    <input type="text" id="days-expire" name="days-expire" title='Numbers only' {...register("days-expire", {
                                        required: true, pattern: {
                                            value: /^[0-9]+$/,
                                            message: 'Please enter a number',
                                        }
                                    })} placeholder="Set days to expire. e.g. 45" className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" />
                                </div>
                            }
                        </div>


                        <hr className="my-[30px]" />


                        <h3 className="text-xl mb-[15px]">Remarks</h3>
                        <div>
                            <input type="text" {...register("invoice_title")} name="invoice_title" placeholder="Invoice title" className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" />
                        </div>
                        <div>
                            <input type="text" {...register("invoice_id")} name="invoice_id" id="invoice_id" placeholder="Custom invoice ID" className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" />
                        </div>
                        <div>
                            <textarea type="text" {...register("note")} name="note" placeholder="Write a note" className="w-full rounded border-solid border border-dark-white placeholder:text-ash" />
                        </div>
                        {/* <BlackButton name="Add Attachment" icon={<PlusIcon />} onClick={selectFile} /> */}
                        <hr className="my-[30px]" />

                        <h3 className="text-xl mb-[15px]">Set a Reminder</h3>
                        <select name="set_reminder" {...register("set_reminder")} id="reminder" className="w-full rounded border-solid border border-dark-white">
                            <option value="twelve" className="p-5 ">12 hours before due</option>
                            <option value="twentyFour">24 hours before due</option>
                            <option value="FortyEight">48 hours before due</option>
                            <option value="seventyTwo">72 hours before due</option>
                        </select>
                        <hr className="my-[30px]" />

                        <h3 className="text-xl mb-[15px]">Set a Schedule</h3>
                        <div className="flex justify-between">
                            {/* <input placeholder="Type Date" type="text" id="date" /> */}
                            <input type="date" {...register("date")} name="date" id="date" min={moment().format("YYYY-MM-DD").toString()} className="rounded border-solid border border-dark-white w-[48%] placeholder:text-ash" placeholder="Pick a date for schedule send" />
                            <input type="time" {...register("time")} name="time" className="rounded border-solid border border-dark-white w-[48%] placeholder:text-ash" />
                        </div>
                    </form>
                </div>
            </main>


            <style>{`
                [type='text']:focus {
                    box-shadow: none !important;
                }

                .cmyNjn > .wrapper {
                    border-radius: 5px !important;
                }

            `}</style>


        </div>
    );
};

export default Invoice;