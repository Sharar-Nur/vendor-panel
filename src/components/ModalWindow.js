import React from 'react'
import { Link } from 'react-router-dom';

export default function ModalWindow(props) {

    return (
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">{props.title}</h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    {props.message}
                                </p>

                                <p className="text-sm mt-3 text-gray-500">
                                    Any query? Please email us on <a className='font-semibold' href="mailto:support@deshipay.com">support@deshipay.com</a>, <br/>or call on <a className='font-semibold' href="tel:+8809617343434">+880 961 734 3434</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
