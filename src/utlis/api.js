// userAxiosInstance.js
import axios from 'axios';

const userAxiosInstance = axios.create({

  baseURL: 'http://localhost:5000/api/user',
  

  timeout: 15000,
  

  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});


userAxiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


userAxiosInstance.interceptors.response.use(
  response => {
   
    return response;
  },
  error => {

    if (error.response) {
    
      console.error('Response error:', error.response.status);
      
    
      if (error.response.status === 401) {
   
        localStorage.removeItem("userToken")
        window.location.href = '/login';
        console.log('Unauthorized - redirecting to login');
       
      }
    } else if (error.request) {
  
      console.error('No response received:', error.request);
    } else {
   
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);


//admin axios
// const adminAxiosInstance = axios.create({

//   baseURL: 'https://fooddelivery-backend-dusky.vercel.app/api/admin',
  

//   timeout: 15000,
  

//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   }
// });
// adminAxiosInstance.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('adminToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );


// adminAxiosInstance.interceptors.response.use(
//   response => {
   
//     return response;
//   },
//   error => {

//     if (error.response) {
    
//       console.error('Response error:', error.response.status);
      
    
//       if (error.response.status === 401) {
   
//         localStorage.removeItem("adminToken")
//         window.location.href = '/admin/login';
//         console.log('Unauthorized - redirecting to login');
       
//       }
//     } else if (error.request) {
  
//       console.error('No response received:', error.request);
//     } else {
   
//       console.error('Error setting up request:', error.message);
//     }
    
//     return Promise.reject(error);
//   }
// );
export  {userAxiosInstance};