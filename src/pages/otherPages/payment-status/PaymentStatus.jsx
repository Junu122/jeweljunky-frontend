import React, { useEffect, useState } from 'react';
import { axiosinstance } from '@/utlis/api';
import { useParams } from 'react-router-dom';
import PaymentSuccessPage from '@/components/othersPages/PaymentSuccess';
import PaymentFailPage from '@/components/othersPages/PaymentFail';

const PaymentStatus = () => {
  const { orderId } = useParams();
  const [status, setStatus] = useState(null); // 'completed' or 'failure'
  const [loading, setLoading] = useState(true);
  const [data,setData]=useState(null)
  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await axiosinstance.get(`/payment/payment-status/${orderId}`);
        console.log('Order Status:.........', response.data);
        setStatus(response.data.status);
        setData(response.data.data)
         // assuming response.data is 'completed' or 'failure'
      } catch (error) {
        console.error('Error fetching order status:', error);
        setStatus('failure'); // fallback to failure on error
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [orderId]);

  if (loading) {
    return <div>Loading payment status...</div>;
  }

  return (
    <div>
      {status === 'COMPLETED' ? <PaymentSuccessPage data={data}/> : <PaymentFailPage data={data} />}
    </div>
  );
};

export default PaymentStatus;
