import React, { useState, useEffect,useRef  } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { userServices } from "@/services/userService";
import { useGoogleLogin } from "@react-oauth/google";
import { useContextElement } from "@/context/Context";
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, signInWithCustomToken } from 'firebase/auth';
import { auth } from "@/utlis/firebase";



export default function Register() {
  // State management
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [registrationType, setRegistrationType] = useState("mobile");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [mobileValue, setMobileValue] = useState({
    name: "",
    phone: "",
  });
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaVerifierRef = useRef(null);
  // const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  const { googleSignup } = useContextElement();

  // Initialize reCAPTCHA

  // Validation schemas
  const mobileValidationSchema = Yup.object({
    phone: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Phone number must be 10 digits starting with 6-9")
      .required("Phone number is required"),
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required")
  });

  const otpValidationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be 6 digits")
      .required("OTP is required"),
  });

  // Initial values
  const mobileInitialValues = {
    name: "",
    phone: ""
  };

  const handleBack = () => {
    setSubmitting(false);
    setOtpSent(false);
    setConfirmationResult(null);
    setOtp("");
    setTimer(0);
  };

  // Handle OTP sending
 const handleSendOTP = async (values) => {
    setError("");
    setSubmitting(true);
    
    try {
      const backendResponse = await userServices.userRegister(values);
      console.log("Backend response:", backendResponse);
      
      if (!backendResponse?.data?.success) {
        setError(backendResponse?.data?.message);
        setSubmitting(false);
        return;
      }

      const formattedPhone = `+91${values.phone}`;
      
    const recaptcha=new RecaptchaVerifier(auth,'recaptcha',{})
     console.log("Recaptcha initialized:", recaptcha);
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptcha
      );
      console.log("OTP sent successfully:", confirmation);
      // setConfirmationResult(confirmation);
      // setMobileValue(values);
      // setOtpSent(true);
      
      // Start timer
      setTimer(60);
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

    } catch (error) {
      console.error("OTP sending error:", error);
      let errorMessage = "Failed to send OTP. Please try again.";
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = "Invalid phone number format";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many requests. Please try again later.";
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = "SMS quota exceeded. Please try again later.";
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (timer > 0) return;

    setError("");
    setSubmitting(true);

    try {
      const formattedPhone = `+91${mobileValue.phone}`;
      
      // Create a new reCAPTCHA verifier for resend
      const newVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
      
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, newVerifier);
      setConfirmationResult(confirmation);
      
      // Start timer again
      setTimer(60);
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle OTP verification and registration
  const handleVerifyOTP = async () => {
    if (!confirmationResult) {
      setError("Please request OTP first");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);
      
      // Get the ID token from Firebase
      const idToken = await result.user.getIdToken();
      
      // Send to backend for final verification and user creation
      const userData = {
        ...mobileValue,
        otp,
        idToken
      };

      const response = await userServices.verifyOtp(userData);
      
      if (response?.data?.success) {
        const registerModal = document.getElementById("register");
        const closeBtn = registerModal.querySelector('[data-bs-dismiss="modal"]');
        if (closeBtn) {
          setOtpSent(false);
          closeBtn.click();
        }
        
        // You might want to store the user token or update context here
        // const { token, user } = response.data.data;
        // localStorage.setItem('token', token);
        // updateUserContext(user);
        
      } else {
        setError(response?.data?.message || "Registration failed");
      }

    } catch (error) {
      console.error("OTP verification error:", error);
      
      let errorMessage = "Invalid OTP. Please try again.";
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = "Invalid OTP code";
      } else if (error.code === 'auth/code-expired') {
        errorMessage = "OTP has expired. Please request a new one.";
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegistrationType = (type) => {
    setError("");
    setRegistrationType(type);
  };

  // Handle Google Sign In
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setSubmitting(true);
        setError("");

        const response = await googleSignup(tokenResponse);
        if (response?.success) {
          const registerModal = document.getElementById("register");
          const closeBtn = registerModal.querySelector('[data-bs-dismiss="modal"]');
          if (closeBtn) {
            closeBtn.click();
          }
        } else {
          setError(response.message || "Google registration failed");
        }
      } catch (error) {
        setError("Google registration failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      setError("Google login failed. Please try again.");
    },
  });

  return (
    <div className="modal modalCentered fade form-sign-in modal-part-content" id="register">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Register</div>
            <span className="icon-close icon-close-popup" data-bs-dismiss="modal" />
          </div>

        
          

          {!otpSent ? (
            <div className="tf-login-form">
              {/* Google Registration Button */}
              <div className="registration-options mb-4">
                <button
                  type="button"
                  className="google-register-btn"
                  onClick={googleLogin}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#fff",
                    border: "1px solid #dadce0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#3c4043",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    marginBottom: "16px",
                    fontFamily: "Roboto, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#f8f9fa";
                    e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#fff";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: "12px" }}>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Register with Google</span>
                </button>
              </div>

              <Formik
                initialValues={mobileInitialValues}
                validationSchema={mobileValidationSchema}
                onSubmit={handleSendOTP}
                enableReinitialize
              >
                <Form>
                  <div className="tf-field style-1">
                    <Field
                      name="name"
                      type="text"
                      className="tf-field-input tf-input"
                      placeholder=" "
                    />
                    <label className="tf-field-label" htmlFor="name">
                      Name *
                    </label>
                  </div>
                  <ErrorMessage name="name" component="p" className="text-danger small" />

                  <div className="tf-field style-1">
                    <Field
                      name="phone"
                      type="text"
                      className="tf-field-input tf-input"
                      placeholder=" "
                      maxLength="10"
                    />
                    <label className="tf-field-label" htmlFor="phone">
                      Phone Number *
                    </label>
                  </div>
                  <ErrorMessage name="phone" component="p" className="text-danger small" />

                  {error && <p className="text-danger small mb-3 mt-2">{error}</p>}
                   <div id="recaptcha"></div>
                  <div className="bottom">
                    <div className="w-100">
                      <button
                        type="submit"
                        className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                        disabled={submitting}
                      >
                        <span>{submitting ? "Sending OTP..." : "Get OTP"}</span>
                      </button>
                    </div>
                    <div className="w-100 mt-3">
                      <a
                        href="#login"
                        data-bs-toggle="modal"
                        className="btn-link fw-6 w-100 link"
                      >
                        Already have an account? Log in here
                        <i className="icon icon-arrow1-top-left" />
                      </a>
                    </div>
                  </div>
                </Form>
              </Formik>
            </div>
          ) : (
            // OTP Verification Form
            <div className="tf-login-form">
              <div className="text-center mb-4">
                <h5>Verify Mobile Number</h5>
                <p className="text-muted">
                  We've sent an OTP to your mobile number +91{mobileValue.phone}
                </p>
              </div>

              <div className="tf-field style-1">
                <input
                  type="text"
                  className="tf-field-input tf-input"
                  placeholder=" "
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                />
                <label className="tf-field-label">Enter 6-digit OTP *</label>
              </div>

              {error && <p className="text-danger small mb-3">{error}</p>}

              <div className="d-flex justify-content-end mb-3">
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={handleResendOTP}
                  disabled={timer > 0 || submitting}
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                </button>
              </div>

              <div className="bottom">
                <div className="w-100">
                  <button
                    type="button"
                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                    onClick={handleVerifyOTP}
                    disabled={submitting || otp.length !== 6}
                  >
                    <span>{submitting ? "Verifying..." : "Verify & Register"}</span>
                  </button>
                </div>

                <div className="w-100 mt-3">
                  <button
                    type="button"
                    className="btn btn-link fw-6 w-100 p-0"
                    onClick={handleBack}
                  >
                    <i className="icon icon-arrow1-left me-2"></i>
                    Back to registration
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}