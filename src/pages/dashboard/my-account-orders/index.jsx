import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import DashboardNav from "@/components/othersPages/dashboard/DashboardNav";
import Orders from "@/components/othersPages/dashboard/Orders";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";
import { useEffect } from "react";
import { axiosinstance } from "@/utlis/api";
import { useState } from "react";
const metadata = {
  title: "My Account Orders || JEWELJUNKIE",
  description: "JEWEL JUNKIE",
};


export default function MyAccountOrderPage() {
  const [data,setData]=useState()
  useEffect(()=>{
  const fetchuserorders=async()=>{
    try {
      const response=await axiosinstance.get('/orders/getuserorders',{withCredentials:true})
      console.log("user orders ..................",response.data)
      setData(response?.data?.orders)
    } catch (error) {
      console.log("fetch user orders error",error)
      alert(error?.response?.data || "Something went wrong")
      
    }
  }
  fetchuserorders()
},[])
  return (
    <>
      <MetaComponent meta={metadata} />
     
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">My Orders</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <DashboardNav />
            </div>
            <div className="col-lg-9">
              <Orders data={data}/>
            </div>
          </div>
        </div>
      </section>

      <Footer1 />
    </>
  );
}
