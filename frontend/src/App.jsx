import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./pages/Navbar/Navbar";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

export default function App() {

  //user state
  let [userData, setUserData] = useState();

  //views state
  let [userViews, setUserViews] = useState();

  //nav
  const navigator = useNavigate();

  //sidebar element
  let sidebar = useRef();

  //main site container
  let mainHolder = useRef();

  //onload check user session
  useEffect(() => {
    sessionRefresh();
  }, []);

  //load user session
  function sessionRefresh() {
    //session doesn't exist in localstorage
    let ls_storage = localStorage.getItem("sessionID");
    if (ls_storage == undefined) {
      //nav to login
      navigator("/login");
      return;
    }

    //call
    axios
      .post(
        `${import.meta.env.VITE_API_URL}`,
        {
          service: "userData",
          sessionID: localStorage.getItem("sessionID"),
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        //Read API response status
        let response_status = response.data.success;
        if (response_status === false) {
          //Unsuccessfull
          //go to login
          navigator("/login");
        } else {
          //user session loaded
          let userData = response.data.message;
          userData = JSON.parse(userData);
          let userViews = JSON.parse(userData.views);
          setUserViews(userViews);
          setUserData(userData);
        }
      })
      .catch((error) => {
        toast.error(error.message, {
          position: "top-right",
          autoClose: 5000,
          closeOnClick: true,
          draggable: true,
          theme: "colored"
        });
      });
  }


  return (
    <>
      {userData ?
        <>
          <div className="main-holder" ref={mainHolder}>
            <div className="side-bar" ref={sidebar}>
              <div className="side-bar-content">
                <Navbar userData={userData} userViews={userViews} sessionRefresh={sessionRefresh} />
              </div>
            </div>
            <div className="main-body">
              <div className="main-body-content">
                <div className="w-100">
                  <div className="m-4 text-end text-xl-start">
                    <i className="fa-solid fa-bars-staggered pointer" onClick={() => {
                      mainHolder.current.classList.toggle('main-holder-forced')
                      sidebar.current.classList.toggle('side-bar-forced');
                    }}></i>
                  </div>
                  <Outlet context={{ userData, userViews, sessionRefresh }} />
                </div>
              </div>
            </div>
          </div>
        </>
        :
        ""
      }
      <ToastContainer />
    </>
  );
}
