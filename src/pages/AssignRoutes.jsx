import React, { useEffect, useState } from 'react';
import './AssignRoutes.css';
import axios from 'axios';

function AssignRoutes({ afterLoginEmail }) {
  const [status, setStatus] = useState("Pending");
  const [routes, setRoutes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

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
      console.error("Failed to fetch drivers:", error.response?.data || error.message);
      alert("Driver not found: " + (error.response?.data?.error || error.message));
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
      setLoading(false)

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

  const handleStartJourney = () => {
    setStatus("In Progress");
    alert(" Journey started!");
  };

  return (
    <div className="container mt-3">
       {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
          style={{ zIndex: 1055 }}
        >
          <button className="btn btn-dark" type="button" disabled>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </button>
        </div>
      )}
      {routes.length === 0 ? (
        <div className="text-center text-muted">No assigned routes found.</div>
      ) : (
        routes.map((route, index) => (
          <div key={index} className="card mb-3" style={{ borderColor: "#ffc107" }}>
            <div className="card-body text-light" style={{ backgroundColor: "#1e1e2f" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title text-center">
                  <i className="fa-solid fa-route me-2"></i>
                  {route.route.name}
                </h5>
                <span className="badge bg-warning text-dark">{status}</span>
              </div>
              <p className="card-text mb-2">
                <strong>
                  <i className="fas fa-road me-2"></i>Distance:
                </strong>{' '}
                {route.route.totalDistance} km
              </p>
              <button
                className="btn btn-outline-warning w-100"
                onClick={handleStartJourney}
                disabled={status === "In Progress"}
              >
                <i className="fas fa-flag-checkered me-2"></i>
                Start Journey
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AssignRoutes;
