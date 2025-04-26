import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import "./styles.css";
import { toast } from 'react-toastify';

export default function Home() {

  //update session info
  const { sessionRefresh } = useOutletContext();
  //nav
  const navigator = useNavigate();
  //loc
  const location = useLocation();


  //onload
  useEffect(() => {
    document.title = `${import.meta.env.VITE_APP_TITLE}: Home`;

    if (location.state?.justLoggedIn) {

      setTimeout(() => {
        toast.success("Logged in successfully! Welcome back!", {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          draggable: true,
          theme: "colored"
        });
      }, 200);

      navigator(location.pathname, { replace: true, state: {} });
    }

  }, []);

  //app props
  let viewName = useRef(null);
  let usersList = useRef(null);

  function extract_users(users) {
    return users.replace(/(\r\n|\n|\r)/g, '{:}');
  }

  //API Call
  function createView(event) {
    //prevent form submit
    event.preventDefault();
    //Lock all form elements until request is over
    event.target.querySelectorAll("input, button").forEach(el => el.disabled = true);

    //create new view
    axios
      .post(
        `${import.meta.env.VITE_API_URL}`,
        {
          service: "viewCreate",
          viewName: viewName.current.value,
          sessionID: localStorage.getItem("sessionID"),
          usersList: extract_users(usersList.current.value),
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
          //get newview ID
          let response_data = response.data.message;
          //Refresh view list
          sessionRefresh();
          //nav to view ID
          navigator("/w/" + response_data)
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
              <i className="fa-solid fa-terminal"></i>New monitor
            </div>

            <div className="section-body">
              <form action="#" onSubmit={createView} className="fs-6">
                <div className="mb-3">
                  <label htmlFor="viewName">Monitor name</label>
                  <input ref={viewName} className="form-control mb-3" type="text" name="viewName" id="viewName" placeholder="enter unique name for your dashboard" spellCheck="false" autoComplete="off" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="usersList" className="mt-2">Accounts list</label>
                  <textarea ref={usersList} className="form-control" id="usersList" rows="10" placeholder="Follow one of these Formats:-
https://leetcode.com/u/example1
https://leetcode.com/u/example2,CUSTOM NAME
username
username,custom name
...
One account per line" autoComplete="off" spellCheck="false" required></textarea>
                </div>
                <div className="mt-4 text-end">
                  <input type="file" onChange={(event) => {
                    const file = event.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();

                    reader.onload = function (e) {
                      let text = e.target.result;
                      document.getElementById('usersList').value = text;
                      event.target.value = '';
                    };

                    reader.readAsText(file);
                  }} className="d-none" id="csvFile" accept=".csv" />
                  <button type="submit" className="btn btn-success"><i className="fa-solid fa-plus"></i> Create</button>
                  <button type="button" className="btn btn-primary ms-2" onClick={() => { document.getElementById("csvFile").click(); }}><i className="fa-solid fa-file-import"></i> Import from CSV</button>
                </div>

              </form>
            </div>
          </div>
        </div >
      </div >
    </>
  );
}
