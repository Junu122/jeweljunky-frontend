import React, { useState, useMemo, useEffect, useCallback, memo } from "react";
import CountdownComponent from "../common/Countdown";
import { paymentImages } from "@/data/singleProductOptions";
import StickyItem from "./StickyItem";
import Quantity from "./Quantity";
import Slider1ZoomOuter from "./sliders/Slider1ZoomOuter";
import { useContextElement } from "@/context/Context";
import { openCartModal } from "@/utlis/openCartModal";

// Loading skeleton component
const ProductSkeleton = memo(() => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded mb-4"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-6 bg-gray-200 rounded mb-4"></div>
    <div className="flex space-x-2 mb-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="w-8 h-8 bg-gray-200 rounded-full"></div>
      ))}
    </div>
  </div>
));

// Error boundary component
const ErrorFallback = memo(({ error, resetError }) => (
  <div className="alert alert-danger text-center p-5">
    <h4>Something went wrong loading product details</h4>
    <p className="mb-3">{error?.message || "Please try again"}</p>
    <button className="btn btn-primary" onClick={resetError}>
      Try Again
    </button>
  </div>
));

// Price display component
const PriceDisplay = memo(({ selectedVariant, defaultPrice, comparePrice }) => {
  const currentPrice = selectedVariant?.pricing?.price || defaultPrice;
  const currentComparePrice = selectedVariant?.pricing?.compareAtPrice || comparePrice;
  
  const discountPercentage = useMemo(() => {
    if (!currentComparePrice || !currentPrice) return 0;
    return Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100);
  }, [currentPrice, currentComparePrice]);

  return (
    <div className="tf-product-info-price">
      <div className="price-on-sale">
        &#8377;{currentPrice?.toLocaleString('en-IN')}
      </div>
      {currentComparePrice && currentComparePrice > currentPrice && (
        <>
          <div className="compare-at-price">
            &#8377;{currentComparePrice.toLocaleString('en-IN')}
          </div>
          <div className="badges-on-sale">
            <span>{discountPercentage}</span>% OFF
          </div>
        </>
      )}
    </div>
  );
});

// Color picker component
const ColorPicker = memo(({ colors, currentColor, onColorChange, groupedByColor }) => (
  <div className="variant-picker-item">
    <div className="variant-picker-label">
      Color:
      <span className="fw-6 variant-picker-label-value">
        {currentColor}
      </span>
    </div>
    <form className="variant-picker-values">
      {colors.map((color) => (
        <React.Fragment key={color}>
          <input
            id={color}
            type="radio"
            name="color1"
            readOnly
            checked={currentColor === color}
            aria-label={`Select ${color} color`}
          />
          <label
            onClick={() => onColorChange(color)}
            className="hover-tooltip radius-60"
            htmlFor={color}
            data-value={color}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onColorChange(color);
              }
            }}
          >
            <span
              className={`btn-checkbox `}
              style={{backgroundColor:`${groupedByColor[color]?.[0]?.color?.value }`}}
            />
            <span className="tooltip">{color}</span>
          </label>
        </React.Fragment>
      ))}
    </form>
  </div>
));

// Size picker component
const SizePicker = memo(({ variants, currentSize, onSizeChange }) => (
  <div className="variant-picker-item">
    <div className="d-flex justify-content-between align-items-center">
      <div className="variant-picker-label">
        Size:
        <span className="fw-6 variant-picker-label-value">
          {currentSize || 'Select Size'}
        </span>
      </div>
      {/* <a
        href="#find_size"
        data-bs-toggle="modal"
        className="find-size fw-6"
      >
        Find your size
      </a> */}
    </div>
    <form className="variant-picker-values">
      {variants?.map((variant) => {
        const isInStock = variant.inventory?.isInStock;
        const sizeValue = variant.size?.value;
        
        return (
          <React.Fragment key={sizeValue}>
            <input
              type="radio"
              name="size1"
              id={sizeValue}
              readOnly
              checked={currentSize === sizeValue}
              disabled={!isInStock}
              aria-label={`Select size ${sizeValue}`}
            />
            <label
              onClick={() => {
                if (isInStock) {
                  onSizeChange(sizeValue);
                }
              }}
              className={`style-text ${!isInStock ? "disabled" : ""}`}
              htmlFor={sizeValue}
              data-value={sizeValue}
              style={{
                cursor: isInStock ? "pointer" : "not-allowed",
                opacity: isInStock ? 1 : 0.5,
              }}
              role="button"
              tabIndex={isInStock ? 0 : -1}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && isInStock) {
                  onSizeChange(sizeValue);
                }
              }}
            >
              {isInStock ? (
                <p>{sizeValue}</p>
              ) : (
                <p style={{
                  color: "red",
                  textDecoration: "line-through",
                }}>
                  {sizeValue}
                </p>
              )}
            </label>
          </React.Fragment>
        );
      })}
    </form>
  </div>
));

// Main component
export default function DetailsOuterZoom({ dummy }) {
  // Early return if no product data
  if (!dummy || !dummy.variants || !Array.isArray(dummy.variants)) {
    return <ProductSkeleton />;
  }

  const [quantity, setQuantity] = useState(1);
  const [currentColor, setCurrentColor] = useState('');
  const [currentSize, setCurrentSize] = useState('');
  const [error, setError] = useState(null);

  // Memoized grouped variants by color
  const groupedByColor = useMemo(() => {
    try {
      return dummy.variants.reduce((acc, variant) => {
        const color = variant?.color?.name;
        if (color) {
          if (!acc[color]) acc[color] = [];
          acc[color].push(variant);
        }
        return acc;
      }, {});
    } catch (err) {
      setError(err);
      return {};
    }
  }, [dummy.variants]);

  // Available colors
  const availableColors = useMemo(() => 
    Object.keys(groupedByColor), [groupedByColor]
  );

  // Selected variant
  const selectedVariant = useMemo(() => {
    if (!currentColor || !currentSize) return null;
    return groupedByColor[currentColor]?.find(
      variant => variant.size?.value === currentSize
    );
  }, [groupedByColor, currentColor, currentSize]);
  console.log("currentColor:", currentColor);
  console.log("currentSize:", currentSize);
  console.log("Selected Variant:", selectedVariant);
  // Default pricing
  const defaultVariant = useMemo(() => 
    groupedByColor[currentColor]?.[0], [groupedByColor, currentColor]
  );

  // Initialize color when component mounts or variants change
  useEffect(() => {
    if (availableColors.length > 0 && !currentColor) {
      setCurrentColor(availableColors[0]);
    }
  }, [availableColors, currentColor]);

  // Update size when color changes
  useEffect(() => {
    if (currentColor && groupedByColor[currentColor]) {
      const firstAvailableSize = groupedByColor[currentColor].find(
        variant => variant.inventory?.isInStock
      )?.size?.value;
      
      setCurrentSize(firstAvailableSize || '');
    }
  }, [currentColor, groupedByColor]);

  // Handlers
  const handleColorChange = useCallback((color) => {
    if (groupedByColor[color]) {
      setCurrentColor(color);
    }
  }, [groupedByColor]);

  const handleSizeChange = useCallback((size) => {
    setCurrentSize(size);
  }, []);

  const handleAddToCart = useCallback(() => {
   
    if (selectedVariant) {
      // openCartModal();
      addProductToCart(dummy._id,selectedVariant, quantity);
    }
  }, [selectedVariant, quantity]);

  const handleRetry = useCallback(() => {
    setError(null);
  }, []);

  // Context
  const {
    addProductToCart,
    isAddedToCartProducts,
    addToCompareItem,
    isAddedtoCompareItem,
    addToWishlist,
    isAddedtoWishlist,
    isAuthenticated
  } = useContextElement();

  // Error state
  if (error) {
    return <ErrorFallback error={error} resetError={handleRetry} />;
  }

  // Stock status
  const isInStock = selectedVariant?.inventory?.isInStock ?? false;
  const stockLevel = selectedVariant?.inventory?.quantity ?? 0;

  return (
    <section
      className="flat-spacing-4 pt_0"
      style={{ maxWidth: "100vw", overflow: "clip" }}
    >
      <div
        className="tf-main-product section-image-zoom"
        style={{ maxWidth: "100vw", overflow: "clip" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="tf-product-media-wrap sticky-top">
                <div className="thumbs-slider">
                  <Slider1ZoomOuter
                    handleColor={handleColorChange}
                    currentColor={currentColor}
                    dummyJewellery={dummy}
                  />
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="tf-product-info-wrap position-relative">
                <div className="tf-zoom-main" />
                <div className="tf-product-info-list other-image-zoom">
                  
                  {/* Product Title */}
                  <div className="tf-product-info-title">
                    <h1 className="h5">
                      {dummy.title || "Product Title"}
                    </h1>
                  </div>

                  {/* Badges */}
                  <div className="tf-product-info-badges">
                    <div className="badges">Best seller</div>
                    <div className="product-status-content">
                      <i className="icon-lightning" />
                      <p className="fw-6">
                        Selling fast! {Math.floor(Math.random() * 100)} people have this in their carts.
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <PriceDisplay 
                    selectedVariant={selectedVariant}
                    defaultPrice={defaultVariant?.pricing?.price}
                    comparePrice={defaultVariant?.pricing?.compareAtPrice}
                  />

                  {/* Stock Status */}
                  {selectedVariant && (
                    <div className="tf-product-info-stock">
                      <div className={`stock-status ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
                        <span className={`stock-indicator ${isInStock ? 'green' : 'red'}`}></span>
                        {isInStock ? (
                          <span>In Stock ({stockLevel} available)</span>
                        ) : (
                          <span>Out of Stock</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Live View Counter */}
                  <div className="tf-product-info-liveview">
                    <div className="liveview-count">{Math.floor(Math.random() * 50) + 10}</div>
                    <p className="fw-6">People are viewing this right now</p>
                  </div>

                  {/* Countdown */}
                  <div className="tf-product-info-countdown">
                    <div className="countdown-wrap">
                      <div className="countdown-title">
                        <i className="icon-time tf-ani-tada" />
                        <p>HURRY UP! SALE ENDS IN:</p>
                      </div>
                      <div className="tf-countdown style-1">
                        <div className="js-countdown">
                          <CountdownComponent labels="Days :,Hours :,Mins :,Secs" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Variant Picker */}
                  <div className="tf-product-info-variant-picker">
                  
                    {availableColors.length > 0 && (
                      <ColorPicker
                        colors={availableColors}
                        currentColor={currentColor}
                        onColorChange={handleColorChange}
                        groupedByColor={groupedByColor}
                      />
                    )}

                    {currentColor && groupedByColor[currentColor] && (
                      <SizePicker
                        variants={groupedByColor[currentColor]}
                        currentSize={currentSize}
                        onSizeChange={handleSizeChange}
                      />
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="tf-product-info-quantity">
                    <div className="quantity-title fw-6">Quantity</div>
                    <Quantity 
                      setQuantity={setQuantity} 
                      maxvalue={selectedVariant?.inventory?.quantity }
                    />
                  </div>

                  {/* Buy Buttons */}
                  <div className="tf-product-info-buy-button">
                    <form onSubmit={(e) => e.preventDefault()}>
                      {isInStock && selectedVariant ? (
                        <button
                          type="button"
                          onClick={handleAddToCart}
                          className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn"
                          disabled={!selectedVariant}
                        >
                          <span>
                            {isAddedToCartProducts(dummy._id,selectedVariant._id)
                              ? "Already Added"
                              : "Add to cart"
                            }
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1"
                          style={{ backgroundColor: "#FF6B6B" }}
                          disabled
                        >
                          <span>
                            {!selectedVariant ? "Out of stock" : "null" }
                          </span>
                        </button>
                      )}

                      {/* Action Buttons */}
                      <button
                        type="button"
                        onClick={() => addToWishlist(dummy._id)}
                        className={`tf-product-btn-wishlist hover-tooltip box-icon bg_white wishlist btn-icon-action
                        ${isAddedtoWishlist(dummy._id) ? "added" : ""}`}
                        aria-label="Add to wishlist"
                        style={{backgroundColor:`${isAddedtoWishlist?"black" :"red"}`}}
                        
                      >
                        <span
                          className={`icon icon-heart`}
                        />
                        <span className="tooltip">
                          {isAddedtoWishlist(dummy._id)
                            ? "Already Wishlisted"
                            : "Add to Wishlist"
                          }
                        </span>
                        <span className="icon icon-delete" />
                      </button>

                      {/* <button
                        type="button"
                        onClick={() => addToCompareItem(dummy._id)}
                        className="tf-product-btn-wishlist hover-tooltip box-icon bg_white compare btn-icon-action"
                        aria-label="Add to compare"
                      >
                        <span
                          className={`icon icon-compare ${
                            isAddedtoCompareItem(dummy._id) ? "added" : ""
                          }`}
                        />
                        <span className="tooltip">
                          {isAddedtoCompareItem(dummy._id)
                            ? "Already Compared"
                            : "Add to Compare"
                          }
                        </span>
                        <span className="icon icon-check" />
                      </button> */}

                      {/* Payment Options */}
                      <div className="w-100">
                        <a href="#" className="btns-full">
                          Buy with
                          <img
                            alt="PayPal"
                            src="/images/payments/paypal.png"
                            width={64}
                            height={18}
                          />
                        </a>
                        <a href="#" className="payment-more-option">
                          More payment options
                        </a>
                      </div>
                    </form>
                  </div>

                  {/* Extra Links */}
                  <div className="tf-product-info-extra-link">
                    <a
                      href="#compare_color"
                      data-bs-toggle="modal"
                      className="tf-product-extra-icon"
                    >
                      <div className="icon">
                        <img
                          alt="Compare colors"
                          src="/images/item/compare.svg"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="text fw-6">Compare color</div>
                    </a>
                    <a
                      href="#ask_question"
                      data-bs-toggle="modal"
                      className="tf-product-extra-icon"
                    >
                      <div className="icon">
                        <i className="icon-question" />
                      </div>
                      <div className="text fw-6">Ask a question</div>
                    </a>
                    <a
                      href="#delivery_return"
                      data-bs-toggle="modal"
                      className="tf-product-extra-icon"
                    >
                      <div className="icon">
                        <svg
                          className="d-inline-block"
                          xmlns="http://www.w3.org/2000/svg"
                          width={22}
                          height={18}
                          viewBox="0 0 22 18"
                          fill="currentColor"
                        >
                          <path d="M21.7872 10.4724C21.7872 9.73685 21.5432 9.00864 21.1002 8.4217L18.7221 5.27043C18.2421 4.63481 17.4804 4.25532 16.684 4.25532H14.9787V2.54885C14.9787 1.14111 13.8334 0 12.4255 0H9.95745V1.69779H12.4255C12.8948 1.69779 13.2766 2.07962 13.2766 2.54885V14.5957H8.15145C7.80021 13.6052 6.85421 12.8936 5.74468 12.8936C4.63515 12.8936 3.68915 13.6052 3.33792 14.5957H2.55319C2.08396 14.5957 1.70213 14.2139 1.70213 13.7447V2.54885C1.70213 2.07962 2.08396 1.69779 2.55319 1.69779H9.95745V0H2.55319C1.14528 0 0 1.14111 0 2.54885V13.7447C0 15.1526 1.14528 16.2979 2.55319 16.2979H3.33792C3.68915 17.2884 4.63515 18 5.74468 18C6.85421 18 7.80021 17.2884 8.15145 16.2979H13.423C13.7742 17.2884 14.7202 18 15.8297 18C16.9393 18 17.8853 17.2884 18.2365 16.2979H21.7872V10.4724ZM16.684 5.95745C16.9494 5.95745 17.2034 6.08396 17.3634 6.29574L19.5166 9.14894H14.9787V5.95745H16.684ZM5.74468 16.2979C5.27545 16.2979 4.89362 15.916 4.89362 15.4468C4.89362 14.9776 5.27545 14.5957 5.74468 14.5957C6.21392 14.5957 6.59575 14.9776 6.59575 15.4468C6.59575 15.916 6.21392 16.2979 5.74468 16.2979ZM15.8298 16.2979C15.3606 16.2979 14.9787 15.916 14.9787 15.4468C14.9787 14.9776 15.3606 14.5957 15.8298 14.5957C16.299 14.5957 16.6809 14.9776 16.6809 15.4468C16.6809 15.916 16.299 16.2979 15.8298 16.2979ZM18.2366 14.5957C17.8853 13.6052 16.9393 12.8936 15.8298 12.8936C15.5398 12.8935 15.252 12.943 14.9787 13.04V10.8511H20.0851V14.5957H18.2366Z" />
                        </svg>
                      </div>
                      <div className="text fw-6">Delivery &amp; Return</div>
                    </a>
                    <a
                      href="#share_social"
                      data-bs-toggle="modal"
                      className="tf-product-extra-icon"
                    >
                      <div className="icon">
                        <i className="icon-share" />
                      </div>
                      <div className="text fw-6">Share</div>
                    </a>
                  </div>

                  {/* Delivery Info */}
                  <div className="tf-product-info-delivery-return">
                    <div className="row">
                      <div className="col-xl-6 col-12">
                        <div className="tf-product-delivery">
                          <div className="icon">
                            <i className="icon-delivery-time" />
                          </div>
                          <p>
                            Estimate delivery times:
                            <span className="fw-7">12-26 days</span>
                            (International),
                            <span className="fw-7">3-6 days</span> (All indian
                            States).
                          </p>
                        </div>
                      </div>
                      <div className="col-xl-6 col-12">
                        <div className="tf-product-delivery mb-0">
                          <div className="icon">
                            <i className="icon-return-order" />
                          </div>
                          <p>
                            Return within <span className="fw-7">30 days</span>{" "}
                            of purchase. Fees &amp; taxes are non-refundable.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trust Seal */}
                  <div className="tf-product-info-trust-seal">
                    <div className="tf-product-trust-mess">
                      <i className="icon-safe" />
                      <p className="fw-6">
                        Guarantee Safe <br />
                        Checkout
                      </p>
                    </div>
                    <div className="tf-payment">
                      {paymentImages.map((image, index) => (
                        <img
                          key={index}
                          alt={image.alt}
                          src={image.src}
                          width={image.width}
                          height={image.height}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StickyItem />
    </section>
  );
}