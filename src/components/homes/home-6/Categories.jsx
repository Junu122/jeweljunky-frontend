import { collectionData3 } from "@/data/categories";
import { Swiper, SwiperSlide } from "swiper/react";

import { Link } from "react-router-dom";
import { Navigation } from "swiper/modules";
export default function Categories({categories,facets}) {

  return (
    <section className="flat-spacing-12 bg_grey-3">
      <div className="container">
        <div
          className="flat-title flex align-items-center px-0 wow fadeInUp"
          data-wow-delay="0s"
        >
          <h3 className="title">Season Collection</h3>
          
        </div>
        <div className="hover-sw-nav hover-sw-2">
          <Swiper
            dir="ltr"
            className="tf-sw-collection"
            slidesPerView={6}
            breakpoints={{
              768: {
                slidesPerView: 6,
                spaceBetween: 50,
              },
              576: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              0: {
                slidesPerView: 3,
              },
            }}
            spaceBetween={15}
            loop={false}
            autoplay={false}
            modules={[Navigation]}
            navigation={{
              prevEl: ".snbp130",
              nextEl: ".snbn130",
            }}
          >
            {categories?.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="collection-item-circle hover-img">
                  <Link
                    to={`/shop-collection-list/${item.name}`}
                    className="collection-image img-style"
                  >
                    <img
                      className="lazyload"
                      data-src={item.image.url}
                      alt={item.image.alt}
                      src={item.image.url}
                      width={400}
                      height={200}
                    />
                  </Link>
                  <div className="collection-content text-center">
                    <Link
                      to={`/shop-collection-list/${item.name}`}
                      className="link title fw-5"
                    >
                      {item.name}
                    </Link>
                   {/* {
                    facets.map((facet) => {
                      if (facet.name === item.name) {
                        return (
                          <div key={facet.name} className="count">
                            {facet.count} items
                          </div>
                        );
                      }
                      return null;
                    })
                   } */}
                  
                 
                    
      
                   
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="sw-dots style-2 sw-pagination-collection justify-content-center" />
          <div className="nav-sw nav-next-slider nav-next-collection snbp130">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-collection snbn130">
            <span className="icon icon-arrow-right" />
          </div>
        </div>
      </div>
    </section>
  );
}
