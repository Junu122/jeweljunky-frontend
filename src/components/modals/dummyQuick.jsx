import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import Quantity from "../shopDetails/Quantity";
import { useContextElement } from "@/context/Context";

import { allProducts } from "@/data/products";
import { colors, sizeOptions } from "@/data/singleProductOptions";
export default function QuickAdd() {
  const {
    quickAddItem,
    addProductToCart,
    isAddedToCartProducts,
    addToCompareItem,
    isAddedtoCompareItem,
  } = useContextElement();
  const navigate = useNavigate();
  const [product, setProduct] = useState();
  const [currentColor, setCurrentColor] = useState();
  const [currentSize, setCurrentSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState();

  useEffect(() => {
    if (quickAddItem?.productid) {
      setProduct(quickAddItem?.realproduct);
    }
  }, [quickAddItem?.productid]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const groupedByColor = useMemo(() => {
    if (!product?.variants) return {};

    return product.variants.reduce((acc, variant) => {
      const color = variant?.color?.name;
      if (color) {
        if (!acc[color]) acc[color] = [];
        acc[color].push(variant);
      }
      return acc;
    }, {});
  }, [product]);

  console.log(groupedByColor, "groupedByColor");

  // Initialize current color and image when quickAddItem changes
  useEffect(() => {
    if (quickAddItem?.variant?.[0]) {
      const firstVariant = quickAddItem.variant[0];
      setCurrentColor(firstVariant?.color?.name || "");
      setCurrentImage(firstVariant?.images?.[0]?.url || "");
      setCurrentSize("");
    }
  }, [quickAddItem]);

  // Set first available size when color changes
  useEffect(() => {
    if (currentColor && groupedByColor[currentColor]) {
      const firstAvailableSize = groupedByColor[currentColor]?.find(
        (variant) => variant?.inventory?.isInStock
      )?.size?.value;

      setCurrentSize(firstAvailableSize || "");
    }
  }, [currentColor, groupedByColor]);

  // Find selected variant
  const selectedVariant = useMemo(() => {
    if (!currentColor || !currentSize || !groupedByColor[currentColor]) {
      return null;
    }

    return groupedByColor[currentColor]?.find(
      (variant) => variant?.size?.value === currentSize
    );
  }, [currentColor, currentSize, groupedByColor]);

  // Get default price for display
  const defaultPrice = useMemo(() => {
    if (currentColor && groupedByColor[currentColor]?.[0]) {
      return groupedByColor[currentColor][0]?.pricing?.price || 0;
    }
    return 0;
  }, [currentColor, groupedByColor]);

  return (
    <div className="modal fade modalDemo" id="quick_add">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="wrap">
            <div className="tf-product-info-item">
              <div className="image">
                <img
                  alt="image"
                  style={{ objectFit: "contain" }}
                  src={currentImage}
                  width={720}
                  height={1005}
                />
              </div>
              <div className="content">
                <Link to={`/product-detail/${product._id}`}>{item.title}</Link>
                <div className="tf-product-info-price">
                  <div className="price">
                    &#8377;
                    {selectedVariant
                      ? selectedVariant.pricing.price
                      : defaultPrice}
                  </div>
                </div>
              </div>
            </div>
            <div className="tf-product-info-variant-picker mb_15">
              <div className="variant-picker-item">
                <div className="variant-picker-label">
                  Color:
                  <span className="fw-6 variant-picker-label-value">
                    {currentColor}
                  </span>
                </div>
                <form className="variant-picker-values">
                  {groupedByColor &&
                    Object.keys(groupedByColor).map((color, i) => (
                      <React.Fragment key={i}>
                        <input
                          type="radio"
                          name="color1"
                          readOnly
                          checked={currentColor === color}
                        />
                        <label
                          onClick={() => setCurrentColor(color)}
                          className="hover-tooltip radius-60"
                          data-value={color}
                        >
                          <span
                            className={`btn-checkbox ${groupedByColor[color][0].color.class}`}
                          />
                          <span className="tooltip">{color}</span>
                        </label>
                      </React.Fragment>
                    ))}
                </form>
              </div>
              <div className="variant-picker-item">
                <div className="variant-picker-label">
                  Size:{" "}
                  <span className="fw-6 variant-picker-label-value">
                    {" "}
                    {currentSize.value}
                  </span>
                </div>
                <form className="variant-picker-values">
                  {currentColor &&
                    Array.isArray(groupedByColor[currentColor]) &&
                    groupedByColor[currentColor]?.map((variants) => {
                      console.log(
                        variants,
                        "variants..........................."
                      );
                      {
                        /* variants.map((variant,i) => (
                                       <React.Fragment key={i}>
                                         <input
                                           type="radio"
                                           name="size1"
                                           readOnly
                                           checked={true}
                                         />
                                         <label
                                           onClick={() => setCurrentSize(variant.size.value)}
                                           className="style-text"
                                           data-value={variant.size.value}
                                         >
                                           <p>{variant.size.value}</p>
                                         </label>
                                       </React.Fragment>
                                     )); */
                      }
                    })}
                  {groupedByColor &&
                    groupedByColor[currentColor]?.map((variant, i) => (
                      <React.Fragment key={`${i}-${i}`}>
                        <input
                          type="radio"
                          name="size1"
                          readOnly
                          checked={currentSize == variant.size.value}
                          disabled={!variant.inventory.isInStock}
                        />
                        <label
                          onClick={() => {
                            if (variant.inventory.isInStock) {
                              setCurrentSize(variant.size.value);
                            }
                          }}
                          className={`style-text ${
                            !variant.inventory.isInStock ? "disabled" : ""
                          }`}
                          htmlFor={variant.size.value}
                          data-value={variant.size.value}
                          style={{
                            cursor: variant.inventory.isInStock
                              ? "pointer"
                              : "not-allowed",
                            opacity: variant.inventory.isInStock ? 1 : 0.5,
                          }}
                        >
                          {variant.inventory.isInStock ? (
                            <p>{variant.size.value}</p>
                          ) : (
                            <p
                              style={{
                                color: "red",
                                textDecoration: "line-through",
                              }}
                            >
                              {variant.size.value}
                            </p>
                          )}
                        </label>
                      </React.Fragment>
                    ))}
                </form>
              </div>
            </div>
            <div className="tf-product-info-quantity mb_15">
              <div className="quantity-title fw-6">Quantity</div>
              <Quantity />
            </div>
            <div className="tf-product-info-buy-button">
              <form onSubmit={(e) => e.preventDefault()} className="">
                 {
                selectedVariant?(
                       <a
                  className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn"
                  onClick={() => addProductToCart(quickAddItem.productid,selectedVariant)}
                >
                  <span>
                    {isAddedToCartProducts(quickAddItem.productid, selectedVariant)
                      ? "Already Added - "
                      : "Add to cart - "}
                  </span>
                  <span className="tf-qty-price">&#8377;{selectedVariant?selectedVariant.pricing.price:""}</span>
                </a>
                ):(
                     <a
                          className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn"
                          style={{ backgroundColor: "#FF6B6B" }}
                        >
                          <span>out of stock</span>
                        </a>
                )
              }
                <div className="tf-product-btn-wishlist btn-icon-action">
                  <i className="icon-heart" />
                  <i className="icon-delete" />
                </div>
                <a
                  href="#compare"
                  data-bs-toggle="offcanvas"
                  aria-controls="offcanvasLeft"
                  onClick={() => addToCompareItem(product._id)}
                  className="tf-product-btn-wishlist box-icon bg_white compare btn-icon-action"
                >
                  <span className="icon icon-compare" />
                  <span className="icon icon-check" />
                </a>
                <div className="w-100">
                  <a href="#" className="btns-full">
                    Buy with
                    <img
                      alt="image"
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
          </div>
        </div>
      </div>
    </div>
  );
}
