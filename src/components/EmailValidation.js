import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PreLoginGetApi from './api/PreLoginGetApi';


export default function EmailValidation() {

    const navigate = useNavigate();
    const url = new URLSearchParams(window.location.search);
    
    useEffect( () =>{
        if(!url.has("verify")) {
            return navigate("/login");
        }

        const verifyToken = url.get("verify");
        if(verifyToken === "") {
            return navigate("/login");
        }

        PreLoginGetApi("api/signup/verify/email?verify="+verifyToken,0).then((responseJSON)=>{
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if(response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if(responseData?.code === 200) {
                    toast.success("Email address has been verified.");
                    return;
                }


                toast.error(responseData?.messages?.toString());
            }
        }).catch((error) => {
            console.log(error);
        }).finally(()=>{
            return navigate("/login");
        });

    },[]);


    return (
        <div className='p-4'> 
            Please wait, <br/>Your email address is verifying . . .
        </div>
    )
}
