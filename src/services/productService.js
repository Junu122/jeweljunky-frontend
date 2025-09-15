
import { axiosinstance } from "@/utlis/api";

export const productService = {
async getProducts(page = 1, limit = 2, filters = {}) {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      // Add filter parameters
      if (filters.price_min !== undefined) params.append('price_min', filters.price_min);
      if (filters.price_max !== undefined) params.append('price_max', filters.price_max);
      if (filters.brands?.length > 0) params.append('filter.p.brand', filters.brands.join(','));
      if (filters.colors?.length > 0) params.append('filter.p.color', filters.colors.join(','));
      if (filters.sizes?.length > 0) params.append('filter.p.size', filters.sizes.join(','));
      if (filters.availability?.length > 0) params.append('filter.p.availability', filters.availability.join(','));
      if (filters.categories?.length > 0) params.append('category', filters.categories.join(','));
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.search) params.append('search', filters.search);
      const response = await axiosinstance.get(`/product/getallproducts?${params.toString()}`, {
        withCredentials: true
      });
      
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
    async getProductById(productId) {
      console.log("productId in service", productId);
        try {
        const response = await axiosinstance.get(`/product/getproduct/${productId}`, { withCredentials: true });
        console.log("product data by id :", response.data);
        return response.data;
        } catch (error) {
        console.error(`Error fetching product with ID ${productId}:`, error);
        throw error; // Re-throw the error for further handling if needed
        }
    },
    async getProductsByCategory(category) {
        try {
            const response = await axiosinstance.get(`/products/category/${category}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error(`Error fetching products in category ${category}:`, error);
            throw error; // Re-throw the error for further handling if needed
        }
    },

};