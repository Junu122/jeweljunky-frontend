import Footer1 from "@/components/footers/Footer1";
import RecentProducts from "@/components/shopDetails/RecentProducts";
import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import DetailsOuterZoom from "@/components/shopDetails/DetailsOuterZoom";
import MetaComponent from "@/components/common/MetaComponent";
import { useParams, useLocation } from "react-router-dom";
import { productService } from "@/services/productService";

// Loading component for better UX
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
    <div className="spinner-border " style={{color:"black"}} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// Error component for better error handling
const ErrorMessage = ({ message, onRetry }) => (
  <div className="alert alert-danger text-center" style={{backgroundColor:"white"}} role="alert">
    <h4 className="alert-heading">Oops! Something went wrong</h4>
    <p>{message}</p>
    <hr />
    <button className="btn btn-outline-danger" onClick={onRetry}>
      Try Again
    </button>
  </div>
);

export default function ProductDetailPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Memoize productId to prevent unnecessary re-renders
  const productId = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("id") || slug;
  }, [location.search, slug]);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic metadata based on product
  const metadata = useMemo(() => ({
    title: product?.title 
      ? `${product.title} | Jewel Junkie` 
      : "Product Details | Jewel Junkie",
    description: product?.description 
      ? product.description.substring(0, 160) + "..." 
      : "Discover amazing jewelry at Jewel Junkie",
    keywords: product?.tags?.join(", ") || "jewelry, accessories",
    image: product?.images?.[0] || "/default-product-image.jpg"
  }), [product]);

  // Fetch product data with proper error handling
  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setError("Product ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getProductById(productId);
      
      if (response.success && response.product) {
        setProduct(response.product);
      } else {
        throw new Error(response.message || "Product not found");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      
      // Handle different types of errors
      if (error.response?.status === 404) {
        setError("Product not found. It may have been removed or doesn't exist.");
      } else if (error.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else if (error.name === 'NetworkError' || !navigator.onLine) {
        setError("Network error. Please check your internet connection and try again.");
      } else {
        setError(error.message || "Failed to load product details");
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // Fetch product on component mount and when productId changes
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Handle retry functionality
  const handleRetry = useCallback(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Handle navigation back if product not found
  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Show loading state
  if (loading) {
    return (
      <>
        <MetaComponent meta={{ title: "Loading... | Jewel Junkie" }} />
        <LoadingSpinner />
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <MetaComponent meta={{ title: "Error | Jewel Junkie" }} />
        <div className="container my-5">
          <ErrorMessage message={error} onRetry={handleRetry} />
          <div className="text-center mt-3">
            <button className="btn btn-secondary" onClick={handleGoBack}>
              Go Back
            </button>
          </div>
        </div>
        <Footer1 />
      </>
    );
  }

  // Show product not found state
  if (!product) {
    return (
      <>
        <MetaComponent meta={{ title: "Product Not Found | Jewel Junkie" }} />
        <div className="container my-5">
          <div className="text-center">
            <h2>Product Not Found</h2>
            <p>The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer1 />
      </>
    );
  }

  return (
    <>
      <MetaComponent meta={metadata} />
      
      {/* Breadcrumb */}
      <div className="tf-breadcrumb">
        <div className="container">
          <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">
            <div className="tf-breadcrumb-list">
              <Link to="/" className="text">
                Home
              </Link>
              <i className="icon icon-arrow-right" />
              <span className="text">
                {product.title || "Product Details"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <DetailsOuterZoom dummy={product} />
      
      {/* Uncomment these components as needed */}
      {/* <ShopDetailsTab dummyJewellery={product} /> */}
      {/* <Products /> */}
      {/* <RecentProducts /> */}
      
      <Footer1 />
    </>
  );
}