import React from "react";
import { useState } from "react";

const NewAddressForm = ({
  allAddresses,
  addressData,
  setShowNewAddressForm,
  setAddressData,
  setSelectedAddressId,setIsAddingNewAddress,
  setTemporaryAddresses
}) => {
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState("");
  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    setAddressData((prev) => ({ ...prev, pincode }));
    setPincodeError("");

    if (pincode.length === 6 && /^\d{6}$/.test(pincode)) {
      setPincodeLoading(true);
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const data = await response.json();

        if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const subPostOffice =
            data[0].PostOffice.find(
              (po) => po.BranchType === "Sub Post Office"
            ) || data[0].PostOffice[0];

          setAddressData((prev) => ({
            ...prev,
            place: subPostOffice.Name || "",
            state: subPostOffice.State || "",
            district: subPostOffice.District || "",
            city: subPostOffice.Block || subPostOffice.Name || "",
          }));
        } else {
          setPincodeError("Invalid pincode or no data found");
        }
      } catch (error) {
        console.error("Error fetching pincode data:", error);
        setPincodeError("Error fetching location data");
      } finally {
        setPincodeLoading(false);
      }
    }
  };


  const handleSaveAddress = () => {
    // Validate required fields
    const requiredFields = [
      "fullName",
      "address",
      "city",
      "state",
      "place",
      "district",
      "pincode",
      "phoneNumber",
      "email",
    ];
    const missingFields = requiredFields.filter((field) => !addressData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Create temporary address with unique ID
    const newTempAddress = {
      ...addressData,
      tempId: `temp_${Date.now()}`,
      isTemporary: true,
    };

    // Add to temporary addresses
    setTemporaryAddresses((prev) => [...prev, newTempAddress]);

    // Select this address
    setSelectedAddressId(newTempAddress.tempId);
    setShowNewAddressForm(false);
    setIsAddingNewAddress(false);
  };


     const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div>
      <div
        className="new-address-form"
        style={{
          backgroundColor: "#f8f9fa",
          borderRadius: "12px",
          padding: "25px",
          marginTop: allAddresses.length > 0 ? "20px" : "0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
            📝{" "}
            {allAddresses.length > 0 ? "Add New Address" : "Add Your Address"}
          </h6>
          {allAddresses.length > 0 && (
            <button
              type="button"
              onClick={() => setShowNewAddressForm(false)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="form-checkout"
          style={{ display: "grid", gap: "20px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <fieldset style={{ margin: 0 }}>
              <label
                htmlFor="fullName"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#2c3e50",
                }}
              >
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
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "16px",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#000000")}
                onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
              />
            </fieldset>

            <fieldset style={{ margin: 0 }}>
              <label
                htmlFor="phoneNumber"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#2c3e50",
                }}
              >
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
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "16px",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#000000")}
                onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
              />
            </fieldset>
          </div>

          <fieldset style={{ margin: 0 }}>
            <label
              htmlFor="address"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#2c3e50",
              }}
            >
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
                width: "100%",
                padding: "12px",
                border: "2px solid #e9ecef",
                borderRadius: "8px",
                fontSize: "16px",
                transition: "border-color 0.3s ease",
                resize: "vertical",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#000000")}
              onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
            />
          </fieldset>

          <fieldset style={{ margin: 0 }}>
            <label
              htmlFor="pincode"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#2c3e50",
              }}
            >
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
                width: "100%",
                padding: "12px",
                border: "2px solid #e9ecef",
                borderRadius: "8px",
                fontSize: "16px",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#000000")}
              onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
            />
            {pincodeLoading && (
              <small
                style={{
                  color: "#000000",
                  fontSize: "14px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                🔄 Fetching location details...
              </small>
            )}
            {pincodeError && (
              <small
                style={{
                  color: "#dc3545",
                  fontSize: "14px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                ❌ {pincodeError}
              </small>
            )}
          </fieldset>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <fieldset style={{ margin: 0 }}>
              <label
                htmlFor="state"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#2c3e50",
                }}
              >
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
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "16px",
                  backgroundColor: pincodeLoading ? "#f8f9fa" : "white",
                }}
              />
            </fieldset>

            <fieldset style={{ margin: 0 }}>
              <label
                htmlFor="district"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#2c3e50",
                }}
              >
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
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "16px",
                  backgroundColor: pincodeLoading ? "#f8f9fa" : "white",
                }}
              />
            </fieldset>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <fieldset style={{ margin: 0 }}>
              <label
                htmlFor="city"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#2c3e50",
                }}
              >
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
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "16px",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#000000")}
                onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
              />
            </fieldset>

            <fieldset style={{ margin: 0 }}>
              <label
                htmlFor="place"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#2c3e50",
                }}
              >
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
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "16px",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#000000")}
                onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
              />
            </fieldset>
          </div>

          <fieldset style={{ margin: 0 }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#2c3e50",
              }}
            >
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
                width: "100%",
                padding: "12px",
                border: "2px solid #e9ecef",
                borderRadius: "8px",
                fontSize: "16px",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#000000")}
              onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
            />
          </fieldset>

          <button
            type="button"
            onClick={handleSaveAddress}
            disabled={pincodeLoading}
            style={{
              padding: "15px 30px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: pincodeLoading ? "not-allowed" : "pointer",
              opacity: pincodeLoading ? 0.6 : 1,
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
            onMouseOver={(e) =>
              !pincodeLoading && (e.target.style.backgroundColor = "#218838")
            }
            onMouseOut={(e) =>
              !pincodeLoading && (e.target.style.backgroundColor = "#28a745")
            }
          >
            💾 Save Address
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewAddressForm;
