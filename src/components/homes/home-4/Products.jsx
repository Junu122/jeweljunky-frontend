import Productcard4 from "@/components/shopCards/Productcart4";
import { products1 } from "@/data/products";
import {useNavigate} from "react-router-dom"
import { useState } from "react";
import { ProductCard } from "@/components/shopCards/ProductCard";
import { axiosinstance } from "@/utlis/api";
import { useEffect } from "react";
export default function VerticalProducts() {
  const navigate=useNavigate()
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [allproducts, setAllproducts] = useState([]);
  const handleLoad = () => {
    setLoading(true);

    setTimeout(() => {
       
      setLoading(false);
      setLoaded(true);
      navigate("/product-detail")
    }, 1000);
  };
      const fetchdata=async()=>{
       const response=await axiosinstance.get("/product/getallproducts");
       
       setAllproducts(response?.data?.products)
      console.log("response  for all products  :",response)
  }

  useEffect(()=>{

fetchdata()
  },[])
 

  return (
    <section className="flat-spacing-6">
      <div className="container">
        <div className="flat-title mb_1 gap-14">
          <span className="title wow fadeInUp" data-wow-delay="0s">
            New Arrivals
          </span>
          <p className="sub-title wow fadeInUp" data-wow-delay="0s">
            Shop the Latest Styles: Stay ahead of the curve with our newest
            arrivals
          </p>
        </div>
        <div className="grid-layout" data-grid="grid-4">
          {allproducts?.slice(0,8).map((product, i) => (
            <ProductCard product={product} key={i} />
          ))}
        </div>
        {!loaded && (
          <div className="tf-pagination-wrap view-more-button text-center">
            <button
              className={`tf-btn-loading tf-loading-default style-2 btn-loadmore ${
                loading ? "loading" : ""
              } `}
              onClick={() => handleLoad()}
            >
              <span className="text">Load more</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
