import { Link } from "react-router-dom";
import React from "react";

export default function Banner() {
  return (
    <section className="flat-spacing-8 pb_0">
      <div className="container">
        <div className="collection-item-v4 style-2 hover-img">
          <div className="collection-inner">
            <Link
              to={`/shop-collection-sub`}
              className="collection-image img-style ceramic-collection o-hidden"
            >
              <img
                className="lazyload"
                data-src="/images/collections/collection-ceramic-3.png"
                alt="collection-img"
                src="/images/collections/Gemini_Generated_Image_rfaqkxrfaqkxrfaq.png"
                width={1600}
                height={671}
                style={{width:"100%"}}
              />
            </Link>
            <div
              className="collection-content text-center wow fadeInUp"
              data-wow-delay="0s"
            >
              <h5 className="heading text-black" style={{fontWeight:"700"}}>Beauty in Simplicity</h5>
              <p className="subtext " style={{color:"red"}}>
                Explore a world of meticulous details
              </p>
              <Link
                to={`/shop-collection-sub`}
                className="fade-item fade-item-3 tf-btn btn-outline-dark fw-5 btn-xl radius-60"
              >
                <span>Shop now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
