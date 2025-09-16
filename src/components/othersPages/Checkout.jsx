import { useContextElement } from "@/context/Context";
import { axiosinstance } from "@/utlis/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {Locate} from "lucide-react"

export default function Checkout() {
  const [addressData, setAddressData] = useState({
    fullName: '',
    address: '',
    city: '',
    place: '',
    state: '',
    district: '',
    pincode: '',
    phoneNumber: '',
    email: '',
    notes: ''
  });

  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(true);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [temporaryAddresses, setTemporaryAddresses] = useState([]);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const { cartProducts, setCartProducts, totalPrice, user } = useContextElement();

  // Combine user addresses with temporary addresses
  const allAddresses = [
    ...(user?.address || []),
    ...temporaryAddresses
  ];

  // Check if user has addresses and initialize
  useEffect(() => {
    if (allAddresses.length > 0) {
      setIsAddingNewAddress(false);
    } else {
      setIsAddingNewAddress(true);
      setShowNewAddressForm(true);
    }
  }, [user, temporaryAddresses]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://mercury.phonepe.com/web/bundle/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Handle address selection
  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setIsAddingNewAddress(false);
    setShowNewAddressForm(false);
    
    // Find address from combined list
    const selectedAddress = allAddresses.find(addr => 
      (addr._id || addr.id || addr.tempId) === addressId
    );
    
    if (selectedAddress) {
      setAddressData({
        fullName: selectedAddress.fullName || '',
        address: selectedAddress.address || '',
        city: selectedAddress.city || '',
        place: selectedAddress.place || '',
        state: selectedAddress.state || '',
        district: selectedAddress.district || '',
        pincode: selectedAddress.pincode || '',
        phoneNumber: selectedAddress.phoneNumber || '',
        email: selectedAddress.email || user?.email || '',
        notes: selectedAddress.notes || ''
      });
    }
  };

  // Handle add new address
  const handleAddNewAddress = () => {
    setShowNewAddressForm(true);
    setSelectedAddressId('');
    // Reset form for new address
    setAddressData({
      fullName: '',
      address: '',
      city: '',
      place: '',
      state: '',
      district: '',
      pincode: '',
      phoneNumber: '',
      email: user?.email || '',
      notes: ''
    });
  };

  // Handle save new address to temporary list
  const handleSaveAddress = () => {
    // Validate required fields
    const requiredFields = ['fullName', 'address', 'city', 'state', 'place', 'district', 'pincode', 'phoneNumber', 'email'];
    const missingFields = requiredFields.filter(field => !addressData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Create temporary address with unique ID
    const newTempAddress = {
      ...addressData,
      tempId: `temp_${Date.now()}`,
      isTemporary: true
    };

    // Add to temporary addresses
    setTemporaryAddresses(prev => [...prev, newTempAddress]);
    
    // Select this address
    setSelectedAddressId(newTempAddress.tempId);
    setShowNewAddressForm(false);
    setIsAddingNewAddress(false);
  };

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
    
    if (!cartProducts.length) {
      alert("Your cart is empty");
      return;
    }

    if (!selectedAddressId && allAddresses.length === 0) {
      alert("Please add an address first");
      return;
    }

    if (!selectedAddressId && allAddresses.length > 0) {
      alert("Please select an address");
      return;
    }

    try {
      alert("Redirecting to payment gateway");
      
      const response = await axiosinstance.post('/payment/create-payment-intent', {
        cartProducts,
        totalPrice,
        addressData: addressData,
        selectedAddressId: selectedAddressId
      }, { withCredentials: true });

      console.log(response);
      
      if (response?.data?.redirectUrl) {
        const tokenUrl = response?.data?.redirectUrl;
        
        function callback(response) {
          console.log("Payment callback response:", response);
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
    <section className="flat-spacing-11" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container">
        <div className="tf-page-cart-wrap layout-2">
          <div className="tf-page-cart-item">
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '30px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              marginBottom: '20px'
            }}>
              <h5 className="fw-6 mb_30" style={{ color: '#2c3e50', fontSize: '24px' }}>
                📍 Delivery Address
              </h5>
              
              {/* Address List */}
              {allAddresses.length > 0 && (
                <div className="address-selection mb_30">
                  <div className="address-grid" style={{ 
                    display: 'grid', 
                    gap: '16px',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
                  }}>
                    {allAddresses.map((address, index) => {
                      const addressId = address._id || address.id || address.tempId || index;
                      const isSelected = selectedAddressId === addressId;
                      
                      return (
                        <div 
                          key={addressId} 
                          className={`address-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleAddressSelect(addressId)}
                          style={{
                            border: isSelected ? '2px solid #000000' : '2px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '20px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            backgroundColor: isSelected ? '#f8f9ff' : 'white',
                            position: 'relative',
                            boxShadow: isSelected ? '0 4px 15px rgba(0,123,255,0.2)' : '0 2px 8px rgba(0,0,0,0.05)'
                          }}
                        >
                          {/* Selection indicator */}
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: '2px solid #000000',
                            backgroundColor: isSelected ? '#000000' : 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {isSelected && (
                              <div style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: 'white',
                                borderRadius: '50%'
                              }} />
                            )}
                          </div>

                          {/* Temporary address badge */}
                          {address.isTemporary && (
                            <div style={{
                              position: 'absolute',
                              top: '12px',
                              left: '12px',
                              backgroundColor: '#28a745',
                              color: 'white',
                              fontSize: '10px',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontWeight: '600'
                            }}>
                              NEW
                            </div>
                          )}
                          
                          <div className="address-content" style={{ paddingTop: address.isTemporary ? '20px' : '0' }}>
                          
                            <div style={{ 
                              fontSize: '18px', 
                              fontWeight: '600', 
                              color: '#2c3e50', 
                              marginBottom: '8px' 
                            }}>
                              {address.fullName}
                            </div>
                            <div style={{ 
                              color: '#6c757d', 
                              lineHeight: '1.5',
                              marginBottom: '4px' 
                            }}>
                             {address.address}
                            </div>
                            <div style={{ 
                              color: '#6c757d', 
                              lineHeight: '1.5',
                              marginBottom: '4px' 
                            }}>
                               {address.place}, {address.city}
                            </div>
                            <div style={{ 
                              color: '#6c757d', 
                              lineHeight: '1.5',
                              marginBottom: '8px' 
                            }}>
                               {address.district}, {address.state} - {address.pincode}
                            </div>
                            <div style={{ 
                              color: '#000000', 
                              fontSize: '14px',
                              fontWeight: '500' 
                            }}>
                              📞 {address.phoneNumber}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleAddNewAddress}
                    style={{
                      marginTop: '20px',
                      padding: '12px 24px',
                      backgroundColor: '#000000',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#000000'}
                  >
                    ➕ Add New Address
                  </button>
                </div>
              )}

              {/* New Address Form */}
              {showNewAddressForm && (
                <div className="new-address-form" style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '25px',
                  marginTop: allAddresses.length > 0 ? '20px' : '0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '25px' 
                  }}>
                    <h6 style={{ 
                      fontSize: '20px', 
                      fontWeight: '600', 
                      color: '#2c3e50',
                      margin: 0
                    }}>
                      📝 {allAddresses.length > 0 ? 'Add New Address' : 'Add Your Address'}
                    </h6>
                    {allAddresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="form-checkout"
                    style={{ display: 'grid', gap: '20px' }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <fieldset style={{ margin: 0 }}>
                        <label htmlFor="fullName" style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: '500', 
                          color: '#2c3e50' 
                        }}>
                          Full Name *
                        </label>
                        <input
                          required
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={addressData.fullName}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '16px',
                            transition: 'border-color 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#000000'}
                          onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                      </fieldset>

                      <fieldset style={{ margin: 0 }}>
                        <label htmlFor="phoneNumber" style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: '500', 
                          color: '#2c3e50' 
                        }}>
                          Phone Number *
                        </label>
                        <input
                          required
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={addressData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          pattern="[0-9]{10}"
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '16px',
                            transition: 'border-color 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#000000'}
                          onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                      </fieldset>
                    </div>

                    <fieldset style={{ margin: 0 }}>
                      <label htmlFor="address" style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '500', 
                        color: '#2c3e50' 
                      }}>
                        Complete Address *
                      </label>
                      <textarea
                        required
                        id="address"
                        name="address"
                        value={addressData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your complete address (House no, Street, Area)"
                        rows="3"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e9ecef',
                          borderRadius: '8px',
                          fontSize: '16px',
                          transition: 'border-color 0.3s ease',
                          resize: 'vertical'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#000000'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                    </fieldset>

                    <fieldset style={{ margin: 0 }}>
                      <label htmlFor="pincode" style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '500', 
                        color: '#2c3e50' 
                      }}>
                        PIN Code *
                      </label>
                      <input
                        required
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={addressData.pincode}
                        onChange={handlePincodeChange}
                        placeholder="Enter 6-digit pincode"
                        maxLength="6"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e9ecef',
                          borderRadius: '8px',
                          fontSize: '16px',
                          transition: 'border-color 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#000000'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                      {pincodeLoading && (
                        <small style={{ color: '#000000', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                          🔄 Fetching location details...
                        </small>
                      )}
                      {pincodeError && (
                        <small style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                          ❌ {pincodeError}
                        </small>
                      )}
                    </fieldset>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <fieldset style={{ margin: 0 }}>
                        <label htmlFor="state" style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: '500', 
                          color: '#2c3e50' 
                        }}>
                          State *
                        </label>
                        <input
                          required
                          type="text"
                          id="state"
                          name="state"
                          value={addressData.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          readOnly={pincodeLoading}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '16px',
                            backgroundColor: pincodeLoading ? '#f8f9fa' : 'white'
                          }}
                        />
                      </fieldset>
                      
                      <fieldset style={{ margin: 0 }}>
                        <label htmlFor="district" style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: '500', 
                          color: '#2c3e50' 
                        }}>
                          District *
                        </label>
                        <input
                          required
                          type="text"
                          id="district"
                          name="district"
                          value={addressData.district}
                          onChange={handleInputChange}
                          placeholder="District"
                          readOnly={pincodeLoading}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '16px',
                            backgroundColor: pincodeLoading ? '#f8f9fa' : 'white'
                          }}
                        />
                      </fieldset>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <fieldset style={{ margin: 0 }}>
                        <label htmlFor="city" style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: '500', 
                          color: '#2c3e50' 
                        }}>
                          City/Block *
                        </label>
                        <input
                          required
                          type="text"
                          id="city"
                          name="city"
                          value={addressData.city}
                          onChange={handleInputChange}
                          placeholder="City or Block name"
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '16px',
                            transition: 'border-color 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#000000'}
                          onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                      </fieldset>
                      
                      <fieldset style={{ margin: 0 }}>
                        <label htmlFor="place" style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: '500', 
                          color: '#2c3e50' 
                        }}>
                          Place *
                        </label>
                        <input
                          required
                          type="text"
                          id="place"
                          name="place"
                          value={addressData.place}
                          onChange={handleInputChange}
                          placeholder="Place"
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '16px',
                            transition: 'border-color 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#000000'}
                          onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                      </fieldset>
                    </div>

                    <fieldset style={{ margin: 0 }}>
                      <label htmlFor="email" style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '500', 
                        color: '#2c3e50' 
                      }}>
                        Email *
                      </label>
                      <input
                        required
                        type="email"
                        id="email"
                        name="email"
                        value={addressData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e9ecef',
                          borderRadius: '8px',
                          fontSize: '16px',
                          transition: 'border-color 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#000000'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                    </fieldset>

                    <button
                      type="button"
                      onClick={handleSaveAddress}
                      disabled={pincodeLoading}
                      style={{
                        padding: '15px 30px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: pincodeLoading ? 'not-allowed' : 'pointer',
                        opacity: pincodeLoading ? 0.6 : 1,
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                      }}
                      onMouseOver={(e) => !pincodeLoading && (e.target.style.backgroundColor = '#218838')}
                      onMouseOut={(e) => !pincodeLoading && (e.target.style.backgroundColor = '#28a745')}
                    >
                      💾 Save Address
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          <div className="tf-page-cart-footer">
            <div className="tf-cart-footer-inner" style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h5 className="fw-6 mb_25" style={{ color: '#2c3e50', fontSize: '24px' }}>
                🛒 Your Order
              </h5>
              
              <form onSubmit={initiatePayment}>
                <div className="wrap-checkout-product" style={{ marginBottom: '25px' }}>
                  {cartProducts.map((elm, i) => (
                    <div key={i} className="checkout-product-item" style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '15px',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      marginBottom: '15px',
                      backgroundColor: '#f8f9fa'
                    }}>
                      <figure className="img-product" style={{ 
                        margin: '0 15px 0 0',
                        position: 'relative',
                        width: '80px',
                        height: '80px'
                      }}>
                        <img
                          alt="product"
                          src={elm.product.variants[0].images[0].url}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '6px'
                          }}
                        />
                        <span style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          backgroundColor: '#DB1215',
                          color: 'white',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {elm.quantity}
                        </span>
                      </figure>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: '600', 
                          color: '#2c3e50',
                          marginBottom: '4px' 
                        }}>
                          {elm.productId.title}
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#6c757d',
                          marginBottom: '8px' 
                        }}>
                         { elm.product.variants[0].size.value}
                        </div>
                        <div style={{ 
                          fontSize: '18px', 
                          fontWeight: '700', 
                          color: '#000000' 
                        }}>
                          ₹{(elm.product.variants[0].pricing.price * elm.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {!cartProducts.length && (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#6c757d'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛒</div>
                    <div style={{ fontSize: '18px', marginBottom: '20px' }}>
                      Your cart is empty
                    </div>
                    <Link
                      to={`/product-detail`}
                      style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        backgroundColor: '#000000',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      🛍️ Explore Products
                    </Link>
                  </div>
                )}
                
                {cartProducts.length > 0 && (
                  <>
                    <div style={{
                      padding: '20px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      marginBottom: '25px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '15px'
                      }}>
                        <input 
                          type="text" 
                          placeholder="Enter discount code" 
                          style={{
                            flex: 1,
                            padding: '12px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '16px'
                          }}
                        />
                        <button
                          type="button"
                          style={{
                            padding: '12px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Apply Coupon
                        </button>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '20px 0',
                      borderTop: '2px solid #e9ecef',
                      marginBottom: '25px'
                    }}>
                      <h6 style={{ 
                        fontSize: '20px', 
                        fontWeight: '600', 
                        color: '#2c3e50',
                        margin: 0 
                      }}>
                        💰 Total Amount
                      </h6>
                      <h6 style={{ 
                        fontSize: '24px', 
                        fontWeight: '700', 
                        color: '#000000',
                        margin: 0 
                      }}>
                        ₹{totalPrice}
                      </h6>
                    </div>
                    
                    <div style={{ marginBottom: '25px' }}>
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#6c757d', 
                        lineHeight: '1.5',
                        marginBottom: '15px' 
                      }}>
                        🔒 Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{' '}
                        <Link
                          to={`/privacy-policy`}
                          style={{ 
                            color: '#000000', 
                            textDecoration: 'underline' 
                          }}
                        >
                          privacy policy
                        </Link>
                        .
                      </p>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: '10px' 
                      }}>
                        <input
                          required
                          type="checkbox"
                          id="check-agree"
                          style={{ 
                            marginTop: '4px',
                            transform: 'scale(1.2)'
                          }}
                        />
                        <label 
                          htmlFor="check-agree" 
                          style={{ 
                            fontSize: '14px', 
                            color: '#6c757d',
                            lineHeight: '1.5',
                            cursor: 'pointer'
                          }}
                        >
                          I have read and agree to the website{' '}
                          <Link
                            to={`/terms-conditions`}
                            style={{ 
                              color: '#000000', 
                              textDecoration: 'underline' 
                            }}
                          >
                            terms and conditions
                          </Link>
                          .
                        </label>
                      </div>
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={!cartProducts.length || pincodeLoading || (!selectedAddressId && allAddresses.length > 0)}
                      style={{
                        width: '100%',
                        padding: '18px',
                        backgroundColor: (!cartProducts.length || pincodeLoading || (!selectedAddressId && allAddresses.length > 0)) ? '#6c757d' : '#000000',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: (!cartProducts.length || pincodeLoading || (!selectedAddressId && allAddresses.length > 0)) ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        boxShadow: '0 4px 15px rgba(0,123,255,0.3)'
                      }}
                      onMouseOver={(e) => {
                        if (!e.target.disabled) {
                          e.target.style.backgroundColor = '#0056b3';
                          e.target.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!e.target.disabled) {
                          e.target.style.backgroundColor = '#000000';
                          e.target.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {pincodeLoading ? (
                        <>🔄 Loading...</>
                      ) : !selectedAddressId && allAddresses.length > 0 ? (
                        <>📍 Select an Address First</>
                      ) : (
                        <>🚀 Place Order - ₹{totalPrice}</>
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