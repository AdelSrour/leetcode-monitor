import React, { useEffect } from "react";
import "./styles.css";
import avatar from "../../assets/avatar.png";

export default function ViewCard({ userData }) {

  function openProfile(profileID) {
    window.open("https://leetcode.com/u/" + profileID + "/", '_blank', 'noopener,noreferrer');
  }

  function generateMonths(activedays) {
    return (
      <>
        {activedays.map((month) => {
          let days = [];
          for (let i = 1; i <= month.monthDays; i++) {
            //check if day is active
            let activeClass = "day";
            let currentMonth = month.activeDays;
            if (currentMonth && currentMonth.includes(i)) {
              activeClass = activeClass + " activeDay";
            }

            days.push(
              <div key={i} className={activeClass}>
                {i}
              </div>
            );
          }

          return (
            <div key={month.monthName} className="col-auto">
              <div className="month">
                <div className="monthTitle">{month.monthName}</div>
                <div className="monthsGrid">{days}</div>
                {month.missedDays > 0 ?
                  <div className="missedDays text-danger">
                    <i className="fa-solid fa-xmark"></i> {month.missedDays} days
                  </div>
                  :
                  <div className="missedDays noned text-success">
                    <i className="fa-solid fa-check"></i> onTrack
                  </div>
                }
              </div>
            </div>
          );
        })}
      </>
    );
  }

  return (
    <>
      {/* flex */}
      <div className="row g-0">
        {/* user title */}
        <div className="col-12 col-xl-4">
          <div className="userInfo">
            {/* username display */}
            <div className="userImg">
              {userData.profileimg ? <img src={userData.profileimg} /> : <img src={avatar} />}
            </div>
            {/* Name */}
            <div className="userDisplay">
              {/* userName */}
              <div className="userName">
                <div> <i className="fa-solid fa-user text-secondary"></i> </div>
                <div className="usernameDisplay">{userData.usertitle}</div>
              </div>
              {/* userName */}
              {/* userRanking */}
              <div className="userRanking">
                <div>
                  <i className="fa-solid fa-ranking-star text-warning"></i>
                </div>
                <div>{new Intl.NumberFormat().format(userData.ranking)}</div>
              </div>
              {/* userRanking */}
              {/* userID display */}
              <div className="userID" onClick={() => { openProfile(userData.username) }}>
                <div><i className="fa-solid fa-arrow-up-right-from-square text-primary"></i></div>
                <div>/{userData.username}</div>
              </div>
              {/* end of userID display */}
            </div>
            {/* Name */}
          </div>
        </div>
        {/* end of usertitle */}

        {/* userdata */}
        <div className="col-12 col-xl-8">
          <div className="monthInfo">
            {/* months */}
            <div className="row justify-content-evenly align-items-center align-content-center g-3 w-100">
              {userData.success === true ?
                generateMonths(userData.activedays)
                :
                <>
                  <div className="text-danger">
                    <div>An error occurred while loading this user.</div>
                    <div>{userData.message ? <><b>Server reply</b><br /> {userData.message}</> : ""}</div>
                  </div>
                </>
              }
            </div>
            {/* end of months */}
          </div>
        </div>
        {/* end of user data */}
      </div>
      {/* end of flex */}
    </>
  );
}
