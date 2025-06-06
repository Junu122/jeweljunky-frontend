import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";

import Products from "@/components/shopDetails/Products";
import RecentProducts from "@/components/shopDetails/RecentProducts";
import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";
import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import DetailsOuterZoom from "@/components/shopDetails/DetailsOuterZoom";
import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Shop Details || Ecomus - Ultimate Reactjs Ecommerce Template",
  description: "Ecomus - Ultimate Reactjs Ecommerce Template",
};
import { allProducts } from "@/data/products";
import { Jewelleryproducts } from "@/data/products";
import ProductSinglePrevNext from "@/components/common/ProductSinglePrevNext";
export default function ProductDetailPage({}) {
  let params = useParams();
  const { id } = params;
  const product =
    Jewelleryproducts.filter((elm) => elm.id == id)[0] || allProducts[1];
  return (
    <>
      <MetaComponent meta={metadata} />
      {/* <Header2 /> */}
      <div className="tf-breadcrumb">
        <div className="container">
          <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">
            <div className="tf-breadcrumb-list">
              <Link to={`/`} className="text">
                Home
              </Link>
              <i className="icon icon-arrow-right" />

              <span className="text">
                {product.title ? product.title : "Cotton jersey top"}
              </span>
            </div>
            
            <ProductSinglePrevNext currentId={product.id} />
          </div>
        </div>
      </div>
      <DetailsOuterZoom product={product} />
     
      <ShopDetailsTab />
      <Products />
      <RecentProducts />
      <Footer1 />
    </>
  );
}
