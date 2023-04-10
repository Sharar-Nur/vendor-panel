import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';

import $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.min.css';



var App = () => {
    
    useEffect(() => {
        $( "#singleDatePicker" ).datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true
        });
    });

    const changeData = (isNext) => {
        
        let pickDate = $("#singleDatePicker").val();
        if(pickDate === "") {
            return;
        }

        var currentDate = new Date(pickDate);
        
        if(isNext===1) {
            const result = new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() + 1));
            $("#singleDatePicker").val(result.toISOString().substring(0,10));
        }

        if(isNext===0) {
            const result = new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - 1));
            $("#singleDatePicker").val(result.toISOString().substring(0,10));
        }
    }


    return (
        <>
            <div className='flex bg-[#F5F5F5] w-full hidden' id="date-div">
                
                <Link to="#" onClick={()=>changeData(0)}>
                    <svg className='h-[42px] rounded-l' viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect className='h-full' fill="#F5F5F5"/>
                        <path d="M30 33L24 27L30 21" stroke="#999999" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Link>
                
                <input type="text" autoComplete='off' id="singleDatePicker" placeholder="Choose Date" name="from" className='float-left text-center border-none bg-[#F5F5F5]' style={{borderLeft:"1px dotted #DDDDDD", borderRight: "1px dotted #DDDDDD", width: "100%"}}/>
                
                <Link to="#" onClick={()=>changeData(1)}>
                    <svg className='h-[42px] rounded-r' viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect className='h-full' fill="#F5F5F5"/>
                        <path d="M24 33L30 27L24 21" stroke="#999999" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </div>

            <style jsx="true">{`
            .ui-datepicker .ui-datepicker-prev, .ui-datepicker .ui-datepicker-next {
                height: 3em !important;
            }
            `}</style>
        </>
    );
}

export default App;