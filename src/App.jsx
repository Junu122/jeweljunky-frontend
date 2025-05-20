import UserRouter from "../routes/userRouter";
import { Routes,Route } from "react-router-dom";
import Context from "@/context/Context";
function App() {
 
 


 




  return (
  <>
  <Context>
   <Routes>
       <Route path="/*" element={<UserRouter />}/>
     </Routes>
  </Context>
  
  </>
  );
}

export default App;
