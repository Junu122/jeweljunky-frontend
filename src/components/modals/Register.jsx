import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { userServices } from "@/services/userService";

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
    password: ""
  });
  const [emailValue, setEmailValue] = useState({
    name: "",
    email: "",
    password: ""
  });



  // Validating schemas based on registration type
  const mobileValidationSchema = Yup.object({
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const emailValidationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const otpValidationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be 6 digits")
      .required("OTP is required"),
  });

  // Initial values
  const mobileInitialValues = {
    name: "",
    phone: "",
    password: "",
    email: ""
  };

  const emailInitialValues = {
    name: "",
    email: "",
    password: "",
    phone: ""
  };

  const handleBack = () => {
    setSubmitting(false);
    setOtpSent(false);
  };

  // Handle OTP sending
  const handleSendOTP = async (values) => {
    setError("")
    if (registrationType === 'mobile') {

      setMobileValue(values);
    } else {
      setEmailValue(values);
    }

    setSubmitting(true);
    setError("");

    try {

      const response = await userServices.userRegister(values);
      console.log(response, "response in sending otp")
      if (response.data.success) {
        setOtpSent(true);
        // Start a 60-second timer for resending OTP
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
      } else {
        setError(response?.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = () => {
    if (timer > 0) return;

    const values = registrationType === "mobile"
      ? { phone: mobileValue.phone }
      : { email: emailValue.email };

    handleSendOTP(values);
  };

  // Handle OTP verification and registration
  const handleVerifyOTP = async () => {


    setSubmitting(true);
    setError("");

    try {
      const userData = registrationType === "mobile"
        ? { ...mobileValue, otp }
        : { ...emailValue, otp };

      console.log("Verifying with data:", userData);


      const response = await userServices.verifyOtp(userData);
      console.log(response)
      if (response?.data?.success) {
        const registerModal = document.getElementById('register');


        // Fallback if the modal instance isn't available
        const closeBtn = registerModal.querySelector('[data-bs-dismiss="modal"]');
        if (closeBtn) {
          setOtpSent(false)
          closeBtn.click();
        }


      } else {
        setError(response?.data?.message);
      }
    } catch (err) {
      console.log(err)
      setError("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegistrationType = (type) => {
    setError('');
    setRegistrationType(type)
  }

  // Handle Google Sign In
  const handleGoogleSignIn = () => {
    try {
      // Implement your Google Sign In logic here
      window.location.href = "/api/auth/google";
    } catch (error) {
      setError("Google sign in failed. Please try again.");
    }
  };

  return (
    <div
      className="modal modalCentered fade form-sign-in modal-part-content"
      id="register"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Register</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>

          {!otpSent ? (
            <div className="tf-login-form">
              {/* Registration Type Selection */}
              <div className="registration-options mb-4">
                <div className="d-flex justify-content-center mb-3">
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className={`btn ${registrationType === "mobile" ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => handleRegistrationType("mobile")}
                    >
                      Mobile
                    </button>
                    <button
                      type="button"
                      className={`btn ${registrationType === "email" ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => handleRegistrationType("email")}
                    >
                      Email
                    </button>
                  </div>
                </div>

                <div className="text-center mb-3">
                  <span className="text-muted">or</span>
                </div>

                <button
                  type="button"
                  className="tf-btn btn-outline animate-hover-btn radius-3 w-100 justify-content-center mb-3"
                  onClick={handleGoogleSignIn}
                >
                  <i className="fab fa-google me-2"></i>
                  <span>Continue with Google</span>
                </button>
              </div>


              <Formik
                initialValues={registrationType === "mobile" ? mobileInitialValues : emailInitialValues}
                validationSchema={registrationType === "mobile" ? mobileValidationSchema : emailValidationSchema}
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
                    <label className="tf-field-label">Name *</label>
                  </div>
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="text-danger small"
                  />

                  {registrationType === "mobile" ? (
                    <>
                      <div className="tf-field style-1">
                        <Field
                          name="phone"
                          type="text"
                          className="tf-field-input tf-input"
                          placeholder=" "
                        />
                        <label className="tf-field-label">Phone Number *</label>
                      </div>
                      <ErrorMessage
                        name="phone"
                        component="p"
                        className="text-danger small"
                      />
                    </>
                  ) : (
                    <>
                      <div className="tf-field style-1">
                        <Field
                          name="email"
                          type="email"
                          className="tf-field-input tf-input"
                          placeholder=" "
                        />
                        <label className="tf-field-label">Email *</label>
                      </div>
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="text-danger small"
                      />
                    </>
                  )}

                  <div className="tf-field style-1">
                    <Field
                      name="password"
                      type="password"
                      className="tf-field-input tf-input"
                      placeholder=" "
                      autoComplete="new-password"
                    />
                    <label className="tf-field-label">Password *</label>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-danger small"
                  />

                  {error && <p className="text-danger small mb-3 mt-2">{error}</p>}

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
                <h5>Verify {registrationType === "mobile" ? "Mobile Number" : "Email"}</h5>
                <p className="text-muted">
                  We've sent an OTP to your {registrationType === "mobile" ? "mobile number" : "email address"}
                </p>
              </div>

              <div className="tf-field style-1">
                <input
                  type="text"
                  className="tf-field-input tf-input"
                  placeholder=" "
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}

                />
                <label className="tf-field-label">Enter 6-digit OTP *</label>
              </div>

              {error && <p className="text-danger small mb-3">{error}</p>}

              <div className="d-flex justify-content-end mb-3">
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={handleResendOTP}
                  disabled={timer > 0}
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
                    disabled={submitting || otp.length !== 4}
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
  )
}