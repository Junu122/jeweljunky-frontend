import Productcart2 from "@/components/shopCards/Productcart2";
import { products1 } from "@/data/products";
import { Jewelleryproducts } from "@/data/products";
import { dummyJewellery } from "@/data/products";
import React, { useState, useRef } from "react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCard } from "@/components/shopCards/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Products({ title, data }) {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef(null);
 
  // Safety check for products data
  const products = data?.products || [];
 
  const hasProducts = products.length > 0;

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const goToPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const goToNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  // Early return if no products
  if (!hasProducts) {
    return (
      <section className="products-showcase">
        <div className="products-container">
          <div className="products-header">
            <div className="header-content">
              <div className="title-wrapper">
                <h2 className="main-title" style={{textTransform: "uppercase"}}>
                  {title}
                  <span className="title-accent" ></span>
                </h2>
                {data?.subtitle && (
                  <p className="subtitle" style={{textTransform: "capitalize"}}>
                    {data.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* No products message */}
          <div className="no-products">
            <p>No products available at the moment.</p>
          </div>
        </div>

        <style jsx>{`
          .products-showcase {
            padding: 4rem 0;
            background: #ffffff;
            position: relative;
          }

          .products-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 1.5rem;
          }

          .products-header {
            margin-bottom: 3rem;
          }

          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 2rem;
          }

          .title-wrapper {
            flex: 1;
          }

          .main-title {
            font-size: clamp(2rem, 4vw, 3.5rem);
            font-weight: 700;
            line-height: 1.2;
            color: #000000;
            margin-bottom: 0.75rem;
            position: relative;
            letter-spacing: -0.025em;
          }

          .title-accent {
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 60px;
            height: 4px;
            background: #000000;
            border-radius: 2px;
          }

          .subtitle {
            font-size: 1.125rem;
            color: #000000;
            font-weight: 400;
            line-height: 1.6;
            max-width: 600px;
          }

          .no-products {
            text-align: center;
            padding: 4rem 0;
            color: #64748b;
            font-size: 1.125rem;
          }

          @media (max-width: 768px) {
            .products-showcase {
              padding: 2.5rem 0;
            }

            .products-container {
              padding: 0 1rem;
            }

            .header-content {
              flex-direction: column;
              align-items: flex-start;
            }

            .no-products {
              padding: 2rem 0;
              font-size: 1rem;
            }
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="products-showcase">
      <div className="products-container">
        {/* Enhanced Header Section */}
        <div className="products-header">
          <div className="header-content">
            <div className="title-wrapper">
              <h2 className="main-title" style={{textTransform: "uppercase"}}>
                {title}
                <span className="title-accent"></span>
              </h2>
              {data?.subtitle && (
                <p className="subtitle" style={{textTransform: "capitalize"}}>
                  {data.subtitle}
                </p>
              )}
            </div>
            
            {/* Custom Navigation Buttons */}
            <div className="nav-controls">
              <button 
                className={`nav-btn nav-prev ${isBeginning ? 'disabled' : ''}`}
                onClick={goToPrev}
                disabled={isBeginning}
                aria-label="Previous products"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                className={`nav-btn nav-next ${isEnd ? 'disabled' : ''}`}
                onClick={goToNext}
                disabled={isEnd}
                aria-label="Next products"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Swiper */}
        <div className="products-carousel">
          <Swiper
            ref={swiperRef}
            dir="ltr"
            className="products-swiper"
            slidesPerView={5}
            spaceBetween={24}
            speed={800}
            loop={false}
            grabCursor={true}
            breakpoints={{
              1200: {
                slidesPerView: 5,
                spaceBetween: 24,
              },
              992: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
              576: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              480: {
                slidesPerView: 2,
                spaceBetween: 12,
              },
              0: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
            }}
            modules={[Navigation, Pagination, Autoplay]}
            onSlideChange={handleSlideChange}
            onSwiper={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
          >
            {products.map((product, index) => (
              <>
              {
                (
                  <SwiperSlide key={index} className="product-slide">
                    <div className="product-wrapper">
                      <ProductCard product={product} />
                    </div>
                  </SwiperSlide>
                ) 
              }
              {/* <SwiperSlide key={index} className="product-slide">
                <div className="product-wrapper">
                  <ProductCard product={product?.product} />
                </div>
              </SwiperSlide> */}
              </>
            ))}
          </Swiper>
          
          {/* Progress Indicator */}
          <div className="swiper-pagination-progress">
            <div className="progress-bar"></div>
          </div>
        </div>
      </div>

      {/* Enhanced Styles */}
      <style jsx>{`
        .products-showcase {
          padding: 4rem 0;
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .products-showcase::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);
        }

        .products-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .products-header {
          margin-bottom: 3rem;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 2rem;
        }

        .title-wrapper {
          flex: 1;
        }

        .main-title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 700;
          line-height: 1.2;
          color: #000000;
          margin-bottom: 0.75rem;
          position: relative;
          letter-spacing: -0.025em;
        }

        .title-accent {
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 60px;
          height: 4px;
          background: #000000;
          border-radius: 2px;
        }

        .subtitle {
          font-size: 1.125rem;
          color: #000000;
          font-weight: 400;
          line-height: 1.6;
          max-width: 600px;
        }

        .nav-controls {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .nav-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid #e2e8f0;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #64748b;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .nav-btn:hover:not(.disabled) {
          border-color: #000000;
          color: #000000;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .nav-btn:active:not(.disabled) {
          transform: translateY(0);
        }

        .nav-btn.disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .products-carousel {
          position: relative;
        }

        .products-swiper {
          overflow: visible;
          padding: 1rem 0 2rem;
        }

        .product-slide {
          height: auto;
        }

        .product-wrapper {
          transition: transform 0.3s ease;
          height: 100%;
        }

        .product-wrapper:hover {
          transform: translateY(-4px);
        }

        .swiper-pagination-progress {
          margin-top: 2rem;
          height: 3px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .progress-bar {
          height: 100%;
          background: #000000;
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .products-showcase {
            padding: 2.5rem 0;
          }

          .products-container {
            padding: 0 1rem;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
          }

          .nav-controls {
            align-self: flex-end;
          }

          .nav-btn {
            width: 44px;
            height: 44px;
          }

          .products-header {
            margin-bottom: 2rem;
          }
        }

        @media (max-width: 480px) {
          .main-title {
            font-size: 2rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .products-container {
            padding: 0 0.75rem;
          }

          .products-swiper {
            padding: 0.5rem 0 1.5rem;
          }
        }

        /* Very small screens optimization */
        @media (max-width: 360px) {
          .products-container {
            padding: 0 0.5rem;
          }
          
          .nav-controls {
            display: none;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .products-showcase {
            background: white;
          }

          .main-title {
            color: black;
          }

          .title-accent {
            background: #ffffff;
          }

          .subtitle {
            color: gray;
          }

          .nav-btn {
            background: #1e293b;
            border-color: #334155;
            color: #94a3b8;
          }

          .nav-btn:hover:not(.disabled) {
            background: #334155;
            border-color: #ffffff;
            color: #ffffff;
          }

          .swiper-pagination-progress {
            background: #334155;
          }

          .progress-bar {
            background: #ffffff;
          }
        }

        /* Animation for entrance */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .products-showcase {
          animation: fadeInUp 0.8s ease-out;
        }

        /* Smooth scrolling for touch devices */
        .products-swiper {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </section>
  );
}