import axios from 'axios';
import React, { useContext, useEffect, useRef } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import "./styles.css";
import { ToastContainer, toast } from 'react-toastify';


export default function Signup() {

    //username input
    let usernameInput = useRef();
    //password input
    let passwordInput = useRef();
    //re-password input
    let repasswordInput = useRef();
    //email input
    let emailInput = useRef();
    //nav
    let navigator = useNavigate();

    //onload
    useEffect(() => {
        document.title = `${import.meta.env.VITE_APP_TITLE}: Signup`;
    }, []);

    //signup call
    function signupCall(event) {
        //prevent form submit
        event.preventDefault();
        //lock form
        event.target.querySelectorAll("input, button").forEach(el => el.disabled = true);

        //validate repassword
        if (passwordInput.current.value !== repasswordInput.current.value) {
            toast.error("The passwords you entered do not match.", {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
                draggable: true,
                theme: "colored"
            });
            //unlock form
            setTimeout(() => { event.target.querySelectorAll("input, button").forEach(el => el.disabled = false) }, 1000);
            return;
        }
        axios
            .post(
                `${import.meta.env.VITE_API_URL}`,
                {
                    service: "userCreate",
                    username: usernameInput.current.value,
                    email: emailInput.current.value,
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
                    //successfully
                    //redirect to login
                    navigator("/login", { state: { justSignUp: true } });
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
                            <i className="fa-solid fa-terminal"></i>Signup
                        </div>

                        <div className="section-body">
                            <form action="#" onSubmit={signupCall} className="fs-6">
                                <div className="mb-3">
                                    <label htmlFor="username">Username</label>
                                    <input ref={usernameInput} className="form-control mb-3" type="text" name="username" id="username" placeholder="Enter your username" spellCheck="false" autoComplete="off" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email">Email</label>
                                    <input ref={emailInput} className="form-control mb-3" type="text" name="email" id="email" placeholder="Enter your email" spellCheck="false" autoComplete="off" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password">Password</label>
                                    <input ref={passwordInput} className="form-control mb-3" type="password" name="password" id="password" placeholder="Enter your password" spellCheck="false" autoComplete="off" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="repassword">Re-Password</label>
                                    <input ref={repasswordInput} className="form-control mb-3" type="password" name="repassword" id="repassword" placeholder="Re-Enter your password" spellCheck="false" autoComplete="off" required />
                                </div>
                                <div className="mb-3 text-end">
                                    <button className='btn btn-primary'>Signup</button>
                                </div>
                            </form>

                            <div className="mt-5 text-center small">
                                Already have an account? <Link to="/login">Signin</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}
