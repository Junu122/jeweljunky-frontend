import React, { useState, useEffect } from 'react';
import { X } from "lucide-react"

// Simple X icon
<X size={24} />
const PaymentFailurePage = ({data}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
    
    // Start pulse animation for the icon
    const pulseInterval = setInterval(() => {
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 1000);
    }, 3000);

    return () => clearInterval(pulseInterval);
  }, []);

  const handleRetryPayment = () => {
    window.open("/checkout")
  };

  const handleGoBack = () => {
    // Add navigation logic here
    window.open("/")
    console.log('Going back...');
  };

  const handleContactSupport = () => {
    // Add support contact logic here
    console.log('Contacting support...');
  };

  return (
    <>
      {/* Bootstrap CSS */}
    
      
      {/* Custom styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #fff 0%, #fff 100%);
          min-height: 100vh;
          margin: 0;
        }

        .failure-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .failure-card {
          border:1px solid #ddd;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          max-width: 500px;
          width: 100%;
          padding: 40px;
          text-align: center;
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .failure-card.visible {
          transform: translateY(0);
          opacity: 1;
        }

        .error-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #ff6b6b, #ee5a52);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 30px;
          position: relative;
          overflow: hidden;
          transform: scale(1);
          transition: all 0.3s ease;
        }

        .error-icon.pulse {
          animation: pulse 1s ease-in-out;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .error-icon::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, #ff6b6b, #ee5a52);
          border-radius: 50%;
          z-index: -1;
          animation: rotate 3s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .error-icon svg {
          width: 40px;
          height: 40px;
          color: white;
          z-index: 2;
          position: relative;
        }

        .error-title {
          color: #2d3748;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 15px;
          animation: slideInUp 0.6s ease-out 0.2s both;
        }

        .error-message {
          color: #718096;
          font-size: 1.1rem;
          margin-top:5px
          margin-bottom: 10px;
          animation: slideInUp 0.6s ease-out 0.4s both;
        }

        .error-details {
          background: #f7fafc;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 30px;
          border-left: 4px solid #ff6b6b;
          animation: slideInUp 0.6s ease-out 0.6s both;
        }

        .error-code {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          color: #e53e3e;
          margin-bottom: 5px;
        }

        .error-description {
          color: #4a5568;
          font-size: 0.9rem;
        }

        .btn-group {
          display: flex;
          flex-direction: column;
          gap: 15px;
          animation: slideInUp 0.6s ease-out 0.8s both;
        }

        .btn-primary-custom {
          background: black;
          border: none;
          padding: 15px 30px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          color:#fefefe
        }

        .btn-primary-custom:hover {
        border:1px solid red;
         background: #ff6868;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .btn-primary-custom::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background:black;
          transition: left 0.5s;
        }

        .btn-primary-custom:hover::before {
          left: 100%;
          
        }

        .btn-outline-custom {
          border: 2px solid #cbd5e0;
          background: transparent;
          color: #4a5568;
          border-radius: 20px;
          padding: 12px 30px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-outline-custom:hover {
          background: #f7fafc;
          border-color: #a0aec0;
          transform: translateY(-1px);
          color: #2d3748;
        }

        .btn-link-custom {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          padding: 10px 20px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .btn-link-custom:hover {
          background: #edf2f7;
          color: #5a67d8;
          text-decoration: none;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .floating-shapes {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }

        .shape {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .shape:nth-child(1) {
          width: 60px;
          height: 60px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape:nth-child(2) {
          width: 40px;
          height: 40px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .shape:nth-child(3) {
          width: 80px;
          height: 80px;
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @media (max-width: 576px) {
          .failure-card {
            padding: 30px 20px;
            margin: 20px;
          }
          
          .error-title {
            font-size: 1.5rem;
          }
          
          .btn-group {
            flex-direction: column;
          }
        }
      `}</style>

      {/* Floating background shapes */}
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="failure-container">
        <div className={`failure-card ${isVisible ? 'visible' : ''}`}>
          {/* Error Icon */}
          <div className={`error-icon ${pulseAnimation ? 'pulse' : ''}`}>
           <X size={24} />
          </div>

          {/* Error Title */}
          <h1 className="error-title">Payment Failed</h1>
            <div className="error-details">
            <div className="error-code">{data?.errorCode}</div>
            <div className="error-description">
              Your payment was declined or could not be processed. Please check your payment details or try a different payment method.
              <p className="error-message"><span style={{color:"#2d3748",fontWeight:"900",fontSize:"1rem"}}>ORDER ID:</span>{data?.merchantOrderId}</p>
             
               <p className="error-message"><span style={{color:"#2d3748",fontWeight:"900",fontSize:"1rem"}}>AMOUNT:</span>&#8377;{data?.amount/100}</p>
            </div>
          </div>

          {/* Error Message */}
          {/* <p className="error-message">
            We're sorry, but your payment could not be processed at this time. 
           
          </p> */}
          
          
          
          {/* Error Details */}
        

          {/* Action Buttons */}
          <div className="btn-group">
            <button 
              className="btn btn-primary-custom"
              onClick={handleRetryPayment}
            >
              Try Again
            </button>
            
            <div className="row">
              <div className="col-6">
                <button 
                  className="btn btn-outline-custom w-100"
                  onClick={handleGoBack}
                >
                  Go Back Home
                </button>
              </div>
              {/* <div className="col-6">
                <button 
                  className="btn btn-outline-custom w-100"
                  onClick={handleContactSupport}
                >
                  Contact Support
                </button>
              </div> */}
            </div>
            
            {/* <a 
              href="#" 
              className="btn-link-custom"
              onClick={(e) => {
                e.preventDefault();
                console.log('View transaction details');
              }}
            >
              View Transaction Details
            </a> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentFailurePage;