import { useState, useEffect } from 'react';
import { axiosinstance } from '@/utlis/api.js';
export const HomepageDatas = () => {
  const [data, setData] = useState({
    bestsellers: [],
    trending: [],
    loading: true,
    error: null,
    
  });


    const fetchHomepageData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await axiosinstance.get('/collection/bestseller',{withCredentials:true});
        const trendingresponse=await axiosinstance.get('/collection/trending',{withCredentials:true});
        const result = await response.data;
        const trendingresult=await trendingresponse.data
        console.log("Homepage data*************************:", result);
        if (result?.success) {
          setData({
            bestsellers: result?.bestseller,
            trending:trendingresult?.trending,
            loading: false,
            error: null
          });
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    useEffect(()=>{
      fetchHomepageData();
    },[])

   


  return data;
};