import { useEffect } from 'react';
import $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.min.css';
import moment from 'moment';





var App = ({ startDate }) => {

    useEffect(() => {
        $("#fromDate").datepicker({
            defaultDate: "+1w",
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            gotoCurrent: true,
            numberOfMonths: 1,
            onClose: function (selectedDate) {
                $("#toDate").datepicker("option", "minDate", selectedDate);

                if (selectedDate !== "") {
                    $("#toDate").trigger("focus");
                }
            }
        });
        $("#toDate").datepicker({
            defaultDate: "+1w",
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            gotoCurrent: true,
            numberOfMonths: 1,
            onClose: function (selectedDate) {
                $("#fromDate").datepicker("option", "maxDate", selectedDate);
            }
        });
    });

    return (
        <div id='date-range-div'>
            <div className='flex'>
                <input type="text" autoComplete='off' id="fromDate" placeholder="From Date" name="from" className='w-[300px] mr-1 float-left  border-none bg-[#F5F5F5] rounded-l' defaultValue={startDate && moment(startDate, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD") + ""} />

            </div>

            <style jsx="true">{`
            .ui-datepicker .ui-datepicker-prev, .ui-datepicker .ui-datepicker-next {
                height: 3em !important;
            }
            `}</style>
        </div>
    );
}


export default App;