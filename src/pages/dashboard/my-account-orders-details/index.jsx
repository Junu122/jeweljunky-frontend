import Footer1 from "@/components/footers/Footer1";
import { toast } from 'sonner'
import Header2 from "@/components/headers/Header2";
import DashboardNav from "@/components/othersPages/dashboard/DashboardNav";
import OrderDetails from "@/components/othersPages/dashboard/OrderDetails";
import Orders from "@/components/othersPages/dashboard/Orders";
import React from "react";
import { useEffect,useState } from "react";
import {useParams} from 'react-router-dom'
import { axiosinstance } from "@/utlis/api";
import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "My Account Orders || jeweljunkie",
  description: "JEWELJUNKIE order details",
};
export default function MyAccountOrderDetailsPage() {
  const [orderData,setOrderData]=useState(null)
  const {orderid}=useParams()
   useEffect(()=>{
       const fetchorderdetails=async()=>{
         try {
          const response=await axiosinstance.get(`/orders/getorder-details/${orderid}`,{withCredentials:true});
          
          setOrderData(response?.data?.orderDetails)
         } catch (error) {
          toast.error(error?.response?.statusText || "Something went wrong")
          console.log("[user order details]fetch user order details error",error)
         }
       }
       fetchorderdetails()
   },[])

  return (
    <>
      <MetaComponent meta={metadata} />
     
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">My Order</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            {/* <div className="col-lg-3">
              <DashboardNav />
            </div> */}
            <div className="col-lg-9">
              <OrderDetails orderdata={orderData}/>
            </div>
          </div>
        </div>
      </section>

      <Footer1 />
    </>
  );
}
