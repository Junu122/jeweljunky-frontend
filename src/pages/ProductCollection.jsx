import React from 'react';

const ProductCollectionShowcase = () => {
  // Sample product data - you can replace this with your actual data
  const products = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: "$199.99",
      originalPrice: "$249.99",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      rating: 4.5,
      reviews: 128,
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Smart Watch Series 5",
      price: "$299.99",
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      rating: 4.8,
      reviews: 256,
      badge: "Trending"
    },
    {
      id: 3,
      name: "Laptop Stand Adjustable",
      price: "$49.99",
      originalPrice: "$69.99",
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
      rating: 4.3,
      reviews: 89,
      badge: "Sale"
    },
    {
      id: 4,
      name: "Bluetooth Speaker Pro",
      price: "$129.99",
      originalPrice: "$159.99",
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
      rating: 4.6,
      reviews: 174,
      badge: "Featured"
    },
    {
      id: 5,
      name: "Mechanical Keyboard RGB",
      price: "$149.99",
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
      rating: 4.7,
      reviews: 203,
      badge: "New"
    },
    {
      id: 6,
      name: "Wireless Mouse Gaming",
      price: "$79.99",
      originalPrice: "$99.99",
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop",
      rating: 4.4,
      reviews: 95,
      badge: "Popular"
    }
  ];

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-warning"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-warning"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-warning"></i>);
    }

    return stars;
  };

  const getBadgeClass = (badge) => {
    const badgeClasses = {
      'Best Seller': 'bg-danger',
      'Trending': 'bg-success',
      'Sale': 'bg-warning text-dark',
      'Featured': 'bg-primary',
      'New': 'bg-info',
      'Popular': 'bg-secondary'
    };
    return badgeClasses[badge] || 'bg-primary';
  };

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#f8f9fa' }}>
    
      
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold mb-3" style={{ color: '#000' }}>
            Best Sellers & Trending
          </h2>
          <p className="lead mb-0" style={{ color: '#000', opacity: 0.8 }}>
            Discover our most popular products loved by customers worldwide
          </p>
        </div>

        {/* Products Section */}
        <div className="position-relative">
          <style jsx>{`
            .product-carde {
              transition: all 0.3s ease;
              border: none;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .product-carde:hover {
              transform: translateY(-8px);
              box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
            .product-image {
              transition: transform 0.3s ease;
            }
            .product-carde:hover .product-image {
              transform: scale(1.05);
            }
            .btn-add-cart {
              background: linear-gradient(135deg, #007bff, #0056b3);
              border: none;
              transition: all 0.3s ease;
            }
            .btn-add-cart:hover {
              background: linear-gradient(135deg, #0056b3, #004085);
              transform: translateY(-2px);
            }
            
            /* Desktop and Large screens - Horizontal scroll */
            @media (min-width: 768px) {
              .products-container {
                display: flex !important;
                gap: 1.5rem;
                overflow-x: auto;
                padding-bottom: 1rem;
                scrollbar-width: thin;
                scrollbar-color: #007bff #f1f1f1;
                -ms-overflow-style: none;
              }
              .products-container::-webkit-scrollbar {
                height: 8px;
              }
              .products-container::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
              }
              .products-container::-webkit-scrollbar-thumb {
                background: #007bff;
                border-radius: 4px;
              }
              .products-container::-webkit-scrollbar-thumb:hover {
                background: #0056b3;
              }
              .product-item {
                flex-shrink: 0;
                min-width: 280px;
                max-width: 280px;
              }
            }
            
            /* Mobile and Small screens - Grid layout */
            @media (max-width: 767.98px) {
              .products-container {
                display: grid !important;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
              }
              .product-item {
                width: 100%;
              }
            }
          `}</style>
          
          <div className="products-container">
            {products.map((product) => (
              <div key={product.id} className="product-item">
                <div className="card h-100 product-carde">
                  {/* Product Badge */}
                  <div className="position-relative">
                    <div className="position-absolute top-0 start-0 m-2">
                      <span className={`badge ${getBadgeClass(product.badge)} px-2 py-1`}>
                        {product.badge}
                      </span>
                    </div>
                    <div className="position-absolute top-0 end-0 m-2">
                      <button className="btn btn-outline-light btn-sm rounded-circle p-2" style={{ background: 'rgba(255,255,255,0.9)' }}>
                        <i className="far fa-heart text-dark"></i>
                      </button>
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="overflow-hidden" style={{ height: '200px' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="card-img-top product-image w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title fw-semibold mb-2" style={{ height: '48px', overflow: 'hidden' }}>
                      {product.name}
                    </h6>

                    {/* Rating */}
                    <div className="d-flex align-items-center mb-2">
                      <div className="me-2">
                        {renderStars(product.rating)}
                      </div>
                      <small className="text-muted">({product.reviews})</small>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <span className="h5 fw-bold text-primary mb-0">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-muted text-decoration-line-through ms-2">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <div className="mt-auto">
                      <button className="btn btn-add-cart text-white w-100 py-2 fw-semibold">
                        <i className="fas fa-shopping-cart me-2"></i>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicators - Only for Desktop */}
          <div className="d-none d-md-block">
            <button 
              className="btn btn-light position-absolute top-50 start-0 translate-middle-y shadow-sm"
              style={{ zIndex: 10, left: '-15px' }}
              onClick={() => {
                const container = document.querySelector('.products-container');
                container.scrollBy({ left: -300, behavior: 'smooth' });
              }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button 
              className="btn btn-light position-absolute top-50 end-0 translate-middle-y shadow-sm"
              style={{ zIndex: 10, right: '-15px' }}
              onClick={() => {
                const container = document.querySelector('.products-container');
                container.scrollBy({ left: 300, behavior: 'smooth' });
              }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-4">
          <button className="btn btn-outline-primary btn-lg px-4 py-2">
            View All Products
            <i className="fas fa-arrow-right ms-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCollectionShowcase;