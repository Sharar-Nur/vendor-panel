import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
const CryptoJS = require("crypto-js");

var Logout = () => {

    let navigate = useNavigate();
    const { state } = useLocation();


    useEffect(() => {
        let msg = "";
        if (state !== undefined && state?.success !== "") {
            msg = state?.success;
        }

        try {
            var decryptData = JSON.parse(CryptoJS.AES.decrypt(window.localStorage.getItem("UserToken"), process.env.REACT_APP_SECURITY_SALT).toString(CryptoJS.enc.Utf8));
            fetch(process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_PREFIX + "logout", {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/x-www-form-urlencoded",
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + decryptData.token
                }),

                body: ""
            });
        }
        catch (e) {
            console.log(e);
        }
        finally {
            window.localStorage.clear();
            navigate("/", {
                state: {
                    success: msg
                }
            });
        }

    }, []);


    return (
        <>Logout....</>
    );
}


export default Logout;