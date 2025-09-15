import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Orders({ data }) {
  const [filter, setFilter] = useState('all');

  const getStatusInfo = (status) => {
    const statusMap = {
      '0': { label: 'Order Placed', color: '#2563eb', bgColor: '#eff6ff', icon: '✓' },
      'processing': { label: 'Processing', color: '#7c3aed', bgColor: '#f3f4f6', icon: '⏳' },
      'shipped': { label: 'Shipped', color: '#ea580c', bgColor: '#fff7ed', icon: '🚚' },
      '3': { label: 'Delivered', color: '#059669', bgColor: '#f0fdf4', icon: '📦' },
      'confirmed': { label: 'Confirmed', color: '#059669', bgColor: '#f0fdf4', icon: '✅' },
      'failed': { label: 'Failed', color: '#dc2626', bgColor: '#fef2f2', icon: '❌' },
      'placed': { label: 'Order Placedd', color: '#2563eb', bgColor: '#eff6ff', icon: '✓' },
    };
    return statusMap[status] || statusMap['placed'];
  };

  const getPaymentStatusInfo = (status) => {
    const paymentMap = {
      'completed': { label: 'Paid', color: '#059669', icon: '✅' },
      'pending': { label: 'Pending', color: '#ea580c', icon: '⏳' },
      'failed': { label: 'Failed', color: '#dc2626', icon: '❌' },
    };
    return paymentMap[status?.toLowerCase()] || { label: status || 'Paid', color: '#059669', icon: '✅' };
  };

  const filteredData = data?.filter(order => {
    if (filter === 'all') return true;
    return order.orderStatus === filter;
  });

  return (
    <div className="orders-page">
      <style jsx>{`
        .orders-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 0;
        }

        .orders-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 24px 0;
          margin-bottom: 0;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .orders-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .orders-count {
          font-size: 14px;
          color: #64748b;
          margin: 4px 0 0 0;
        }

        .filter-tabs {
          display: flex;
          gap: 0;
          background: #f8fafc;
          border-radius: 8px;
          padding: 4px;
          border: 1px solid #e2e8f0;
        }

        .filter-tab {
          background: none;
          border: none;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .filter-tab.active {
          background: #1a202c;
          color: white;
        }

        .orders-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        .order-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          margin-bottom: 20px;
          transition: all 0.2s ease;
          overflow: hidden;
        }

        .order-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .order-header {
          background: #f8fafc;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 16px;
        }

        .order-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .order-id {
          font-size: 16px;
          font-weight: 600;
          color: #1a202c;
          margin: 0;
        }

        .order-date {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }

        .order-amount {
          text-align: right;
        }

        .amount-label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 500;
          letter-spacing: 0.05em;
          margin-bottom: 2px;
        }

        .amount-value {
          font-size: 20px;
          font-weight: 700;
          color: #1a202c;
        }

        .order-body {
          padding: 24px;
        }

        .order-progress {
          margin-bottom: 24px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .delivery-info {
          font-size: 13px;
          color: #64748b;
        }

        .order-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #f1f5f9;
        }

        .detail-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .detail-label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.1em;
        }

        .detail-value {
          font-size: 14px;
          font-weight: 500;
          color: #1a202c;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .payment-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
        }

        .order-footer {
          border-top: 1px solid #f1f5f9;
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .order-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .btn-view {
          background: #1a202c;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .btn-view:hover {
          background: #2d3748;
          color: white;
          text-decoration: none;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: transparent;
          color: #64748b;
          border: 1px solid #e2e8f0;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .btn-secondary:hover {
          border-color: #cbd5e1;
          color: #475569;
          text-decoration: none;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: #f8fafc;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          font-size: 32px;
        }

        .empty-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 8px;
        }

        .empty-text {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 24px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .btn-primary {
          background: #1a202c;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background: #2d3748;
          color: white;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 0 16px;
            flex-direction: column;
            align-items: flex-start;
          }

          .filter-tabs {
            width: 100%;
            justify-content: center;
          }

          .orders-container {
            padding: 16px;
          }

          .order-header {
            padding: 16px 20px;
            flex-direction: column;
            align-items: flex-start;
          }

          .order-amount {
            text-align: left;
          }

          .order-body {
            padding: 20px;
          }

          .order-details {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 16px;
          }

          .order-footer {
            padding: 16px 20px;
            flex-direction: column;
            align-items: stretch;
          }

          .order-actions {
            width: 100%;
            justify-content: space-between;
          }

          .btn-view, .btn-secondary {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>

      <div className="orders-header">
        <div className="header-content">
          <div>
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-count">
              {data?.length || 0} order{data?.length !== 1 ? 's' : ''} found
            </p>
          </div>
          {/* <div className="filter-tabs">
            {['all', 'confirmed', '1', '2', '3', 'failed'].map(status => (
              <button
                key={status}
                className={`filter-tab ${filter === status ? 'active' : ''}`}
                onClick={() => setFilter(status)}
              >
                {status === 'all' ? 'All Orders' : 
                 status === '1' ? 'Processing' :
                 status === '2' ? 'Shipped' :
                 status === '3' ? 'Delivered' :
                 status}
              </button>
            ))}
          </div> */}
        </div>
      </div>

      <div className="orders-container">
        {!filteredData || filteredData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h2 className="empty-title">
              {filter === 'all' ? 'No orders found' : `No ${filter} orders`}
            </h2>
            <p className="empty-text">
              {filter === 'all' 
                ? "You haven't placed any orders yet. Start shopping to see your orders here."
                : `You don't have any ${filter} orders at the moment.`
              }
            </p>
            {filter === 'all' && (
              <Link to="/shop" className="btn-primary">
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          <div className="orders-list">
            {filteredData.map((order) => {
              const statusInfo = getStatusInfo(order.orderStatus || 'placed');
              const paymentInfo = getPaymentStatusInfo(order.paymentStatus);
              
              return (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-meta">
                      <h3 className="order-id">Order #{order.merchantOrderId}</h3>
                      <p className="order-date">
                        Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })} at {new Date(order.orderDate).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                    <div className="order-amount">
                      <div className="amount-label">Total Amount</div>
                      <div className="amount-value">
                        ₹{(order.subTotal / 100).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="order-body">
                    <div className="order-progress">
                      <div className="progress-header">
                        <div 
                          className="status-badge"
                          style={{
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.color,
                          }}
                        >
                          <span>{statusInfo.icon}</span>
                          {statusInfo.label}
                        </div>
                        <div className="delivery-info">
                          {order.orderStatus === '3' || order.orderStatus === 'delivered' 
                            ? 'Delivered' 
                            : 'Expected delivery in 3-5 days'
                          }
                        </div>
                      </div>
                    </div>

                    <div className="order-details">
                      <div className="detail-group">
                        <span className="detail-label">Payment Status</span>
                        <span className="detail-value">
                          <span 
                            className="payment-status"
                            style={{ color: paymentInfo.color }}
                          >
                            <span>{paymentInfo.icon}</span>
                            {paymentInfo.label}
                          </span>
                        </span>
                      </div>

                      <div className="detail-group">
                        <span className="detail-label">Items</span>
                        <span className="detail-value">
                          {order?.products?.length || 0} item{order?.products?.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="detail-group">
                        <span className="detail-label">Payment Method</span>
                        <span className="detail-value">
                          {order.paymentMethod || 'Online Payment'}
                        </span>
                      </div>

                      <div className="detail-group">
                        <span className="detail-label">Order Type</span>
                        <span className="detail-value">
                          {order.orderType || 'Standard Delivery'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="order-footer">
                    <div className="order-info">
                      <span style={{ fontSize: '13px', color: '#64748b' }}>
                        Need help? Contact support
                      </span>
                    </div>
                    <div className="order-actions">
                      <Link 
                        to={`/my-account-orders-details/${order.merchantOrderId}`} 
                        className="btn-secondary"
                      >
                        Track Order
                      </Link>
                      <Link 
                        to={`/my-account-orders-details/${order.merchantOrderId}`} 
                        className="btn-view"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}