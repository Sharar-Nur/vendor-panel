import React from 'react';
import { useEffect, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import $ from "jquery";

// QR Code
const QRCode = React.lazy(()=>{return import("qrcode.react")});


var toggleTable = () => {
    $(".toggle-table").toggleClass("upside-down");
    $("#details-table").toggleClass("hidden");
    $("a#edit-store-link").toggleClass("hidden");
}


const OfflineDetailsTable = (props) => {

    const navigate = useNavigate();

    useEffect(()=>{
        if(props.data === undefined) {
            return navigate("/dashboard/counter");
        }
    },[props, navigate]);


    const downloadQR = (name="payment-qr") => {
        const canvas = document.getElementById("qr-code");
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = name+".png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    
    return (
        <Suspense fallback="Loading...">
            <div id="store-head" className="flow-root w-full py-3 bg-white px-1 rounded-md" style={{boxShadow:"0px 4px 10px rgb(0 0 0 / 5%)", border: "1px solid rgb(243 243 243)"}}>
                <p className="float-left text-xl px-4 font-medium pb-0 pl-4">{(props.data.type !== "") && (props.data.type + " ")}Counter Details</p>
                
                <svg onClick={toggleTable} className="toggle-table float-right cursor-pointer upside-down mt-1" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 15L12 9L6 15" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            <table id="details-table" className="custom-details-table w-full mt-0 mb-2">
                <tbody>
                    <tr>
                        <td className="font-semibold text-base">Counter Name</td>
                        <td className="px-5 text-base">{props.data.counter_name}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold text-base">Counter ID</td>
                        <td className="px-5 text-base">{props.data.store_id}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold text-base">Category</td>
                        <td className="px-5 text-base">{props.data.store_category?.text}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold text-base">Phone Number</td>
                        <td className="px-5 text-base">{props.data.mobile_no}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold text-base">Location</td>
                        <td className="px-5 text-base">{props.data.address}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold text-base">
                            QR Code
                            
                            {props.data.qr !== undefined &&
                                <button onClick={()=>downloadQR(props.data.counter_name.toString().replace(" ","-"))} className='mt-3 mb-2 bg-black text-sm text-white hover:bg-white font-medium hover:text-black py-1 px-2 border border-black hover:border-black-500 rounded'>
                                    Download QR
                                </button>
                            }
                        </td>
                        <td className="px-5 py-3 text-base">
                            <Suspense fallback="loading...">
                                {props.data.qr !== undefined && <QRCode id="qr-code" value={props.data.qr} size={150} renderAs="canvas" />}
                            </Suspense>
                        </td>
                    </tr>
                    
                </tbody>
            </table>

            
            <Link to={"/dashboard/counter/offline/edit"} state={{data: props.data}} id="edit-store-link" className='text-[#0774E9] text-base font-medium flex py-1 items-center'>
                Edit Counter Details
                &nbsp;&nbsp;
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.0007 6.21301C10.8238 6.21301 10.6543 6.28325 10.5292 6.40827C10.4042 6.53329 10.334 6.70286 10.334 6.87967V11.6663C10.334 11.8432 10.2637 12.0127 10.1387 12.1377C10.0137 12.2628 9.84413 12.333 9.66732 12.333H2.33398C2.15717 12.333 1.9876 12.2628 1.86258 12.1377C1.73756 12.0127 1.66732 11.8432 1.66732 11.6663V4.33301C1.66732 4.1562 1.73756 3.98663 1.86258 3.8616C1.9876 3.73658 2.15717 3.66634 2.33398 3.66634H7.12065C7.29746 3.66634 7.46703 3.5961 7.59206 3.47108C7.71708 3.34605 7.78732 3.17649 7.78732 2.99967C7.78732 2.82286 7.71708 2.65329 7.59206 2.52827C7.46703 2.40325 7.29746 2.33301 7.12065 2.33301H2.33398C1.80355 2.33301 1.29484 2.54372 0.919771 2.91879C0.544698 3.29387 0.333984 3.80257 0.333984 4.33301V11.6663C0.333984 12.1968 0.544698 12.7055 0.919771 13.0806C1.29484 13.4556 1.80355 13.6663 2.33398 13.6663H9.66732C10.1978 13.6663 10.7065 13.4556 11.0815 13.0806C11.4566 12.7055 11.6673 12.1968 11.6673 11.6663V6.87967C11.6673 6.70286 11.5971 6.53329 11.4721 6.40827C11.347 6.28325 11.1775 6.21301 11.0007 6.21301ZM13.614 0.746341C13.5463 0.583442 13.4169 0.453991 13.254 0.386341C13.1738 0.35218 13.0878 0.334061 13.0007 0.333008H9.00065C8.82384 0.333008 8.65427 0.403246 8.52925 0.52827C8.40422 0.653294 8.33398 0.822863 8.33398 0.999674C8.33398 1.17649 8.40422 1.34605 8.52925 1.47108C8.65427 1.5961 8.82384 1.66634 9.00065 1.66634H11.394L4.52732 8.52634C4.46483 8.58832 4.41524 8.66205 4.38139 8.74329C4.34754 8.82453 4.33012 8.91167 4.33012 8.99967C4.33012 9.08768 4.34754 9.17482 4.38139 9.25606C4.41524 9.3373 4.46483 9.41103 4.52732 9.47301C4.58929 9.53549 4.66303 9.58509 4.74427 9.61894C4.82551 9.65278 4.91264 9.67021 5.00065 9.67021C5.08866 9.67021 5.1758 9.65278 5.25704 9.61894C5.33828 9.58509 5.41201 9.53549 5.47398 9.47301L12.334 2.60634V4.99967C12.334 5.17649 12.4042 5.34605 12.5292 5.47108C12.6543 5.5961 12.8238 5.66634 13.0007 5.66634C13.1775 5.66634 13.347 5.5961 13.4721 5.47108C13.5971 5.34605 13.6673 5.17649 13.6673 4.99967V0.999674C13.6663 0.912556 13.6481 0.826489 13.614 0.746341Z" fill="#0774E9"/>
                </svg>
            </Link>

        </Suspense>
    )
}


export default OfflineDetailsTable;