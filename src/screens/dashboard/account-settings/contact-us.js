import React from 'react';
import DeshiLogo from "./../../../assets/images/deshi-logo.png";


export default function ContactUs() {
    return (
        <>
            <h1 className="font-bold text-lg mb-3 px-2">Contact Us</h1>

            <table className="custom-details-table w-full mt-0 mb-2">
                <tbody>
                    <tr>
                        <td className="font-semibold text-base">Company Name</td>
                        <td className="px-5 text-base">
                            <div className='flex items-center content-center'>
                                <img src={DeshiLogo} alt="Deshi Logo" title="Deshi Logo" />
                                {/* <p className='mt-2 ml-2'>Deshi</p> */}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="font-semibold text-base">Phone Number</td>
                        <td className="px-5 text-base">
                            <a href='tel:+8809617343434'>+880 961 734 3434</a>
                        </td>
                    </tr>
                    <tr>
                        <td className="font-semibold text-base">Email Address</td>
                        <td className="px-5 text-base">
                            <a href='mailto:support@deshipay.com'>support@deshipay.com</a>
                        </td>
                    </tr>
                    <tr>
                        <td className="font-semibold text-base">Address</td>
                        <td className="px-5 text-base">
                              <a target="_blank" rel='noreferrer' href='https://goo.gl/maps/hPMDjCMyXK1tVLrY6'>  JCX Business Tower (6th Floor),
                                Plot # 1136/A, Block # I,
                                Japan Street, Bashundhara R/A,
                                Dhaka - 1229, Bangladesh
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}
