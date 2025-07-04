import { axiosinstance } from "@/utlis/api";


export const cartService={
    async addToCart(item){
        try {
            const response=await axiosinstance.post('/cart/add',item,{withCredentials:true});
            return response.data
        } catch (error) {
            console.log("error in adding product to cart   :",error)
           throw error
        }
    },
    async getCartProducts(){
        try {
            const response=await axiosinstance.get('/cart/get',{withCredentials:true})
            return response.data
        } catch (error) {
            console.log(error)
        }
    },
    async updateQuantity(updateData){
        try {
            const response=await axiosinstance.put('/cart/updateQuantity',updateData,{withCredentials:true});
            console.log(response,">.........................")
            return response.data
        } catch (error) {
            if(error?.response?.data){
                throw error.response?.data
            }
            throw error
        }
    },
    async removeFromCart(removeData){
        try {
            const response=await axiosinstance.delete('/cart/removeFromCart',{data:removeData,withCredentials:true})
            return response.data
        } catch (error) {
            if(error.response.data){
              throw error.response.data
            }
            throw error
        }
    }
}