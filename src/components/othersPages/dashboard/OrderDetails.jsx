import React from "react";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import {
  CheckCircle,
  Package,
  Truck,
  Home,
  Star,
  Calendar,
  MapPin,
  CreditCard,
} from "lucide-react";

const OrderDetails = ({ orderdata }) => {
const navigate=useNavigate()
 
 const addressdata=orderdata?.shippingAddress ||{}

  // Define the possible status steps with their corresponding backend status names
  const statusSteps = [
    { 
      label: "Order Placed", 
      icon: CheckCircle, 
      backendStatus: ["ORDER_CONFIRMED", "CONFIRMED", "PLACED"], // possible backend status names
      defaultDate: "Order Placed"
    },
    { 
      label: "order is Processing", 
      icon: Package, 
      backendStatus: ["ORDER_PROCESSED", "PROCESSING", "PREPARING"], 
      defaultDate: "Processing"
    },
    { 
      label: "Shipped", 
      icon: Truck, 
      backendStatus: ["SHIPPED", "OUT_FOR_DELIVERY", "IN_TRANSIT"], 
      defaultDate: "Shipped"
    },
    { 
      label: "Delivered", 
      icon: Home, 
      backendStatus: ["DELIVERED", "COMPLETED"], 
      defaultDate: "Delivered"
    },
  ];

  // Function to determine current status based on orderHistory
  const getCurrentStatusFromHistory = () => {
    if (!orderdata?.statusHistory || !Array.isArray(orderdata.statusHistory)) {
      return 0; // Default to first step if no history
    }

    let maxStatusIndex = -1;
    
    // Check each history entry against our status steps
    orderdata?.statusHistory.forEach(historyItem => {
      const status = historyItem.status?.toUpperCase();
     
      statusSteps.forEach((step, stepIndex) => {
        if (step.backendStatus.includes(status)) {
          maxStatusIndex = Math.max(maxStatusIndex, stepIndex);
        }
      });
    });

    return maxStatusIndex >= 0 ? maxStatusIndex : 0;
  };

  // Function to get date for each status step from orderHistory
  const getStatusDate = (stepIndex) => {
    if (!orderdata?.statusHistory || !Array.isArray(orderdata.statusHistory)) {
      return statusSteps[stepIndex].defaultDate;
    }

    const step = statusSteps[stepIndex];
    
    // Find matching history entry
    const historyEntry = orderdata.statusHistory.find(item => 
      step.backendStatus.includes(item.status?.toUpperCase())
    );

    if (historyEntry && historyEntry.timestamp) {
      return new Date(historyEntry.timestamp).toLocaleDateString("en-IN", {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }

    // For future steps, show "Expected" or "Pending"
    const currentStatus = getCurrentStatusFromHistory();
    if (stepIndex > currentStatus) {
      return stepIndex === statusSteps.length - 1 ? "Expected" : "Pending";
    }

    return step.defaultDate;
  };

  const [orderCurrentStatus, setOrderCurrentStatus] = useState(() => getCurrentStatusFromHistory());
  const [animationTrigger, setAnimationTrigger] = useState(1);

  // Update status when orderdata changes
  useEffect(() => {
    const newStatus = getCurrentStatusFromHistory();
    if (newStatus !== orderCurrentStatus) {
      setOrderCurrentStatus(newStatus);
      setAnimationTrigger(prev => prev + 1);
    }
  }, [orderdata]);

  // Enhanced status steps with dynamic dates
  const enhancedStatusSteps = statusSteps.map((step, index) => ({
    ...step,
    date: getStatusDate(index)
  }));

  const getStatusColor = (index) => {
    if (index < orderCurrentStatus) return "success";
    if (index === orderCurrentStatus) return "primary";
    return "secondary";
  };

  const isStepCompleted = (index) => index <= orderCurrentStatus;

  // Function to get the latest status message
  const getLatestStatusMessage = () => {
    if (!orderdata?.orderHistory || orderdata.orderHistory.length === 0) {
      return "Order information unavailable";
    }
    
    const latestHistory = orderdata.orderHistory[orderdata.orderHistory.length - 1];
    return latestHistory.status?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) || "Status Unknown";
  };

  // Custom styles for animations
  const animationStyles = {
    fadeInUp: {
      animation: 'fadeInUp 0.6s ease-out forwards',
      opacity: 0,
      transform: 'translateY(20px)'
    },
    bounceIn: {
      animation: 'bounceIn 0.8s ease-out forwards'
    },
    slideIn: {
      animation: 'slideIn 0.5s ease-out forwards'
    },
    progressLine: {
      transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1), height 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    iconPulse: {
      animation: 'pulse 2s infinite'
    }
  };

  const keyframes = `
    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes bounceIn {
      0% {
        opacity: 0;
        transform: scale(0.3) rotate(-180deg);
      }
      50% {
        opacity: 1;
        transform: scale(1.1) rotate(-10deg);
      }
      70% {
        transform: scale(0.95) rotate(5deg);
      }
      100% {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
      }
    }
    
    @keyframes shimmer {
      0% {
        background-position: -200px 0;
      }
      100% {
        background-position: calc(200px + 100%) 0;
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div className="min-vh-100 bg-light">
        <div className="container py-4">
          {/* Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="bg-white rounded-3 shadow-sm p-4 border-0" style={animationStyles.fadeInUp}>
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h2 className="fw-bold text-dark mb-2">Order Details</h2>
                    <div className="d-flex flex-wrap gap-3 text-muted">
                      <span>
                        <strong>Order ID:</strong> {orderdata?.merchantOrderId}
                      </span>
                      <span>
                        <strong>Date:</strong>{" "}
                        {orderdata?.createdAt &&
                          new Date(orderdata.createdAt)
                            .toLocaleDateString("en-IN", {
                              day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour:'2-digit',
                            minute:'2-digit',
                            hour12:true
                            })
                            }
                      </span>
                      <span>
                        <strong>Status:</strong> {getLatestStatusMessage()}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-4 text-md-end mt-3 mt-md-0">
                    <div className="d-flex align-items-center justify-content-md-end gap-2">
                      <Calendar size={18} className="text-primary" />
                      <small className="text-muted">
                        Est. Delivery: {orderdata?.estimatedDelivery || "TBD"}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="bg-white rounded-3 shadow-sm p-4 border-0" style={{...animationStyles.fadeInUp, animationDelay: '0.2s'}}>
                <h5 className="fw-semibold mb-4 text-dark">Order Status</h5>

                {/* Desktop Progress Bar */}
                <div className="d-none d-md-block">
                  <div className="position-relative px-5">
                    {/* Status Icons and Labels */}
                    <div className="d-flex justify-content-between align-items-center position-relative">
                      {enhancedStatusSteps.map((step, index) => {
                        const IconComponent = step.icon;
                        const completed = isStepCompleted(index);
                        const active = index === orderCurrentStatus;

                        return (
                          <div
                            key={index}
                            className="d-flex flex-column align-items-center position-relative"
                            style={{ 
                              zIndex: 2,
                              ...animationStyles.slideIn,
                              animationDelay: `${0.3 + index * 0.1}s`
                            }}
                          >
                            <div
                              className={`rounded-circle d-flex align-items-center justify-content-center mb-3 border-3 ${
                                completed
                                  ? "bg-success text-white border-success"
                                  : active
                                  ? "bg-primary text-white border-primary"
                                  : "bg-secondary text-muted border-secondary"
                              }`}
                              style={{ 
                                width: "48px", 
                                height: "48px",
                                ...(active ? animationStyles.iconPulse : {}),
                                ...(completed ? animationStyles.bounceIn : {}),
                                animationDelay: `${0.5 + index * 0.1}s`
                              }}
                            >
                              <IconComponent size={20} />
                            </div>
                            <div className="text-center">
                              <div
                                className={`fw-semibold small ${
                                  completed || active ? "text-dark" : "text-muted"
                                }`}
                                style={{
                                  ...animationStyles.fadeInUp,
                                  animationDelay: `${0.7 + index * 0.1}s`
                                }}
                              >
                                {step.label}
                              </div>
                              <div
                                className="text-muted"
                                style={{ 
                                  fontSize: "0.75rem",
                                  ...animationStyles.fadeInUp,
                                  animationDelay: `${0.8 + index * 0.1}s`
                                }}
                              >
                                {step.date}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Progress Line */}
                      <div
                        className="position-absolute d-flex align-items-center"
                        style={{
                          top: "24px",
                          left: "48px",
                          right: "48px",
                          zIndex: 1,
                        }}
                      >
                        <div
                          className="w-100 rounded"
                          style={{
                            height: "4px",
                            position: "relative",
                            backgroundColor: "#e9ecef",
                          }}
                        >
                          <div
                            className="bg-success rounded position-absolute"
                            style={{
                              height: "4px",
                              width: `${
                                orderCurrentStatus > 0
                                  ? (orderCurrentStatus /
                                      (enhancedStatusSteps.length - 1)) *
                                    100
                                  : 0
                              }%`,
                              ...animationStyles.progressLine,
                              background: orderCurrentStatus > 0 ? 
                                'linear-gradient(90deg, #28a745 0%, #20c997 100%)' : 
                                '#28a745'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Progress Bar */}
                <div className="d-md-none">
                  <div className="position-relative">
                    {/* Vertical Progress Line */}
                    <div
                      className="position-absolute"
                      style={{
                        left: "19px",
                        top: "20px",
                        width: "3px",
                        height: `${(enhancedStatusSteps.length - 1) * 80}px`,
                        backgroundColor: "#e9ecef",
                        borderRadius: "2px",
                        zIndex: 1,
                      }}
                    >
                      {/* Active Progress Line */}
                      <div
                        className="position-absolute"
                        style={{
                          width: "3px",
                          height: `${
                            orderCurrentStatus > 0
                              ? (orderCurrentStatus / (enhancedStatusSteps.length - 1)) * 100
                              : 0
                          }%`,
                          background: 'linear-gradient(180deg, #28a745 0%, #20c997 100%)',
                          borderRadius: "2px",
                          ...animationStyles.progressLine,
                          boxShadow: '0 0 8px rgba(40, 167, 69, 0.3)'
                        }}
                      ></div>
                    </div>

                    {/* Status Steps */}
                    {enhancedStatusSteps.map((step, index) => {
                      const IconComponent = step.icon;
                      const completed = isStepCompleted(index);
                      const active = index === orderCurrentStatus;

                      return (
                        <div
                          key={index}
                          className={`d-flex align-items-center position-relative ${
                            index === enhancedStatusSteps.length - 1 ? "mb-0" : "mb-4"
                          }`}
                          style={{ 
                            zIndex: 2,
                            minHeight: "60px",
                            ...animationStyles.slideIn,
                            animationDelay: `${0.3 + index * 0.15}s`
                          }}
                        >
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center me-3 border-3 ${
                              completed
                                ? "bg-success text-white border-success"
                                : active
                                ? "bg-primary text-white border-primary"
                                : "bg-white text-secondary border-secondary"
                            }`}
                            style={{ 
                              width: "40px", 
                              height: "40px",
                              position: "relative",
                              zIndex: 3,
                              ...(active ? animationStyles.iconPulse : {}),
                              ...(completed ? animationStyles.bounceIn : {}),
                              animationDelay: `${0.5 + index * 0.1}s`,
                              boxShadow: completed || active ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                            }}
                          >
                            <IconComponent size={18} />
                          </div>
                          <div className="flex-grow-1">
                            <div
                              className={`fw-semibold ${
                                completed || active ? "text-dark" : "text-muted"
                              }`}
                              style={{
                                ...animationStyles.fadeInUp,
                                animationDelay: `${0.7 + index * 0.1}s`
                              }}
                            >
                              {step.label}
                            </div>
                            <div 
                              className="text-muted small"
                              style={{
                                ...animationStyles.fadeInUp,
                                animationDelay: `${0.8 + index * 0.1}s`
                              }}
                            >
                              {step.date}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Order Items */}
            <div className="col-lg-8 mb-4">
              <div className="bg-white rounded-3 shadow-sm border-0" style={{...animationStyles.fadeInUp, animationDelay: '0.4s'}}>
                <div className="p-4 border-bottom">
                  <h5 className="fw-semibold mb-0 text-dark">Order Items</h5>
                </div>
                <div className="p-4">
                  {orderdata?.products?.map((item, index) => (
                    <div
                      key={item.productId}
                      onClick={()=>navigate(`/product-detail/${item?.productId}`)}
                      className="row align-items-center mb-4 pb-4 border-bottom"
                      style={{ 
                        cursor:"pointer", 
                        boxShadow:"0 4px 8px rgba(0, 0, 0, 0.1)",
                        ...animationStyles.fadeInUp,
                        animationDelay: `${0.5 + index * 0.1}s`,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <div className="col-3 col-md-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded-3 shadow-sm"
                          style={{ aspectRatio: "1/1", objectFit: "cover" }}
                        />
                      </div>
                      <div className="col-9 col-md-10">
                        <div className="row align-items-center">
                          <div className="col-md-6">
                            <h6 className="fw-semibold mb-1 text-dark">
                              {item.name}
                            </h6>
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <div className="d-flex align-items-center">
                                <Star
                                  size={14}
                                  className="text-warning me-1"
                                  fill="currentColor"
                                />
                                <span className="small text-muted">
                                  {item.rating || 4.5}
                                </span>
                              </div>
                            </div>
                            <span className="text-muted small">
                              Qty: {item.quantity}
                            </span>
                          </div>
                          <div className="col-md-6 text-md-end mt-2 mt-md-0">
                            <div className="fw-bold text-dark">
                              &#8377; {(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="small text-muted">
                              &#8377; {item.price} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary & Address */}
            <div className="col-lg-4">
             
              <div className="bg-white rounded-3 shadow-sm border-0 mb-4" style={{...animationStyles.fadeInUp, animationDelay: '0.6s'}}>
                <div className="p-4 border-bottom">
                  <div className="d-flex align-items-center">
                    <MapPin size={20} className="text-primary me-2" />
                    <h6 className="fw-semibold mb-0 text-dark">
                      Shipping Address
                    </h6>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-dark fw-semibold">
                 {addressdata?.fullName}
                  </div>
                  <div className="text-muted mt-1">
                   {addressdata?.address} ,{addressdata?.place}, {addressdata?.city} 
                    <br />
                   {addressdata?.state}-{addressdata?.pincode}  
                  
                    <br />
                   {addressdata?.phoneNumber} 
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3 shadow-sm border-0 mb-4" style={{...animationStyles.fadeInUp, animationDelay: '0.7s'}}>
                <div className="p-4 border-bottom">
                  <div className="d-flex align-items-center">
                    <CreditCard size={20} className="text-primary me-2" />
                    <h6 className="fw-semibold mb-0 text-dark">Payment Method</h6>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-muted">
                    <strong>{orderdata?.paymentDetails?.method}</strong> 
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-3 shadow-sm border-0" style={{...animationStyles.fadeInUp, animationDelay: '0.8s'}}>
                <div className="p-4 border-bottom">
                  <h6 className="fw-semibold mb-0 text-dark">Order Summary</h6>
                </div>
                <div className="p-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-dark">
                      &#8377;{orderdata?.subTotal}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Shipping</span>
                    <span className="text-dark">
                     Free
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Tax</span>
                    <span className="text-dark">
                     &#8377;{orderdata?.tax || 0}
                    </span>
                  </div>
                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold text-dark h6">Total</span>
                      <span className="fw-bold text-primary h5">
                        &#8377;{orderdata?.subTotal}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;