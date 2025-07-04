import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useContextElement } from "@/context/Context";
import CountdownComponent from "../common/Countdown";
import { useSearchParams } from "react-router-dom";
import { useProductView } from "@/hooks/userProductView";
import { toast } from 'sonner'
import {useNavigate} from 'react-router-dom'
export const ProductCard = ({ product }) => {
  const navigate=useNavigate()
  const { trackView } = useProductView();
  const [searchParams, setSearchParams] = useSearchParams();
  const colors = searchParams.get('filter.p.color');

  const [currentImage, setCurrentImage] = useState(product.variants[0].images[0].url);
  const [currentColor, setCurrentColor] = useState();
  const [currentVariant, setCurrentVariant] = useState(product?.variants[0]);
  
  const { isAuthenticated, loading} = useContextElement();
  const {
    setQuickAddItem,
    addToWishlist,
    isAddedtoWishlist,
  } = useContextElement();

  const groupedByColor = useMemo(() => {
    return product?.variants?.reduce((acc, variant) => {
      const color = variant.color.name;
      if (!acc[color]) acc[color] = [];
      acc[color].push(variant);
      return acc;
    }, {});
  }, [product]);

  // Function to get the color to display based on URL params
  const getInitialColor = useMemo(() => {
    if (!colors || !groupedByColor) return Object.keys(groupedByColor)[0];
    
    // Split colors from URL params (assuming comma-separated if multiple)
    const urlColors = colors.toLowerCase().split(',').map(color => color.trim());
    const availableColors = Object.keys(groupedByColor).map(color => color.toLowerCase());
    
    // Find the first matching color that exists in the product
    for (const urlColor of urlColors) {
      const matchingColor = Object.keys(groupedByColor).find(
        productColor => productColor.toLowerCase() === urlColor
      );
      if (matchingColor) {
        return matchingColor;
      }
    }
    
    // If no URL color matches, return the first available color
    return Object.keys(groupedByColor)[0];
  }, [colors, groupedByColor]);

  useEffect(() => {
    if (!groupedByColor || Object.keys(groupedByColor).length === 0) return;
    
    const selectedColor = getInitialColor;
    const selectedVariant = groupedByColor[selectedColor]?.[0];
    
    if (selectedVariant) {
      setCurrentImage(selectedVariant.images[0].url);
      setCurrentColor(selectedColor);
      setCurrentVariant(selectedVariant);
    }
  }, [product, groupedByColor, getInitialColor]);

  const handleColorChange = (color) => {
    const selectedVariant = groupedByColor[color][0];
    setCurrentImage(selectedVariant.images[0].url);
    setCurrentColor(color);
    setCurrentVariant(selectedVariant);
  };

  function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}


const handleWishlistToggle=async(productId,currentVariant)=>{   
    const result= await  addToWishlist(productId,currentVariant);
     console.log("result  :",result.message)
    if(!result?.success){
     
         toast.error("error occured", {
      description: result.message,
      duration: 4000,
    });
    return;
    }else{
      toast.success(result.message, {
      description: " 🖤",
      duration: 4000,
      action: {
        label: "Wishlist",
        onClick: () => {
           navigate('/wishlist')
          console.log("Navigate to login");
        },
      },
    });
    }
    console.log("result  :",result)
}

  const handleProductClick=()=>{
    trackView(product._id);
  }

  return (
    <div className="card-product fl-item" key={product?._id} >
      <div className="card-product-wrapper">
        <Link to={`/product-detail/${slugify(product?.title)}?id=${product._id}`} className="product-img">
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
              product.imgHoverSrc
                ? product.imgHoverSrc
                : product.variants[0].images[0].url
            }
            src={
              product.imgHoverSrc
                ? product.imgHoverSrc
                : product.variants[0].images[0].url
            }
            alt="image-product"
            width={720}
            height={1005}
          />
        </Link>
        {product.soldOut ? (
          <div className="sold-out">
            <span>Sold out</span>
          </div>
        ) : (
          <>
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
              {
                !loading && (
                  <a
                 
                  href={!isAuthenticated && "#login"}
                   data-bs-toggle={!isAuthenticated ? "modal" : null}

                onClick={() =>handleWishlistToggle(product?._id,currentVariant)}
                className={`box-icon bg_white  wishlist btn-icon-action ${
                  isAddedtoWishlist(product?._id) ? "added" : ""
                }`}
              >
                <span
                  className={`icon icon-heart ${
                    isAddedtoWishlist(product?._id) ? "added" : ""
                  }`}
                />
                <span className="tooltip">
                  {isAddedtoWishlist(product?._id)
                    ? "Already Wishlisted"
                    : "Add to Wishlist"}
                </span>
                <span className="icon icon-delete" />
              </a>
                )

              }
              
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
            <div className="size-list">
              {groupedByColor[currentColor]?.map((variant) => (
                <span
                  key={variant.size.value}
                  style={{
                    textDecoration: variant.inventory.isInStock
                      ? "none"
                      : "line-through",
                    color: variant.inventory.isInStock ? "white" : "gray",
                  }}
                  title={variant.inventory.isInStock ? "" : "Out of stock"}
                >
                  {variant.size.value}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="card-product-info">
        <Link to={`/product-detail/${product.id}`} className="title link">
          {product.title}
        </Link>
        <span className="price">
          &#8377;{currentVariant?.pricing?.price.toFixed(2)}
        </span>
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
                <span
                  style={{
                    backgroundColor: groupedByColor[color][0].color.value,
                  }}
                  className={`swatch-value `}
                />
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