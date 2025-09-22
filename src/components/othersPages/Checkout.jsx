import { useContextElement } from "@/context/Context";
import { axiosinstance } from "@/utlis/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Locate, CreditCard, Banknote } from "lucide-react";
import AddressList from "../checkout/AddressList";
import NewAddressForm from "../checkout/NewAddressForm";
import {useNavigate} from "react-router-dom"

export default function Checkout() {
  const [addressData, setAddressData] = useState({
    fullName: "",
    address: "",
    city: "",
    place: "",
    state: "",
    district: "",
    pincode: "",
    phoneNumber: "",
    email: "",
    notes: "",
  });
  const navigate = useNavigate()
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isAddingNewAddress, setIsAddingNewAddress] = useState();
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState("");
  const [temporaryAddresses, setTemporaryAddresses] = useState([]);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentType, setPaymentType] = useState(""); // Changed from paymmentType
  const [isProcessing, setIsProcessing] = useState(false);
  const [phonePeLoaded, setPhonePeLoaded] = useState(false);

  const { cartProducts, setCartProducts, totalPrice, user } =
    useContextElement();

  // Combine user addresses with temporary addresses
  const allAddresses = [...(user?.address || []), ...temporaryAddresses];

  useEffect(() => {
    if (allAddresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(allAddresses[0]._id || allAddresses[0].tempId);
      handleAddressSelect(allAddresses[0]._id || allAddresses[0].tempId);
    }
  }, [allAddresses]);

  // Load PhonePe SDK
  useEffect(() => {
    const loadPhonePeScript = () => {
      // Check if script already exists
      if (document.querySelector('script[src="https://mercury.online.com/web/bundle/checkout.js"]')) {
        // Script already exists, check if PhonePe is available
        if (window.PhonePeCheckout) {
          setPhonePeLoaded(true);
        } else {
          // Wait a bit more for it to load
          setTimeout(() => {
            if (window.PhonePeCheckout) {
              setPhonePeLoaded(true);
            }
          }, 1000);
        }
        return;
      }

      const script = document.createElement("script");
      script.src = "https://mercury.phonepe.com/web/bundle/checkout.js";
      script.async = true;
      
      script.onload = () => {
        console.log("PhonePe script loaded successfully");
        // Wait a bit for the SDK to initialize
        setTimeout(() => {
          if (window.PhonePeCheckout) {
            setPhonePeLoaded(true);
            console.log("PhonePe SDK is ready");
          } else {
            console.error("PhonePe SDK not available after script load");
          }
        }, 500);
      };
      
      script.onerror = () => {
        console.error("Failed to load PhonePe script");
        alert("Failed to load payment gateway. Please refresh and try again.");
      };
      
      document.head.appendChild(script);
    };

    loadPhonePeScript();

    return () => {
      // Cleanup if needed
      const script = document.querySelector('script[src="https://mercury.online.com/web/bundle/checkout.js"]');
      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
        setPhonePeLoaded(false);
      }
    };
  }, []);

  // Handle address selection
  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setIsAddingNewAddress(false);

    const selectedAddress = allAddresses.find(
      (addr) => (addr._id || addr.id || addr.tempId) === addressId
    );

    if (selectedAddress) {
      setAddressData({
        fullName: selectedAddress.fullName || "",
        address: selectedAddress.address || "",
        city: selectedAddress.city || "",
        place: selectedAddress.place || "",
        state: selectedAddress.state || "",
        district: selectedAddress.district || "",
        pincode: selectedAddress.pincode || "",
        phoneNumber: selectedAddress.phoneNumber || "",
        email: selectedAddress.email || user?.email || "",
        notes: selectedAddress.notes || "",
      });
    }
  };

  // Handle add new address
  const handleAddNewAddress = () => {
    setShowNewAddressForm(true);
    setSelectedAddressId("");
    setTemporaryAddresses([]);
    setAddressData({
      fullName: "",
      address: "",
      city: "",
      place: "",
      state: "",
      district: "",
      pincode: "",
      phoneNumber: "",
      email: user?.email || "",
      notes: "",
    });
  };

  // Handle Order Submit
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentType) {
      alert("Please select a payment method");
      return;
    }

    if (!selectedAddressId) {
      alert("Please select a delivery address");
      return;
    }

    try {
      setIsProcessing(true);
      
      console.log("Submitting order with:", {
        paymentType,
        addressData,
        selectedAddressId,
        cartProducts: cartProducts.length,
        totalPrice
      });

      const response = await axiosinstance.post(
        "/payment/create-payment-intent",
        {
          cartProducts,
          totalPrice,
          addressData: addressData,
          selectedAddressId: selectedAddressId,
          paymentMethod: paymentType,
        },
        { withCredentials: true }
      );

      console.log("Backend response:", response.data);

      if (paymentType === "cod") {
        // Handle Cash on Delivery
        if (response.data.redirectUrl) {
          setCartProducts([]); // Clear cart on successful COD order
          navigate(response.data.redirectUrl);
        } else {
          alert("Order placed successfully!");
          setCartProducts([]);
          navigate("/orders"); // or wherever you want to redirect
        }
      } else if (paymentType === "online") {
        // Handle PhonePe Payment
        if (!response.data.redirectUrl) {
          throw new Error("No payment URL received from server");
        }

        const tokenUrl = response.data.redirectUrl;
        console.log("PhonePe token URL:", tokenUrl);

        // Check if PhonePe SDK is loaded
        if (!window.PhonePeCheckout || !window.PhonePeCheckout.transact) {
          throw new Error("PhonePe SDK not loaded properly");
        }

        // Define callback function
        const callback = (response) => {
          console.log("PhonePe callback response:", response);
          setIsProcessing(false);

          if (response === "USER_CANCEL") {
            alert("Payment cancelled by user");
          } else if (response === "CONCLUDED") {
            alert("Payment successful! Your order has been placed.");
             // Clear cart on successful payment
            navigate("/orders"); // Redirect to orders page
          } else {
            console.log("PhonePe response:", response);
            // Handle other responses if needed
            alert("Payment completed. Please check your order status.");
          }
        };

        console.log("Initiating PhonePe transaction...");
        
        // Call PhonePe transact method
        try {
          window.PhonePeCheckout.transact({
            tokenUrl: tokenUrl,
            callback: callback
          });
        } catch (phonePeError) {
          console.error("PhonePe transact error:", phonePeError);
          throw new Error("Failed to initialize PhonePe payment");
        }
      }

    } catch (error) {
      console.error("Order submission error:", error);
      setIsProcessing(false);
      
      // More specific error messages
      if (error.message.includes("PhonePe")) {
        alert("Payment gateway error: " + error.message + ". Please try again or use Cash on Delivery.");
      } else if (error.response) {
        alert("Server error: " + (error.response.data?.message || "Please try again"));
      } else if (error.request) {
        alert("Network error: Please check your connection and try again");
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  const isFormDisabled =
    !cartProducts.length ||
    pincodeLoading ||
    (!selectedAddressId && allAddresses.length > 0) ||
    !paymentType ||
    isProcessing ||
    (paymentType === "online" && !phonePeLoaded);

  return (
    <section
      className="flat-spacing-11"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <div className="container">
        <div className="tf-page-cart-wrap layout-2">
          <div className="tf-page-cart-item">
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "30px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                marginBottom: "20px",
              }}
            >
              <h5
                className="fw-6 mb_30"
                style={{ color: "#2c3e50", fontSize: "24px" }}
              >
                📍 Delivery Address
              </h5>

              {/* Address List */}
              {allAddresses?.length > 0 && (
                <div className="address-selection mb_30">
                  <div
                    className="address-grid"
                    style={{
                      display: "grid",
                      gap: "16px",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(300px, 1fr))",
                    }}
                  >
                    {allAddresses?.map((address, index) => {
                      console.log("address", address);
                      return (
                        <AddressList
                          key={index}
                          address={address}
                          index={index}
                          selectedAddressId={selectedAddressId}
                          handleAddressSelect={handleAddressSelect}
                        />
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddNewAddress}
                    style={{
                      marginTop: "20px",
                      padding: "12px 24px",
                      backgroundColor: "#000000",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#0056b3")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "#000000")
                    }
                  >
                    ➕ Add New Address
                  </button>
                </div>
              )}

              {
                allAddresses.length<=0 && (
                     <button
                    type="button"
                    onClick={handleAddNewAddress}
                    style={{
                      marginTop: "20px",
                      padding: "12px 24px",
                      backgroundColor: "#000000",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#0056b3")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "#000000")
                    }
                  >
                    ➕ Add New Address
                  </button>
                )
              }

              {/* New Address Form */}
              {showNewAddressForm && (
                <NewAddressForm
                  allAddresses={allAddresses}
                  setShowNewAddressForm={setShowNewAddressForm}
                  addressData={addressData}
                  setAddressData={setAddressData}
                  setSelectedAddressId={setSelectedAddressId}
                  setIsAddingNewAddress={setIsAddingNewAddress}
                  setTemporaryAddresses={setTemporaryAddresses}
                />
              )}
            </div>
          </div>

          <div className="tf-page-cart-footer">
            <div
              className="tf-cart-footer-inner"
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "30px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <h5
                className="fw-6 mb_25"
                style={{ color: "#2c3e50", fontSize: "24px" }}
              >
                🛒 Your Order
              </h5>

              <form onSubmit={handleOrderSubmit}>
                <div
                  className="wrap-checkout-product"
                  style={{ marginBottom: "25px" }}
                >
                  {cartProducts.map((elm, i) => (
                    <div
                      key={i}
                      className="checkout-product-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "15px",
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      <figure
                        className="img-product"
                        style={{
                          margin: "0 15px 0 0",
                          position: "relative",
                          width: "80px",
                          height: "80px",
                        }}
                      >
                        <img
                          alt="product"
                          src={elm.product.variants[0].images[0].url}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            backgroundColor: "#DB1215",
                            color: "white",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          {elm.quantity}
                        </span>
                      </figure>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#2c3e50",
                            marginBottom: "4px",
                          }}
                        >
                          {elm.productId.title}
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#6c757d",
                            marginBottom: "8px",
                          }}
                        >
                          {elm.product.variants[0].size.value}
                        </div>
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "#000000",
                          }}
                        >
                          ₹
                          {(
                            elm.product.variants[0].pricing.price * elm.quantity
                          ).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {!cartProducts.length && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "#6c757d",
                    }}
                  >
                    <div style={{ fontSize: "48px", marginBottom: "20px" }}>
                      🛒
                    </div>
                    <div style={{ fontSize: "18px", marginBottom: "20px" }}>
                      Your cart is empty
                    </div>
                    <Link
                      to={`/product-detail`}
                      style={{
                        display: "inline-block",
                        padding: "12px 24px",
                        backgroundColor: "#000000",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "8px",
                        fontWeight: "500",
                        transition: "all 0.3s ease",
                      }}
                    >
                      🛍️ Explore Products
                    </Link>
                  </div>
                )}

                {cartProducts.length > 0 && (
                  <>
                    {/* Payment Method Selection */}
                    <div
                      style={{
                        marginBottom: "25px",
                        padding: "20px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "12px",
                        border: "1px solid #e9ecef",
                      }}
                    >
                      <h6
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2c3e50",
                          marginBottom: "15px",
                        }}
                      >
                        💳 Select Payment Method
                      </h6>

                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                          flexWrap: "wrap",
                        }}
                      >
                        {/* PhonePe Option */}
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "15px 20px",
                            backgroundColor:
                              paymentType === "online" ? "#e3f2fd" : "white",
                            border:
                              paymentType === "online"
                                ? "2px solid #2196f3"
                                : "2px solid #e9ecef",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            minWidth: "200px",
                            gap: "12px",
                            opacity: phonePeLoaded ? 1 : 0.7,
                          }}
                          onMouseOver={(e) => {
                            if (paymentType !== "online" && phonePeLoaded) {
                              e.target.style.borderColor = "#2196f3";
                              e.target.style.backgroundColor = "#f5f5f5";
                            }
                          }}
                          onMouseOut={(e) => {
                            if (paymentType !== "online") {
                              e.target.style.borderColor = "#e9ecef";
                              e.target.style.backgroundColor = "white";
                            }
                          }}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="online"
                            checked={paymentType === "online"}
                            onChange={(e) => setPaymentType(e.target.value)}
                            style={{ marginRight: "8px" }}
                            disabled={!phonePeLoaded}
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                          >
                            <path
                              fill="#4527a0"
                              d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5	V37z"
                            ></path>
                            <path
                              fill="#fff"
                              d="M32.267,20.171c0-0.681-0.584-1.264-1.264-1.264h-2.334l-5.35-6.25	c-0.486-0.584-1.264-0.778-2.043-0.584l-1.848,0.584c-0.292,0.097-0.389,0.486-0.195,0.681l5.836,5.666h-8.851	c-0.292,0-0.486,0.195-0.486,0.486v0.973c0,0.681,0.584,1.506,1.264,1.506h1.972v4.305c0,3.502,1.611,5.544,4.723,5.544	c0.973,0,1.378-0.097,2.35-0.486v3.112c0,0.875,0.681,1.556,1.556,1.556h0.786c0.292,0,0.584-0.292,0.584-0.584V21.969h2.812	c0.292,0,0.486-0.195,0.486-0.486V20.171z M26.043,28.413c-0.584,0.292-1.362,0.389-1.945,0.389c-1.556,0-2.097-0.778-2.097-2.529	v-4.305h4.043V28.413z"
                            ></path>
                          </svg>
                          
                          <div>
                            <div
                              style={{ fontWeight: "600", color: "#2c3e50" }}
                            >
                              PhonePe {!phonePeLoaded && "(Loading...)"}
                            </div>
                            <div style={{ fontSize: "12px", color: "#6c757d" }}>
                              Pay securely online: <br></br>
                             <span ></span> Credit Card, Debit Card, UPI, Net Banking, and Wallets
                            </div>
                          </div>
                        </label>

                        {/* Cash on Delivery Option */}
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "15px 20px",
                            backgroundColor:
                              paymentType === "cod" ? "#e8f5e8" : "white",
                            border:
                              paymentType === "cod"
                                ? "2px solid #4caf50"
                                : "2px solid #e9ecef",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            minWidth: "200px",
                            gap: "12px",
                          }}
                          onMouseOver={(e) => {
                            if (paymentType !== "cod") {
                              e.target.style.borderColor = "#4caf50";
                              e.target.style.backgroundColor = "#f5f5f5";
                            }
                          }}
                          onMouseOut={(e) => {
                            if (paymentType !== "cod") {
                              e.target.style.borderColor = "#e9ecef";
                              e.target.style.backgroundColor = "white";
                            }
                          }}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentType === "cod"}
                            onChange={(e) => setPaymentType(e.target.value)}
                            style={{ marginRight: "8px" }}
                          />
                          <Banknote size={20} color="#4caf50" />
                          <div>
                            <div
                              style={{ fontWeight: "600", color: "#2c3e50" }}
                            >
                              Cash on Delivery
                            </div>
                            <div style={{ fontSize: "12px", color: "#6c757d" }}>
                             Pay on delivery: <br></br>
                            <span ></span> Pay the amount when you receive the product
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Discount Code Section */}
                    <div
                      style={{
                        padding: "20px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        marginBottom: "25px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "15px",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Enter discount code"
                          style={{
                            flex: 1,
                            padding: "12px",
                            border: "2px solid #e9ecef",
                            borderRadius: "8px",
                            fontSize: "16px",
                          }}
                        />
                        <button
                          type="button"
                          style={{
                            padding: "12px 20px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Apply Coupon
                        </button>
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "20px 0",
                        borderTop: "2px solid #e9ecef",
                        marginBottom: "25px",
                      }}
                    >
                      <h6
                        style={{
                          fontSize: "20px",
                          fontWeight: "600",
                          color: "#2c3e50",
                          margin: 0,
                        }}
                      >
                        💰 Total Amount
                      </h6>
                      <h6
                        style={{
                          fontSize: "24px",
                          fontWeight: "700",
                          color: "#000000",
                          margin: 0,
                        }}
                      >
                        ₹{totalPrice}
                      </h6>
                    </div>

                    {/* Terms and Conditions */}
                    <div style={{ marginBottom: "25px" }}>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          lineHeight: "1.5",
                          marginBottom: "15px",
                        }}
                      >
                        🔒 Your personal data will be used to process your
                        order, support your experience throughout this website,
                        and for other purposes described in our{" "}
                        <Link
                          to={`/privacy-policy`}
                          style={{
                            color: "#000000",
                            textDecoration: "underline",
                          }}
                        >
                          privacy policy
                        </Link>
                        .
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                        }}
                      >
                        <input
                          required
                          type="checkbox"
                          id="check-agree"
                          style={{
                            marginTop: "4px",
                            transform: "scale(1.2)",
                          }}
                        />
                        <label
                          htmlFor="check-agree"
                          style={{
                            fontSize: "14px",
                            color: "#6c757d",
                            lineHeight: "1.5",
                            cursor: "pointer",
                          }}
                        >
                          I have read and agree to the website{" "}
                          <Link
                            to={`/terms-conditions`}
                            style={{
                              color: "#000000",
                              textDecoration: "underline",
                            }}
                          >
                            terms and conditions
                          </Link>
                          .
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isFormDisabled}
                      style={{
                        width: "100%",
                        padding: "18px",
                        backgroundColor: isFormDisabled ? "#6c757d" : "#000000",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "18px",
                        fontWeight: "600",
                        cursor: isFormDisabled ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        boxShadow: "0 4px 15px rgba(0,123,255,0.3)",
                      }}
                      onMouseOver={(e) => {
                        if (!e.target.disabled) {
                          e.target.style.backgroundColor = "#0056b3";
                          e.target.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!e.target.disabled) {
                          e.target.style.backgroundColor = "#000000";
                          e.target.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      {isProcessing ? (
                        <>🔄 Processing...</>
                      ) : pincodeLoading ? (
                        <>🔄 Loading...</>
                      ) : !selectedAddressId && allAddresses.length > 0 ? (
                        <>📍 Select an Address First</>
                      ) : !paymentType ? (
                        <>💳 Select Payment Method</>
                      ) : paymentType === "online" && !phonePeLoaded ? (
                        <>🔄 Loading Payment Gateway...</>
                      ) : paymentType === "online" ? (
                        <>🚀 Pay with PhonePe - ₹{totalPrice}</>
                      ) : (
                        <>🚀 Place COD Order - ₹{totalPrice}</>
                      )}
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}