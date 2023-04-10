import LoginScreen from "./screens/LoginScreen";
import Dashboard from "./screens/Dashboard";
import DashboardIncomplete from "./screens/Dashboard-incomplete";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import CryptoJS from "crypto-js";

import { Route, Routes } from "react-router-dom";
import EmailValidation from "./components/EmailValidation";

const App = () => {

  let isLogin = true;
  let navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoadProfile, setIsLoadProfile] = useState(false);
  const [profile, setProfile] = useState([]);
  const [isRefresh, setIsRefresh] = useState(0);



  if (window.window.localStorage.getItem("UserToken") === null || window.window.localStorage.getItem("UserToken") === undefined
    || window.window.localStorage.getItem("UserToken") === "") {
    isLogin = false;
  }

  useEffect(() => {

    if (!document.URL.includes("/user/verification/email")) {
      if (isLogin === true) {
        if (!document.URL.includes("/dashboard/") && !document.URL.includes("/dashboard/logout")) {
          navigate("/dashboard/home");
        }
      }
      else {
        if (document.URL.includes("/dashboard/")) {
          navigate("/");
        }
      }
    }

    return;
  }, [isLogin, navigate]);


  useEffect(() => {
    if (isLogin === true) {
      try {
        const decryptData = JSON.parse(CryptoJS.AES.decrypt(window.localStorage.getItem("UserToken"), process.env.REACT_APP_SECURITY_SALT).toString(CryptoJS.enc.Utf8));
        fetch(process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_PREFIX_PRIVATE + "user/profile", {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + decryptData.token
          })
        })
          .then(res => res.json())
          .then((result) => {
            let responseData = JSON.stringify(result);
            responseData = JSON.parse(responseData);

            if (responseData["code"] === 200) {
              setIsRefresh((prevCounter) => {
                return prevCounter + 1;
              });
              if (responseData['data']['kyc_status'] === 1 && responseData['data']['kyb_status'] === 1) {
                setIsVerified(true);
              }

              setProfile(responseData["data"]["profile"]);
            }

            setIsLoadProfile(true);
          }
          );
      }
      catch (ex) {
        console.log(ex);
      }
    }
  }, [isLogin]);


  if (document.URL.includes("/user/verification/email")) {
    return (
      <Routes>
        <Route path="/user/verification/email" element={<EmailValidation />} />
      </Routes>
    );
  }

  if (isLogin === false) {
    return (<LoginScreen />);
  }

  if (isLoadProfile === false) {
    return;
  }

  if (isVerified === true) {
    return (<Dashboard userProfileData={profile} />);
  }

  return (
    <DashboardIncomplete userProfileData={profile} />
  );

};

export default App;