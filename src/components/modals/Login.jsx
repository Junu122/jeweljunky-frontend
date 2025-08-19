import { userServices } from "@/services/userService";
import React, { useState } from "react";
import { useContextElement } from "@/context/Context";
import { useGoogleLogin } from "@react-oauth/google";
export default function Login() {
  const [submitting, setSubmitting] = useState(false);
   const [error, setError] = useState("");
  const [formData,setFormData]=useState({
    credential:"",
    password:""
  })
   const [validationErrors, setValidationErrors] = useState({
    credential: '',
    password: ''
  });
   const { login,isAuthenticated,user,googleSignin } = useContextElement();
  const emailPattern= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;;
  const phonePattern = /^\+?[0-9]{10,15}$/;
  const handleChange=(e)=>{
      const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  }
  
    const validateForm = () => {
    const errors = {
      credential: '',
      password: ''
    };
    let isValid = true;
   
    if (!formData.credential.trim()) {
      errors.credential = 'Email or phone number is required';
      isValid = false;
    } else if (!emailPattern.test(formData.credential) && !phonePattern.test(formData.credential)) {
      errors.credential = 'Please enter a valid email or phone number';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };


  const handleLogin=async(e)=>{
       e.preventDefault()
       if (!validateForm()) {
      return; 
    }
    try {
     const response=await login(formData)
      console.log(response,"............")
      if(response?.success){
        const loginModal = document.getElementById('login');


        // Fallback if the modal instance isn't available
        const closeBtn = loginModal.querySelector('[data-bs-dismiss="modal"]');
        if (closeBtn) {
         
          closeBtn.click();
        }
      }else{
        if(response.error=="passworderror"){
          setValidationErrors({password:response.message})
        }else if
        (response.error=="usererror"){
          setValidationErrors({credential:response.message})
        }else{
          setError(response.message)
        }
      

      }
    } catch (error) {
      console.log("login error",error)
    }
  }


    const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
     
      try {
      
        setError("");

        const response = await googleSignin(tokenResponse);
        
        if (response?.success) {
          const loginModal = document.getElementById("login");
          const closeBtn = loginModal.querySelector('[data-bs-dismiss="modal"]');
          if (closeBtn) {
            closeBtn.click();
          }
        } else {
          setError(response.message || "Google registration failed");
        }
      } catch (error) {
        setError("Google registration failed. Please try again.");
      } finally {
       
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      setError("Google login failed. Please try again.");
    },
  });

  return (
    <div
      className="modal modalCentered fade form-sign-in modal-part-content"
      id="login"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Log in</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="tf-login-form">
            <form
              onSubmit={handleLogin}
              className=""
              acceptCharset="utf-8"
            >
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  name="credential"
                  onChange={handleChange}
                  autoComplete="abc@xyz.com"
                />
                <label className="tf-field-label" htmlFor="">
                   Email *
                </label>
              </div>
             {validationErrors && <p className="error-message" style={{color:"red"}}>{validationErrors.credential}</p> }
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="password"
                  name="password"
                  onChange={handleChange}
                  
                />
                <label className="tf-field-label" htmlFor="">
                  Password *
                </label>
                {validationErrors && <p className="error-message" style={{color:"red"}}>{validationErrors.password}</p> }
              </div>
              <div>
                {/* <a
                  href="#forgotPassword"
                  data-bs-toggle="modal"
                  className="btn-link link"
                >
                  Forgot your password?
                </a> */}
              </div>
               {/* <button
                  type="button"
                  className="tf-btn btn-outline animate-hover-btn radius-3 w-100 justify-content-center mb-3"
                  onClick=""
                >
                  <i className="fab fa-google me-2"></i>
                  <span>Continue with Google</span>
                </button> */}
                  <div className="text-center mb-3">
                <span className="text-muted">or</span>
              </div>
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
                  <span>Signin with Google</span>
                </button>
                 {error && <p className="text-danger small mb-3 mt-2">{error}</p>}
              <div className="bottom">
                <div className="w-100">
                  <button
                    type="submit"
                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                  >
                    <span>Log in</span>
                  </button>
                </div>
                <div className="w-100">
                  <a
                    href="#register"
                    data-bs-toggle="modal"
                    className="btn-link fw-6 w-100 link"
                  >
                    New customer? Create your account
                    <i className="icon icon-arrow1-top-left" />
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
