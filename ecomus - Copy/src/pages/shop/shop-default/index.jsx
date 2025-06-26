import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import ShopDefault from "@/components/shop/ShopDefault";
import React from "react";
import { useParams } from "react-router-dom";
import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Product Default || Ecomus - Ultimate Reactjs Ecommerce Template",
  description: "Ecomus - Ultimate Reactjs Ecommerce Template",
};
export default function ShopDefaultPage() {
  let params=useParams();
  const {category}=params;

  return (
    <>
      <MetaComponent meta={metadata} />
      {/* <Header2 /> */}
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">{category}</div>
          <p className="text-center text-2 text_black-2 mt_5">
            Shop through our latest selection of Fashion hhhh
          </p>
        </div>
      </div>
      <ShopDefault category={category}/>
      <Footer1 />
    </>
  );
}
