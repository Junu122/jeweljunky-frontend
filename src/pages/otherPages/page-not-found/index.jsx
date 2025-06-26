import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";

import { Link } from "react-router-dom";
import React from "react";
import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Page Not Found || Jewel Junky ",
  description: "Jewel Junky",
};
export default function PageNotFoundPage({message,onRetry}) {
  return (
    <>
      <MetaComponent meta={metadata} />
      {/* <Header1 /> */}
      <section className="page-404-wrap">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="image">
                <img
                  alt="image"
                  src="/images/item/404.svg"
                  width="394"
                  height="319"
                />
              </div>
              <div className="title">{message}</div>
             
              <p>
                Sorry for the inconvenience.
              </p>
              <button
                onClick={onRetry}
                className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer1 />
    </>
  );
}
