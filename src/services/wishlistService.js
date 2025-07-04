import { axiosinstance } from "@/utlis/api";

export const wishlistService={
    async addToWishlist(wishlistItem){
       
        try {
            const response=await axiosinstance.post('/wishlist/addtowishlist',wishlistItem,{withCredentials:true})
            return response.data
        } catch (error) {
            console.log("add to wishlist error",error)
            throw error
        }

    },
    async removeFromWishlist(id){
        console.log("wishlistItem ...................................................................  ;",id)
        try {
            const response=await axiosinstance.delete('/wishlist/removefromwishlist',{data:{id:id},withCredentials:true});
            return response.data
        } catch (error) {
           console.log(error)
            throw error
        }
    },
    async getUserWishlist(){
        try {
            const response=await axiosinstance.get('/wishlist/getwishlist',{withCredentials:true})
            return response.data
        } catch (error) {
            console.log("error",error)
            throw error;
          
        }
    }
}