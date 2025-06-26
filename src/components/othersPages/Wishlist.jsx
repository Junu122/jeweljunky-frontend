import { Jewelleryproducts } from "@/data/products";
import { dummyJewellery } from "@/data/products";
import { useContextElement } from "@/context/Context";
import { useEffect, useState } from "react";
import { ProductCardWishlist } from "../shopCards/ProductCardWishlist";
import {ProductCard} from '../shopCards/ProductCard'
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { wishList } = useContextElement();
  const [wishListItems, setWishListItems] = useState([]);
useEffect(() => {
  if (wishList && wishList.length > 0) {
    const wishListIds = wishList.map(item => item.productId); 
    const filteredItems = dummyJewellery.filter(product => 
      wishListIds.includes(product.id)
    );
    setWishListItems(filteredItems);
  } else {
    setWishListItems([]); // clear if wishlist is empty
  }
}, [wishList]);

  console.log("wishlist items   :",wishListItems)

  return (
    <section className="flat-spacing-2">
      <div className="container">
        <div className="grid-layout wrapper-shop" data-grid="grid-4">
          {wishListItems.map((elm, i) => (
            <ProductCardWishlist key={i} product={elm} />
          ))}
        </div>
        {!wishListItems.length && (
          <>
            <div
              className="row align-items-center w-100"
              style={{ rowGap: "20px" }}
            >
              <div className="col-lg-3 col-md-6 fs-18">
                Your wishlist is empty
              </div>
              <div className="col-lg-3  col-md-6">
                <Link
                  to={`/product-detail`}
                  className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                >
                  Explore Products!
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
