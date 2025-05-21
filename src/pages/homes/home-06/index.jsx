import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import Brands from "@/components/homes/home-1/Brands";
import BestsellerSection from "@/components/shopCards/ProductCardNew";
import Banner from "@/components/homes/home-6/Banner";
import Categories from "@/components/homes/home-6/Categories";
import Features from "@/components/common/Features";
// import Hero from "@/components/homes/home-6/Hero";
import Products from "@/components/homes/home-6/Products";
import Location from "@/components/homes/home-6/Location";
import React from "react";
import Announcmentbar from "@/components/common/Announcmentbar";
// import Hero from "@/components/homes/home-1/Hero";
import Hero from "@/components/homes/home-food/Hero";
import MetaComponent from "@/components/common/MetaComponent";
import Features2 from "@/components/common/Features2";
import JewelryBanners from "@/components/homes/home-6/BannerNew";
const metadata = {
  title: "Home 6 || Ecomus - Ultimate Reactjs Ecommerce Template",
  description: "Ecomus - Ultimate Reactjs Ecommerce Template",
};
export default function Homepage6() {
  return (
    <>
      <MetaComponent meta={metadata} />
      {/* <Announcmentbar /> */}
      {/* <Header4 /> */}
      <Hero />
      <Categories />
      <Products title="Best Seller"/>
      <JewelryBanners />
      {/* <Banner /> */}
      {/* <BestsellerSection /> */}
      <Products title="Trending"/>
      <Features2 bgColor="" />
      <Location />
      <div className="mt-5"></div>
      <Brands />
      <Footer1 bgColor="background-gray" />
    </>
  );
}
