import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Topbar1 from "@/components/headers/Topbar1";
import ProductStyle7 from "@/components/shop/ProductStyle7";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Product Style 7 || Ecomus - Ultimate Reactjs Ecommerce Template",
  description: "Ecomus - Ultimate Reactjs Ecommerce Template",
};
export default function ProductStylePage7() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Topbar1 />
      <Header2 />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">New Arrival</div>
          <p className="text-center text-2 text_black-2 mt_5">
            Shop through our latest selection of Fashion
          </p>
        </div>
      </div>
      <ProductStyle7 />
      <Footer1 />
    </>
  );
}
