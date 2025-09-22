import { axiosinstance } from "@/utlis/api";
import { useState,useEffect } from "react";
export const useHomePageData = () => {
  const [data, setData] = useState({
    hero: { loading: true, data: null, error: null },
    categories: { loading: true, data: null, error: null },
    bestseller:{ loading: true, data: null, error: null },
    allcollections:{ loading: true, data: null, error: null },
    banner:{loading:true,data:null,error:null},
    home:{loading:true,data:null,error:null}
   
  });

  const fetchData = async (endpoint, key) => {
    try {
      setData(prev => ({
        ...prev,
        [key]: { ...prev[key], loading: true, error: null }
      }));

      const response = await axiosinstance.get(endpoint,{withCredentials:true})
     

    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }

      const result = await response;
       
      setData(prev => ({
        ...prev,
        [key]: { loading: false, data: result.data, error: null }
      }));
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      setData(prev => ({
        ...prev,
        [key]: { loading: false, data: null, error:error?.response?.data || error?.response?.data?.message || error?.message }
      }));
    }
  };

  useEffect(() => {


 
      setTimeout(() => {
      fetchData('/homepage/gethomepage',"home")
    }, 100);
    
    // Load products with slight delay for better perceived performance
   
  }, []);

  return data;
};

