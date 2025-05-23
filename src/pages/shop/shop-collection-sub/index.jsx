import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Topbar1 from "@/components/headers/Topbar1";
import ShopDefault from "@/components/shop/ShopDefault";
import Subcollections from "@/components/shop/Subcollections";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title:
    "Product Collection Sub || Ecomus - Ultimate Reactjs Ecommerce Template",
  description: "Ecomus - Ultimate Reactjs Ecommerce Template",
};
export default function ShopCollectionSubPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      {/* <Topbar1 /> */}
      
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Products</div>
          <p className="text-center text-2 text_black-2 mt_5">
           Find variety of models 
          </p>
        </div>
      </div>
      {/* <Subcollections /> */}
      <ShopDefault />
      <Footer1 />
    </>
  );
}
