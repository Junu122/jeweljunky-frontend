import React from "react";
import Pagination from "../common/Pagination";
import { collectionItems3 } from "@/data/categories";

import { Link } from "react-router-dom";

export default function ShopCollections({collections}) {
 


  return (
    <section className="flat-spacing-1">
      <div className="container">
        <div className="tf-grid-layout lg-col-3 tf-col-2">
          {collections.map((item, index) => (
            <div className="collection-item hover-img" key={item._id}>
              <div className="collection-inner">
                <Link
                  to={`/shop-collection-list/${item.name}`}
                  className="collection-image img-style"
                >
                  <img
                    className="lazyload"
                    data-src={item.image.url}
                    alt={item.image.alt}
                    src={item.image.url}
                    width={460}
                    height={460}
                  />
                </Link>
                <div className="collection-content">
                  <Link
                    to={`/shop-collection-list/${item.name}`}
                    className="tf-btn collection-title hover-icon"
                  >
                    <span>{item.name}</span>
                    <i className="icon icon-arrow1-top-left" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* pagination */}
        <ul className="tf-pagination-wrap tf-pagination-list">
          {/* <Pagination /> */}
        </ul>
      </div>
    </section>
  );
}
