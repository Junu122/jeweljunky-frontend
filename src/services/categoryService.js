import { axiosinstance } from "@/utlis/api";


export const categoryService = {
        async getCategory(){
      try {
        const response= await axiosinstance.get(`/category/getAllCategories`, { withCredentials: true });
        return response.data;
      } catch (error) {
         console.error(`Error fetching category :`, error);
         throw error;
      }
    }
}