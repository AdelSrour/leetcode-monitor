import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import "./styles.css";
import { ToastContainer, toast } from 'react-toastify';


export default function Login() {

    //username input
    let usernameInput = useRef();
    //password input
    let passwordInput = useRef();

    let location = useLocation();
    let navigator = useNavigate();

    //onload
    useEffect(() => {
        document.title = `${import.meta.env.VITE_APP_TITLE}: Login`;

        //if user just redirected from signup successfully
        if (location.state?.justSignUp) {

            setTimeout(() => {
                toast.success("Account created!... Please Login!", {
                    position: "top-right",
                    autoClose: 4000,
                    closeOnClick: true,
                    draggable: true,
                    theme: "colored"
                });
            }, 200);

            navigator(location.pathname, { replace: true, state: {} });
        }
    }, []);

    //login
    function loginCall(event) {
        //prevent form submit
        event.preventDefault();
        //lock all form elements
        event.target.querySelectorAll("input, button").forEach(el => el.disabled = true);

        axios
            .post(
                `${import.meta.env.VITE_API_URL}`,
                {
                    service: "userLogin",
                    username: usernameInput.current.value,
                    password: passwordInput.current.value,
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
                    toast.error(response.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        closeOnClick: true,
                        draggable: true,
                        theme: "colored"
                    });
                    //unlock form
                    setTimeout(() => { event.target.querySelectorAll("input, button").forEach(el => el.disabled = false) }, 1000);
                } else {
                    //loggedin successfully
                    //update sessionID
                    localStorage.setItem("sessionID", response.data.message);
                    //nav to dashboard
                    navigator("/dashboard", { state: { justLoggedIn: true } });
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
                //unlock form
                setTimeout(() => { event.target.querySelectorAll("input, button").forEach(el => el.disabled = false) }, 1000);
            });
    }

    return (
        <>
            <div className="container">
                <div className="section">
                    <div className="section-card shadow">
                        <div className="section-title">
                            <i className="fa-solid fa-terminal"></i>Login
                        </div>

                        <div className="section-body">
                            <form action="#" onSubmit={loginCall} className="fs-6">
                                <div className="mb-3">
                                    <label htmlFor="username">Username</label>
                                    <input ref={usernameInput} className="form-control mb-3" type="text" name="username" id="username" placeholder="Enter your username" spellCheck="false" autoComplete="off" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password">Password</label>
                                    <input ref={passwordInput} className="form-control mb-3" type="password" name="password" id="password" placeholder="Enter your password" spellCheck="false" autoComplete="off" required />
                                </div>
                                <div className="mb-3 text-end">
                                    <button className='btn btn-primary'>Login</button>
                                </div>
                            </form>

                            <div className="mt-5 text-center small">
                                New here? <Link to="/signup">Create an account</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}
