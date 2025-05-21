import { ShoppingBag, Gift, Star } from 'lucide-react';
import { recentCollectionData } from "@/data/categories";
import { Link } from "react-router-dom";
export default function JewelryBanners() {
  return (
  <div className="container py-5">
  {/* Using flex-col by default (mobile) and flex-row on sm+ screens */}
  <div className="d-flex flex-column flex-md-row  gap-3">
    {recentCollectionData.slice(0,3).map((item, id) => (
      <div 
        key={id} 
        className="collection-item-v4 hover-img br"
      >
        <div className="collection-inner ">
          <Link
            to={`/shop-collection-list`}
            className="collection-image img-style"
          >
            <img
              className="lazyload"
              data-src={item.imgSrc}
              alt={item.imgAlt}
              src={item.imgSrc}
              width={item.imgWidth}
              height={item.imgHeight}
            />
          </Link>
          <div
            className="collection-content wow fadeInUp"
          >
            <p className="subheading ">{item.subheading}</p>
            <h5 className="heading ">{item.heading}</h5>
            <Link
              to={`/shop-collection-list`}
              className="tf-btn inline-flex items-center justify-center px-6 py-2 bg-black text-white hover:bg-gray-800 rounded-md transition-colors duration-300"
            >
              <span className="mr-2">Shop now</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
  );
}
