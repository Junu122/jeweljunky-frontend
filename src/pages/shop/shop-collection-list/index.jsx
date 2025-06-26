import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Topbar1 from "@/components/headers/Topbar1";
import ShopCollections from "@/components/shop/ShopCollections";
import { useState,useEffect,useCallback } from "react";
import React from "react";
import { categoryService } from "@/services/categoryService";
import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title:
    "Product Collection List || jewel junky",
  description: "jewel junky",
};
export default function ShopCollectionPage() {

   const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState(null);

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategory();
      setCollections(data.categories)

    } catch (err) {
      console.error("Fetch collections error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch collections"
      );
      setCollections([]);
    
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

    const refetch = useCallback(() => {
    fetchCollections();
  }, [fetchCollections]);

  console.log("collections", collections);
  return (
    <>
      <MetaComponent meta={metadata} />
      {/* <Topbar1 /> */}
      {/* <Header2 /> */}
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Shop by Category</div>
          <p className="text-center text-2 text_black-2 mt_5">
            Shop through our latest  Fashion and trending jewellery
          </p>
        </div>
      </div>

        {loading && (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

             {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
              <button 
                className="btn btn-link" 
                onClick={refetch}
              >
                Try Again
              </button>
            </div>
          )}

          {
            !loading && !error  && (
              <ShopCollections collections={collections}/>
            )
          }
    
      <Footer1 />
    </>
  );
}
