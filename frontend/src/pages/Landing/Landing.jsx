import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

export default function Landing() {

    let navg = useNavigate();
    // return (
    //     <div className='text-center mt-5'>
    //         <h6>Leetcode Monitor</h6>
    //         <button className='me-5' onClick={() => {
    //             navg("/login");
    //         }}>Login</button>
    //         <button onClick={() => {
    //             {
    //                 navg("/signup");
    //             }
    //         }}>Register</button>
    //     </div>
    // )

    return <Navigate to="/dashboard" replace />;
}
