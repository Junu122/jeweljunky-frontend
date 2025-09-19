import React from "react";

const AddressList = ({address,index,selectedAddressId,handleAddressSelect}) => {
      const addressId =address._id || address.id || address.tempId || index;
      const isSelected = selectedAddressId === addressId;
  return (
    <>
      <div
        key={addressId}
        className={`address-card ${isSelected ? "selected" : ""}`}
        onClick={() => handleAddressSelect(addressId)}
        style={{
          border: isSelected ? "2px solid #000000" : "2px solid #e9ecef",
          borderRadius: "12px",
          padding: "20px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          backgroundColor: isSelected ? "#f8f9ff" : "white",
          position: "relative",
          boxShadow: isSelected
            ? "0 4px 15px rgba(0,123,255,0.2)"
            : "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Selection indicator */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: "2px solid #000000",
            backgroundColor: isSelected ? "#000000" : "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isSelected && (
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "white",
                borderRadius: "50%",
              }}
            />
          )}
        </div>

        {/* Temporary address badge */}
        {address.isTemporary && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              backgroundColor: "#28a745",
              color: "white",
              fontSize: "10px",
              padding: "4px 8px",
              borderRadius: "12px",
              fontWeight: "600",
            }}
          >
            NEW
          </div>
        )}

        <div
          className="address-content"
          style={{
            paddingTop: address.isTemporary ? "20px" : "0",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#2c3e50",
              marginBottom: "8px",
            }}
          >
            {address.fullName}
          </div>
          <div
            style={{
              color: "#6c757d",
              lineHeight: "1.5",
              marginBottom: "4px",
            }}
          >
            {address.address}
          </div>
          <div
            style={{
              color: "#6c757d",
              lineHeight: "1.5",
              marginBottom: "4px",
            }}
          >
            {address.place}, {address.city}
          </div>
          <div
            style={{
              color: "#6c757d",
              lineHeight: "1.5",
              marginBottom: "8px",
            }}
          >
            {address.district}, {address.state} - {address.pincode}
          </div>
          <div
            style={{
              color: "#000000",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            📞 {address.phoneNumber}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressList;
