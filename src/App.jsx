import UserRouter from "../routes/userRouter";
import { Routes,Route } from "react-router-dom";
import Context from "@/context/Context";
import { Toaster } from 'sonner'
import GoogleOAuthWrapper from "./components/googleauth/GoogleOAuthWrapper";
import dotenv from 'dotenv';


function App() {
 
 


 




  return (
  <>
<GoogleOAuthWrapper>
  <Context>
   <Routes>
       <Route path="/*" element={<UserRouter />}/>
     </Routes>
       <Toaster
        position="top-right"
        richColors
        closeButton
        expand={true}
        duration={3000}
        toastOptions={{
          style: {
            fontSize: '14px',
          },
          className: 'my-toast',
          descriptionClassName: 'my-toast-description',
        }}
      />
  </Context>
  </GoogleOAuthWrapper>
  </>
  );
}

export default App;
