import { useContextElement } from "@/context/Context";
import { axiosinstance } from "@/utlis/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Checkout() {
  const [addressData, setAddressData] = useState({
    fullName: '',
    address: '',
    city: '',
    place:'',
    state: '',
    district: '',
    pincode: '',
    phoneNumber: '',
    email: '',
    notes: ''
  });

  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://mercury.phonepe.com/web/bundle/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // cleanup on unmount
    };
  }, []);

  const { cartProducts, setCartProducts, totalPrice } = useContextElement();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle pincode change and API call
  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    setAddressData(prev => ({ ...prev, pincode }));
    setPincodeError('');

    if (pincode.length === 6 && /^\d{6}$/.test(pincode)) {
      setPincodeLoading(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();

        if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          // Find Sub Post Office or take the first one
          const subPostOffice = data[0].PostOffice.find(po => po.BranchType === 'Sub Post Office') 
            || data[0].PostOffice[0];

          setAddressData(prev => ({
            ...prev,
            place: subPostOffice.Name || '',
            state: subPostOffice.State || '',
            district: subPostOffice.District || '',
            city: subPostOffice.Block || subPostOffice.Name || ''
          }));
        } else {
          setPincodeError('Invalid pincode or no data found');
        }
      } catch (error) {
        console.error('Error fetching pincode data:', error);
        setPincodeError('Error fetching location data');
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const initiatePayment = async (e) => {
    e.preventDefault();
    alert("Redirecting to payment gateway");
    
    if (!cartProducts.length) {
      alert("Your cart is empty");
      return;
    }

    // Validate required fields
    const requiredFields = ['fullName', 'address', 'city', 'state','place', 'district', 'pincode', 'phoneNumber', 'email'];
    const missingFields = requiredFields.filter(field => !addressData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      // Call the backend api to create order and get the order id and other details
      const response = await axiosinstance.post('/payment/create-payment-intent', {
        cartProducts,
        totalPrice,
        addressData
      }, { withCredentials: true });

      console.log(response);
      
      if (response?.data?.redirectUrl) {
        const tokenUrl = response?.data?.redirectUrl;
        
        function callback(response) {
          console.log("Payment callback response..........:", response);
          if (response === 'USER_CANCEL') {
            alert("Payment cancelled by user");
            return;
          } else if (response === 'CONCLUDED') {
            alert("Payment successful");
            return;
          }
        }
        
        window.PhonePeCheckout.transact({ tokenUrl });
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert("Error initiating payment");
    }
  };

  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="tf-page-cart-wrap layout-2">
          <div className="tf-page-cart-item">
            <h5 className="fw-5 mb_20">Billing details</h5>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="form-checkout"
            >
              <fieldset className="box fieldset">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  required
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={addressData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </fieldset>

              <fieldset className="box fieldset">
                <label htmlFor="address">Address *</label>
                <input
                  required
                  type="text"
                  id="address"
                  name="address"
                  value={addressData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your complete address"
                />
              </fieldset>

              <fieldset className="box fieldset">
                <label htmlFor="pincode">Pin Code *</label>
                <input
                  required
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={addressData.pincode}
                  onChange={handlePincodeChange}
                  placeholder="Enter 6-digit pincode"
                  maxLength="6"
                />
                {pincodeLoading && <small className="text-info">Fetching location details...</small>}
                {pincodeError && <small className="text-danger">{pincodeError}</small>}
              </fieldset>

              <div className="box grid-2">
                <fieldset className="fieldset">
                  <label htmlFor="state">State *</label>
                  <input
                    required
                    type="text"
                    id="state"
                    name="state"
                    value={addressData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    readOnly={pincodeLoading}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <label htmlFor="district">District *</label>
                  <input
                    required
                    type="text"
                    id="district"
                    name="district"
                    value={addressData.district}
                    onChange={handleInputChange}
                    placeholder="District"
                    readOnly={pincodeLoading}
                  />
                </fieldset>
              </div>
              <div className="box grid-2">
                 <fieldset className="fieldset">
                  <label htmlFor="state">City/Block *</label>
                  <input
                    required
                    type="text"
                    id="city"
                    name="city"
                    value={addressData.city}
                    onChange={handleInputChange}
                    
                    placeholder="City or Block name"
                  />
                </fieldset>
                 <fieldset className="fieldset">
                  <label htmlFor="state">Place *</label>
                  <input
                    required
                    type="text"
                    id="place"
                    name="place"
                    value={addressData.place}
                    onChange={handleInputChange}
                    
                    placeholder="Place"
                  />
                </fieldset>
              </div>
             

              <fieldset className="box fieldset">
                <label htmlFor="phoneNumber">Phone Number *</label>
                <input
                  required
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={addressData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                />
              </fieldset>

              <fieldset className="box fieldset">
                <label htmlFor="email">Email *</label>
                <input
                  required
                  type="email"
                  id="email"
                  name="email"
                  value={addressData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                />
              </fieldset>

              
            </form>
          </div>

          <div className="tf-page-cart-footer">
            <div className="tf-cart-footer-inner">
              <h5 className="fw-5 mb_20">Your order</h5>
              <form
                onSubmit={initiatePayment}
                className="tf-page-cart-checkout widget-wrap-checkout"
              >
                <ul className="wrap-checkout-product">
                  {cartProducts.map((elm, i) => (
                    <li key={i} className="checkout-product-item">
                      <figure className="img-product">
                        <img
                          alt="product"
                          src={elm.product.variants[0].images[0].url}
                          width={720}
                          height={1005}
                        />
                        <span className="quantity">{elm.quantity}</span>
                      </figure>
                      <div className="content">
                        <div className="info">
                          <p className="name">{elm.productId.title}</p>
                          <span className="variant">Brown / M</span>
                        </div>
                        <span className="price">
                          &#8377;{(elm.product.variants[0].pricing.price * elm.quantity).toFixed(2)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                
                {!cartProducts.length && (
                  <div className="container">
                    <div className="row align-items-center mt-5 mb-5">
                      <div className="col-12 fs-18">
                        Your shop cart is empty
                      </div>
                      <div className="col-12 mt-3">
                        <Link
                          to={`/product-detail`}
                          className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                          style={{ width: "fit-content" }}
                        >
                          Explore Products!
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="coupon-box">
                  <input type="text" placeholder="Discount code" />
                  <a
                    href="#"
                    className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                  >
                    Apply
                  </a>
                </div>
                
                <div className="d-flex justify-content-between line pb_20">
                  <h6 className="fw-5">Total</h6>
                  <h6 className="total fw-5">&#8377;{totalPrice}</h6>
                </div>
                
                <div className="wd-check-payment">
                  <p className="text_black-2 mb_20">
                    Your personal data will be used to process your order,
                    support your experience throughout this website, and for
                    other purposes described in our
                    <Link
                      to={`/privacy-policy`}
                      className="text-decoration-underline"
                    >
                      privacy policy
                    </Link>
                    .
                  </p>
                  <div className="box-checkbox fieldset-radio mb_20">
                    <input
                      required
                      type="checkbox"
                      id="check-agree"
                      className="tf-check"
                    />
                    <label htmlFor="check-agree" className="text_black-2">
                      I have read and agree to the website
                      <Link
                        to={`/terms-conditions`}
                        className="text-decoration-underline"
                      >
                        terms and conditions
                      </Link>
                      .
                    </label>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center"
                  disabled={!cartProducts.length || pincodeLoading}
                >
                  Place order
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}