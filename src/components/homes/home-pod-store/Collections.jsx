import React from "react";

import { Link } from "react-router-dom";
import { collectionItems12 } from "@/data/categories";
export default function Collections() {
  return (
    <section className="flat-spacing-27 pb_0">
      <div className="container">
        <div className="masonry-layout-v6 wow fadeInUp" data-wow-delay="0s">
          {collectionItems12.map((item) => (
            <div
              key={item.id}
              className={`${item.id} collection-item large hover-img`}
            >
              <div className="collection-inner">
                <Link
                  to={item.href}
                  className="collection-image img-style rounded-0"
                >
                  <img
                    className="lazyload"
                    data-src={item.imgSrc}
                    alt={item.alt}
                    src={item.imgSrc}
                    width={item.width}
                    height={item.height}
                  />
                </Link>
                <div className="collection-content">
                  <Link
                    to={item.href}
                    className="tf-btn collection-title hover-icon"
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
