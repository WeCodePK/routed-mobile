import React,{useState}from 'react'
import './AssignRoutes.css';

function AssignRoutes() {
    const [status, setStatus] = useState("Pending");
    const routes = [
  {
    id: 1,
    name: "Route A",
    assignDate: "2025-08-03",
    assignTime: "08:30 AM",
    totalDistance: 12.5,
  },
  {
    id: 2,
    name: "Route B",
    assignDate: "2025-08-03",
    assignTime: "10:00 AM",
    totalDistance: 8.2,
  },
  {
    id: 3,
    name: "Route C",
    assignDate: "2025-08-03",
    assignTime: "01:15 PM",
    totalDistance: 15.0,
  },
  {
    id: 4,
    name: "Route A",
    assignDate: "2025-08-03",
    assignTime: "08:30 AM",
    totalDistance: 12.5,
  },
  {
    id: 5,
    name: "Route B",
    assignDate: "2025-08-03",
    assignTime: "10:00 AM",
    totalDistance: 8.2,
  },
  {
    id: 6,
    name: "Route C",
    assignDate: "2025-08-03",
    assignTime: "01:15 PM",
    totalDistance: 15.0,
  },
];

const handleStartJourney = () => {
    // Logic to start the journey
    setStatus("In Progress");
    alert("Journey started!");
    
}

  return (
    <div>
<div className="container mt-3">
      {routes.map((route, index) => (
        <div key={index} className="card mb-3" style={{ borderColor: "#ffc107" }}>
          <div className="card-body text-light" style={{ backgroundColor: "#1e1e2f"}}>
            <div className='d-flex justify-content-between align-items-center mb-3'>
           <h5 className="card-title text-center"><i class="fa-solid fa-route me-2"></i>{route.name}</h5>
            <span className="badge bg-warning text-dark">{status}</span>
            </div>

         


            <p className="card-text mb-2">
              <strong><i class="fa-solid fa-calendar-days me-2"></i>Date:</strong> {route.assignDate}<br />
              <strong><i class="fa-solid fa-clock me-2"></i>Time:</strong> {route.assignTime}<br />
              <strong><i className="fas fa-road me-2"></i>Distance:</strong> {route.totalDistance} km
            </p>
            <button className="btn btn-outline-warning w-100" onClick={handleStartJourney} disabled={status === "In Progress"}>
              <i className="fas fa-flag-checkered me-2"></i>
Start Journey
            </button>
          </div>
        </div>
      ))}
    </div>
    </div>
  )
}

export default AssignRoutes
