import React, { useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import login2 from "../images/login2.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [showOtpMessage, setShowOtpMessage] = useState(true);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  const navigate = useNavigate();
  const payload = { email: loginEmail };
const sendOtp = async () => {
  try {
    const response = await axios.post(
      "https://routed-backend.wckd.pk/api/v0/auth/driver/otp",
      payload
    );

    if (response.status === 200 || response.data?.success) {
   
      if(showOtpMessage){
        toast.success("OTP sent successfully!");
      setTimer(60);
      setCanResend(false);
          setOtpModal(true);
     
      setLoading(false)
      }

      const id = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return true
    } else {
      toast.error(!response.data?.success|| "OTP failed. Please try again.");
      return false;
    }
  } catch (error) {
    toast.error(!error.response?.data?.success || "OTP failed. Please try again.");
    return false;
  } finally {
    setLoading(false);
  }
};
const handleResend = async () => {
  toast.success("OTP Resent Successfully!");
  setTimer(60)
    setOtp(new Array(6).fill(""));
    inputRefs.current[0]?.focus();
    setCanResend(false);
    setShowOtpMessage(false)
   sendOtp(); 
    
  
}

const handleCloseOTPModal = ()=>{
  setOtpModal(false)
  setOtp(new Array(6).fill(""));
  setTimer(0)
  setShowOtpMessage(true);
}

  const handleChange = (element, index) => {
    if (!/^[a-zA-Z0-9]?$/.test(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value.toUpperCase();
    setOtp(newOtp);

    if (element.value !== "" && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      otp[index] === "" &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };
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
    await sendOtp();
  };

 

 const verifyOtp = async () => {
  setLoading(true);

  if (otp.join("").length !== 6) {
    toast.warning("Please enter the complete 6-digit OTP!");
    setLoading(false);
    return;
  }

  try {
    const payload2 = {
      email: loginEmail,
      otpCode: otp.join(""),
    };

    const response = await axios.post(
      "https://routed-backend.wckd.pk/api/v0/auth/driver/login",
      payload2
    );

    if (response.status === 200) {
      toast.success("Login successfully!");
      localStorage.setItem("email", loginEmail);
      localStorage.setItem("token", response.data.data.jwt);
      navigate("/driver/dashboard");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container my-5">
      <ToastContainer />

      <div className="text-center mb-4">
        <h1 className="fw-bold" style={{color :"#0a1128"}}>Welcome Back, Driver!</h1>
        <p className="lead text-dark">
          Login to access your driving dashboard.
        </p>
      </div>

      <div className="d-flex justify-content-center">
        <div
          className="shadow-lg p-4 rounded-4 d-flex flex-column flex-md-row align-items-center w-100"
          style={{
            backgroundColor: "#0a1128",
            maxWidth: "800px",
            width: "100%",
            minHeight: "400px",
          }}
        >
          {/* Image Section */}
          <div className="text-center mb-md-0 " style={{ flex: 1 }}>
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

          <div className="px-md-4 w-100" style={{ flex: 1 }}>
            <h2 className="text-center mb-3 text-light">Driver Login</h2>
            <p className="text-center text-light">
              <b>Enter valid email to get access</b>
            </p>

            <label className="text-light">Email</label>
            <input
              type="email"
              className="form-control mb-3 mt-1"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="Enter your email"
            />

            <button
              className="btn btn-outline-light w-100"
              onClick={loginRequest}
              disabled={loading}
            >
              {loading === false ? (
                <>
                  Send OTP
                  <i className="fas fa-key ms-2"></i>
                </>
              ) : (
                <>
                  Sending OTP...
                  <div
                    className="spinner-border spinner-border-sm text-light ms-2"
                    role="status"
                  ></div>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {otpModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(26, 26, 26, 0.5)" }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{
              width: "90vw", 
              maxWidth: "370px", 
              margin: "auto",
            }}
          >
            <div
              className="modal-content text-light"
              style={{
                backgroundColor: "#0a1128"
              }}
            >
              <div className="modal-header">
                <h5 className="modal-title">VERIFY OTP</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseOTPModal}
                ></button>
              </div>

              <div className="modal-body">
                <p style={{ opacity: 0.85, fontSize: "0.9rem" }}>
                  We've sent a One-Time Password (OTP) to your registered email.
                  Enter it below to verify your identity.
                </p>
                <p
                  style={{
                    opacity: 0.7,
                    fontSize: "0.9rem",
                    marginTop: "6px",
                    textAlign: "center",
                  }}
                >
                  <i className="fas fa-clock me-1"></i> OTP will expire in
                </p>

                <div className="text-center mt-2">
                  {!canResend ? (
                    <div className="d-flex justify-content-center align-items-center">
                      <div
                        className="mt-1"
                        style={{
                          width: "75px",
                          height: "75px",
                          borderRadius: "50%",
                          border: "6px solid #ffc107",
                          backgroundColor: "transparent",
                          color: "#ffffffff",
                          fontSize: "32px",
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {timer % 120}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mt-2">
                        <span
                          className="text-light"
                          style={{
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "1.05rem",
                           
                          }}
                          onClick={handleResend}
                        >
                          <i className="fas fa-paper-plane me-2"></i> Resend OTP
                        </span>
                      </div>

                      <div className="mt-2">
                        <p
                          className="text-muted"
                          style={{ fontSize: "0.9rem" }}
                        >
                          <i className="fas fa-info-circle me-2"></i> Didn't
                          receive the OTP? Check your spam folder or try
                          resending.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="d-flex justify-content-center gap-2 mt-4">
                  {otp.map((val, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="form-control text-center"
                      style={{
                        width: "36px",
                        height: "40px",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        borderRadius: "1px",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #ced4da",
                      }}
                      value={otp[index]}
                      ref={(el) => (inputRefs.current[index] = el)}
                      onChange={(e) => handleChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
                </div>

                <div className="text-center mt-4">
                  <button
                    className="btn btn-outline-warning fw-bold d-flex align-items-center justify-content-center px-3 py-2 mx-auto btn-sm"
                    onClick={verifyOtp}
                  >
                    <i className="fas fa-key me-2"></i>
                    {loading === false ? (
                      "Verify OTP"
                    ) : (
                      <>
                        Verifying OTP...
                        <div
                          className="spinner-border spinner-border-sm text-dark ms-2"
                          role="status"
                        ></div>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseOTPModal}
                >
                  Cancel
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
