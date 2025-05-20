import React, { useState } from 'react';
import { Heart, BarChart3, Eye, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const ProductCard = ({ product, onWishlist, onCompare, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const navigate=useNavigate()
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index}
        size={14}
        className={index < rating ? "text-warning" : "text-muted"}
        fill={index < rating ? "currentColor" : "none"}
      />
    ));
  };

  return (
    <div 
      className="col-lg-3 col-md-4 col-sm-6 mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={()=>navigate('/product-detail/1')}
    >
      <div className="card h-100 border-0 shadow-sm position-relative overflow-hidden">
        {/* Limited Stock Badge */}
        {product.limitedStock && (
          <div className="position-absolute top-0 start-0 z-index-2 m-3">
            <span className="badge bg-success rounded-pill px-3 py-2">
              <span className="text-white fw-bold">● Limited Stock</span>
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`position-absolute top-0 end-0 z-index-2 m-3 d-flex flex-column gap-2 transition-all ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button 
            className="btn btn-light btn-sm rounded-circle p-2 shadow-sm"
            onClick={() => onWishlist(product.id)}
            title="Add to Wishlist"
          >
            <Heart size={16} />
          </button>
          <button 
            className="btn btn-light btn-sm rounded-circle p-2 shadow-sm"
            onClick={() => onCompare(product.id)}
            title="Add to Compare"
          >
            <BarChart3 size={16} />
          </button>
          <button 
            className="btn btn-light btn-sm rounded-circle p-2 shadow-sm"
            onClick={() => onQuickView(product.id)}
            title="Quick View"
          >
            <Eye size={16} />
          </button>
        </div>

        {/* Product Image */}
        <div className="position-relative overflow-hidden" style={{ height: '300px' }}>
          <img 
            src={selectedColor.image} 
            alt={product.name}
            className={`card-img-top h-100 w-100 object-fit-cover transition-transform ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            style={{ transition: 'transform 0.3s ease' }}
          />
        </div>

        {/* Card Body */}
        <div className="card-body p-3">
          <h6 className="card-title text-dark fw-normal mb-2" style={{ fontSize: '15px' }}>
            {product.name}
          </h6>
          
          {/* Rating */}
          <div className="d-flex align-items-center mb-2">
            <div className="d-flex me-2">
              {renderStars(product.rating)}
            </div>
            <small className="text-muted">({product.reviews})</small>
          </div>

          {/* Price */}
          <div className="mb-3">
            <span className="fw-bold text-dark" style={{ fontSize: '16px' }}>
              €{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-muted text-decoration-line-through ms-2" style={{ fontSize: '14px' }}>
                €{product.originalPrice}
              </span>
            )}
          </div>

          {/* Color Options */}
          <div className="d-flex gap-2 align-items-center justify-content-center">
            {product.colors.map((color) => (
              <button
                key={color.name}
                className={`btn p-0 rounded-circle border-2 ${
                  selectedColor.name === color.name ? 'border-dark' : 'border-light'
                }`}
                style={{ 
                  width: '32px', 
                  height: '32px',
                  backgroundColor: color.hex,
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setSelectedColor(color)}
                title={color.name}
              />
            ))}
          </div>

          {/* Select Options Button */}
          {isHovered && (
            <div className="mt-3">
              <button className="btn btn-outline-dark w-100 py-2">
                Select Options
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BestsellerSection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = React.useRef(null);

  const products = [
    {
      id: 1,
      name: "Cotton Long-Sleeve Striped T-shirt",
      price: "103,95",
      rating: 4,
      reviews: 24,
      limitedStock: false,
      colors: [
        { name: "Grey Striped", hex: "#8B8B8B", image: "https://www.palmonas.com/cdn/shop/files/NK-213-03_85e4fb97-53cc-4d0d-b9ab-0873d173cde4.jpg?v=1744527917&width=500" },
        { name: "Navy Striped", hex: "#2C3E50", image: "https://www.palmonas.com/cdn/shop/files/NK-213-03_85e4fb97-53cc-4d0d-b9ab-0873d173cde4.jpg?v=1744527917&width=500" },
        { name: "Beige Striped", hex: "#D2B48C", image: "https://www.palmonas.com/cdn/shop/files/NK-213-03_85e4fb97-53cc-4d0d-b9ab-0873d173cde4.jpg?v=1744527917&width=500" }
      ]
    },
    {
      id: 2,
      name: "Plain Cotton Undershirt - Wide Neck",
      price: "31,95",
      rating: 4,
      reviews: 156,
      limitedStock: true,
      colors: [
        { name: "White", hex: "#FFFFFF", image: "/api/placeholder/300/400" },
        { name: "Navy", hex: "#2C3E50", image: "/api/placeholder/300/400" },
        { name: "Beige", hex: "#D2B48C", image: "/api/placeholder/300/400" }
      ]
    },
    {
      id: 3,
      name: "Organic Cotton Basic Tee",
      price: "45,99",
      originalPrice: "59,99",
      rating: 5,
      reviews: 89,
      limitedStock: false,
      colors: [
        { name: "Black", hex: "#000000", image: "/api/placeholder/300/400" },
        { name: "White", hex: "#FFFFFF", image: "/api/placeholder/300/400" },
        { name: "Grey", hex: "#8B8B8B", image: "/api/placeholder/300/400" }
      ]
    },
    {
      id: 4,
      name: "Premium Cotton Polo Shirt",
      price: "78,50",
      rating: 4,
      reviews: 67,
      limitedStock: true,
      colors: [
        { name: "Navy", hex: "#2C3E50", image: "/api/placeholder/300/400" },
        { name: "Forest Green", hex: "#228B22", image: "/api/placeholder/300/400" },
        { name: "Burgundy", hex: "#800020", image: "/api/placeholder/300/400" }
      ]
    },
    {
      id: 5,
      name: "Lightweight Summer Cardigan",
      price: "125,00",
      rating: 4,
      reviews: 43,
      limitedStock: false,
      colors: [
        { name: "Cream", hex: "#F5F5DC", image: "/api/placeholder/300/400" },
        { name: "Light Blue", hex: "#ADD8E6", image: "/api/placeholder/300/400" },
        { name: "Rose Pink", hex: "#FFB6C1", image: "/api/placeholder/300/400" }
      ]
    },
    {
      id: 6,
      name: "Merino Wool Blend Sweater",
      price: "189,99",
      rating: 5,
      reviews: 112,
      limitedStock: true,
      colors: [
        { name: "Charcoal", hex: "#36454F", image: "/api/placeholder/300/400" },
        { name: "Camel", hex: "#C19A6B", image: "/api/placeholder/300/400" },
        { name: "Olive", hex: "#808000", image: "/api/placeholder/300/400" }
      ]
    }
  ];

  const scroll = (direction) => {
    const container = containerRef.current;
    const scrollAmount = 300;
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleWishlist = (productId) => {
    console.log('Added to wishlist:', productId);
    // Implement wishlist functionality
  };

  const handleCompare = (productId) => {
    console.log('Added to compare:', productId);
    // Implement compare functionality
  };

  const handleQuickView = (productId) => {
    console.log('Quick view:', productId);
    // Implement quick view modal
  };

  return (
    <div className="container-fluid py-5 bg-light">
      <div className="container">
        {/* Section Header */}
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h2 className="display-6 fw-bold text-dark mb-2">Bestsellers</h2>
            <p className="text-muted lead">Our most popular products this season</p>
          </div>
        </div>

        {/* Products Container */}
        <div className="position-relative">
          {/* Scroll Buttons */}
          <button 
            className="btn btn-light position-absolute start-0 top-50 translate-middle-y z-index-3 rounded-circle p-3 shadow"
            onClick={() => scroll('left')}
            style={{ marginLeft: '-20px' }}
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            className="btn btn-light position-absolute end-0 top-50 translate-middle-y z-index-3 rounded-circle p-3 shadow"
            onClick={() => scroll('right')}
            style={{ marginRight: '-20px' }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Scrollable Products */}
          <div 
            ref={containerRef}
            className="row flex-nowrap overflow-auto pb-3"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': { display: 'none' }
            }}
          >
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                onWishlist={handleWishlist}
                onCompare={handleCompare}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <button className="btn btn-outline-dark btn-lg px-5 py-3">
              View All Products
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .transition-all {
          transition: all 0.3s ease;
        }
        .scale-110 {
          transform: scale(1.1);
        }
        .scale-100 {
          transform: scale(1.0);
        }
        .z-index-2 {
          z-index: 2;
        }
        .z-index-3 {
          z-index: 3;
        }
        .object-fit-cover {
          object-fit: cover;
        }
        .row.flex-nowrap {
          flex-wrap: nowrap !important;
        }
        .row.flex-nowrap .col-lg-3,
        .row.flex-nowrap .col-md-4,
        .row.flex-nowrap .col-sm-6 {
          flex: 0 0 auto;
          width: 300px;
          max-width: none;
        }
        .row.overflow-auto {
          overflow-x: auto;
          overflow-y: hidden;
        }
        .row.overflow-auto::-webkit-scrollbar {
          display: none;
        }
        .row.overflow-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default BestsellerSection;