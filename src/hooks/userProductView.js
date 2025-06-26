import { useCallback } from 'react';
import { axiosinstance } from '@/utlis/api.js';
export const useProductView = () => {
  const trackView = useCallback(async (productId, userId = null) => {
    console.log("Tracking product view for productId:", productId);
    try {
      const sessionId = sessionStorage.getItem('sessionId') || 
        Math.random().toString(36).substring(2, 15);
      
      if (!sessionStorage.getItem('sessionId')) {
        sessionStorage.setItem('sessionId', sessionId);
      }


    const response=await axiosinstance.post(`/analytics/track-view/${productId}`,{sessionId,userId},{withCredentials:true});
    console.log(response)
   
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  }, []);

  return { trackView };
};