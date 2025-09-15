import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { Navigation, Autoplay } from "swiper/modules";
import {ArrowBigRight,ArrowBigLeft} from 'lucide-react'

export default function Categories({ categories, facets }) {
  return (
    <>
      <section className="py-5 bg-light">
        <div className="container">
          {/* Modern Header Section */}
          <div className="text-center mb-5">
            <div className="d-flex align-items-center justify-content-center mb-3">
              <div className="bg-dark me-3" style={{width: '32px', height: '2px', opacity: '0.3'}}></div>
              <span className="text-uppercase text-muted fw-medium" style={{fontSize: '0.875rem', letterSpacing: '0.1em'}}>
                Discover
              </span>
              <div className="bg-dark ms-3" style={{width: '32px', height: '2px', opacity: '0.3'}}></div>
            </div>
            
            <h2 className="display-4 fw-bold text-dark mb-3">
              Shop By{" "}
              <span className="text-dark">Categories</span>
            </h2>
            
            <p className="lead text-muted mx-auto" style={{maxWidth: '600px'}}>
              Explore our carefully curated collection of premium products
            </p>
            
            {/* Decorative element */}
            <div className="mt-4 d-flex justify-content-center">
              <div className="bg-dark rounded-pill" style={{width: '96px', height: '4px', opacity: '0.6'}}></div>
            </div>
          </div>

          {/* Categories Carousel */}
          <div className="position-relative modern-categories-wrapper">
            <Swiper
              dir="ltr"
              className="categories-swiper pb-4"
              slidesPerView={6}
              breakpoints={{
                1200: {
                  slidesPerView: 6,
                  spaceBetween: 20,
                },
                992: {
                  slidesPerView: 5,
                  spaceBetween: 25,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
                576: {
                  slidesPerView: 4,
                  spaceBetween: 15,
                },
                0: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
              }}
              spaceBetween={30}
              loop={categories?.length > 6}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              modules={[Navigation, Autoplay]}
              navigation={{
                prevEl: ".categories-prev",
                nextEl: ".categories-next",
              }}
            >
              {categories?.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="category-item">
                    <Link
                      to={`/shop-collection-list/${item.name}`}
                      className="text-decoration-none"
                    >
                      {/* Circular Card Container */}
                      <div className="category-card text-center">
                        {/* Circular Image Container */}
                        <div className="category-circle-wrapper mx-auto mb-3 position-relative overflow-hidden bg-white shadow-sm">
                          <img
                            className="category-image w-100 h-100 object-fit-cover"
                            src={item.image.url}
                            alt={item.image.alt}
                            loading="lazy"
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="category-overlay position-absolute top-0 start-0 w-100 h-100"></div>
                        </div>
                        
                        {/* Content Below Circle */}
                        <div className="category-content">
                          <h5 className="category-title mb-1" style={{fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight:"800"}}>
                            {item.name} <br/>

                          </h5>
                          
                          {/* Item Count */}
                          {facets?.map((facet) => {
                            if (facet.name === item.name) {
                              return (
                                <p key={facet.name} className="category-count  mb-0" style={{fontSize: '0.75rem'}}>
                                  {facet.count} items
                                </p>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            <button className="categories-prev btn btn-light rounded-circle position-absolute start-0 top-50 translate-middle-y shadow-sm d-none d-md-flex align-items-center justify-content-center" 
                    style={{width: '48px', height: '48px', zIndex: '10', left: '1rem'}}>
              <ArrowBigLeft  />
            </button>
            
            <button className="categories-next btn btn-light rounded-circle position-absolute end-0 top-50 translate-middle-y shadow-sm d-none d-md-flex align-items-center justify-content-center" 
                    style={{width: '48px', height: '48px', zIndex: '10', right: '1rem'}}>
              <ArrowBigRight />
            </button>
          </div>
        </div>
      </section>

      {/* Custom CSS Styles */}
      <style jsx>{`
        body {
          overflow-x: hidden;
        }

        .modern-categories-wrapper:hover .categories-prev,
        .modern-categories-wrapper:hover .categories-next {
          opacity: 1;
          visibility: visible;
        }

        .categories-prev,
        .categories-next {
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,0,0,0.1) !important;
        }

        .categories-prev:hover,
        .categories-next:hover {
          transform: translateY(-50%) scale(1.05);
          box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important;
        }

        .category-item {
          height: 100%;
          display: flex;
          align-items: center;
        }

        .category-card {
          transition: all 0.3s ease;
          width: 100%;
        }

        .category-card:hover {
          transform: translateY(-8px);
        }

        /* Circular Image Container */
        .category-circle-wrapper {
          width: 220px;
          height: 220px;
          border-radius: 50%;
          position: relative;
          overflow: hidden;
          border: 3px solid rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .category-circle-wrapper:hover {
          border-color: rgba(0,0,0,0.15);
          transform: scale(1.05);
          box-shadow: 0 0.75rem 1.5rem rgba(0,0,0,0.15) !important;
        }

        .category-image {
          transition: transform 0.5s ease;
          border-radius: 50%;
        }

        .category-card:hover .category-image {
          transform: scale(1.1);
        }

        .category-overlay {
          background: linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 50%;
        }

        .category-card:hover .category-overlay {
          opacity: 1;
        }

        .category-title {
          transition: color 0.3s ease;
          color: #333;
        }

        .category-card:hover .category-title {
          color: #000 !important;
        }

        .categories-swiper {
          overflow: visible;
          padding: 2rem 0;
        }

        .categories-swiper .swiper-slide {
          height: auto;
        }

        /* Custom background gradient */
        .bg-light {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
        }

        /* Responsive adjustments */
        @media (max-width: 992px) {
          .category-circle-wrapper {
            width: 100px;
            height: 100px;
          }
        }

        @media (max-width: 768px) {
          .display-4 {
            font-size: 2.5rem;
          }
          
          .categories-prev,
          .categories-next {
            display: none !important;
          }

          .category-circle-wrapper {
            width: 90px;
            height: 90px;
          }
        }

        @media (max-width: 576px) {
          .display-4 {
            font-size: 2rem;
          }
          
          .category-circle-wrapper {
            width: 80px;
            height: 80px;
          }

          .category-title {
            font-size: 0.85rem !important;
          }

          .category-count {
            font-size: 0.7rem !important;
          }
        }
      `}</style>
    </>
  );
}