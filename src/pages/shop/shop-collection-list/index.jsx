import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Topbar1 from "@/components/headers/Topbar1";
import ShopCollections from "@/components/shop/ShopCollections";
import { useState, useEffect, useCallback } from "react";
import React from "react";
import { categoryService } from "@/services/categoryService";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Product Collection List || jewel junky",
  description: "jewel junky",
};

export default function ShopCollectionPage() {
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState(null);

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategory();
      setCollections(data.categories);
    } catch (err) {
      console.error("Fetch collections error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch collections"
      );
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const refetch = useCallback(() => {
    fetchCollections();
  }, [fetchCollections]);

  console.log("collections", collections);

  return (
    <>
      <MetaComponent meta={metadata} />
      <style jsx>{`
        .modern-page-container {
          background: #ffffff;
          min-height: 100vh;
        }

        .hero-section {
          
          color: white;
          
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.05"/><circle cx="50" cy="10" r="0.5" fill="%23ffffff" opacity="0.08"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          font-weight: 300;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .content-section {
         
          background: #ffffff;
        }

        .modern-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 0;
        }

        .loader-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #000000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        .loader-text {
          color: #666666;
          font-size: 1rem;
          font-weight: 500;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          max-width: 600px;
          margin: 60px auto;
          text-align: center;
          padding: 40px 20px;
        }

        .error-card {
          background: #ffffff;
          border: 2px solid #f8f9fa;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .error-icon {
          width: 60px;
          height: 60px;
          background: #ff4757;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
          font-size: 24px;
        }

        .error-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .error-message {
          color: #7f8c8d;
          font-size: 1rem;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .retry-button {
          background: #000000;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .retry-button:hover {
          background: #333333;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .collections-wrapper {
          animation: fadeIn 0.6s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .breadcrumb-section {
          background: #f8f9fa;
          padding: 15px 0;
          border-bottom: 1px solid #e9ecef;
        }

        .breadcrumb {
          background: transparent;
          margin-bottom: 0;
          font-size: 0.9rem;
        }

        .breadcrumb-item a {
          color: #6c757d;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .breadcrumb-item a:hover {
          color: #000000;
        }

        .breadcrumb-item.active {
          color: #000000;
          font-weight: 500;
        }

        .stats-bar {
          background: #000000;
          color: white;
          padding: 15px 0;
          text-align: center;
        }

        .stats-text {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
          }

          .hero-section {
            padding: 60px 0 40px;
          }

          .content-section {
            padding: 40px 0;
          }

          .error-card {
            padding: 30px 20px;
          }
        }

        @media (max-width: 576px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-section {
            padding: 40px 0 30px;
          }
        }
      `}</style>

      <div className="modern-page-container">
        {/* <Topbar1 /> */}
        {/* <Header2 /> */}

        {/* Breadcrumb Section */}
        <div className="breadcrumb-section">
          <div className="container">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                {/* <li className="breadcrumb-item">
                  <a href="/shop">Shop</a>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  <a href="/shop-collection-list"></a>
                  Collections
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        {/* <div className="hero-section">
          <div className="container">
            <div className="hero-content text-center">
              <h1 className="hero-title">Shop by Category</h1>
              <p className="hero-subtitle">
                Discover our exquisite collection of fine jewelry, carefully curated to match your unique style and elegance
              </p>
            </div>
          </div>
        </div> */}

        {/* Stats Bar */}
        {/* {!loading && !error && collections.length > 0 && (
          <div className="stats-bar">
            <div className="container">
              <p className="stats-text">
                {collections.length} Premium Collection{collections.length !== 1 ? 's' : ''} Available
              </p>
            </div>
          </div>
        )} */}

        {/* Content Section */}
        <div className="content-section">
          <div className="container">
            {loading && (
              <div className="modern-loader">
                <div className="loader-spinner"></div>
                <div className="loader-text">Loading collections...</div>
              </div>
            )}

            {error && (
              <div className="error-container">
                <div className="error-card">
                  <div className="error-icon">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <h3 className="error-title">Oops! Something went wrong</h3>
                  <p className="error-message">
                    We couldn't load the collections at the moment. Please check your connection and try again.
                  </p>
                  <button className="retry-button" onClick={refetch}>
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && collections.length > 0 && (
              <div className="collections-wrapper">
                <ShopCollections collections={collections} />
              </div>
            )}

            {!loading && !error && collections.length === 0 && (
              <div className="error-container">
                <div className="error-card">
                  <div className="error-icon" style={{ background: '#95a5a6' }}>
                    <i className="fas fa-box-open"></i>
                  </div>
                  <h3 className="error-title">No Collections Found</h3>
                  <p className="error-message">
                    We couldn't find any collections at the moment. Please check back later or contact support if this persists.
                  </p>
                  <button className="retry-button" onClick={refetch}>
                    Refresh
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer1 />
      </div>
    </>
  );
}