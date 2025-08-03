import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./driverSidebar.css";
function DriverSidebar() {
  const navigate = useNavigate();

  const [active, setActive] = useState("home");
  const handleClick = (key, action) => {
    setActive(key);
    action();
    // perform the navigation or function
  };

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <>
      <div
        className="card fixed-bottom shadow"
        style={{
          borderRadius: "15px",
          background: "#1e1e2f",
          marginBottom: "10px",
          marginLeft: "10px",
          width: "calc(100% - 20px)",
          borderColor: "#ffc107",
       
        }}
      >
        <div className="card-body d-flex justify-content-around p-2 ">
          <span
            className={`text-center flex-fill ${
              active === "home" ? "text-warning zoom" : "text-light"
            }`}
            onClick={() => handleClick("home", () => navigate("/driver/dashboard"))}
          >
            <i className="fas fa-home  d-block mb-0 mt-2"></i>
            <small>Home</small>
          </span>
          <span
            className={`text-center flex-fill ${
              active === "route" ? "text-warning zoom" : "text-light"
            }`}
            onClick={() =>
              handleClick("route", () => navigate("/driver/assignRoutes"))
            }
          >
            <i className="fa-solid fa-route d-block mb-0 mt-2"></i>
            <small>My Routes</small>
          </span>

          <span
            className={`text-center flex-fill ${
              active === "customer" ? "text-warning zoom" : "text-light"
            }`}
            onClick={() =>
              handleClick("customer", () => alert("Customer List"))
            }
          >
            <i className="fas fa-bell d-block mb-0 mt-2"></i>
            <small>Notifications</small>
          </span>

          <span
            className={`text-center flex-fill ${
              active === "profile" ? "text-warning zoom" : "text-light"
            }`}
            onClick={() => handleClick("profile", () => alert("Profile"))}
          >
            <i className="fas fa-user  d-block mb-0 mt-2"></i>
            <small>Profile</small>
          </span>

          <span
            className={`text-center flex-fill ${
              active === "order" ? "text-warning zoom" : "text-light"
            }`}
            onClick={() => handleClick("order", () => logOut())}
          >
            <i className="fa-solid fa-right-from-bracket  d-block mb-0 mt-2"></i>
            <small>Log Out</small>
          </span>
        </div>
      </div>

      <div className="flex-grow-1 p-3" style={{ paddingBottom: "80px" }}>
        <Outlet />
      </div>
      <div style={{ height: "60px" }}></div>
    </>
  );
}

export default DriverSidebar;
