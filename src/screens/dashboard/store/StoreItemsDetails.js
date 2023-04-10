import moment from 'moment';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as CloseBtn } from '../../../assets/icons/close.svg';
import MiniketRiceImage from '../../../assets/images/MiniketRice.png';
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';
import PostLoginPostApi from '../../../components/api/PostLoginPostApi';
import BlackButton from '../../../components/BlackButton';
import Button from '../../../components/Button';
import { ReactComponent as PlusIcon } from './../../../assets/icons/u_plus.svg';
import Store from './store';
import { toast } from 'react-toastify';

const StoreItemsDetails = () => {
    const [itemDetails, setItemDetails] = useState();
    let { state } = useLocation();
    const [isLoad, setIsLoad] = useState(false);

    const navigate = useNavigate();

    console.log(state)

    useEffect(() => {
        try {
            PostLoginGetApi(`shop/item/${state.itemId}`).then((responseJSON) => {
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {
                        setItemDetails(responseData["data"]);
                        setIsLoad(true);
                    }
                }

            }).catch((err) => {
                console.log(err);
            });
        }
        catch (ex) {
            console.log(ex);
        }
    }, [])

    const handlePublish = () => {

        // Call Request for publish item

        PostLoginPostApi(`shop/item/publish-request/${state.itemId}`, JSON.stringify({ publish: "active" }), 1, 0, 0).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response['status'] === 1) {
                let responseData = JSON.stringify(response['data']);
                responseData = JSON.parse(responseData);

                if (responseData['code'] === 200) {
                    toast.success("Request to publish item successfully.");
                    return navigate('/dashboard/store')
                }


                toast.error(responseData["messages"].toString());
            }
        }).catch(err => {
            console.log(err);
        })

    }


    return (
        <>
            {(isLoad === true) &&
                <div className='h-full'>
                    <header className="p-4 border-b-2 border-dark-white mb-[60px]">
                        <Link to="/dashboard/store" state={{ from: state }}><CloseBtn className="float-left" /></Link>
                        <p className="text-center text-xl font-medium">Item Details </p>
                    </header>
                    <div className='max-w-3xl m-auto'>
                        <div className='flex items-center text-[#444444] mb-[30px] '>
                            <div className='py-3 px-5'>
                                <img className='w-[412px] mr-[30px] object-contain' src={itemDetails.image} alt="" />
                            </div>
                            <div>
                                <h3 className='text-2xl font-semibold text-[#222222] mb-2.5'>{itemDetails.name}</h3>
                                <p className='mb-2.5'>Groceries</p>
                                <h4 className='font-medium text-xl text-[#222222] mb-10'>BDT {itemDetails.unit_price} </h4>

                                <div className='mb-10'>
                                    <h4 className='text-xl font-semibold mb-[15px]'>Other Details</h4>
                                    {/* <p className='mb-2.5'>Item ID : 8KU70146GY </p> */}
                                    <p className='mb-2.5'>Added on : {moment(itemDetails.created_at).format("DD MMMM, YYYY")}</p>
                                    <p className='mb-2.5'>Barcode Number : {itemDetails.barcode}</p>
                                    {itemDetails.url && <p >Item URL : {itemDetails.barcode}</p>}
                                </div>


                                <h4 className='text-xl font-semibold mb-[15px]'>Stock Details</h4>
                                <p className='mb-2.5'>Current Stock : {itemDetails.stock_quantity}</p>
                                {itemDetails.low_stock_alert > 0 && <p>Low Stock Alert : {itemDetails.low_stock_alert}</p>}
                            </div>
                        </div>
                        <BlackButton name='Add Another Item' icon={<PlusIcon />} onClick={() => navigate('/dashboard/store/add-item')} />
                        {!(itemDetails.is_publish) && <button type='submit' className="w-full text-white bg-[#158560] p-3 mb-4 rounded cursor-pointer hover:bg-brand-dark" onClick={() => handlePublish()}>Request to Publish</button>}

                    </div>
                </div>
            }

        </>

    );
};

export default StoreItemsDetails;