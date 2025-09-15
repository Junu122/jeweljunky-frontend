import { useState } from "react";
import { Plus, Edit, Trash2, MapPin, Phone, Building, User, X } from "lucide-react";
import { useEffect } from "react";
import { axiosinstance } from "@/utlis/api";
import { useContextElement } from "@/context/Context";
import { toast } from 'sonner'
export default function AccountAddress() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { user, setUser } = useContextElement(); 
  const addresses = user?.address || [];

  const [addressData, setAddressData] = useState({
    fullName: '',
    address: '',
    city: '',
    place: '',
    state: '',
  
    pincode: '',
    phoneNumber: '',

 
    isDefault: false
  });

  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingIndex !== null) {
        // Update existing address
        const addressToUpdate = addresses[editingIndex];
        const response = await axiosinstance.post(`/user/update-address/${ addressToUpdate._id}`, addressData);
        console.log("update response++++++++++++++++++++++++++++++", response);
        // Update local state
        const updatedAddresses = addresses.map((addr, index) => 
          index === editingIndex 
            ? { ...response.data, ...addressData }
            : addressData.isDefault ? { ...addr, isDefault: false } : addr
        );
        
        // Update user context
        setUser(prev => ({ ...prev, address: updatedAddresses }));
        toast.success('Address updated successfully');
        setEditingIndex(null);
      } else {
        // Add new address
        const response = await axiosinstance.post('/user/save-address', addressData);
        console.log("save response++++++++++++++++++++++++++++++", response);
        toast.success('Address added successfully');
        const updatedAddresses = response.data.address;
      

        
        
        setUser(prev => ({ ...prev, address: updatedAddresses }));
      }
      
      resetForm();
      setShowAddForm(false);
    } catch (error) {

      toast.error(error?.response?.data?.message || error.message || 'Error saving address');
      console.error('Error saving address:', error);
      // Handle error (show toast, alert, etc.)
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    const address = addresses[index];
    setAddressData({
      fullName: address.fullName || `${address.firstName || ''} ${address.lastName || ''}`.trim(),
      address: address.address || '',
      city: address.city || '',
      place: address.place || '',
      state: address.state || '',
     
      pincode: address.pincode || address.zip || '',
      phoneNumber: address.phoneNumber || address.phone || '',
     
     
      isDefault: address.isDefault || false
    });
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleDelete = async (index) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setLoading(true);
      try {
        const addressToDelete = addresses[index];
        await axiosinstance.delete(`/address/${addressToDelete.id || addressToDelete._id}`);
        
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        setUser(prev => ({ ...prev, address: updatedAddresses }));
      } catch (error) {
        console.error('Error deleting address:', error);
        // Handle error
      } finally {
        setLoading(false);
      }
    }
  };

  const setAsDefault = async (index) => {
    setLoading(true);
    try {
      const addressToSetDefault = addresses[index];
      await axiosinstance.put(`/address/${addressToSetDefault.id || addressToSetDefault._id}`, {
        ...addressToSetDefault,
        isDefault: true
      });
      
      const updatedAddresses = addresses.map((addr, i) => ({
        ...addr,
        isDefault: i === index
      }));
      
      setUser(prev => ({ ...prev, address: updatedAddresses }));
    } catch (error) {
      console.error('Error setting default address:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAddressData({
      fullName: '',
      address: '',
      city: '',
      place: '',
      state: '',
 
      pincode: '',
      phoneNumber: '',


      isDefault: false
    });
    setPincodeError('');
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingIndex(null);
    resetForm();
  };

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            {/* Header */}
            <div className="mb-4">
              <h1 className="display-6 fw-bold text-dark mb-2">Address Book</h1>
              <p className="text-muted">Manage your shipping and billing addresses</p>
            </div>

            {/* Add New Address Button */}
            {!showAddForm && (
              <div className="mb-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn btn-dark btn-lg d-flex align-items-center gap-2"
                  disabled={loading}
                >
                  <Plus size={20} />
                  Add New Address
                </button>
              </div>
            )}

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="card shadow-lg mb-4 border-0">
                <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                  <h2 className="h4 mb-0 fw-semibold text-dark">
                    {editingIndex !== null ? 'Edit Address' : 'Add New Address'}
                  </h2>
                  <button
                    onClick={cancelForm}
                    className="btn btn-link text-muted p-0 border-0"
                    style={{ fontSize: '1.5rem' }}
                    disabled={loading}
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      {/* Full Name */}
                      <div className="col-12">
                        <label className="form-label fw-medium text-dark">
                          Full Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={addressData.fullName}
                          onChange={handleInputChange}
                          required
                          className="form-control form-control-lg"
                          style={{ borderColor: '#dee2e6' }}
                        />
                      </div>

                      {/* Address */}
                      <div className="col-12">
                        <label className="form-label fw-medium text-dark">
                          Address <span className="text-danger">*</span>
                        </label>
                        <textarea
                          name="address"
                          value={addressData.address}
                          onChange={handleInputChange}
                          required
                          rows="3"
                          className="form-control form-control-lg"
                          style={{ borderColor: '#dee2e6' }}
                        />
                      </div>

                      {/* Pincode */}
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-dark">
                          Pincode <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={addressData.pincode}
                          onChange={handlePincodeChange}
                          required
                          maxLength="6"
                          className="form-control form-control-lg"
                          style={{ borderColor: '#dee2e6' }}
                        />
                        {pincodeLoading && (
                          <small className="text-info">Loading location data...</small>
                        )}
                        {pincodeError && (
                          <small className="text-danger">{pincodeError}</small>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-dark">
                          Phone Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={addressData.phoneNumber}
                          onChange={handleInputChange}
                          required
                          className="form-control form-control-lg"
                          style={{ borderColor: '#dee2e6' }}
                        />
                      </div>

                      {/* Place */}
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-dark">Place</label>
                        <input
                          type="text"
                          name="place"
                          value={addressData.place}
                          onChange={handleInputChange}
                          className="form-control form-control-lg"
                          style={{ borderColor: '#dee2e6' }}
                          readOnly={pincodeLoading}
                        />
                      </div>

                      {/* City */}
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-dark">
                          City <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={addressData.city}
                          onChange={handleInputChange}
                          required
                          className="form-control form-control-lg"
                          style={{ borderColor: '#dee2e6' }}
                        />
                      </div>

                      {/* District */}
                      {/* <div className="col-md-6">
                        <label className="form-label fw-medium text-dark">District</label>
                        <input
                          type="text"
                          name="district"
                          value={addressData.district}
                          onChange={handleInputChange}
                          className="form-control form-control-lg"
                          style={{ borderColor: '#dee2e6' }}
                          readOnly={pincodeLoading}
                        />
                      </div> */}

                      {/* State */}
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-dark">
                          State <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={addressData.state}
                          onChange={handleInputChange}
                          required
                          className="form-control form-control-lg"
                          style={{ borderColor: '#dee2e6' }}
                        />
                      </div>

                      {/* Email */}
                      {/* <div className="col-12">
                        <label className="form-label fw-medium text-dark">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={addressData.email}
                          onChange={handleInputChange}
                          className="form-control form-control-lg"
                          style={{ borderColor: '#dee2e6' }}
                        />
                      </div> */}

                      {/* Notes */}
                      {/* <div className="col-12">
                        <label className="form-label fw-medium text-dark">Notes</label>
                        <textarea
                          name="notes"
                          value={addressData.notes}
                          onChange={handleInputChange}
                          rows="2"
                          className="form-control form-control-lg"
                          style={{ borderColor: '#dee2e6' }}
                          placeholder="Any additional delivery instructions..."
                        />
                      </div> */}

                      {/* Default Address Checkbox */}
                      <div className="col-12">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            name="isDefault"
                            id="isDefault"
                            checked={addressData.isDefault}
                            onChange={handleInputChange}
                            className="form-check-input"
                          />
                          <label htmlFor="isDefault" className="form-check-label fw-medium text-dark">
                            Set as default address
                          </label>
                        </div>
                      </div>

                      {/* Form Actions */}
                      <div className="col-12 pt-3">
                        <div className="d-flex flex-column flex-sm-row gap-2">
                          <button
                            type="submit"
                            className="btn btn-dark btn-lg"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                {editingIndex !== null ? 'Updating...' : 'Saving...'}
                              </>
                            ) : (
                              editingIndex !== null ? 'Update Address' : 'Save Address'
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={cancelForm}
                            className="btn btn-outline-secondary btn-lg"
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Addresses Grid */}
            <div className="row g-4">
              {addresses.map((address, index) => (
                <div key={address.id || address._id || index} className="col-md-6">
                  <div className="card shadow-lg border-0 h-100">
                    {/* Header */}
                    <div className="card-header bg-dark text-white">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h3 className="h5 mb-1 d-flex align-items-center gap-2">
                            <User size={18} />
                            {address.fullName || `${address.firstName || ''} ${address.lastName || ''}`.trim()}
                          </h3>
                          {address.isDefault && (
                            <span className="badge bg-white text-dark small fw-medium mt-1">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="card-body">
                      <div className="d-flex flex-column gap-3">
                        <div className="d-flex align-items-start gap-3">
                          <MapPin size={16} className="text-muted mt-1" />
                          <div className="text-dark">
                            <div>{address.address}</div>
                            <div>
                              {address.place && `${address.place}, `}
                              {address.city}
                              {address.district && `, ${address.district}`}
                            </div>
                            <div>{address.state} - {address.pincode || address.zip}</div>
                          </div>
                        </div>

                        {(address.phoneNumber || address.phone) && (
                          <div className="d-flex align-items-center gap-3">
                            <Phone size={16} className="text-muted" />
                            <span className="text-dark">{address.phoneNumber || address.phone}</span>
                          </div>
                        )}

                        {address.notes && (
                          <div className="d-flex align-items-start gap-3">
                            <Building size={16} className="text-muted mt-1" />
                            <small className="text-muted">{address.notes}</small>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="card-footer bg-light">
                      <div className="d-flex flex-wrap gap-2">
                        {!address.isDefault && (
                          <button
                            onClick={() => setAsDefault(index)}
                            className="btn btn-sm btn-outline-secondary"
                            disabled={loading}
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(index)}
                          className="btn btn-sm btn-dark d-flex align-items-center gap-1"
                          disabled={loading}
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                          disabled={loading}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {addresses.length === 0 && !showAddForm && (
              <div className="text-center py-5">
                <div className="mb-3">
                  <MapPin size={48} className="text-muted" />
                </div>
                <h3 className="h4 fw-medium text-dark mb-2">No addresses saved</h3>
                <p className="text-muted mb-4">Add your first address to get started</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn btn-dark btn-lg d-flex align-items-center gap-2 mx-auto"
                  disabled={loading}
                >
                  <Plus size={20} />
                  Add Your First Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}