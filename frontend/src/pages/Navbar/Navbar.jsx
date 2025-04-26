import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import "./styles.css";

export default function Navbar({ userViews, sessionRefresh }) {

    //session destroy
    function logout() {
        axios
            .post(
                `${import.meta.env.VITE_API_URL}`,
                {
                    service: "userLogout",
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
                    toast.error(response.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        closeOnClick: true,
                        draggable: true,
                        theme: "colored"
                    });
                } else {
                    //remove sessionID from localstorage
                    localStorage.removeItem("sessionID");
                    //refresh sessions
                    sessionRefresh();
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


            <div className='sidebar'>
                <div className="nav-title">
                    <div className='titleText'>
                        <i className="fa-solid fa-terminal"></i>Leetcode Monitor
                    </div>
                </div>

                <div className="nav-menu">
                    <ul className="nav-links">
                        <li key={2}>
                            <NavLink className="nav-link" to="/dashboard">
                                <div className='nav-link-icon'>
                                    <i className="fa-solid fa-house"></i>
                                </div>
                                <div className='w-75 nav-link-text'>
                                    Dashboard
                                </div>
                            </NavLink>
                        </li>

                        <li key={3}>
                            <div className="nav-link pointer" onClick={() => { logout(); }}>
                                <div className='nav-link-icon'>
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                </div>
                                <div className='w-75 nav-link-text'>
                                    Logout
                                </div>
                            </div>
                        </li>

                        <div className='navbreak'></div>

                        {userViews.map((view) => {
                            return (
                                <>
                                    <li key={view.viewID}>
                                        <NavLink className="nav-link" to={"/w/" + view.viewID}>
                                            <div className='nav-link-icon'>
                                                <i className="fa-solid fa-terminal"></i>
                                            </div>
                                            <div className='w-75 nav-link-text'>
                                                {view.viewName}
                                            </div>
                                        </NavLink>
                                    </li>
                                </>)
                        })
                        }
                    </ul>
                </div>
            </div>
        </>
    )
}
