import React from "react";

import { Link } from "react-router-dom";
import { collectionItemsStyle2 } from "@/data/categories";
export default function Collections() {
  return (
    <section className="flat-spacing-18">
      <div className="container">
        <div className="masonry-layout-v3 wow fadeInUp" data-wow-delay="0s">
          {collectionItemsStyle2.map((item) => (
            <div
              key={item.id}
              className={`${item.id} collection-item style-2 hover-img`}
            >
              <div className="collection-inner">
                <Link to={item.href} className="collection-image img-style">
                  <img
                    className="lazyload"
                    data-src={item.imgSrc}
                    alt={item.alt}
                    src={item.imgSrc}
                    width={item.imgWidth}
                    height={item.imgHeight}
                  />
                </Link>
                <div className="collection-content">
                  <Link
                    to={item.href}
                    className="tf-btn collection-title hover-icon fs-15 rounded-full"
                  >
                    <span>{item.title}</span>
                    <i className="icon icon-arrow1-top-left" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
