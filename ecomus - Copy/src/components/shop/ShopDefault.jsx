import { layouts } from "@/data/shop";
import ProductGrid from "./ProductGrid";
import { useState } from "react";
import Pagination from "../common/Pagination";
import ShopFilter from "./ShopFilter";
import Sorting from "./Sorting";
import { Jewelleryproducts } from "@/data/products";
import { useEffect } from "react";

export default function ShopDefault({category}) {
  const [gridItems, setGridItems] = useState(4);
 
  const [finalSorted, setFinalSorted] = useState([]);
 const [categoryProducts,setCategoryProducts]=useState([]);
 useEffect(() => {
    if (category) {
      const categoryproducts = Jewelleryproducts.filter(product => 
        product.category.includes(category)
      );
      setCategoryProducts(categoryproducts);
    } else {
      // If no category is provided, use all products
      setCategoryProducts(Jewelleryproducts);
    }
    
    console.log(category, "category....................");
  }, [category]);


  return (
    <>
      <section className="flat-spacing-2">
        <div className="container">
          <div className="tf-shop-control grid-3 align-items-center">
            <div className="tf-control-filter">
              <a
                href="#filterShop"
                data-bs-toggle="offcanvas"
                aria-controls="offcanvasLeft"
                className="tf-btn-filter"
              >
                <span className="icon icon-filter" />
                <span className="text">Filter</span>
              </a>
            </div>
            <ul className="tf-control-layout d-flex justify-content-center">
              {layouts.map((layout, index) => (
                <li
                  key={index}
                  className={`tf-view-layout-switch ${layout.className} ${
                    gridItems == layout.dataValueGrid ? "active" : ""
                  }`}
                  onClick={() => setGridItems(layout.dataValueGrid)}
                >
                  <div className="item">
                    <span className={`icon ${layout.iconClass}`} />
                  </div>
                </li>
              ))}
            </ul>
            <div className="tf-control-sorting d-flex justify-content-end">
              <div className="tf-dropdown-sort" data-bs-toggle="dropdown">
                <Sorting setFinalSorted={setFinalSorted} products={categoryProducts} />
              </div>
            </div>
          </div>
          <div className="wrapper-control-shop">
            <ProductGrid allproducts={finalSorted} gridItems={gridItems} category={category}/>
            {/* pagination */}
            {finalSorted.length ? (
              <ul className="tf-pagination-wrap tf-pagination-list tf-pagination-btn">
                <Pagination />
              </ul>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>
      <ShopFilter setProducts={setCategoryProducts} />
    </>
  );
}
