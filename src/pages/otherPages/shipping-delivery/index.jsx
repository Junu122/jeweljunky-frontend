import MetaComponent from "@/components/common/MetaComponent";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";
const metadata = {
  title: "Shipping Delivery policy || Jewel Junkie Shipping & Delivery policy",
  description: "Shipping and Delivery Policy",
};
export default function ShopingDeliveryPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      {/* <Header2 /> */}
      <>
        {/* page-title */}
        <div className="tf-page-title style-2">
          <div className="container-full">
            <div className="heading text-center">Shipping &amp; Delivery policy</div>
          </div>
        </div>
        {/* /page-title */}
        {/* main-page */}
        <section className="flat-spacing-25">
          <div className="container">
            <div className="tf-main-area-page tf-page-delivery">
              <div className="box">
                <h4>Shipping</h4>
                <p>All orders shipped with trusted delivery partners.</p>
                <p>Always free shipping for orders over &#8377;2000</p>
                <p>Once shipped, you’ll receive a tracking link via SMS or Whatsapp or Email.</p>
                <p>For any queries, contact us at jeweljunkieinfo@gmail.com</p>
              </div>
              <div className="box">
                <h4>Delivery</h4>
                <p>
                  Delivery estimates are shown after succesfully order placed. 
                  These estimates depend on your specific pincode and area. 
                </p>
                <p>
                 Occasional delays may occur due to weather, local restrictions, or courier-related issues.
                </p>
               
              </div>
              {/* <div className="box">
                <h4>Help</h4>
                <p>
                  Give us a shout if you have any other questions and/or
                  concerns.
                </p>
                <p>
                  Email:
                  <a href="mailto:contact@domain.com" className="cf-mail">
                    contact@domain.com
                  </a>
                </p>
                <p>Phone: +1 (23) 456 789</p>
              </div> */}
            </div>
          </div>
        </section>
      </>

      <Footer1 />
    </>
  );
}
