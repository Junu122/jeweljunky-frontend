import React from "react";
import { Link } from "react-router-dom";

export default function Orders({ data }) {
  const getStatusColor = (status) => {
    switch (status) {
      case '0': return '#28a745';
      case '1': return '#007bff';
      case '2': return '#ffc107';
      case '3': return '#dc3545';
      case 'confirmed':return '#28a745';
      case 'failed' :return '#dc3545';
      default: return '#17a2b8';
    }
  };

  

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return '✓';
      case '1': return '⏳';
      case '2': return '🚚';
      case '3': return '📦';
      case 'failed' :return '❌';
      default: return '✓';
    }
  };

  return (
    <div className="my-account-content account-order">
      <style jsx>{`
        .orders-container {
          background: #f8f9fa;
          min-height: 100vh;
          padding: 20px 0;
        }

        .order-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          margin-bottom: 16px;
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .order-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          transform: translateY(-2px);
        }

        .order-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }

        .order-id {
          font-weight: 600;
          font-size: 16px;
          margin: 0;
        }

        .order-date {
          font-size: 14px;
          opacity: 0.9;
        }

        .order-body {
          padding: 20px;
        }

        .order-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-size: 12px;
          color: #6c757d;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 16px;
          font-weight: 500;
          color: #212529;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .amount {
          font-size: 18px;
          font-weight: 700;
          color: #28a745;
        }

        .order-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          padding-top: 16px;
          border-top: 1px solid #e9ecef;
        }

        .btn-view {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          padding: 10px 24px;
          border-radius: 6px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-view:hover {
          color: white;
          text-decoration: none;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-text {
          color: #6c757d;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .empty-subtext {
          color: #adb5bd;
          font-size: 14px;
        }

        .orders-header {
          margin-bottom: 24px;
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .orders-title {
          margin: 0;
          color: #212529;
          font-weight: 600;
          font-size: 24px;
        }

        .orders-subtitle {
          margin: 4px 0 0 0;
          color: #6c757d;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .order-header {
            padding: 12px 16px;
          }
          
          .order-body {
            padding: 16px;
          }
          
          .order-details {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .order-actions {
            justify-content: stretch;
          }
          
          .btn-view {
            width: 100%;
            justify-content: center;
          }
          
          .orders-header {
            padding: 16px;
          }
        }
      `}</style>

      <div className="orders-container">
        <div className="container">
          <div className="orders-header">
            <h2 className="orders-title">My Orders</h2>
            <p className="orders-subtitle">Track and manage your orders</p>
          </div>

          {!data || data.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3 className="empty-text">No orders found</h3>
              <p className="empty-subtext">You haven't placed any orders yet</p>
            </div>
          ) : (
            <div className="orders-list">
              {data.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h5 className="order-id">Order #{order.merchantOrderId}</h5>
                      <div className="order-date">
                        Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour:'2-digit',
                          minute:'2-digit',
                          hour12:true
                          
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="order-body">
                    <div className="order-details">
                      <div className="detail-item">
                        <span className="detail-label">Status</span>
                        <span 
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(order.orderStatus || "placed") + '20',
                            color: getStatusColor(order.orderStatus || "placed"),
                            border: `1px solid ${getStatusColor(order.orderStatus || "placed")}30`
                          }}
                        >
                          <span>{getStatusIcon(order.orderStatus )}</span>
                          {order.orderStatus}
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Total Amount</span>
                        <span className="detail-value amount">
                          ₹{(order.subTotal / 100).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Payment</span>
                        <span className="detail-value">
                          {order.paymentStatus || 'Completed'}
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Items</span>
                        <span className="detail-value">
                          {order?.products.length } item(s)
                        </span>
                      </div>
                    </div>

                    <div className="order-actions">
                      <Link 
                        to={`/my-account-orders-details/${order.merchantOrderId}`} 
                        className="btn-view"
                      >
                        <span>👁️</span>
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}