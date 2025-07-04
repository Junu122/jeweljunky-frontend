import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContextElement } from "@/context/Context";
import CountdownComponent from "../common/Countdown";
import { toast } from 'sonner'
export const ProductCardWishlist = ({ product }) => {

  
  const {  getWishlistItem } = useContextElement();
  const {
    setQuickAddItem,
    addToWishlist,
    isAddedtoWishlist,
    removeFromWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
  } = useContextElement();

  // Get the wishlist item to retrieve the selected variant
  const wishlistItem = getWishlistItem(product?.id || []);
  
  const [currentImage, setCurrentImage] = useState('');
  const [currentColor, setCurrentColor] = useState('');
  const [currentVariant, setCurrentVariant] = useState(null);

  const groupedByColor = useMemo(() => {
    return product?.variants?.reduce((acc, variant) => {
      const color = variant.color.name;
      if (!acc[color]) acc[color] = [];
      acc[color].push(variant);
      return acc;
    }, {});
  }, [product]);

  // Function to find the variant that was saved in wishlist
  const getSelectedVariant = useMemo(() => {
    if (!groupedByColor || !wishlistItem) {
      return {
        variant: product?.variants?.[0] || null,
        color: Object.keys(groupedByColor || {})[0] || ''
      };
    }

    // Try to find the exact variant that was saved
    if (wishlistItem.variantId) {
      const savedVariant = product.variants.find(v => v.id === wishlistItem.variantId);
      if (savedVariant) {
        return {
          variant: savedVariant,
          color: savedVariant.color.name
        };
      }
    }

    // If variantId not found, try to match by color and size
    if (wishlistItem.color) {
      const colorVariants = groupedByColor[wishlistItem.color];
      if (colorVariants) {
        const matchingVariant = wishlistItem.size 
          ? colorVariants.find(v => v.size.value === wishlistItem.size)
          : colorVariants[0];
        
        if (matchingVariant) {
          return {
            variant: matchingVariant,
            color: wishlistItem.color
          };
        }
      }
    }

    // Fallback to first variant
    return {
      variant: product?.variants?.[0] || null,
      color: Object.keys(groupedByColor || {})[0] || ''
    };
  }, [product, groupedByColor, wishlistItem]);

  useEffect(() => {
    if (!groupedByColor || Object.keys(groupedByColor).length === 0) return;
    
    const { variant, color } = getSelectedVariant;
    
    if (variant && color) {
      setCurrentImage(variant.images[0].url);
      setCurrentColor(color);
      setCurrentVariant(variant);
    }
  }, [product, groupedByColor, getSelectedVariant]);

  const handleColorChange = (color) => {
    const selectedVariant = groupedByColor[color][0];
    setCurrentImage(selectedVariant.images[0].url);
    setCurrentColor(color);
    setCurrentVariant(selectedVariant);
  };

  const handleRemoveProduct=async(productid)=>{
   const result=await removeFromWishlist(productid);
   if(result?.success){
     toast.success(result.message, {
      description: " 🖤",
      duration: 4000,
   
    });
   }else{
         toast.error("error occured", {
      description: result.message,
      duration: 4000,
   
    });
   }
   console.log("result in removing product",result)
  }
  // Show loading state if data is not ready
  if ( !currentImage) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card-product fl-item" key={product.id}>
      <div className="card-product-wrapper">
        <Link to={`/product-detail/${product.id}`} className="product-img">
          <img
            className="lazyload img-product"
            data-src={currentImage}
            src={currentImage}
            alt="image-product"
            width={720}
            height={1005}
          />
          <img
            className="lazyload img-hover"
            data-src={
              product.imgHoverSrc ? product.imgHoverSrc : product.variants[0].images[0].url
            }
            src={product.imgHoverSrc ? product.imgHoverSrc : product.variants[0].images[0].url}
            alt="image-product"
            width={720}
            height={1005}
          />
        </Link>
        <div className="list-product-btn type-wishlist">
          <a
            onClick={() => handleRemoveProduct(product._id)}
            className="box-icon bg_white wishlist"
          >
            <span className="tooltip">Remove Wishlist</span>
            <span className="icon icon-delete" />
          </a>
        </div>

        <div className="list-product-btn">
          <a
            href="#quick_add"
              onClick={() => setQuickAddItem({
                  productid:product._id,
                  variant:groupedByColor[currentColor],
                  realproduct:product
                })}
            data-bs-toggle="modal"
            className="box-icon bg_white quick-add tf-btn-loading"
          >
            <span className="icon icon-bag" />
            <span className="tooltip">Quick Add</span>
          </a>
          <a
            // onClick={() => addToWishlist(product.id, currentVariant)}
            className={`box-icon bg_white  wishlist btn-icon-action ${
              isAddedtoWishlist(product.id) ? "added" : ""
            }`}
          >
            <span
              className={`icon icon-heart ${
                isAddedtoWishlist(product.id) ? "added" : ""
              }`}
            />
            <span className="tooltip">
              {isAddedtoWishlist(product.id)
                ? "Already Wishlisted"
                : "Add to Wishlist"}
            </span>
            <span className="icon icon-delete" />
          </a>
          {/* <a
            href="#compare"
            data-bs-toggle="offcanvas"
            aria-controls="offcanvasLeft"
            onClick={() => addToCompareItem(product.id)}
            className="box-icon bg_white compare btn-icon-action"
          >
            <span
              className={`icon icon-compare ${
                isAddedtoCompareItem(product.id) ? "added" : ""
              }`}
            />
            <span className="tooltip">
              {isAddedtoCompareItem(product.id)
                ? "Already Compared"
                : "Add to Compare"}
            </span>
            <span className="icon icon-check" />
          </a> */}
          {/* <a
            href="#quick_view"
            onClick={() => setQuickViewItem(product)}
            data-bs-toggle="modal"
            className="box-icon bg_white quickview tf-btn-loading"
          >
            <span className="icon icon-view" />
            <span className="tooltip">Quick View</span>
          </a> */}
        </div>
        
        {product.countdown && (
          <div className="countdown-box">
            <div className="js-countdown">
              <CountdownComponent />
            </div>
          </div>
        )}
        
        {/* Display the selected variant info */}
        <div className="wishlist-variant-info">
          <small>
            Selected: {currentColor} - {currentVariant.size.value}
          </small>
        </div>

        {product.variants && (
          <div className="size-list">
            {groupedByColor[currentColor]?.map((variant) => (
              <span 
                key={variant.size.value}   
                style={{
                  textDecoration: variant.inventory.isInStock ? "none" : "line-through",
                  color: variant.inventory.isInStock ? "white" : "gray",
                  fontWeight: variant.id === currentVariant.id ? "bold" : "normal",
                  
                }} 
                title={variant.inventory.isInStock ? "" : "Out of stock"}
              > 
                {variant.size.value}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="card-product-info">
        <Link to={`/product-detail/${product.id}`} className="title link">
          {product.title}
        </Link>
        <span className="price">&#8377;{currentVariant?.pricing?.price.toFixed(2)}</span>
        
        {product.variants && (
          <ul className="list-color-product">
            {Object.keys(groupedByColor).map((color, i) => (
              <li
                className={`list-color-item color-swatch ${
                  currentColor === color ? "active" : ""
                }`}
                key={i}
                onMouseOver={() => handleColorChange(color)}
              >
                <span className="tooltip">{color}</span>
                <span  style={{
                    backgroundColor: groupedByColor[color][0].color.value,
                  }} className={`swatch-value `} />
                <img
                  className="lazyload"
                  data-src={groupedByColor[color][0].images[0].url}
                  src={groupedByColor[color][0].images[0].url}
                  alt="image-product"
                  width={720}
                  height={1005}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};