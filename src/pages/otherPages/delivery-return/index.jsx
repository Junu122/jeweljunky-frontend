import MetaComponent from "@/components/common/MetaComponent";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";
const metadata = {
  title: "Deliveery Return & Refund || Jewel Junkie Return and Refund policy",
  description: "Jewel Junkie Return and Refund policy",
};
export default function DeliveryReturnPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      {/* <Header2 /> */}
      <>
        {/* page-title */}
        <div className="tf-page-title style-2">
          <div className="container-full">
            <div className="heading text-center">Delivery Return & Refund</div>
          </div>
        </div>
        {/* /page-title */}
        {/* main-page */}
        <section className="flat-spacing-25">
          <div className="container">
            <div className="tf-main-area-page tf-page-delivery">
              <div className="box">
                <h4>Returns</h4>
                <ul className="tag-list">
                  <li>
                    You can raise a return request from here within 2 days of the delivery of the order
                  </li>
                  <li>
                    Items sold under special offers where you have applied a coupon code at checkout are not eligible for returns.
                  </li>
                  <li>
                    Items sold at a strike-through or discounted price (without applying a coupon) are eligible for return.
                  </li>
              
                </ul>
              </div>
               <div className="box">
                <h4>Return Condition</h4>
                <ul className="tag-list">
                  <li>
                    Items must be unused, with original packaging and tags intact.
                  </li>
                  <li>
                    An unboxing video is required to process any claims for missing items in your order.
                     Please ensure you record the package being opened from the sealed state for your claim to be considered.
                  </li>
                </ul>
              </div>
              <div className="box">
                <h4>Refund</h4>
                <ul className="tag-list">
                  <li>
                   Refunds are credited in 7–10 working days as per RBI guidelines, following item pickup and verification.
                  </li>
                  <li>
                    Prepaid orders : Refunded to original payment method.
                  </li>
                </ul>
              </div>
       
            </div>
          </div>
        </section>
      </>

      <Footer1 />
    </>
  );
}
