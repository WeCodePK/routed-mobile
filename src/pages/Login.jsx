import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import login2 from "../images/login2.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [otpCode, setOtpCode] = useState(0);

  
  const navigate = useNavigate();

  const loginRequest = async () => {
 
    setLoading(true);

    if (loginEmail === "") {
      toast.warning("Email field cannot be empty!");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      toast.warning("Valid Email is required!");
      setLoading(false);
      return;
    }

    const payload = { email: loginEmail };

    try {
      
      


      const response = await axios.post(
        "https://routed-backend.wckd.pk/api/v0/auth/driver/otp",
        payload
      );

      if (response.status === 200) {
        toast.success("OTP Send successfully!");
        setShowModal(true);

        // navigate("/home");
        setLoading(false);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("OTP failed. Please try again.");
      }
      setLoading(false);
    }
  };

  const payload2 ={
    email: loginEmail,
    otpCode: otpCode,
  }

  const verifyOtp = async () => {
    console.log("datatype", typeof payload2.otpCode);
    if (otpCode === 0) {
      toast.warning("OTP field cannot be empty!");
      return;
    }
     try {
      


      const response = await axios.post(
        "https://routed-backend.wckd.pk/api/v0/auth/driver/login",
        payload2
      );

      if (response.status === 200) {
        toast.success("Login successfully!");
        console.log("token", response.data.data.jwt);
        
        localStorage.setItem("token", response.data.data.jwt);
         navigate("/driver/dashboard");
        setLoading(false);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Login failed. Please try again.");
      }
      setLoading(false);
    }
  }

  return (
    <div className="container my-5">
      <ToastContainer />

      <div className="text-center mb-4">
        <h1 className="text-primary fw-bold">Welcome Back, Driver!</h1>
        <p className="lead">Login to access your driving dashboard.</p>
      </div>

      <div className="d-flex justify-content-center">
        <div
          className="shadow-lg p-4 rounded-4 d-flex flex-column flex-md-row align-items-center w-100"
          style={{
            backgroundColor: "#f9f9f9",
            maxWidth: "800px",
            width: "100%",
            minHeight: "400px",
          }}
        >
          {/* Image Section */}
          <div className="text-center mb-md-0 " style={{ flex: 1}}>
            <img
              src={login2}
              alt="Login"
              className="img-fluid rounded-3"
              style={{
                maxHeight: "250px",
                width: "100%",
                objectFit: "contain",
              }}
            />
          </div>

      {          /* Vertical Divider */}
          <div
            className="d-block d-md-none w-100 my-3"
            style={{ height: "1px", backgroundColor: "#ccc" }}
          ></div>

    
          <div
            className="d-none d-md-block"
            style={{
              width: "1px",
              backgroundColor: "#ccc",
              height: "90%",
              margin: "0 20px",
            }}
          ></div>

          {/* Login Form Section */}
          <div className="px-md-4 w-100" style={{ flex: 1 }}>
            <h2 className="text-center mb-3">Driver Login</h2>
            <p className="text-center text-muted">
              <b>Enter valid email to get access</b>
            </p>

            <label>Email</label>
            <input
              type="email"
              className="form-control mb-3"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="Enter your email"
            />

            <button
              className="btn btn-primary w-100"
              onClick={loginRequest}
              disabled={loading}
            >
              Send OTP
            </button>
          </div>
        </div>
      </div>

      
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(0px)",
          }}
        >
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div
              className="modal-content shadow"
              style={{ borderRadius: "10px" }}
            >
              <div
                className="modal-header text-light py-2 px-3"
                style={{ backgroundColor: "#1e1e2f" }}
              >
                <h6 className="modal-title m-0">
                
                  <strong>OTP VErification</strong>
                </h6>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">

                <input type=" number" className="form-control" value={otpCode} onChange={(e)=> setOtpCode(e.target.value)}/>
              
                <button
                  className="btn btn-outline-primary w-100 mb-2"
                  onClick={verifyOtp}
                >
                   Verify OTP
                </button>
               
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
