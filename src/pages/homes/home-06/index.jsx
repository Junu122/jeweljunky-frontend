import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import Productsp from "@/components/homes/home-1/Products";
import Brands from "@/components/homes/home-1/Brands";
import BestsellerSection from "@/components/shopCards/ProductCardNew";
import Banner from "@/components/homes/home-6/Banner";
import Categories from "@/components/homes/home-6/Categories";
import Features from "@/components/common/Features";
// import Hero from "@/components/homes/home-6/Hero";
import Products from "@/components/homes/home-6/Products";
import Location from "@/components/homes/home-6/Location";
import React, { useEffect, useState } from "react";
import Announcmentbar from "@/components/common/Announcmentbar";
// import Hero from "@/components/homes/home-1/Hero";
import Hero from "@/components/homes/home-food/Hero";
import MetaComponent from "@/components/common/MetaComponent";
import Features2 from "@/components/common/Features2";
import JewelryBanners from "@/components/homes/home-6/BannerNew";
import { useHomePageData } from "@/services/homepageService";
import { HomepageDatas } from "@/hooks/homePageData";
import PageNotFoundPage from "../../../pages/otherPages/page-not-found";
import ProductCollectionShowcase from "@/pages/ProductCollection";
const LoadingSpinner = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "400px" }}
  >
    <div className="spinner-border " style={{ color: "black" }} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div
    className="alert alert-danger text-center"
    style={{ backgroundColor: "white" }}
    role="alert"
  >
    <h4 className="alert-heading">Oops! Something went wrong</h4>
    <p>{message}</p>
    <hr />
    <button className="btn btn-outline-danger" onClick={onRetry}>
      Try Again
    </button>
  </div>
);
const metadata = {
  title: "Home || jewel junkie",
  description: "jewel junkie jewellery",
};
export default function Homepage6() {
  const { home } = useHomePageData();

  const handleRetry = () => {
    window.location.reload();
  };
  if (home.loading) {
    return (
      <>
        <MetaComponent meta={metadata} />
        <LoadingSpinner />
      </>
    );
  }

  if (home.error) {
    return (
      <>
        <MetaComponent meta={metadata} />
        <PageNotFoundPage message={home.error} onRetry={handleRetry} />
      </>
    );
  }

  console.log(home, "homegszdgggggggg");

  return (
    <>
      <MetaComponent meta={metadata} />
      {/* <Announcmentbar /> */}
      {/* <Header4 /> */}

      <Hero herodata={home.data.data.heroSection} />

      <Categories categories={home.data.data.categorySection} />
      
      { 
        home.data?.data?.allcollections.map((collection,index)=><Products key={index} title={collection.name} data={collection} />)
      }
      {/* <Products title="Best Seller" data={home.data.data.bestsellerSection} /> */}
      <JewelryBanners bannercollection={home.data.data.bannerSection} />
      {/* <Products title="Trending" data={home.data.data.trendingSection} /> */}
{/* <ProductCollectionShowcase /> */}
      {/* <Banner /> */}
      {/* <BestsellerSection /> */}

      {/* <Productsp /> */}
      {/* <Features2 bgColor="" />
      <Location /> */}
      <div className="mt-5"></div>
      {/* <Brands /> */}
      <Footer1 bgColor="background-gray" />
    </>
  );
}
