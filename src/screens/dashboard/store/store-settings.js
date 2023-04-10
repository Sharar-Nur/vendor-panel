import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as CloseBtn } from './../../../assets/icons/close.svg';
import Popup from '../../../components/Popup';
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';
import $ from "jquery";
import PostLoginPostApi from '../../../components/api/PostLoginPostApi';
import { toast } from 'react-toastify';
import moment from 'moment/moment';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';


const StoreSettings = (props) => {


    const [info, setInfo] = useState({});
    const [addressInput, setAddressInput] = useState({
        full_address: "",
        address_line_2: "",
        district: "",
        zip_code: "",
        phone_no: "",
        email: "",
        lat: "",
        lng: ""
    });


    //Google-map
    const [location, setLocation] = useState({
        lat: "",
        lng: ""
    });


    let [markers, setMarkers] = useState([{
        "lat": "",
        "lng": ""
    }]);


    const mapStyles = {
        position: "absolute",
        width: "52%",
        height: "72%"
    };

    let onMarkerDragEnd = (coord, index, markers) => {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        markers[index] = { lat, lng };
        setMarkers(markers);
        setLocation({ lat: lat, lng: lng });
        showAddressDetails({ lat: lat, lng: lng });
    }

    const autoCompleteRef = useRef();
    const inputRef = useRef();
    // const options = { fields: ["address_components", "geometry", "icon", "name"] };
    const options = {};



    let myMarkers = markers && Object.entries(markers).map(([key, val]) => (
        <Marker
            key={key}
            id={key}
            position={{
                lat: location.lat,
                lng: location.lng
            }}
            draggable={true}
            // onClick={() => console.log("Clicked")}
            onDragend={(t, map, coord) => onMarkerDragEnd(coord, key, markers)}
        />
    ))

    
    const [counter, setCounter] = useState(0);
    const [isLoad, setIsLoad] = useState(false);
    useEffect(() => {
        try {
            PostLoginGetApi("shop/store-info").then((responseJSON) => {
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response?.status === 1) {
                    let responseData = JSON.stringify(response.data);
                    responseData = JSON.parse(responseData);

                    if (responseData?.code === 200) {
                        setInfo(responseData?.data);

                        addressInput.full_address = responseData?.data?.address?.full_address;
                        addressInput.address_line_2 = responseData?.data?.address?.address_line_2;
                        addressInput.district = responseData?.data?.address?.district?.id;
                        addressInput.zip_code = responseData?.data?.address?.zip_code;
                        addressInput.phone_no = responseData?.data?.address?.phone_no;
                        addressInput.email = responseData?.data?.address?.email;
                        addressInput.lat = responseData?.data?.location?.latitude;
                        addressInput.lng = responseData?.data?.location?.longitude;
                        
                        const saved_location = {lat: responseData?.data?.location?.latitude, lng: responseData?.data?.location?.longitude};
                        setLocation(saved_location);

                        setScheduleDays(responseData?.data?.pickup_and_dine_in_times);
                        return;
                    }

                    setTimeout(()=>{setUserCurrentAddress()}, 1500);
                }


            }).catch((error) => {
                console.log(error);
            });
        }
        catch (ex) {
            console.log(ex);
        }
        finally {
            setIsLoad(true);
        }

    }, [counter]);


    // Get User's Current Location
    const setUserCurrentAddress = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
            return;
        }

        alert("Geolocation is not supported by this browser.");
    }


    const showPosition = (position) => {
        let obj = { lat: position.coords.latitude, lng: position.coords.longitude };
        setLocation(obj);
        showAddressDetails(obj);
    }



    const showAddressDetails = (obj) => {

        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${obj.lat},${obj.lng}&sensor=false&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`)
        .then(res => res.json())
        .then((response) => {

            response = JSON.stringify(response?.results[0]);
            response = JSON.parse(response);

            if(response?.address_components?.length >= 3) {
                console.log(response);
                
                let zc = response?.address_components[(response.address_components.length)-1]?.long_name;
                if(isNaN(zc)) {
                    zc = "";
                }

                setAddressInput({ 
                    ...addressInput, 
                    full_address:  response?.address_components[0]?.long_name + ", " + response?.address_components[1]?.long_name, 
                    address_line_2: "",
                    zip_code: zc
                });
                
                
                let sd = districtList.filter((element) => element.name.toString().toLowerCase() === response?.address_components[1]?.long_name.toString().split(" ")[0].toLowerCase());
                if (sd.length > 0) {
                    $("#district").val(sd[0]?.id).change();
                }
                else {
                    let sd2 = districtList.filter((element) => element.name.toString().toLowerCase() === response?.address_components[2]?.long_name.toString().split(" ")[0].toLowerCase());
                    if (sd2.length > 0) {
                        $("#district").val(sd2[0]?.id).change();
                    }
                    else {
                        let sd3 = districtList.filter((element) => element.name.toString().toLowerCase() === response?.address_components[3]?.long_name.toString().split(" ")[0].toLowerCase());
                        if (sd3.length > 0) {
                            $("#district").val(sd3[0]?.id).change();
                        }
                    }
                }

            }

            // let full_address = "";
            // let components = [];
            // // eslint-disable-next-line array-callback-return
            // response?.address_components.map(val => {
            //     full_address += val?.long_name + ", ";
            //     components.push(val?.long_name);
            // });

            // if (full_address.length > 2) {
            //     full_address = full_address.substring(0, full_address.length - 2);
            // }

            // document.getElementById("autocomplete").value = full_address;
            // if (is_current === 1) {
            //     setA(components);
            // }

        }).catch((err) => {
            console.log(err);
        });
    }


    const [isPopupShow, setIsPopupShow] = useState({
        editAddress: false,
        editHours: false,
        editInstructions: false
    });

    const openModel = (id) => {
        switch (id) {
            case "address":
                setIsPopupShow({ editAddress: true });
                break;
            case "hours":
                setIsPopupShow({ editHours: true });
                setTimeout(() => {
                    if (scheduleDays.Sunday?.start_time) {
                        $(".days_range").eq(0).attr("style", "display: flex");
                    }
                    if (scheduleDays.Monday?.start_time) {
                        $(".days_range").eq(1).attr("style", "display: flex");
                    }
                    if (scheduleDays.Tuesday?.start_time) {
                        $(".days_range").eq(2).attr("style", "display: flex");
                    }
                    if (scheduleDays.Wednesday?.start_time) {
                        $(".days_range").eq(3).attr("style", "display: flex");
                    }
                    if (scheduleDays.Thursday?.start_time) {
                        $(".days_range").eq(4).attr("style", "display: flex");
                    }
                    if (scheduleDays.Friday?.start_time) {
                        $(".days_range").eq(5).attr("style", "display: flex");
                    }
                    if (scheduleDays.Saturday?.start_time) {
                        $(".days_range").eq(6).attr("style", "display: flex");
                    }
                }, 500);
                break;
            case "instructions":
                setIsPopupShow({ editInstructions: true });
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if (isPopupShow.editAddress === true) {

            autoCompleteRef.current = new window.google.maps.places.Autocomplete(
                inputRef.current,
                options
            );

            new window.google.maps.event.addListener(autoCompleteRef.current, 'place_changed', function () {
                let places = autoCompleteRef.current.getPlace();

                let lng = places?.geometry?.viewport?.Ma.lo;
                let lat = places?.geometry?.viewport?.Ya.lo;



                let obj = { lat: lat, lng: lng };

                setMarkers([obj]);
                setLocation(obj);
            });

        }
    }, [isPopupShow.editAddress, inputRef.current]);

    const closeModel = () => {
        setIsPopupShow({ editAddress: false, editHours: false, editInstructions: false });
    }


    const setInputs = (event) => {
        setAddressInput({ ...addressInput, [event.target.name]: event.target.value });
    }


    const hours = [
        "01 : 00", "01 : 15", "01 : 30", "01 : 45", "02 : 00", "02 : 15", "02 : 30", "02 : 45", "03 : 00", "03 : 15", "03 : 30", "03 : 45", "04 : 00", "04 : 15", "04 : 30", "04 : 45", "05 : 00", "05 : 15", "05 : 30", "05 : 45", "06 : 00", "06 : 15", "06 : 30", "06 : 45", "07 : 00", "07 : 15", "07 : 30", "07 : 45", "08 : 00", "08 : 15", "08 : 30", "08 : 45", "09 : 00", "09 : 15", "09 : 30", "09 : 45", "10 : 00", "10 : 15", "10 : 30", "10 : 45", "11 : 00", "11 : 15", "11 : 30", "11 : 45", "12 : 00", "12 : 15", "12 : 30", "12 : 45"
    ];


    // GET District Lists
    const [districtList, setDistrictList] = useState([]);
    useEffect(() => {
        PostLoginGetApi("api/v1/division_district_thana_list", "", 0).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    setDistrictList(responseData["data"]["districts"]);
                }
            }
        }).catch((error) => {
            console.log(error);
        });
    }, []);


    const contactDetailsFormHandler = async (event) => {
        event.preventDefault();
        const district_name = $("#district").find(':selected').attr('data-name');


        const arr = {
            address: {
                full_address: addressInput.full_address,
                address_line_2: addressInput.address_line_2,
                district: {
                    id: addressInput.district,
                    name: district_name
                },
                zip_code: addressInput.zip_code,
                phone_no: addressInput.phone_no,
                email: addressInput.email
            }
        };


        await PostLoginPostApi("shop/store-info/address-setting", JSON.stringify(arr)).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData?.code === 200) {
                    closeModel();
                    setCounter((prev) => {
                        return prev + 1;
                    });

                    toast.success("Contact information update successfully.");
                    return;
                }
            }

            toast.error("A problem occur. Please try again contact.");
            return;


        }).catch((error) => {
            console.log(error);
        });

        
        await PostLoginPostApi("shop/geo-location", JSON.stringify({ latitude: location.lat, longitude: location.lng })).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData?.code === 201) {
                    closeModel();
                    setCounter((prev) => {
                        return prev + 1;
                    });

                    return;
                }
                toast.error("A problem occur. Please try again geo-location.");
            }

        }).catch((error) => {
            console.log(error);
        });

    }

    //mapAddress



    const setA = (object) => {
        addressInput.full_address = object[0] + object[1];
        $("#fullAddress").val(object[0]);
        $("#addressLine2").val(object[1]);


        let sd = districtList.filter((element) => element.name.toString().toLowerCase() === object[1].toString().toLowerCase());
        if (sd !== undefined) {
            $("#district").val(sd[0]?.id).change();
        }
        else {
            let sd2 = districtList.filter((element) => element.name.toString().toLowerCase() === object[2].toString().toLowerCase());
            if (sd2 !== undefined) {
                $("#district").val(sd2[0]?.id).change();
            }
        }

    }


    // Pickup & Dine-In
    const PickUpAndDineInSubmit = () => {

        const dataArr = {
            allow_pickup: $("#is_pickup_location").prop("checked"),
            allow_dine_in: $("#is_allow_dine_id").prop("checked")
        }

        PostLoginPostApi("shop/store-info/allow-service-setting", JSON.stringify(dataArr)).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData?.code === 200) {
                    closeModel();
                    setCounter((prev) => {
                        return prev + 1;
                    });

                    toast.success("Pickup & Dine-In update successfully.");
                    return;
                }
            }

            toast.error("A problem occur. Please try again.");
            console.log(response);

        }).catch((error) => {
            console.log(error);
        });
    }

    const storeOpenBtn = () => {

        const dataArr = {
            is_store_enable: $("#store_availability").prop("checked")

        }


        PostLoginPostApi("shop/store-info/enable-or-disable-store", JSON.stringify(dataArr)).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData?.code === 200) {
                    closeModel();
                    setCounter((prev) => {
                        return prev + 1;
                    });

                    toast.success("Store Availability update successfully.");
                    return;
                }
            }

            toast.error("A problem occur. Please try again.");
            console.log(response);

        }).catch((error) => {
            console.log(error);
        });
    }


    //Order Prepare Time
    const orderPrepareTimeButton = () => {

        const dataArr = {
            order_prepare_time: $("#schedule_pickup").val(),
        }

        PostLoginPostApi("shop/store-info/order_prepare_time-setting", JSON.stringify(dataArr)).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData?.code === 200) {
                    closeModel();
                    setCounter((prev) => {
                        return prev + 1;
                    });

                    toast.success("Order Prepare Time update successfully.");
                    return;
                }
            }

            toast.error("A problem occur. Please try again.");
            console.log(response);

        }).catch((error) => {
            console.log(error);
        });
    }


    const schedulePickup = () => {

        let allow_schedule_pickup = true;
        if ($("#schedule_pickup2").val() === "0") {
            allow_schedule_pickup = false;
        }

        const dataArr = {
            allow_schedule_pickup: allow_schedule_pickup
        }

        PostLoginPostApi("shop/store-info/allow_schedule_pickup-setting", JSON.stringify(dataArr)).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData?.code === 200) {
                    closeModel();
                    setCounter((prev) => {
                        return prev + 1;
                    });

                    toast.success("Schedule Pickup update successfully.");
                    return;
                }
            }

            toast.error("A problem occur. Please try again.");
            console.log(response);

        }).catch((error) => {
            console.log(error);
        });
    }





    // INSTRUCTION
    const [instruction, setInstruction] = useState(info?.instructions);
    const submitInstructionForm = (event) => {
        event.preventDefault();

        PostLoginPostApi("shop/store-info/instruction-setting", JSON.stringify({ instructions: instruction })).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData?.code === 200) {
                    closeModel();
                    setCounter((prev) => {
                        return prev + 1;
                    });

                    toast.success("Instruction update successfully.");
                    return;
                }
            }

            toast.error("A problem occur. Please try again.");
            console.log(response);

        }).catch((error) => {
            console.log(error);
        });
    }


    const submitHours = (event) => {
        event.preventDefault();
    }


    // const [hoursInput, setHoursInput] = useState([]);
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
        let arrDT = {};

        let is_finish = 0;
        $(".days").each((i) => {
            let cb = $(".days").eq(i).find("input[type='checkbox']");

            if (cb.prop("checked") === true) {
                let startTime = $(".days").eq(i).find("select[name='start-time1']");
                let startTime2 = $(".days").eq(i).find("select[name='start-time2']");
                let endTime = $(".days").eq(i).find("select[name='end-time1']");
                let endTime2 = $(".days").eq(i).find("select[name='end-time2']");

                let st = startTime.val().replaceAll(" ", "") + " " + startTime2.val();
                let et = endTime.val().replaceAll(" ", "") + " " + endTime2.val();
                arrDT[cb.val().toString()] = { "start_time": st, "end_time": et };
            }

            if (i >= 6) {
                is_finish = 1;
            }
        });

        setScheduleDays(arrDT);


        if (is_finish === 1) {
            try {
                PostLoginPostApi("shop/store-info/pickup-dine-in-time-setting", JSON.stringify({ pickup_and_dine_in_times: arrDT })).then((responseJSON) => {
                    let response = JSON.stringify(responseJSON);
                    response = JSON.parse(response);

                    if (response.status === 1) {
                        let responseData = JSON.stringify(response["data"]);
                        responseData = JSON.parse(responseData);

                        if (responseData["code"] === 200) {
                            toast.success("Pickup & Dine-In hours update successfully.");
                            return;
                        }

                        toast.error(responseData["messages"]["pickup_and_dine_in_times"].toString());
                        return;

                    }


                    toast.error("A problem occur. Please try again.");
                    return;
                });
            }
            catch (ex) {
                toast.error("A problem occur while submission. Please try again.");
                console.log(ex);
            }
        }

        closeModel();
    }


    useEffect(() => {
        if (info?.order_prepare_time !== undefined) {
            $("#schedule_pickup").val(info?.order_prepare_time);
        }


        let is_allow = 0;
        if (info?.allow_schedule_pickup === true) {
            is_allow = 1;
        }
        $("#schedule_pickup2").val(is_allow);

    }, [info?.order_prepare_time, info?.allow_schedule_pickup]);




    return (

        <>
            {isLoad &&
                <>




                    <table className="custom-details-table w-full -mt-2 mb-2 ">
                        <tbody>
                            <tr>
                                <td className="font-semibold text-base">Address</td>
                                <td className="px-5 text-base">
                                    <p>
                                        {(info?.address?.full_address) &&
                                            <>{info.address.full_address},<br /></>
                                        }
                                        {(info?.address?.address_line_2) &&
                                            <>{info.address.address_line_2}, </>
                                        }
                                        {(info?.address?.district?.name) &&
                                            <>{info?.address?.district?.name}, </>
                                        }
                                        {(info?.address?.zip_code) &&
                                            <>Postal Code - {info?.address?.zip_code}.</>
                                        }
                                        {(info?.address?.phone_no) &&
                                            <><br />{info.address.phone_no}. <br /></>
                                        }
                                        {(info?.address?.email) &&
                                            <>{info.address.email}. <br /></>
                                        }
                                    </p>

                                    <Link to="#" onClick={() => openModel("address")} id="edit-store-link" className='text-[#0774E9] text-base font-medium flex py-2 items-center'>
                                        Edit Address & Contact Details
                                        &nbsp;
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.0007 6.21301C10.8238 6.21301 10.6543 6.28325 10.5292 6.40827C10.4042 6.53329 10.334 6.70286 10.334 6.87967V11.6663C10.334 11.8432 10.2637 12.0127 10.1387 12.1377C10.0137 12.2628 9.84413 12.333 9.66732 12.333H2.33398C2.15717 12.333 1.9876 12.2628 1.86258 12.1377C1.73756 12.0127 1.66732 11.8432 1.66732 11.6663V4.33301C1.66732 4.1562 1.73756 3.98663 1.86258 3.8616C1.9876 3.73658 2.15717 3.66634 2.33398 3.66634H7.12065C7.29746 3.66634 7.46703 3.5961 7.59206 3.47108C7.71708 3.34605 7.78732 3.17649 7.78732 2.99967C7.78732 2.82286 7.71708 2.65329 7.59206 2.52827C7.46703 2.40325 7.29746 2.33301 7.12065 2.33301H2.33398C1.80355 2.33301 1.29484 2.54372 0.919771 2.91879C0.544698 3.29387 0.333984 3.80257 0.333984 4.33301V11.6663C0.333984 12.1968 0.544698 12.7055 0.919771 13.0806C1.29484 13.4556 1.80355 13.6663 2.33398 13.6663H9.66732C10.1978 13.6663 10.7065 13.4556 11.0815 13.0806C11.4566 12.7055 11.6673 12.1968 11.6673 11.6663V6.87967C11.6673 6.70286 11.5971 6.53329 11.4721 6.40827C11.347 6.28325 11.1775 6.21301 11.0007 6.21301ZM13.614 0.746341C13.5463 0.583442 13.4169 0.453991 13.254 0.386341C13.1738 0.35218 13.0878 0.334061 13.0007 0.333008H9.00065C8.82384 0.333008 8.65427 0.403246 8.52925 0.52827C8.40422 0.653294 8.33398 0.822863 8.33398 0.999674C8.33398 1.17649 8.40422 1.34605 8.52925 1.47108C8.65427 1.5961 8.82384 1.66634 9.00065 1.66634H11.394L4.52732 8.52634C4.46483 8.58832 4.41524 8.66205 4.38139 8.74329C4.34754 8.82453 4.33012 8.91167 4.33012 8.99967C4.33012 9.08768 4.34754 9.17482 4.38139 9.25606C4.41524 9.3373 4.46483 9.41103 4.52732 9.47301C4.58929 9.53549 4.66303 9.58509 4.74427 9.61894C4.82551 9.65278 4.91264 9.67021 5.00065 9.67021C5.08866 9.67021 5.1758 9.65278 5.25704 9.61894C5.33828 9.58509 5.41201 9.53549 5.47398 9.47301L12.334 2.60634V4.99967C12.334 5.17649 12.4042 5.34605 12.5292 5.47108C12.6543 5.5961 12.8238 5.66634 13.0007 5.66634C13.1775 5.66634 13.347 5.5961 13.4721 5.47108C13.5971 5.34605 13.6673 5.17649 13.6673 4.99967V0.999674C13.6663 0.912556 13.6481 0.826489 13.614 0.746341Z" fill="#0774E9" />
                                        </svg>
                                    </Link>


                                    {/* Model Window */}
                                    {(isPopupShow.editAddress === true) &&
                                        <div>
                                            <Popup is_big={1} content={
                                                <div className="p-5 font-medium">

                                                    <div className=" py-3 flex justify-between">
                                                        <h3 className="text-xl text-black">Edit Contact Details</h3>
                                                        <CloseBtn className="cursor-pointer" onClick={closeModel} />
                                                    </div>


                                                    {/* <h2 className='text-base font-semibold py-1'>Address</h2> */}
                                                    <div className='flex'>
                                                        <div className='w-[45%] h-full'>
                                                            <form action='' method="post" onSubmit={(event) => contactDetailsFormHandler(event)} className='py-2'>
                                                                <div className="relative pb-2 pt-1 mb-1">
                                                                    <input type="text" name="full_address" id="fullAddress" value={addressInput.full_address} onChange={(event) => setInputs(event)} placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />

                                                                    <label htmlFor="fullAddress" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Full Address</label>
                                                                </div>

                                                                <div className="relative pb-2 pt-1 mb-1">
                                                                    <input type="text" name="address_line_2" id="addressLine2" value={addressInput.address_line_2} onChange={(event) => setInputs(event)} placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" />

                                                                    <label htmlFor="addressLine2" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Address Line 2</label>
                                                                </div>

                                                                <select name="district" id="district" defaultValue={info?.address?.district?.id} className="w-full mb-3 rounded border-solid border border-dark-white text-secondary" onChange={(event) => setInputs(event)} required>
                                                                    <option value="" disabled>Choose District</option>
                                                                    {districtList.map((data, index) =>
                                                                        <option key={index} value={data?.id} data-name={data?.name} className="text-black">{data?.name}</option>
                                                                    )}
                                                                </select>

                                                                <div className="relative pb-2 pt-1 mb-1">
                                                                    <input type="text" name="zip_code" id="postCode" value={addressInput.zip_code} onChange={(event) => setInputs(event)} placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />

                                                                    <label htmlFor="postCode" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Zip/Postal Code</label>
                                                                </div>
                                                                <div className="relative pb-2 pt-1 mb-1">
                                                                    <input type="text" name="phone_no" id="phoneNumber" value={addressInput.phone_no} onChange={(event) => setInputs(event)} placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />

                                                                    <label htmlFor="phoneNumber" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Phone Number</label>
                                                                </div>
                                                                <div className="relative pb-2 pt-1 mb-1">
                                                                    <input type="email" name="email" id="emailAddress" value={addressInput.email} onChange={(event) => setInputs(event)} placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />

                                                                    <label htmlFor="emailAddress" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Email Address</label>
                                                                </div>

                                                                <button type="submit" className="text-white bg-black py-3 text-base rounded cursor-pointer w-full hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-wait">
                                                                    Save
                                                                </button>

                                                            </form>
                                                        </div>

                                                        <div className='px-5 py-3 w-[40%]'>

                                                            <input className='w-full hidden' id="autocomplete" ref={inputRef} type="text" style={{ marginBottom: "10px" }} autoComplete="off" />
                                                            <Map
                                                                google={props.google}
                                                                zoom={17}
                                                                style={mapStyles}
                                                                initialCenter={
                                                                    {
                                                                        lat: location.lat,
                                                                        lng: location.lng
                                                                    }
                                                                }
                                                                center={
                                                                    {
                                                                        lat: location.lat,
                                                                        lng: location.lng
                                                                    }
                                                                }
                                                            >
                                                                {myMarkers}
                                                            </Map>



                                                        </div>
                                                    </div>

                                                </div>}
                                            />
                                        </div>
                                    }

                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-base">Pickup & Dine-In</td>
                                <td className="px-5 text-base">
                                    <label className="toggle">
                                        {(info?.allow_pickup)
                                            ?
                                            <input id="is_pickup_location" onClick={PickUpAndDineInSubmit} name="is_pickup_location" className="toggle-checkbox" type="checkbox" defaultChecked />
                                            :
                                            <input id="is_pickup_location" onClick={PickUpAndDineInSubmit} name="is_pickup_location" className="toggle-checkbox" type="checkbox" />
                                        }
                                        <div className="toggle-switch"></div>
                                        <span className="toggle-label">&nbsp;Allow Pickup at this Location</span>
                                    </label>
                                    <br />
                                    <label className="toggle mt-3">
                                        {(info?.allow_dine_in)
                                            ?
                                            <input id="is_allow_dine_id" onClick={PickUpAndDineInSubmit} name="is_allow_dine_id" className="toggle-checkbox" type="checkbox" defaultChecked />
                                            :
                                            <input id="is_allow_dine_id" onClick={PickUpAndDineInSubmit} name="is_allow_dine_id" className="toggle-checkbox" type="checkbox" />
                                        }
                                        <div className="toggle-switch"></div>
                                        <span className="toggle-label">&nbsp;Allow Dine-In at this Location</span>
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-base">Pickup & Dine-In Hours</td>
                                <td className="px-5 text-base">

                                    <div className='border rounded-lg shadow mb-3'>
                                        <table className='min-w-full divide-y divide-gray-200 '>
                                            <thead className='bg-neutral-100'>
                                                <tr className='text-left'>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Sunday</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Monday</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Tuesday</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Wednesday</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Thursday</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Friday</th>
                                                    <th scope="col" className="px-6 py-3 text-center" style={{ width: "14.3%" }}>Saturday</th>
                                                </tr>
                                            </thead>

                                            <tbody className='divide-y divide-gray-200' style={{ fontSize: "14px" }}>
                                                <tr>
                                                    <td className='px-3 py-2 border-r-2  text-center' style={{ borderRight: "2px solid #e5e7eb" }}>

                                                        {(scheduleDays?.Sunday?.start_time) ?
                                                            <>
                                                                {moment(scheduleDays?.Sunday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays?.Sunday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </>
                                                            :
                                                            <>-</>}

                                                    </td>
                                                    <td className='px-3 py-4 border-r-2  text-center' style={{ borderRight: "2px solid #e5e7eb" }}>

                                                        {(scheduleDays?.Monday?.start_time) ?
                                                            <>
                                                                {moment(scheduleDays?.Monday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays?.Monday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </>
                                                            :
                                                            <>-</>}

                                                    </td>
                                                    <td className='px-3 py-4 border-r-2  text-center'>
                                                        {(scheduleDays?.Tuesday?.start_time) ?
                                                            <>
                                                                {moment(scheduleDays?.Tuesday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays?.Tuesday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </>
                                                            :
                                                            <>-</>}
                                                    </td>
                                                    <td className='px-3 py-4 border-r-2  text-center'>
                                                        {(scheduleDays?.Wednesday?.start_time) ?
                                                            <>
                                                                {moment(scheduleDays?.Wednesday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays?.Wednesday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </>
                                                            :
                                                            <>-</>}
                                                    </td>
                                                    <td className='px-3 py-4 border-r-2  text-center'>
                                                        {(scheduleDays?.Thursday?.start_time) ?
                                                            <>
                                                                {moment(scheduleDays?.Thursday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays?.Thursday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </>
                                                            :
                                                            <>-</>}
                                                    </td>
                                                    <td className='px-3 py-4 border-r-2  text-center'>
                                                        {(scheduleDays?.Friday?.start_time) ?
                                                            <>
                                                                {moment(scheduleDays?.Friday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays?.Friday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </>
                                                            :
                                                            <>-</>}
                                                    </td>
                                                    <td className='px-3 py-4 text-center'>
                                                        {(scheduleDays?.Saturday?.start_time) ?
                                                            <>
                                                                {moment(scheduleDays?.Saturday?.start_time, "hh:mm A").format("hh:mm A")} - {moment(scheduleDays?.Saturday?.end_time, "hh:mm A").format("hh:mm A")}
                                                            </>
                                                            :
                                                            <>-</>}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <Link to="#" onClick={() => openModel("hours")} className='text-[#0774E9] text-base font-medium flex items-center'>
                                        Edit Day & Time
                                        &nbsp;
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.0007 6.21301C10.8238 6.21301 10.6543 6.28325 10.5292 6.40827C10.4042 6.53329 10.334 6.70286 10.334 6.87967V11.6663C10.334 11.8432 10.2637 12.0127 10.1387 12.1377C10.0137 12.2628 9.84413 12.333 9.66732 12.333H2.33398C2.15717 12.333 1.9876 12.2628 1.86258 12.1377C1.73756 12.0127 1.66732 11.8432 1.66732 11.6663V4.33301C1.66732 4.1562 1.73756 3.98663 1.86258 3.8616C1.9876 3.73658 2.15717 3.66634 2.33398 3.66634H7.12065C7.29746 3.66634 7.46703 3.5961 7.59206 3.47108C7.71708 3.34605 7.78732 3.17649 7.78732 2.99967C7.78732 2.82286 7.71708 2.65329 7.59206 2.52827C7.46703 2.40325 7.29746 2.33301 7.12065 2.33301H2.33398C1.80355 2.33301 1.29484 2.54372 0.919771 2.91879C0.544698 3.29387 0.333984 3.80257 0.333984 4.33301V11.6663C0.333984 12.1968 0.544698 12.7055 0.919771 13.0806C1.29484 13.4556 1.80355 13.6663 2.33398 13.6663H9.66732C10.1978 13.6663 10.7065 13.4556 11.0815 13.0806C11.4566 12.7055 11.6673 12.1968 11.6673 11.6663V6.87967C11.6673 6.70286 11.5971 6.53329 11.4721 6.40827C11.347 6.28325 11.1775 6.21301 11.0007 6.21301ZM13.614 0.746341C13.5463 0.583442 13.4169 0.453991 13.254 0.386341C13.1738 0.35218 13.0878 0.334061 13.0007 0.333008H9.00065C8.82384 0.333008 8.65427 0.403246 8.52925 0.52827C8.40422 0.653294 8.33398 0.822863 8.33398 0.999674C8.33398 1.17649 8.40422 1.34605 8.52925 1.47108C8.65427 1.5961 8.82384 1.66634 9.00065 1.66634H11.394L4.52732 8.52634C4.46483 8.58832 4.41524 8.66205 4.38139 8.74329C4.34754 8.82453 4.33012 8.91167 4.33012 8.99967C4.33012 9.08768 4.34754 9.17482 4.38139 9.25606C4.41524 9.3373 4.46483 9.41103 4.52732 9.47301C4.58929 9.53549 4.66303 9.58509 4.74427 9.61894C4.82551 9.65278 4.91264 9.67021 5.00065 9.67021C5.08866 9.67021 5.1758 9.65278 5.25704 9.61894C5.33828 9.58509 5.41201 9.53549 5.47398 9.47301L12.334 2.60634V4.99967C12.334 5.17649 12.4042 5.34605 12.5292 5.47108C12.6543 5.5961 12.8238 5.66634 13.0007 5.66634C13.1775 5.66634 13.347 5.5961 13.4721 5.47108C13.5971 5.34605 13.6673 5.17649 13.6673 4.99967V0.999674C13.6663 0.912556 13.6481 0.826489 13.614 0.746341Z" fill="#0774E9" />
                                        </svg>
                                    </Link>

                                    {/* Model Window */}
                                    {(isPopupShow.editHours === true) &&
                                        <div>
                                            <Popup content={
                                                <form onSubmit={(event) => submitHours(event)} className="p-5 font-medium">
                                                    <div className="flex justify-between mb-2">
                                                        <h3 className="text-xl text-black">Edit Days & Times</h3>
                                                        <CloseBtn className="cursor-pointer" onClick={closeModel} />
                                                    </div>

                                                    <hr />


                                                    <div className="relative py-2 mb-1">




                                                        <div className="days block py-2">
                                                            <div className='flex items-center'>
                                                                {scheduleDays?.Sunday?.start_time ?
                                                                    <input type="checkbox" defaultChecked id="sun" value="Sunday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                                    :
                                                                    <input type="checkbox" id="sun" value="Sunday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                                }
                                                                <label htmlFor="sun" className="text-secondary font-semibold">Sunday </label>
                                                            </div>

                                                            <div className='py-2 flex align-middle items-center days_range'>
                                                                <select name="start-time1" defaultValue={moment(scheduleDays?.Sunday?.start_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                                    {hours.map((data, index) =>
                                                                        <option key={index} value={data}>{data}</option>
                                                                    )}
                                                                </select>
                                                                <select name="start-time2" defaultValue={moment(scheduleDays?.Sunday?.start_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                                    <option value="AM">AM</option>
                                                                    <option value="PM">PM</option>
                                                                </select>

                                                                <svg className='mx-4' width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect y="0.5" width="10" height="2" fill="#999999" />
                                                                </svg>


                                                                <select name="end-time1" defaultValue={moment(scheduleDays?.Sunday?.end_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                                    {hours.map((data, index) =>
                                                                        <option key={index} value={data}>{data}</option>
                                                                    )}
                                                                </select>
                                                                <select name="end-time2" defaultValue={moment(scheduleDays?.Sunday?.end_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                                    <option value="AM">AM</option>
                                                                    <option value="PM">PM</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="days block py-2">
                                                            <div className='flex items-center'>
                                                                {scheduleDays?.Monday?.start_time ?
                                                                    <input type="checkbox" defaultChecked id="mon" value="Monday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                                    :
                                                                    <input type="checkbox" id="mon" value="Monday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                                }
                                                                <label htmlFor="mon" className="text-secondary font-semibold">Monday </label>
                                                            </div>

                                                            <div className='py-2 flex align-middle items-center days_range'>
                                                                <select name="start-time1" defaultValue={moment(scheduleDays?.Monday?.start_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                                    {hours.map((data, index) =>
                                                                        <option key={index} value={data}>{data}</option>
                                                                    )}
                                                                </select>
                                                                <select name="start-time2" defaultValue={moment(scheduleDays?.Monday?.start_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                                    <option value="AM">AM</option>
                                                                    <option value="PM">PM</option>
                                                                </select>

                                                                <svg className='mx-4' width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect y="0.5" width="10" height="2" fill="#999999" />
                                                                </svg>


                                                                <select name="end-time1" defaultValue={moment(scheduleDays?.Monday?.end_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                                    {hours.map((data, index) =>
                                                                        <option key={index} value={data}>{data}</option>
                                                                    )}
                                                                </select>
                                                                <select name="end-time2" defaultValue={moment(scheduleDays?.Monday?.end_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                                    <option value="AM">AM</option>
                                                                    <option value="PM">PM</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="days block py-2">
                                                            <div className='flex items-center'>
                                                                {scheduleDays?.Tuesday?.start_time ?
                                                                    <input type="checkbox" defaultChecked id="tue" value="Tuesday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                                    :
                                                                    <input type="checkbox" id="tue" value="Tuesday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                                }
                                                                <label htmlFor="tue" className="text-secondary font-semibold">Tuesday </label>
                                                            </div>

                                                            <div className='py-2 flex align-middle items-center days_range'>
                                                                <select name="start-time1" defaultValue={moment(scheduleDays?.Tuesday?.start_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                                    {hours.map((data, index) =>
                                                                        <option key={index} value={data}>{data}</option>
                                                                    )}
                                                                </select>
                                                                <select name="start-time2" defaultValue={moment(scheduleDays?.Tuesday?.start_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                                    <option value="AM">AM</option>
                                                                    <option value="PM">PM</option>
                                                                </select>

                                                                <svg className='mx-4' width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect y="0.5" width="10" height="2" fill="#999999" />
                                                                </svg>


                                                                <select name="end-time1" defaultValue={moment(scheduleDays?.Tuesday?.end_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                                    {hours.map((data, index) =>
                                                                        <option key={index} value={data}>{data}</option>
                                                                    )}
                                                                </select>
                                                                <select name="end-time2" defaultValue={moment(scheduleDays?.Tuesday?.end_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                                    <option value="AM">AM</option>
                                                                    <option value="PM">PM</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="days block py-2">
                                                            <div className='flex items-center'>
                                                                {scheduleDays?.Wednesday?.start_time ?
                                                                    <input type="checkbox" defaultChecked id="wed" value="Wednesday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                                    :
                                                                    <input type="checkbox" id="wed" value="Wednesday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                                }
                                                                <label htmlFor="wed" className="text-secondary font-semibold">Wednesday </label>
                                                            </div>

                                                            <div className='py-2 flex align-middle items-center days_range'>
                                                                <select name="start-time1" defaultValue={moment(scheduleDays?.Wednesday?.start_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                                    {hours.map((data, index) =>
                                                                        <option key={index} value={data}>{data}</option>
                                                                    )}
                                                                </select>
                                                                <select name="start-time2" defaultValue={moment(scheduleDays?.Wednesday?.start_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                                    <option value="AM">AM</option>
                                                                    <option value="PM">PM</option>
                                                                </select>

                                                                <svg className='mx-4' width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect y="0.5" width="10" height="2" fill="#999999" />
                                                                </svg>


                                                                <select name="end-time1" defaultValue={moment(scheduleDays?.Wednesday?.end_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                                    {hours.map((data, index) =>
                                                                        <option key={index} value={data}>{data}</option>
                                                                    )}
                                                                </select>
                                                                <select name="end-time2" defaultValue={moment(scheduleDays?.Wednesday?.end_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                                    <option value="AM">AM</option>
                                                                    <option value="PM">PM</option>
                                                                </select>
                                                            </div>
                                                        </div>


                                                        <div className="days block py-2">
                                                            <div className='flex items-center'>
                                                                {scheduleDays?.Thursday?.start_time ?
                                                                    <input type="checkbox" defaultChecked id="thu" value="Thursday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                                    :
                                                                    <input type="checkbox" id="thu" value="Thursday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                                }
                                                                <label htmlFor="thu" className="text-secondary font-semibold">Thursday </label>
                                                            </div>

                                                            <div className='py-2 flex align-middle items-center days_range'>
                                                                <select name="start-time1" defaultValue={moment(scheduleDays?.Thursday?.start_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                                    {hours.map((data, index) =>
                                                                        <option key={index} value={data}>{data}</option>
                                                                    )}
                                                                </select>
                                                                <select name="start-time2" defaultValue={moment(scheduleDays?.Thursday?.start_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                                    <option value="AM">AM</option>
                                                                    <option value="PM">PM</option>
                                                                </select>

                                                                <svg className='mx-4' width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect y="0.5" width="10" height="2" fill="#999999" />
                                                                </svg>


                                                                <select name="end-time1" defaultValue={moment(scheduleDays?.Thursday?.end_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                                    {hours.map((data, index) =>
                                                                        <option key={index} value={data}>{data}</option>
                                                                    )}
                                                                </select>
                                                                <select name="end-time2" defaultValue={moment(scheduleDays?.Thursday?.end_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                                    <option value="AM">AM</option>
                                                                    <option value="PM">PM</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="days block py-2">
                                                            <div className='flex items-center'>
                                                                {scheduleDays?.Friday?.start_time ?
                                                                    <input type="checkbox" defaultChecked id="fri" value="Friday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                                    :
                                                                    <input type="checkbox" id="fri" value="Friday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                                }
                                                                <label htmlFor="fri" className="text-secondary font-semibold">Friday </label>
                                                            </div>

                                                            <div className='py-2 flex align-middle items-center days_range'>
                                                                <select name="start-time1" defaultValue={moment(scheduleDays?.Friday?.start_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                                    {hours.map((data, index) =>
                                                                        <option key={index} value={data}>{data}</option>
                                                                    )}
                                                                </select>
                                                                <select name="start-time2" defaultValue={moment(scheduleDays?.Friday?.start_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                                    <option value="AM">AM</option>
                                                                    <option value="PM">PM</option>
                                                                </select>

                                                                <svg className='mx-4' width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect y="0.5" width="10" height="2" fill="#999999" />
                                                                </svg>


                                                                <select name="end-time1" defaultValue={moment(scheduleDays?.Friday?.end_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                                    {hours.map((data, index) =>
                                                                        <option key={index} value={data}>{data}</option>
                                                                    )}
                                                                </select>
                                                                <select name="end-time2" defaultValue={moment(scheduleDays?.Friday?.end_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                                    <option value="AM">AM</option>
                                                                    <option value="PM">PM</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="days block py-2">
                                                            <div className='flex items-center'>
                                                                {scheduleDays?.Saturday?.start_time ?
                                                                    <input type="checkbox" defaultChecked="checked" id="sat" value="Saturday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                                    :
                                                                    <input type="checkbox" id="sat" value="Saturday" name='days[]' onChange={(event) => toggleTimeSchedule(event)} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
                                                                }
                                                                <label htmlFor="sat" className="text-secondary font-semibold">Saturday </label>
                                                            </div>

                                                            <div className='py-2 flex align-middle items-center days_range'>
                                                                <select name="start-time1" defaultValue={moment(scheduleDays?.Saturday?.start_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                                    {hours.map((data, index) =>
                                                                        <option key={index} value={data}>{data}</option>
                                                                    )}
                                                                </select>
                                                                <select name="start-time2" defaultValue={moment(scheduleDays?.Saturday?.start_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                                    <option value="AM">AM</option>
                                                                    <option value="PM">PM</option>
                                                                </select>

                                                                <svg className='mx-4' width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect y="0.5" width="10" height="2" fill="#999999" />
                                                                </svg>


                                                                <select name="end-time1" defaultValue={moment(scheduleDays?.Saturday?.end_time, "hh:mm A").format("hh : mm")} className='w-[140px] select-time text-center text-black text-base py-1 px-2 border border-gray-300 rounded-sm'>
                                                                    {hours.map((data, index) =>
                                                                        <option key={index} value={data}>{data}</option>
                                                                    )}
                                                                </select>
                                                                <select name="end-time2" defaultValue={moment(scheduleDays?.Saturday?.end_time, "hh:mm A").format("A")} className='w-[95px] ml-2 py-1 px-2 pl-4 text-black text-base border border-gray-300 rounded-sm'>
                                                                    <option value="AM">AM</option>
                                                                    <option value="PM">PM</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                    </div>


                                                    <button type="button" onClick={() => submitSelectedDays()} className="text-white bg-black py-3 text-base rounded cursor-pointer w-full hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-wait">
                                                        Save
                                                    </button>


                                                </form>}
                                            />
                                        </div>
                                    }



                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-base" style={{ verticalAlign: "middle" }}>Order Prepare Time</td>
                                <td className="px-5 text-base">
                                    <select onChange={() => orderPrepareTimeButton()} name="schedule_pickup" id="schedule_pickup" className='custom-select'>
                                        <option value="10">10 Minutes</option>
                                        <option value="20">20 Minutes</option>
                                        <option value="30">30 Minutes</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-base" style={{ verticalAlign: "middle" }}>Schedule Pickup</td>
                                <td className="px-5 text-base">
                                    <select onChange={() => schedulePickup()} name="schedule_pickup2" id="schedule_pickup2" className='custom-select'>
                                        <option value={1}>Allow</option>
                                        <option value={0}>Disallow</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-base" style={{ verticalAlign: "middle" }}>Store Availability</td>
                                <td className="px-5 text-base">

                                    <label className="toggle">
                                        {(info?.is_store_enable)
                                            ?
                                            <input id="store_availability" onClick={storeOpenBtn} name="store_availability" className="toggle-checkbox" type="checkbox" defaultChecked />
                                            :
                                            <input id="store_availability" onClick={storeOpenBtn} name="store_availability" className="toggle-checkbox" type="checkbox" />
                                        }
                                        <div className="toggle-switch"></div>
                                        <span className="toggle-label">&nbsp;Store Open</span>
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-base">Instructions</td>
                                <td className="px-5 text-base">
                                    <p>Please pick-up your order when complete.</p>

                                    <Link to="#" onClick={() => openModel("instructions")} className='text-[#0774E9] text-base font-medium flex items-center'>
                                        Write or Edit Instructions
                                        &nbsp;
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.0007 6.21301C10.8238 6.21301 10.6543 6.28325 10.5292 6.40827C10.4042 6.53329 10.334 6.70286 10.334 6.87967V11.6663C10.334 11.8432 10.2637 12.0127 10.1387 12.1377C10.0137 12.2628 9.84413 12.333 9.66732 12.333H2.33398C2.15717 12.333 1.9876 12.2628 1.86258 12.1377C1.73756 12.0127 1.66732 11.8432 1.66732 11.6663V4.33301C1.66732 4.1562 1.73756 3.98663 1.86258 3.8616C1.9876 3.73658 2.15717 3.66634 2.33398 3.66634H7.12065C7.29746 3.66634 7.46703 3.5961 7.59206 3.47108C7.71708 3.34605 7.78732 3.17649 7.78732 2.99967C7.78732 2.82286 7.71708 2.65329 7.59206 2.52827C7.46703 2.40325 7.29746 2.33301 7.12065 2.33301H2.33398C1.80355 2.33301 1.29484 2.54372 0.919771 2.91879C0.544698 3.29387 0.333984 3.80257 0.333984 4.33301V11.6663C0.333984 12.1968 0.544698 12.7055 0.919771 13.0806C1.29484 13.4556 1.80355 13.6663 2.33398 13.6663H9.66732C10.1978 13.6663 10.7065 13.4556 11.0815 13.0806C11.4566 12.7055 11.6673 12.1968 11.6673 11.6663V6.87967C11.6673 6.70286 11.5971 6.53329 11.4721 6.40827C11.347 6.28325 11.1775 6.21301 11.0007 6.21301ZM13.614 0.746341C13.5463 0.583442 13.4169 0.453991 13.254 0.386341C13.1738 0.35218 13.0878 0.334061 13.0007 0.333008H9.00065C8.82384 0.333008 8.65427 0.403246 8.52925 0.52827C8.40422 0.653294 8.33398 0.822863 8.33398 0.999674C8.33398 1.17649 8.40422 1.34605 8.52925 1.47108C8.65427 1.5961 8.82384 1.66634 9.00065 1.66634H11.394L4.52732 8.52634C4.46483 8.58832 4.41524 8.66205 4.38139 8.74329C4.34754 8.82453 4.33012 8.91167 4.33012 8.99967C4.33012 9.08768 4.34754 9.17482 4.38139 9.25606C4.41524 9.3373 4.46483 9.41103 4.52732 9.47301C4.58929 9.53549 4.66303 9.58509 4.74427 9.61894C4.82551 9.65278 4.91264 9.67021 5.00065 9.67021C5.08866 9.67021 5.1758 9.65278 5.25704 9.61894C5.33828 9.58509 5.41201 9.53549 5.47398 9.47301L12.334 2.60634V4.99967C12.334 5.17649 12.4042 5.34605 12.5292 5.47108C12.6543 5.5961 12.8238 5.66634 13.0007 5.66634C13.1775 5.66634 13.347 5.5961 13.4721 5.47108C13.5971 5.34605 13.6673 5.17649 13.6673 4.99967V0.999674C13.6663 0.912556 13.6481 0.826489 13.614 0.746341Z" fill="#0774E9" />
                                        </svg>
                                    </Link>


                                    {/* Model Window */}
                                    {(isPopupShow.editInstructions === true) &&
                                        <div>
                                            <Popup content={
                                                <form onSubmit={(event) => submitInstructionForm(event)} className="p-5 font-medium">
                                                    <div className="flex justify-between">
                                                        <h3 className="text-xl text-black">Write or Edit Instructions</h3>
                                                        <CloseBtn className="cursor-pointer" onClick={closeModel} />
                                                    </div>

                                                    <textarea name="instruction" id="instruction" value={instruction} onChange={(event) => setInstruction(event.currentTarget.value)} className='w-full h-48 mt-5 mb-3 p-3 resize-none border-[#DDD] rounded overflow-hidden focus:outline-none' placeholder='Example: Please pick-up your order when complete'></textarea>

                                                    <button type="submit" className="text-white bg-black py-3 text-base rounded cursor-pointer w-full hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-wait">
                                                        Save
                                                    </button>

                                                </form>}
                                            />
                                        </div>
                                    }




                                </td>
                            </tr>
                        </tbody>
                    </table>


                    <style>{`
                .select-time {
                    background-image: none !important;
                }

                table.custom-details-table tr td:first-child {
                    width: 330px;
                    background: none;
                    border: 0;
                    border-bottom: 1px solid #F5F5F5; 
                    vertical-align: top;
                    padding: 20px 5px;
                }

                table.custom-details-table:not(.no-hover) tr td:hover {
                    background: none;
                }

                table.custom-details-table tr td:nth-child(2) {
                    border: 0;
                    border-bottom: 1px solid #F5F5F5; 
                    color: #444444;
                    padding: 20px 5px;
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
                }

                {/* Toggle Switcher End */}


                select#schedule_pickup ,select#schedule_pickup2{
                    border-color: transparent;
                    padding-left: 0;
                    border:0px;
                    outline:0px;
                }GoogleApiWrapper

                select(.custom-select):focus {
                    box-shadow: none !important;
                    border: none !important;
                }

                .days_range {
                    display: none;
                }

                `}</style>
                </>
            }
        </>
    )
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY
})(StoreSettings);
