import React, { useEffect, useState } from "react";
import "./AssignRoutes.css";
import axios from "axios";
import RouteInfo from "../components/RouteInfo";

function AssignRoutes({ afterLoginEmail }) {
  const [status, setStatus] = useState("Pending");
  const [routes, setRoutes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [singleRouteData, setSingleRouteData] = useState(null);
  const [viewRouteModalOpen, setViewRouteModalOpen] = useState(false);
  const [startJourney, setStartJourney] = useState(false);
  const openviewRouteModal = (route) => {
    setSingleRouteData(route);
    setViewRouteModalOpen(true);
  };
  const handleJourneyButton = (route) => {
    setStartJourney(true);
    setSingleRouteData(route);
    setViewRouteModalOpen(true);
    console.log(startJourney);
  };

  const getDriversData = async () => {
    try {
      const response = await axios.get(
        "https://routed-backend.wckd.pk/api/v0/drivers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const foundDriver = response.data?.data?.drivers.find(
        (driver) => driver.email === afterLoginEmail
      );

      setCurrentUser(foundDriver);
      console.log("Current User:", foundDriver);
    } catch (error) {
      console.error(
        "Failed to fetch drivers:",
        error.response?.data || error.message
      );
      alert(
        "Driver not found: " + (error.response?.data?.error || error.message)
      );
    }
  };

  const getRoutesAgainstDriver = async () => {
    try {
      const response = await axios.get(
        "https://routed-backend.wckd.pk/api/v0/assignments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const allAssignments = response.data?.data?.assignments || [];

      const currentUserRoutes = allAssignments.filter(
        (assignment) => assignment.driver.id === currentUser.id
      );
      setLoading(false);

      console.log("Current User Routes:", currentUserRoutes);
      setRoutes(currentUserRoutes);
    } catch (error) {
      console.error("Failed to fetch routes:", error.message);
    }
  };

  useEffect(() => {
    if (afterLoginEmail) {
      getDriversData();
    }
  }, [afterLoginEmail]);

  useEffect(() => {
    if (currentUser) {
      getRoutesAgainstDriver();
    }
  }, [currentUser]);

  return (
<div className="container mt-4">
  {loading && (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
      style={{ zIndex: 1055 }}
    >
      <div className="text-center">
        <div
          className="spinner-border"
          style={{ width: "3rem", height: "3rem", color: "#1282a2" }}
          role="status"
        ></div>
        <p className="fw-semibold mt-3" style={{ color: "#fefcfb" }}>
          Fetching your routes...
        </p>
      </div>
    </div>
  )}

     <h2 className="text-center"><span className="p-2 rounded text-white" style={{backgroundColor : "#034078"}}><i className="fa-solid fa-route me-2"></i>Assigned Routes</span></h2>

  {routes.length === 0 ? (
    <div className="text-center py-5" style={{ color: "#034078" }}>
      <i className="fa-solid fa-circle-info fa-2x mb-3"></i>
      <p className="mb-0">No assigned routes found.</p>
    </div>
  ) : (
    routes.map((route, index) => (
  <>
     
      <div
        key={index}
        className="card shadow-lg border-0 mb-4 rounded-3 mt-4"
        style={{
          borderLeft: "6px solid #001f54",
          backgroundColor: "#fefcfb",
        }}
      >
        <div className="card-body">
          {/* Title + Status */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5
              className="card-title mb-0 fw-bold text-truncate"
              style={{
                maxWidth: "calc(100% - 120px)",
                color: "#0a1128",
              }}
            >
              <i className="fa-solid fa-route me-2" style={{ color: "#034078" }}></i>
              {route.route.name}
            </h5>
            <span
              className="badge px-3 py-2 shadow-sm"
              style={{ backgroundColor: "#1282a2", color: "#fefcfb" }}
            >
              {status}
            </span>
          </div>

          {/* Distance */}
          <p className="mb-3" style={{ color: "#001f54" }}>
            <i className="fas fa-road me-2" style={{ color: "#034078" }}></i>
            <strong>Distance:</strong> {route.route.totalDistance} km
          </p>

          {/* Buttons */}
          <div className="d-grid gap-2">
            <button
              className="btn fw-semibold shadow-sm"
              style={{
                backgroundColor: "#034078",
                color: "#fefcfb",
                border: "none",
              }}
              onClick={() => openviewRouteModal(route.route)}
            >
              <i className="fa-solid fa-map-location-dot me-2"></i>
              See on Map
            </button>
            <button
              className="btn fw-semibold shadow-sm"
              style={{
                backgroundColor: status === "In Progress" ? "#ccc" : "#1282a2",
                color: "#fefcfb",
                border: "none",
              }}
              onClick={() => handleJourneyButton(route.route)}
              disabled={status === "In Progress"}
            >
              <i className="fas fa-flag-checkered me-2"></i>
              Start Journey
            </button>
          </div>
        </div>
      </div>
  </>
    ))
  )}

  {viewRouteModalOpen && singleRouteData && (
    <RouteInfo
      viewRouteModalOpen={viewRouteModalOpen}
      singleRouteData={singleRouteData}
      setViewRouteModalOpen={setViewRouteModalOpen}
      startJourney={startJourney}
      setStartJourney={setStartJourney}
    />
  )}
</div>


  );
}

export default AssignRoutes;
