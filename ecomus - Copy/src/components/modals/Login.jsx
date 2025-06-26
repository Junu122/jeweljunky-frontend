import { userServices } from "@/services/userService";
import React, { useState } from "react";
import { useContextElement } from "@/context/Context";
export default function Login() {
  const [formData,setFormData]=useState({
    credential:"",
    password:""
  })
   const [validationErrors, setValidationErrors] = useState({
    credential: '',
    password: ''
  });
   const { login,isAuthenticated,user } = useContextElement();
  const emailPattern= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;;
  const phonePattern = /^\+?[0-9]{10,15}$/;
  const handleChange=(e)=>{
      const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  }
    console.log(formData)
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
      }
    } catch (error) {
      
    }
  }

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
                  Email or Phone *
                </label>
              </div>
             {validationErrors && <p className="error-message">{validationErrors.credential}</p> }
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
                {validationErrors && <p className="error-message">{validationErrors.password}</p> }
              </div>
              <div>
                <a
                  href="#forgotPassword"
                  data-bs-toggle="modal"
                  className="btn-link link"
                >
                  Forgot your password?
                </a>
              </div>
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
