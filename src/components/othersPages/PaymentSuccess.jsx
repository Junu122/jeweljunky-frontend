import React, { useState, useEffect } from 'react';

import { axiosinstance } from '@/utlis/api';
const PaymentSuccessPage = ({data}) => {


  const [showContent, setShowContent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    // Trigger animations with delays
    setTimeout(() => setShowContent(true), 200);
    setTimeout(() => setShowDetails(true), 800);
  }, []);



  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
           fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
         }}>
      
      {/* Animated Background Elements */}
      <div className="position-absolute w-100 h-100">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="position-absolute rounded-circle"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background: 'rgba(255, 255, 255, 0.1)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content Card */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div 
              className={`card border-0 shadow-lg ${showContent ? 'animate-card-enter' : 'opacity-0'}`}
              style={{
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                transform: showContent ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="card-body text-center py-5 px-4">
                
                {/* Success Icon with Animation */}
                <div className="mb-4 position-relative">
                  <div 
                    className={`mx-auto ${showContent ? 'animate-success-icon' : ''}`}
                    style={{
                      width: '120px',
                      height: '120px',
                      background: 'linear-gradient(135deg, #00c851, #007e33)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 20px 40px rgba(0, 200, 81, 0.3)',
                      transform: showContent ? 'scale(1)' : 'scale(0)',
                      transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                    }}
                  >
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17L4 12" className={showContent ? 'animate-checkmark' : ''}/>
                    </svg>
                  </div>
                  
                  {/* Ripple Effect */}
                  <div 
                    className="position-absolute top-50 start-50 translate-middle rounded-circle"
                    style={{
                      width: '120px',
                      height: '120px',
                      border: '3px solid #00c851',
                      opacity: showContent ? '0' : '1',
                      transform: showContent ? 'scale(2)' : 'scale(1)',
                      transition: 'all 1s ease-out'
                    }}
                  />
                </div>

                {/* Success Message */}
                <h1 
                  className={`h2 fw-bold mb-3 ${showContent ? 'animate-fade-up' : 'opacity-0'}`}
                  style={{
                    color: '#2d3748',
                    animationDelay: '0.3s',
                    animationFillMode: 'forwards'
                  }}
                >
                  Payment Successful!
                </h1>
                
                <p 
                  className={`text-muted fs-5 mb-4 ${showContent ? 'animate-fade-up' : 'opacity-0'}`}
                  style={{
                    animationDelay: '0.5s',
                    animationFillMode: 'forwards'
                  }}
                >
                  Thank you for your purchase. Your transaction has been completed successfully.
                </p>

                {/* Transaction Details */}
                <div 
                  className={`${showDetails ? 'animate-fade-up' : 'opacity-0'}`}
                  style={{
                    animationDelay: '0.7s',
                    animationFillMode: 'forwards'
                  }}
                >
                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <div 
                        className="p-3 rounded-4"
                        style={{ background: 'linear-gradient(135deg, #f8f9ff, #e6f3ff)' }}
                      >
                        <div className="small text-muted fw-semibold mb-1">Amount</div>
                        <div className="h5 fw-bold mb-0" style={{ color: '#4a5568' }}>&#8377;{data?.amount/100}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div 
                        className="p-3 rounded-4"
                        style={{ background: 'linear-gradient(135deg, #f8f9ff, #e6f3ff)' }}
                      >
                        <div className="small text-muted fw-semibold mb-1">Order ID</div>
                        <div className="h6 fw-bold mb-0" style={{ color: '#4a5568' }}>{data?.merchantOrderId}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                    <button 
                     
                      className="btn btn-lg px-4 py-3 fw-semibold border-0 rounded-4 me-sm-2"
                      style={{
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.5)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
                      }}
                    >
                      View Receipt
                    </button>
                    <button 
                      className="btn btn-outline-primary btn-lg px-4 py-3 fw-semibold rounded-4"
                      style={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        borderWidth: '2px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                        e.target.style.color = 'white';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#667eea';
                        e.target.style.transform = 'translateY(0)';
                      }}
                       onClick={() => window.open("/")}
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>

                {/* Footer Message */}
                <div 
                  className={`mt-4 pt-4 border-top ${showDetails ? 'animate-fade-up' : 'opacity-0'}`}
                  style={{
                    borderColor: 'rgba(0,0,0,0.1) !important',
                    animationDelay: '1s',
                    animationFillMode: 'forwards'
                  }}
                >
                  <p className="small text-muted mb-0">
                    A confirmation email has been sent to your email address
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes animate-fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes animate-checkmark {
          0% {
            stroke-dasharray: 0 50;
          }
          100% {
            stroke-dasharray: 50 0;
          }
        }
        
        .animate-fade-up {
          animation: animate-fade-up 0.6s ease-out;
        }
        
        .animate-checkmark {
          stroke-dasharray: 50;
          animation: animate-checkmark 0.6s ease-out 0.5s forwards;
        }
        
        .opacity-0 {
          opacity: 0;
        }
        
        @media (max-width: 576px) {
          .card-body {
            padding: 2rem 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccessPage;