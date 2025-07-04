import { axiosinstance } from "@/utlis/api"
export const userServices={
    async userRegister(registerData){
        console.log(registerData)
        try {
            const response=await axiosinstance.post('/user/signup',registerData,{withCredentials:true});
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
        }
    },
    async verifyOtp(userData){
        console.log(userData,"userdata in service")
        try {
            const response=await axiosinstance.post('/user/verifyotp',userData,{withCredentials:true})
            return response
        } catch (error) {
            console.log(error)
        }
    },
    async userLogin(loginData){
        try {
            const response=await axiosinstance.post('/user/login',loginData,{withCredentials:true})
            return response
        } catch (error) {
            console.log(error,"error in userservice")
            return error
            
        }
    },
    async checkauth(){
        try {
            const response=await axiosinstance.get('/user/check-auth',{withCredentials:true});
            console.log(response,".......")
            return response
        } catch (error) {
            console.log(error)
        }
    },
    async getuser(){
        try {
            const response=await axiosinstance.get('/user/check-user',{withCredentials:true})
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
}