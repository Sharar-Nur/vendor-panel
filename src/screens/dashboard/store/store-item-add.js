import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as CloseBtn } from '../../../assets/icons/close.svg'
import BlackButton from '../../../components/BlackButton';
import proPic from '../../../assets/images/pro_pic.jpg'
import shareTrip from '../../../assets/images/shareTrip.jpg'
import { toast } from 'react-toastify';
import PostLoginPostApi from '../../../components/api/PostLoginPostApi';
import PlusImage from "./../../../assets/images/u_plus.png";

import RadioIcon from "./../../../assets/icons/radio-icon.png";
import RadioIcon2 from "./../../../assets/icons/radio_selected_icon.png";
import CheckBoxIcon from "./../../../assets/icons/checkbox-icon.png";
import CheckBoxIcon2 from "./../../../assets/icons/checkbox_selected_icon.png";


import { Controller, useForm } from "react-hook-form";
import $ from "jquery";
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';
import CrossIcon from './../../../assets/icons/cross.svg';




const StoreItemAdd = () => {

    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [categoryList, setCategoryList] = useState([]);
    const { state } = useLocation();



    // Get Category Lists
    useEffect(() => {
        PostLoginGetApi("shop/category").then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    setCategoryList(responseData["data"]?.data);
                }
            }

        }).catch((err) => {
            console.log(err);
        });
    }, []);



    const onSubmit = (data) => {


        let reqBody = new FormData();

        let is_valid = true;

        $(".variant-box").each((i) => {
            let box = $(".variant-box").eq(i);
            let variant_name = box.find("input[name='variant_name']");
            if (variant_name.val().length > 0) {
                let is_radio;
                let variant_type = box.find("div.textfirst>img").attr("alt");
                if (variant_type === "Radio") {
                    is_radio = 1;
                }
                else if (variant_type === "Checkbox") {
                    is_radio = 0;
                }

                if (is_radio !== 0 && is_radio !== 1) {
                    is_valid = false;
                    toast.error("Invalid variant type.");
                    return;
                }



                reqBody.append("addons[" + i + "][is_required]", 1);
                reqBody.append("addons[" + i + "][name]", variant_name.val());
                reqBody.append("addons[" + i + "][is_radio_button]", is_radio);

                let item_names = box.find("div.addons-item-name");
                let item_prices = box.find("span.addons-item-price");

                item_names.each((j) => {
                    reqBody.append("addons[" + i + "][items][" + j + "][name]", item_names.eq(j).html());
                    reqBody.append("addons[" + i + "][items][" + j + "][unit_price]", item_prices.eq(j).html());
                });
            }
        });


        if (file === undefined) {
            toast.error("Please upload a valid image file");
            return;
        }

        if (is_valid === true) {

            // Other Information
            reqBody.append("category_id", data.itemCategory);
            reqBody.append("name", data.itemName);
            reqBody.append("unit", data.unit);
            reqBody.append("unit_price", data.unitPrice);
            reqBody.append("image", file);
            reqBody.append("description", '');
            reqBody.append("barcode", data.barcodeNumber);
            reqBody.append("url", data.url);
            reqBody.append("stock_quantity", data.quantity);

            // Is low stock alert is active
            data.low_stock_alert && reqBody.append("low_stock_alert", data.low_stock_alert);

            // Call Create Item API
            PostLoginPostApi("shop/item", reqBody, 1, 1).then((responseJSON) => {
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {
                        toast.success("Item created successfully.");

                        navigate("/dashboard/store/items-details", {
                            state: {
                                itemId: responseData.data.id,
                            }
                        });
                        return;
                    }

                    toast.error('A problem occur. Please try again.');
                    return;
                }
            }).catch((error) => {
                console.log(error);
            });

        }
    }



    const lowStockSwitch = (event) => {
        $("#low_stock_alert_div").hide();
        $("#low_stock_alert").val("");
        if (event.target.checked === true) {
            $("#low_stock_alert_div").show();
        }
    }



    const fileInput = useRef();
    const [file, setFile] = useState();


    const selectFile = () => {
        fileInput.current.click();
    }

    const handleChange = (e) => {
        if (!e.target.files[0]["type"].includes("image/")) {
            toast.error("Please upload valid Image file.");
            return;
        }

        setFile(e.target.files[0]);
    }

    const resetFileInput = () => {
        fileInput.current.value = null;
        setFile(null);
    };

    const [unitPrice, setUnitPrice] = useState('')
    const [barcodeInput, setBarcodeInput] = useState('')
    const [quantityInput, setQuantityInput] = useState('')
    const [lowStockInput, setLowStockInput] = useState('')
    const [addPrice, setAddPrice] = useState('')



    const unitPriceChange = (event) => {
        const result2 = event.target.value.replace(/\D/g, '');
        setUnitPrice(result2)
    }

    const barcodeInputHandler = (event) => {
        const res = event.target.value.replace(/\D/g, '');
        setBarcodeInput(res);
    }
    const quantityInputHandler = (event) => {

        const res2 = event.target.value.replace(/\D/g, '');
        setQuantityInput(res2)
    }

    const lowStockInputHandler = (event) => {

        const output = event.target.value.replace(/\D/g, '');
        setLowStockInput(output)
    }

    const addPriceHandler = (event) => {

        const output2 = event.target.value.replace(/\D/g, '');
        setAddPrice(output2)
    }


    const showDropDown = (index) => {

        $("#required" + index).hide();
        $("#optional" + index).hide();

        $("#variant-box" + index).find("img.vo_radio_icon").hide();
        $("#variant-box" + index).find("img.vo_checkbox_icon").hide();


        var main = $('div#mm-dropdown' + index + ' .textfirst');
        var input = $(".option" + index);


        // Set Input Data
        $('div#mm-dropdown' + index).find("ul > li.input-option").each((j) => {
            $('div#mm-dropdown' + index).find("ul > li.input-option").eq(j).on("click", () => {
                main.html($('div#mm-dropdown' + index).find("ul > li.input-option").eq(j).html());
                input.val($('div#mm-dropdown' + index).find("ul > li.input-option").eq(j).attr("data-value"));
            });
        });


        if (input.val() === "radio") {
            $("#required" + index).show();
            $("#variant-box" + index).find("img.vo_radio_icon").show();
        }
        else if (input.val() === "checkbox") {
            $("#optional" + index).show();
            $("#variant-box" + index).find("img.vo_checkbox_icon").show();
        }

        // Close option list if open
        if ($('div#mm-dropdown' + index).find("ul").is(":visible")) {
            $('div#mm-dropdown' + index).find("ul").hide();
            $('div#mm-dropdown' + index).find("ul > li.input-option").hide();
            return;
        }

        // Open Option
        $('div#mm-dropdown' + index).find("ul").show();
        $('div#mm-dropdown' + index).find("ul > li.input-option").show();

    }
    window.showDropDown = showDropDown;

    const removeVariant = (index) => {
        $("#variant-box" + index).remove();
    }
    window.removeVariant = removeVariant;

    const onEnterPressName = (event) => {
        if (event.key === "Enter") {
            let radio = $(event.target).parent("div").parent("div").find("img.vo_radio_icon");
            let checkbox = $(event.target).parent("div").parent("div").find("img.vo_checkbox_icon");

            // Check variable name is set or not
            let variant_name = $(event.target).parent("div").parent("div").parent("div").find("input[name='variant_name']").val();
            if (variant_name === "") {
                $(event.target).parent("div").parent("div").parent("div").find("input[name='variant_name']").focus();
                alert("Please enter variant name.");
                return;
            }

            if (radio.is(":visible") === false && checkbox.is(":visible") === false) {
                alert("Please choose variant type.");
                return;
            }

            if (event.currentTarget.value === "") {
                alert("Please enter variant item first.");
                return;
            }
            $(event.target).next("input").focus();
        }
    }
    window.onEnterPressName = onEnterPressName;




    const onEnterPressPrice = (event) => {
        if (event.key === "Enter") {
            if (event.currentTarget.value === "") {
                alert("Please enter variant price.");
                return;
            }


            // Check variable name is set or not
            let variant_name = $(event.target).parent("div").parent("div").parent("div").find("input[name='variant_name']");
            if (variant_name.val() === "") {
                variant_name.focus();
                alert("Please enter variant name.");
                return;
            }

            // Check variant type is set or not
            let radio = $(event.target).parent("div").parent("div").find("img.vo_radio_icon");
            let checkbox = $(event.target).parent("div").parent("div").find("img.vo_checkbox_icon");

            if (radio.is(":visible") === false && checkbox.is(":visible") === false) {
                alert("Please choose variant type.");
                return;
            }

            let radio_style = "none";
            if (radio.is(":visible") === true) {
                radio_style = "block";
            }

            let checkbox_style = "none";
            if (checkbox.is(":visible") === true) {
                checkbox_style = "block";
            }

            let vIndex = $("#vIndex").val();
            vIndex = parseInt(vIndex);


            const variantIndex = $(event.target).parent("div").parent("div").parent("div").find("input[name='variant_box_index']").val();
            if (variantIndex < 0) {
                toast.error("No variant index found.");
                return;
            }

            // Now add price option
            let html = '<div id="variant_option_fixed_' + vIndex + '" class="variant-option-fixed flex items-center mt-1 py-1"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAVCAYAAABG1c6oAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHXSURBVHgBrVXLbcJAEB0vvwsHdxAjARI3p4JAB6SCkAogFSAqgA4CFYQOIBVgTkh8hNMBZ8Qn75l1Ygi2bCtPsvY7b2dnZp8NicByubTR2IZhWByfz2cXjVOtVp0wG+N2YjabmUD7dDp1MDRD7FyQ98rl8jCSkB5lMpkPdC3fEN8U5F/eZniK7ym4vt/vG7Vazf1DqMkm2isHJG+VSmUqd7Ber5sg7mvi3fF4bPhh8AgXi4WVz+dJZuEqI1ylJTEA4iGIX4KeKi6ArKtPG8clI7gXDkxpC46+56H2bstTlFKNUqnkSgJst1sL4Zmha+LqjyqXy3X02jQpGUEbhol95KCpdNYEp4wkJUA4ZksuxpDFK2EZjYNsNutoYlvJPwDX3umuSUJvwBciKYHE+LY7ErrsFYtFW1LicDh4toiho3DvTw5QMnVJCdiyuJnYufIzBLRZk5IQ2qbFPspmoJhdXe1moVB4l4QI2AxZk0ozv8pFkuqbzSYWKZPIvbSRyyvrcf5HbZApGzHw1SZU74jValUHAQ+25ObJXumhfpcTudZDStmcAxg+oGnKr/A6mHsOPlnjngeQpRZKoBsgvgUPGSH+g9sFQyLAMEBBqJFenfGfAjGJFJFvfYfmzDcuGA0AAAAASUVORK5CYII=" alt="Variant Option" class="vo_radio_icon h-[18px] hidden" style="display: ' + radio_style + ';"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABISURBVHgB7dSxDQAgCETRwzgICfuPRGQTlYIJvFjxG61eoEHcfQFQcIpBxDKd9TMzwUN3053vALkGG2ywwT+g1B1jlRMGeMUBLKAONRePu7wAAAAASUVORK5CYII=" alt="Variant Option" class="vo_checkbox_icon h-[18px] hidden" style="display: ' + checkbox_style + ';"><div class="flex justify-between w-full pl-2"><div class="w-[70%] pl-0 pt-0.5 addons-item-name">' + $(event.target).parent("div").find(".variant-item").val() + '</div><div class="ml-2 w-[23%] pl-0 pt-1 text-center">+ ৳ <span class="addons-item-price" style="margin-left:7px;">' + event.currentTarget.value + '</span></div><div class="h-6 w-6 flex items-center mt-1 cursor-pointer" onClick="javascript:removeCurrentVariantItem(' + vIndex + ');"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.4099 12L19.7099 5.71C19.8982 5.5217 20.004 5.2663 20.004 5C20.004 4.7337 19.8982 4.47831 19.7099 4.29C19.5216 4.1017 19.2662 3.99591 18.9999 3.99591C18.7336 3.99591 18.4782 4.1017 18.2899 4.29L11.9999 10.59L5.70994 4.29C5.52164 4.1017 5.26624 3.99591 4.99994 3.99591C4.73364 3.99591 4.47824 4.1017 4.28994 4.29C4.10164 4.47831 3.99585 4.7337 3.99585 5C3.99585 5.2663 4.10164 5.5217 4.28994 5.71L10.5899 12L4.28994 18.29C4.19621 18.383 4.12182 18.4936 4.07105 18.6154C4.02028 18.7373 3.99414 18.868 3.99414 19C3.99414 19.132 4.02028 19.2627 4.07105 19.3846C4.12182 19.5064 4.19621 19.617 4.28994 19.71C4.3829 19.8037 4.4935 19.8781 4.61536 19.9289C4.73722 19.9797 4.86793 20.0058 4.99994 20.0058C5.13195 20.0058 5.26266 19.9797 5.38452 19.9289C5.50638 19.8781 5.61698 19.8037 5.70994 19.71L11.9999 13.41L18.2899 19.71C18.3829 19.8037 18.4935 19.8781 18.6154 19.9289C18.7372 19.9797 18.8679 20.0058 18.9999 20.0058C19.132 20.0058 19.2627 19.9797 19.3845 19.9289C19.5064 19.8781 19.617 19.8037 19.7099 19.71C19.8037 19.617 19.8781 19.5064 19.9288 19.3846C19.9796 19.2627 20.0057 19.132 20.0057 19C20.0057 18.868 19.9796 18.7373 19.9288 18.6154C19.8781 18.4936 19.8037 18.383 19.7099 18.29L13.4099 12Z" fill="#999999"></path></svg></div></div></div>';


            $(event.target).parent("div").parent("div").parent("div").find(".variant-option-fixed-box").append(html);

            vIndex++;
            $("#vIndex").val(vIndex);


            $(event.target).parent("div").find(".variant-item").val("");
            $(event.target).parent("div").find(".variant-item").focus();

            event.currentTarget.value = "";
        }
    }
    window.onEnterPressPrice = onEnterPressPrice;


    const removeCurrentVariantItem = (index) => {
        $("#variant_option_fixed_" + index).remove();
    }
    window.removeCurrentVariantItem = removeCurrentVariantItem;



    const addMoreVariant = () => {

        let index = $("#variant_id").val();
        index = parseInt(index);
        index++;

        $("#variant_id").val(index);

        let data = '<div id="variant-box' + index + '" class="mt-3 pt-3 mb-4" style="border-top: 2px dotted rgb(221, 221, 221); margin-top: 6px; padding-top: 8px; margin-bottom: 10px;"><div class="text-[#FD171B] flex float-right items-center font-semibold cursor-pointer close-btn" onClick="removeVariant(' + index + ')"><svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.82067 4.99913L9.49567 1.32996C9.60552 1.22012 9.66723 1.07114 9.66723 0.915798C9.66723 0.760456 9.60552 0.611475 9.49567 0.501632C9.38583 0.391788 9.23685 0.330078 9.08151 0.330078C8.92616 0.330078 8.77718 0.391788 8.66734 0.501632L4.99817 4.17663L1.32901 0.501632C1.21916 0.391788 1.07018 0.330078 0.914841 0.330078C0.759498 0.330078 0.610518 0.391788 0.500674 0.501632C0.39083 0.611475 0.329121 0.760456 0.329121 0.915798C0.329121 1.07114 0.39083 1.22012 0.500674 1.32996L4.17567 4.99913L0.500674 8.6683C0.445999 8.72253 0.402603 8.78704 0.372988 8.85813C0.343372 8.92921 0.328125 9.00546 0.328125 9.08246C0.328125 9.15947 0.343372 9.23572 0.372988 9.3068C0.402603 9.37789 0.445999 9.4424 0.500674 9.49663C0.554902 9.55131 0.61942 9.5947 0.690504 9.62432C0.761589 9.65393 0.837834 9.66918 0.914841 9.66918C0.991848 9.66918 1.06809 9.65393 1.13918 9.62432C1.21026 9.5947 1.27478 9.55131 1.32901 9.49663L4.99817 5.82163L8.66734 9.49663C8.72157 9.55131 8.78609 9.5947 8.85717 9.62432C8.92826 9.65393 9.0045 9.66918 9.08151 9.66918C9.15851 9.66918 9.23476 9.65393 9.30584 9.62432C9.37693 9.5947 9.44144 9.55131 9.49567 9.49663C9.55035 9.4424 9.59375 9.37789 9.62336 9.3068C9.65298 9.23572 9.66822 9.15947 9.66822 9.08246C9.66822 9.00546 9.65298 8.92921 9.62336 8.85813C9.59375 8.78704 9.55035 8.72253 9.49567 8.6683L5.82067 4.99913Z" fill="#FD171B"></path></svg><span class="ml-1 text-[12px] float-right">close</span></div><div class="variant-box"><div class="w-full flex"><input type="hidden" name="variant_box_index" value="' + index + '" /><div class="relative pb-1 pt-2 w-3/5"><input type="text" name="variant_name" id="variant_name' + index + '" placeholder=" " class="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"><label for="variant_name' + index + '" class="absolute -mt-1 text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:mt-1 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Variant Name</label></div><div class="relative pl-2 pb-1 mb-1 w-2/5"><div class="py-2 relative"><div id="mm-dropdown' + index + '" class="mm-dropdown cursor-pointer" onClick="showDropDown(' + index + ')"><div class="textfirst"><span class="w-[100%]">Choose option</span><img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-down-b-128.png" alt="Option" width="10" height="10" class="down"></div><ul style="display: none;"><li class="input-option" data-value="radio"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIYSURBVHgBnVQ7VsJQEH1JWIB2VhioLNmB4VdjaSfp7JQVCCsAVwDuAGp+ocMupRWf0g57Pt6r83IeEQLHOSe8Yb535s08Sx0gz/MuUqlUFeytZVm53W7nUg5+AT7cbre90WjUOeRrxQXlcvkJTnWwFyqBGHyz2TTige1YsDaCtSRYACd/vV5nBoOBxY880PnQhURt23a7VCo1DyIUxTMMVzj94XDYVQlUKBSqSNjEx+QtJKxFAalkNgZDGfkgCEJ1BqHXOcdxxgxK5CzfklLnLEELTRRI9EBfEfFCXmM2z7BhdSu2xBHoVfYMZdaMFrxAzn66BqgryO6y2ayazWYTCubz+RT/mfAGuncbPxUqkPnNRIajro5TvVgs3hn/e3JWbF0OAgZaixKe1AkCkMgGpXbFz7PllhQuYmHY59Rpimy0788oqf/TwcEnwgUZ9O3akAfqNEU2HB9hQxu90zOX1wbmBR0j0wa90wGXRDgR4YM2kDlrJMTb22EM94sk6TrpdPoDQR/x3WCevjBfUypxBq7rLuXSXG4ReOp8rFkUTB6Te3wLJPH16kXTDqd8v98/e/XwzI3BRqvnUMFpz2Qylwjm4e89kH1ClhiUyACio35vu4Et41btv4eY/pYeWP3eoT+hRgxELhBxQ7hdnu4nWlDXMf48sLLb3GNXJRB7hqMWf+asYw4SuCKBcxq1rGgP6LEgwSru9w3wkRscyxKWJAAAAABJRU5ErkJggg==" alt="Radio" width="20" height="20"> Single Choice</li><li class="input-option" data-value="checkbox"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADHSURBVHgB7ZXrCcMgEIDPYP5nhGSDjpBCHKRzKtQRukEdoQP4qAcVxFKM0RIC+SB4eX0X46kAR4eEgDH2dM6N0ABCiOKcTxh34WIreeqi6U0hBIEKlmVx8XkHf+ZMkIXCBuZ5Hvu+v2McyvEXxT0IcixFa232+WwPfNnhl7601jffDkHuD2WMuVYnQJmfmSOlFNshlkspVe797C9CEQp9eCmVr0qAoijJo0SOrKqij3CCDZwzef8EX4Ocrue1xDuagka0dO3PG7I3cp4SV6ZfAAAAAElFTkSuQmCC" alt="Checkbox" width="20" height="20"> Multiple Choice</li></ul><input type="hidden" class="option' + index + '" name="is_radio_button" value=""></div></div></div><div id="required' + index + '" class="bg-[#E5F9EA] hidden text-[#009E22] ml-1 -mr-1 px-2 py-1 h-6 text-[10px] mt-4 font-medium rounded-3xl">Required</div><div id="optional' + index + '" class="bg-[#F5F5F5] hidden text-[#999999] ml-1 -mr-1 px-2 py-1 h-6 text-[10px] mt-4 font-medium rounded-3xl">Optional</div></div><div class="variant-option-fixed-box"></div><div class="variant-option flex items-center mt-2"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAVCAYAAABG1c6oAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHXSURBVHgBrVXLbcJAEB0vvwsHdxAjARI3p4JAB6SCkAogFSAqgA4CFYQOIBVgTkh8hNMBZ8Qn75l1Ygi2bCtPsvY7b2dnZp8NicByubTR2IZhWByfz2cXjVOtVp0wG+N2YjabmUD7dDp1MDRD7FyQ98rl8jCSkB5lMpkPdC3fEN8U5F/eZniK7ym4vt/vG7Vazf1DqMkm2isHJG+VSmUqd7Ber5sg7mvi3fF4bPhh8AgXi4WVz+dJZuEqI1ylJTEA4iGIX4KeKi6ArKtPG8clI7gXDkxpC46+56H2bstTlFKNUqnkSgJst1sL4Zmha+LqjyqXy3X02jQpGUEbhol95KCpdNYEp4wkJUA4ZksuxpDFK2EZjYNsNutoYlvJPwDX3umuSUJvwBciKYHE+LY7ErrsFYtFW1LicDh4toiho3DvTw5QMnVJCdiyuJnYufIzBLRZk5IQ2qbFPspmoJhdXe1moVB4l4QI2AxZk0ozv8pFkuqbzSYWKZPIvbSRyyvrcf5HbZApGzHw1SZU74jValUHAQ+25ObJXumhfpcTudZDStmcAxg+oGnKr/A6mHsOPlnjngeQpRZKoBsgvgUPGSH+g9sFQyLAMEBBqJFenfGfAjGJFJFvfYfmzDcuGA0AAAAASUVORK5CYII=" alt="Variant Option" class="vo_radio_icon h-[18px] hidden"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABISURBVHgB7dSxDQAgCETRwzgICfuPRGQTlYIJvFjxG61eoEHcfQFQcIpBxDKd9TMzwUN3053vALkGG2ywwT+g1B1jlRMGeMUBLKAONRePu7wAAAAASUVORK5CYII=" alt="Variant Option" class="vo_checkbox_icon h-[18px] hidden"><div class="flex justify-between w-full pl-2"><input type="text" name="variant-item" class="variant-item w-[70%] pl-0 border-transparent focus:border-green-700 focus:ring-0 mr-3" onKeyDown="onEnterPressName(event)" placeholder="Add Variant Item"><input type="text" name="add-price" class="ml-2 w-[27%] text-center add-price border-transparent focus:border-green-700 focus:ring-0" onKeyDown="onEnterPressPrice(event)" placeholder="+ Add Price"></div></div></div></div>';

        $("#more_variant").append(data);

    }


    return (
        <div className="font-medium min-h-[100vh] w-[100%] h-[100vh] custom-container-left custom-scroll-auto">
            <form className="mb-10" action='' autoComplete="on" method='POST' encType='multipart/form-data' >
                <header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[60px]">
                    <Link to="/dashboard/store" state={{ from: state }} ><CloseBtn /></Link>
                    <p className="-mr-24 text-xl text-black">Create an Item</p>
                    <div>
                        <input type="button" value="Save and Add More" className="bg-[#DDDDDD] text-black py-2 px-5 rounded-sm hover:cursor-pointer hover:bg-gray-300 mr-3"></input>
                        <input type="button" value="Save" onClick={handleSubmit(onSubmit)} className="bg-[#00D632] text-white py-2 px-5 rounded-sm hover:cursor-pointer hover:bg-green-500"></input>
                    </div>
                </header>
                <main className="max-w-2xl m-auto">
                    <h1 className="text-xl">Item Details</h1>
                    <div className="mt-[5px] mb-[15px]">
                        <div className="relative pb-1 pt-1 mb-1">
                            <input type="text" name="itemName" {...register("itemName", { required: true })} id="itemName" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" />

                            <label htmlFor="itemName" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Write item name</label>
                        </div>
                        <div className="py-2 mt-1 relative">
                            <select name="unit" {...register("unit")} id="unit" className="w-full rounded border-solid border border-dark-white " required>
                                <option value="" hidden>Select unit</option>
                                <option value="pc" className='text-black'>Pc</option>
                                <option value="kg" className='text-black'>Kg</option>
                                <option value="ltr" className='text-black'>Ltr</option>
                                <option value="unit" className='text-black'>Unit</option>
                                <option value="unit" className='text-[#00D632]'>Enter Other Unit</option>
                            </select>

                            {/* 
                            <select {...register("storeCategory", { required: true })} className="w-full rounded border-solid border border-dark-white">
                                <option value="">Select...</option>
                                <option value="pc">Pc</option>
                                <option value="kg">Kg</option>
                            </select> */}

                            <label htmlFor="storeCategory" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:opacity-100 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Select unit</label>
                        </div>
                        <div className="relative pb-1 pt-1 mb-1">
                            <input type="text" pattern="[0-9.]*" name="unitPrice" {...register("unitPrice")} id="unitPrice" onChange={unitPriceChange} value={unitPrice} placeholder=" " className="pl-14 w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />

                            <label id="unitPrice_label" htmlFor="unitPrice" className="absolute pl-14 text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Unit price</label>

                            <span style={{
                                position: "absolute",
                                float: "left",
                                display: "flex",
                                zIndex: "9999",
                                marginTop: "-33px",
                                marginLeft: "12px",
                                fontWeight: "600"
                            }}>BDT</span>
                        </div>

                        <div className="relative pb-1 pt-1 mb-1">
                            <select name="itemCategory" id="itemCategory" {...register("itemCategory")} className='w-full rounded border-solid border border-dark-white' required>
                                <option value="" hidden>Select a category</option>
                                {categoryList.map((data, index) => (
                                    <option key={index} value={data.id} className='text-black'>{data.name}</option>
                                ))}
                            </select>
                            {/* <input type="text" name="itemCategory" {...register("itemCategory")} id="itemCategory" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />

                            <label htmlFor="itemCategory" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Write a category</label> */}
                        </div>
                    </div>
                    <div className="bg-[#F5F5F5] opacity-80 h-[.8px] my-5"></div>
                    <h1 className="text-xl">Other Details</h1>
                    <div className="mt-[5px] mb-[15px]">
                        <div className="relative pb-1 pt-1 mb-1">
                            <input type="text" name="barcodeNumber" {...register("barcodeNumber")} value={barcodeInput} onChange={barcodeInputHandler} id="barcodeNumber" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" />

                            <label htmlFor="barcodeNumber" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Barcode number</label>
                        </div>

                        <div className="relative pb-1 pt-1 mb-1">
                            <input type="text" name="url" {...register("url")} id="url" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" />

                            <label htmlFor="url" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Enter URL</label>
                        </div>



                        <input type="file" name="image" className="hidden" ref={fileInput} onChange={handleChange} />
                        <button type="Button" className="w-full  text-white bg-[#1A202C] mt-3 py-[12px] px-[32px] h-[48px] rounded-[3px] cursor-pointer flex justify-center mb-3 " onClick={selectFile}>
                            <span className="mr-2.5">
                                <img src={PlusImage} alt="Plus Sign"></img>
                            </span>
                            Add Image
                        </button>
                        {
                            file &&
                            <div className='flex justify-between' >
                                <p>{file.name}</p>
                                <div className='flex cursor-pointer' onClick={resetFileInput}>
                                    <img src={CrossIcon} alt="Cross icon" className='mr-2' />
                                    <p className='text-[#FD171B]'>Remove</p>
                                </div>
                            </div>
                        }

                    </div>

                    <h1 className="text-xl py-1">Stock Details</h1>
                    <div className='block border border-[#e5e7eb] rounded-md py-5 px-4 mt-2'>

                        <h1 className="text-base font-semibold pl-1">Quantity</h1>
                        <div className="relative mt-2 pb-1 pt-1 mb-1">
                            <input type="text" name="quantity" {...register("quantity")} value={quantityInput} onChange={quantityInputHandler} id="quantity" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />

                            <label htmlFor="quantity" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Enter Quantity</label>
                        </div>
                    </div>

                    <div className='block border border-[#e5e7eb] rounded-md py-5 px-4 mt-2 mb-5'>
                        <label className="toggle my-1 w-full">
                            <input id="apply_item_or_category" name="apply_item_or_category" {...register("apply_item_or_category")} onChange={(event) => lowStockSwitch(event)} className="toggle-checkbox" value="1" type="checkbox" />
                            <div className="toggle-switch float-right"></div>
                            <span className="toggle-label text-base font-semibold">Low Stock Alert</span>
                        </label>

                        <div className="hidden" id='low_stock_alert_div'>
                            <div className="relative mt-2 pb-1 pt-1 mb-1">
                                <input type="text" name="low_stock_alert" {...register("low_stock_alert")} value={lowStockInput} onChange={lowStockInputHandler} id="low_stock_alert" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" />

                                <label htmlFor="low_stock_alert" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Alert Quantity</label>
                            </div>
                            <button type="Button" className="w-full text-white bg-[#1A202C] mt-3 py-[12px] px-[32px] h-[48px] rounded-[3px] cursor-pointer justify-center mb-3 hidden">
                                Update
                            </button>
                        </div>
                    </div>


                    <input type="hidden" id="vIndex" value="0" />

                    <h1 className="text-xl py-1">Variant Details</h1>

                    <div className='block border border-[#e5e7eb] rounded-md py-5 px-4 mt-2 pt-3 w-full'>

                        <div id="variant-box0" className='variant-box'>
                            <div className='w-full flex'>
                                <input type="hidden" name="variant_box_index" value={0} />
                                <div className="relative pb-1 pt-2 w-3/5">
                                    <input type="text" name="variant_name" id="variant_name0" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" />

                                    <label htmlFor="variant_name0" className="absolute -mt-1 text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:mt-1 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1" >Variant Name</label>
                                </div>


                                <div className="relative pl-2 pb-1 mb-1 w-2/5">
                                    <div className="py-2 relative">
                                        <div id="mm-dropdown0" className="mm-dropdown cursor-pointer" onClick={() => showDropDown(0)}>
                                            <div className="textfirst">
                                                <span className='w-[100%]'>Choose option</span>
                                                <img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-down-b-128.png" alt="Option" width="10" height="10" className="down" />
                                            </div>
                                            <ul style={{ display: "none" }} >
                                                <li className="input-option" data-value="radio">
                                                    <img src={RadioIcon} alt="Radio" width="20" height="20" /> Single Choice
                                                </li>
                                                <li className="input-option" data-value="checkbox">
                                                    <img src={CheckBoxIcon} alt="Checkbox" width="20" height="20" /> Multiple Choice
                                                </li>
                                            </ul>

                                            <input type="hidden" className="option0" name="is_radio_button" value="" />
                                        </div>
                                    </div>
                                </div>

                                <div id="required0" className='bg-[#E5F9EA] hidden text-[#009E22] ml-1 -mr-1 px-2 py-1 h-6 text-[10px] mt-4 font-medium rounded-3xl'>
                                    Required
                                </div>
                                <div id="optional0" className='bg-[#F5F5F5] hidden text-[#999999] ml-1 -mr-1 px-2 py-1 h-6 text-[10px] mt-4 font-medium rounded-3xl'>
                                    Optional
                                </div>
                            </div>

                            <div className='variant-option-fixed-box'></div>

                            <div className='variant-option flex items-center mt-2'>
                                <img src={RadioIcon2} alt="Variant Option" className='vo_radio_icon h-[18px] hidden'></img>
                                <img src={CheckBoxIcon2} alt="Variant Option" className='vo_checkbox_icon h-[18px] hidden'></img>
                                <div className='flex justify-between w-full pl-2'>
                                    <input type="text" name="variant-item" onKeyDown={onEnterPressName} className='variant-item w-[70%] pl-0 variant-item border-transparent focus:border-green-700 focus:ring-0 mr-3' placeholder='Add Variant Item' />
                                    <input type="text" name="add-price" onChange={addPriceHandler} value={addPrice} onKeyDown={onEnterPressPrice} className='ml-2 w-[27%] text-center add-price border-transparent focus:border-green-700 focus:ring-0' placeholder='+ Add Price' />
                                </div>
                            </div>


                        </div>



                        <input type="hidden" value={0} id="variant_id" />
                        <div id="more_variant" style={{ marginTop: "18px" }}></div>


                        <button type="Button" onClick={addMoreVariant} className="w-full text-white bg-[#1A202C] mt-6 py-[12px] px-[32px] h-[48px] rounded-[3px] cursor-pointer flex justify-center mb-3">
                            <span className="mr-2.5">
                                <img src={PlusImage} alt="Plus Sign"></img>
                            </span>
                            Add More Variant
                        </button>
                    </div>


                    {/* <BlackButton name="Add Image" /> */}


                </main>

            </form>

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


                {/* Option Value */}
                select option[value="radio"] {
                    background-image:url(${RadioIcon}) !important;
                }

                .variant-item, .add-price{
                    margin: 2px 0;
                    box-sizing: border-box;
                    border: none;
                    height: 30px;
                    border-bottom: 2px solid #DDDDDD;
                    font-size: 15px;
                }


                {/* SELECT BOX with Image */}
                div.mm-dropdown {
                    border: 1px solid #ddd;
                    width: 100%;
                    border-radius: 3px;
                }

                div.mm-dropdown ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    position: absolute;
                    background: white;
                    width: 100%;
                    z-index: 999999;
                    margin-left: -1px;
                }


                div.mm-dropdown ul li,
                div.mm-dropdown div.textfirst {
                    padding: 0;
                    color: #333;
                    padding: 5px 15px;
                }

                div.mm-dropdown ul li.input-option, div.mm-dropdown div.textfirst {
                    display: flex;
                    align-items: center;
                }

                div.mm-dropdown ul li.input-option {
                    border: 1px solid #ddd !important;
                }

                div.mm-dropdown div.textfirst {
                    border: 0 !important;
                    padding-top: 8px;
                    padding-bottom: 8px;
                }

                div.mm-dropdown div.textfirst span {
                    width: 100% !important;
                }

                div.mm-dropdown div.textfirst img {
                    margin-right: 10px;
                }

                div.mm-dropdown div.textfirst img.down {
                    float: right;
                }

                div.mm-dropdown ul li:last-child {
                    border-bottom: 0;
                }

                div.mm-dropdown ul li {
                    display: none;
                    padding-left: 15px;
                }

                div.mm-dropdown ul li.main {
                    display: block;
                }

                div.mm-dropdown ul li img {
                    width: 20px;
                    height: 20px;
                    margin-right: 10px;
                }

                .checkbox_div, .radio_div {
                    height: 18px;
                    width: 18px;
                    border: 2px solid #E5E5E5; 
                }

                .checkbox_div {
                    border-radius: 6px;
                }

                .radio_div {
                    border-radius: 50%;
                }

            `}</style>


        </div>
    );
};

export default StoreItemAdd;