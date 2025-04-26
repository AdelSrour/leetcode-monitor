import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import ViewCard from "../../components/ViewCard/ViewCard";
import "./styles.css";
import axios from "axios";
import { toast } from 'react-toastify';

export default function Dashboard() {
  //viewid
  const { viewID } = useParams();

  //Update session info
  const { sessionRefresh } = useOutletContext();

  //onload
  useEffect(() => {
    document.title = `${import.meta.env.VITE_APP_TITLE}: Dashboard`;
    displayView();
  }, [viewID]);

  //state for API callback
  let [users, setUsers] = useState(null);
  let [currentState, setCurrentState] = useState("loading");

  //Sorting by days (select input)
  const daysSort = useRef("");

  //Nav
  let navigator = useNavigate();

  //Fetch monitor data
  function displayView(event) {
    //prevent form submit
    event?.preventDefault();
    //set status as loading
    setCurrentState("loading");

    //send request
    axios
      .post(
        `${import.meta.env.VITE_API_URL}`,
        {
          service: "viewDisplay",
          viewID: viewID,
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
          setTimeout(() => { setCurrentState("code"); }, 500);
        } else {
          //Lets print data
          setCurrentState("loaded");
          let response_data = response.data.message;
          updateOnTrackStatus(response_data.data, 3);
        }
      })
      .catch((error) => {
        //network error
        toast.error(error.message, {
          position: "top-right",
          autoClose: 5000,
          closeOnClick: true,
          draggable: true,
          theme: "colored"
        });
      });
  }

  //Remove monitor
  function deleteView() {
    if (!confirm("Are you sure you want to delete this monitor? there is no going back!")) {
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL}`,
        {
          service: "viewDelete",
          viewID: viewID,
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
          //successfully
          sessionRefresh();
          navigator("/dashboard")
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

  //sorting
  //Sorting functions
  function updateOnTrackStatus(data, lastNDays) {
    //hard copy users data
    let newData = JSON.parse(JSON.stringify(data));

    //update ontrack based on their missing days
    newData.forEach(user => {
      const recentDays = [];
      const months = [...user.activedays].reverse();

      let daysNeeded = lastNDays;
      let skipToday = true;

      for (const month of months) {
        const totalDays = parseInt(month.monthDays);
        const activeSet = new Set(month.activeDays);

        let startDay = totalDays;
        if (skipToday) {
          startDay = totalDays - 1;
          skipToday = false;
        }

        for (let day = startDay; day > 0 && daysNeeded > 0; day--) {
          recentDays.push({ day, activeSet });
          daysNeeded--;
        }

        if (daysNeeded === 0) break;
      }

      const missedAny = recentDays.some(({ day, activeSet }) => !activeSet.has(day));

      user.ontrack = !missedAny;
    });

    //Update users list and state
    setUsers(newData);
  }

  //Export
  function exportCSV(users) {
    const offtrackUsers = users.filter(user => !user.ontrack);
    const ontrackUsers = users.filter(user => user.ontrack);

    // csv content
    const csvRows = [];

    // bad users
    csvRows.push(' Status ,  Name , Leetcode Profile');
    offtrackUsers.forEach(user => {
      console.log(user);

      csvRows.push(`OFF-TRACK,${user.usertitle},${user.username}`);
    });

    // ontrack 
    csvRows.push(',');
    csvRows.push(',');
    csvRows.push(' Status ,  Name , Leetcode Profile');
    ontrackUsers.forEach(user => {
      csvRows.push(`ON-TRACK,${user.usertitle},${user.username}`);
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'leetcode_export.csv';

    link.click();
  }



  return (
    <>
      {/* container */}
      <div className="dashboard-card">
        {currentState === "loading" ?
          <>
            <div className="content-placeholder mb-3 w-25">
              <div className="content-placeholder-loader"></div>
            </div>
            <div className="row g-4">
              <div className="col-12 col-xl-6">
                <div className="content-placeholder">
                  <div className="content-placeholder-loader p-5"></div>
                </div>
              </div>
              <div className="col-12 col-xl-6">
                <div className="content-placeholder">
                  <div className="content-placeholder-loader p-5"></div>
                </div>
              </div>
            </div>

            <div className="content-placeholder mt-5 mb-3 w-25">
              <div className="content-placeholder-loader"></div>
            </div>
            <div className="row g-4">
              <div className="col-12 col-xl-6">
                <div className="content-placeholder">
                  <div className="content-placeholder-loader p-5"></div>
                </div>
              </div>
              <div className="col-12 col-xl-6">
                <div className="content-placeholder">
                  <div className="content-placeholder-loader p-5"></div>
                </div>
              </div>
            </div>
          </>
          :
          ""}

        {currentState === "loaded" ?
          <>

            {/* userViews OutofTrack */}
            <div className="track mb-2 mb-lg-0">
              <div className="text-danger track-title mb-2">
                <i className="fa-solid fa-triangle-exclamation"></i> Out of track Users
              </div>
              <div className="ontrack-actions text-end">
                <span onClick={() => {
                  exportCSV(users);
                }} className="pointer"><i className="fa-solid fa-download text-success"></i> Export</span>
                <span><i className="fa-solid fa-sort text-primary ms-3"></i> Based on the last
                  <select ref={daysSort} name="byDays" id="byDays" className="mx-2" defaultValue={"3"} onChange={(e) => { updateOnTrackStatus(users, e.target.value); }}>
                    <option value="30">30</option>
                    <option value="14">14</option>
                    <option value="7">7</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                  </select>
                  Days
                </span>
                <span onClick={() => {
                  deleteView();
                }} className="ms-3 pointer"><i className="fa-solid fa-trash text-danger"></i> Delete</span>

              </div>
            </div>

            <div className="row g-4 mb-5">
              {users.map((user, index) => {
                if (user.ontrack == false) {
                  let uDisplay = (user.display && user.display == "none") ? "d-none" : "col-12 col-xl-6";
                  return <div key={index} className={uDisplay}>
                    <div className="userView shadow-sm">
                      <ViewCard
                        userData={user}
                      />
                    </div>
                  </div>
                }
              })}
            </div>
            {/* end of userViews */}


            {/* userViews ontrack */}
            <div className="text-success mb-2 track-title">
              <i className="fa-solid fa-check"></i> On Track Users
            </div>
            <div className="row g-4 mb-5">
              {users.map((user, index) => {
                if (user.ontrack == true) {
                  let uDisplay = (user.display && user.display == "none") ? "d-none" : "col-12 col-xl-6";
                  return <div key={index} className={uDisplay}>
                    <div className="userView shadow-sm">
                      <ViewCard
                        userData={user}
                      />
                    </div>
                  </div>
                }
              })}
            </div>
            {/* end of userViews */}

          </>
          : ""}
      </div >
      {/* end of container */}
    </>
  );
}
