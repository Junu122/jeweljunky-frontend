import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import DashboardNav from "@/components/othersPages/dashboard/DashboardNav";
import MyAccount from "@/components/othersPages/dashboard/MyAccount";
import React from "react";
import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "My Account || Ecomus - Ultimate Reactjs Ecommerce Template",
  description: "Ecomus - Ultimate Reactjs Ecommerce Template",
};
export default function MyAccountPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      {/* <Header4 /> */}
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">My Account</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <DashboardNav />
            </div>
            <div className="col-lg-9">
              <MyAccount />
            </div>
          </div>
        </div>
      </section>

      <Footer1 />
    </>
  );
}
