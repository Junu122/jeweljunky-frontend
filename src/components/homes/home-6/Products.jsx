import Productcart2 from "@/components/shopCards/Productcart2";
import { products1 } from "@/data/products";
import { Jewelleryproducts } from "@/data/products";
import React from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {ProductCard} from '@/components/shopCards/ProductCard'
export default function Products({title}) {
  
  return (
    <section className="flat-spacing-2 pt_0">
      <div className="container">
   <div className="flat-title d-flex flex-column justify-content-center align-items-center text-center px-0">
  <span className="title wow fadeInUp" data-wow-delay="0s">
    {title}
  </span>
  <div className="wow fadeInUp" data-wow-delay="0.2s">
    Unmatched design—superior performance and customer satisfaction in one.
  </div>
</div>
        <div className="hover-sw-nav hover-sw-2">
          <Swiper
            dir="ltr"
            className="swiper tf-sw-product-sell wrap-sw-over"
            slidesPerView={4} // Equivalent to data-preview={4}
            spaceBetween={30} // Equivalent to data-space-lg={30}
            breakpoints={{
              1024: {
                slidesPerView: 4, // Equivalent to data-tablet={3}
              },
              640: {
                slidesPerView: 3, // Equivalent to data-tablet={3}
              },
              0: {
                slidesPerView: 2, // Equivalent to data-mobile={2}
                spaceBetween: 15, // Equivalent to data-space-md={15}
              },
            }}
            modules={[Navigation]}
            navigation={{
              prevEl: ".snbp114",
              nextEl: ".snbn114",
            }}
          >
            {Jewelleryproducts.map((product, i) => (
              <SwiperSlide key={i} className="swiper-slide">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="nav-sw nav-next-slider nav-next-product box-icon w_46 round snbp114">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-product box-icon w_46 round snbn114">
            <span className="icon icon-arrow-right" />
          </div>
        </div>
      </div>
    </section>
  );
}
