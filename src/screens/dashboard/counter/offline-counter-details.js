import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OfflineDetailsTable from './offline-details-table';



const OfflineStoreDetails = () => {
    
    const navigate = useNavigate();
    const location = useLocation();
    const [info,setInfo] = useState({});


    useEffect(()=>{
        if(location?.state === undefined || location?.state?.info === undefined ) {
            return navigate("/dashboard/counter");
        }

        setInfo(location?.state?.info);

    },[location, navigate]);
    

    return (
        <div className="custom-container w-full float-left px-8 py-10 flex font-montserrat ">
            <div className="block w-full pb-20 custom-scroll-auto">
                <OfflineDetailsTable data={info}></OfflineDetailsTable>
                <br />

                <Link to="/dashboard/counter" state={{tab: "view-offline-store"}}><p className='custom-btn inline-block'>Back to list</p></Link>
            </div>


        </div>
    );
}



export default OfflineStoreDetails;