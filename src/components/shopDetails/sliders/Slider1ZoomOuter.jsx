import Drift from "drift-zoom";
import { useMemo } from "react";
import { useEffect, useRef, useState } from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Slider1ZoomOuter({
 

  currentColor,
  handleColor = () => {},

  
  dummyJewellery
}) {
  const [updatedImages, setUpdatedImages] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const swiperRef = useRef(null);
const allVariantImages = useMemo(() => {
  return dummyJewellery.variants.flatMap((variant, variantIndex) =>
    variant.images.map((img, imgIndex) => ({
      id: `${variant.id}-${imgIndex}`,
      src: img.url,
      alt: img.alt || `${dummyJewellery.title} - ${variant.color.name}`,
      width: 770,
      height: 1075,
      dataValue: variant.color.name, // This is crucial for filtering
    }))
  );
}, [dummyJewellery]);

useEffect(() => {

  if (allVariantImages && allVariantImages.length > 0) {
    setUpdatedImages(allVariantImages);
  }
}, [allVariantImages]);



  // useEffect(()=>{
  //    if (dummyJewellery && product.colors) {
  //     const dynamicImages = product.colors.map((color, index) => ({
  //       id: index + 1,
  //       src: color.imgSrc,
  //       alt: `${product.title} - ${color.name}`,
  //       width: 770, // You can adjust these dimensions as needed
  //       height: 1075,
  //       dataValue: color.name,
  //     }));

  //     // If firstImage is provided, update the first image
  //     if (firstImage && dynamicImages.length > 0) {
  //       dynamicImages[0] = { ...dynamicImages[0], src: firstImage };
  //     }

  //     setUpdatedImages(dynamicImages);
  //   }
  // },[product,firstImage])

  // useEffect(() => {
  //   const slideIndex =
  //     updatedImages.filter(
  //       (elm) => elm.dataValue?.toLowerCase() == currentColor.toLowerCase()
  //     )[0]?.id - 1;
  //   swiperRef.current.slideTo(slideIndex);
  // }, [currentColor]);

useEffect(() => {
  if (!updatedImages.length || !currentColor) return;

  const slideIndex = updatedImages.findIndex(
    (img) =>
      img.dataValue == currentColor
  );

  if (slideIndex >= 0) {
    swiperRef.current?.slideTo(slideIndex);
  }
}, [currentColor, updatedImages]);


  useEffect(() => {
    // Function to initialize Drift
    const imageZoom = () => {
      const driftAll = document.querySelectorAll(".tf-image-zoom");
      const pane = document.querySelector(".tf-zoom-main");

      driftAll.forEach((el) => {
        new Drift(el, {
          zoomFactor: 2,
          paneContainer: pane,
          inlinePane: false,
          handleTouch: false,
          hoverBoundingBox: true,
          containInline: true,
        });
      });
    };
    imageZoom();
    const zoomElements = document.querySelectorAll(".tf-image-zoom");

    const handleMouseOver = (event) => {
      const parent = event.target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.add("zoom-active");
      }
    };

    const handleMouseLeave = (event) => {
      const parent = event.target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.remove("zoom-active");
      }
    };

    zoomElements.forEach((element) => {
      element.addEventListener("mouseover", handleMouseOver);
      element.addEventListener("mouseleave", handleMouseLeave);
    });

    // Cleanup event listeners on component unmount
    return () => {
      zoomElements.forEach((element) => {
        element.removeEventListener("mouseover", handleMouseOver);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []); // Empty dependency array to run only once on mount

  return (
    <>
      <Swiper
        dir="ltr"
        direction="vertical"
        spaceBetween={10}
        slidesPerView={6}
        className="tf-product-media-thumbs other-image-zoom"
        onSwiper={setThumbsSwiper}
        modules={[Thumbs]}
        breakpoints={{
          0: {
            direction: "horizontal",
          },
          1150: {
            direction: "vertical",
          },
        }}
      >
        {updatedImages.map((slide, index) => (
          <SwiperSlide key={index} className="stagger-item">
            <div className="item">
              <img
                className="lazyload"
                data-src={slide.src}
                alt={""}
                src={slide.src} // Optional fallback for non-lazy loading
                width={slide.width}
                height={slide.height}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Gallery>
        <Swiper
          dir="ltr"
          spaceBetween={10}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          className="tf-product-media-main"
          id="gallery-swiper-started"
          thumbs={{ swiper: thumbsSwiper }}
          modules={[Thumbs, Navigation]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => {
            if (updatedImages[swiper.activeIndex]?.dataValue) {
             
              handleColor(updatedImages[swiper.activeIndex].dataValue);
             
            }
          }}
        >
          {updatedImages.map((slide, index) => (
            <SwiperSlide key={index}>
              <Item
                original={slide.src}
                thumbnail={slide.src}
                width={slide.width}
                height={slide.height}
              >
                {({ ref, open }) => (
                  <a
                    className="item"
                    data-pswp-width={slide.width}
                    data-pswp-height={slide.height}
                    onClick={open}
                  >
                    <img
                      className="tf-image-zoom lazyload"
                      data-zoom={slide.src}
                      data-src={slide.src}
                      ref={ref}
                      alt="image"
                      width={slide.width}
                      height={slide.height}
                      src={slide.src} // Optional fallback for non-lazy loading
                    />
                  </a>
                )}
              </Item>
            </SwiperSlide>
          ))}

          {/* Navigation buttons */}
          <div className="swiper-button-next w_36 h_36 button-style-arrow thumbs-next"></div>
          <div className="swiper-button-prev button-style-arrow thumbs-prev"></div>
        </Swiper>{" "}
      </Gallery>
    </>
  );
}
