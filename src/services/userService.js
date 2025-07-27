import { axiosinstance } from "@/utlis/api"
export const userServices={
    async userRegister(registerData){
        console.log(registerData)
        try {
            const response=await axiosinstance.post('/user/signup',registerData,{withCredentials:true});
            console.log(response)
            return response
        } catch (error) {
            throw error
        }
    },
    async verifyOtp(userData){
        console.log(userData,"userdata in service")
        try {
            const response=await axiosinstance.post('/user/verifyotp',userData,{withCredentials:true})
            return response
        } catch (error) {
            throw error
        }
    },
    async userLogin(loginData){
        try {
            const response=await axiosinstance.post('/user/login',loginData,{withCredentials:true})
            return response
        } catch (error) {
        throw error
            
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
    },
    async userLogout(){
        try {
            const response=await axiosinstance.post('/user/logout',{withCredentials:true})
            return response
        } catch (error) {
            console.log(error)
        }
    },
    async googleRegister(googleData){
        try {
            const response=await axiosinstance.post('/user/google-signup',googleData,{withCredentials:true})
            return response
        } catch (error) {
            throw error
            
        }
    },
    async googleLogin(googleData){
        try {
            const response=await axiosinstance.post('/user/google-signin',googleData,{withCredentials:true});
            console.log(response,"google login response in service")
            return response
        } catch (error) {
            throw error
        }
    }
}