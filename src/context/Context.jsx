import { allProducts, Jewelleryproducts,dummyJewellery} from "@/data/products";
import { wishlistService } from "@/services/wishlistService";
import { openCartModal } from "@/utlis/openCartModal";
import { toast } from 'sonner'
// import { openCart } from "@/utlis/toggleCart";
import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { userServices } from "@/services/userService";
import { cartService } from "@/services/cartService";
const dataContext = React.createContext();
export const useContextElement = () => {
  return useContext(dataContext);
};

export default function Context({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  // Changed wishList structure to store objects with productId and variantId
  const [wishList, setWishList] = useState([]);
  const [compareItem, setCompareItem] = useState([1, 2, 3]);
  const [quickViewItem, setQuickViewItem] = useState(allProducts[0]);
  const [quickAddItem, setQuickAddItem] = useState({productid:"",variant:[],realproduct:{}});
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading,setLoading]=useState(false)
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);



  // Check authentication status on component mount only (not on every isAuthenticated change)
const loadData=async()=>{
 checkAuthStatus().then(response=>{
  if(response?.user){
      setUser(response?.user)
    setIsAuthenticated(true)
   
  }else{
    setIsAuthenticated(false)
  }
 })
}

  const checkAuthStatus = async () => {
    try {
      setLoading(true)
      const response = await userServices.checkauth();
       if(response?.data?.isAuthenticated){
        const userdata=await userServices.getuser();
        return userdata
       }
     
    } catch (err) {
  
      setError(err.response?.data?.message || "Authentication check failed");
      setIsAuthenticated(false);
      setLoading(false)
    }finally{
      setLoading(false);
    }
  };

  const loadWishlistFromServer=async(forceLoad = false)=>{
    if(!isAuthenticated && !forceLoad) return;
    try {
      const response=await wishlistService.getUserWishlist();
      if(response.success){
        const userWishlist=response?.wishList?.products;
        setWishList(userWishlist);
      }
    } catch (error) {
      console.log("error in userwishlist  :",error)
    }
  }

  const loadCartFromServer=async(forceLoad=false)=>{
    if(!isAuthenticated && !forceLoad)return

    try {
      const response=await cartService.getCartProducts()
      console.log("cart products  :........:",response);
      if(response?.success){
        const userCart=response?.cart?.items;
        setCartProducts(userCart)
      }
    } catch (error) {
      console.log(error)
    }
    
  }


  // Login functionality
  const login = async (formData) => {
    try {
      const response = await userServices.userLogin(formData);
      setUser(response?.data?.existUser);
      setIsAuthenticated(true);
      await loadWishlistFromServer(true);
      console.log("response in login  :",response)
      return response.data;
    } catch (error) {
  
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  useEffect(() => {
    const subtotal = cartProducts.reduce((accumulator, product) => {
      return accumulator + product.quantity * product.productId.variants[0].pricing.price;
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);
  console.log("cart products :",cartProducts)


  const addProductToCart =async (id, variant,qty) => {
    if(!isAuthenticated){
      return toast.error("please login to add product to cart")
    }

      const item = {
        productId: id,
        quantity: qty ? qty : 1,
        variantId:variant._id 
      };

      const existingCartProduct=cartProducts.find((elm)=>{
        elm.productId._id === id && elm.variantId===variant
      })


      if(existingCartProduct){
        return {success:false,message:"product already exist"}
      }
      try {
        const response=await cartService.addToCart(item);
        console.log("response in add to cart  :",response)
        if(response.success){
         await  loadCartFromServer(true)
           openCartModal();
           toast.success("product added to cart")
        }
     
      } catch (error) {
        if(error?.response){
            toast.error(error.response.data.message)
        }else{
          toast.error(error.message)
        }

      
      }
      // setCartProducts((pre) => [...pre, item]);
    

      // openCart();

  };
  const isAddedToCartProducts = (id,selectedVariant) => {
    console.log("id,selected variants",id,selectedVariant)
   
    if (cartProducts.find((elm) => elm.productId._id.toString()  === id.toString() && elm.variantId.toString()===selectedVariant.toString()   )) {
      return true;
    }
    return false;
  };

  const updateQuantity = (id, qty,variantId) => {
    if (isAddedToCartProducts(id,variantId)) {
      let item = cartProducts.filter((elm) => elm.id == id)[0];
      let items = [...cartProducts];
      const itemIndex = items.indexOf(item);

      item.quantity = qty / 1;
      items[itemIndex] = item;
      setCartProducts(items);

      openCartModal();
    } else {
      addProductToCart(id, qty);
    }
  };


  const addToWishlist =async (id, currentVariant) => {
      if (!isAuthenticated) {
      setError("Please login to add items to wishlist");
      return { success: false, message: "Please login to add items to wishlist" };
    }


    
    const wishlistItem = {
      productId: id,
      variantId: currentVariant?._id || null,
      color: currentVariant?.color?.name || null,
      size: currentVariant?.size?.value || null
    };
    
    const existingItemIndex = wishList.findIndex(item => item.productId._id === id);


  

    try {
      if(existingItemIndex===-1){
        // setWishList((pre) => [...pre, wishlistItem]);
      const response=  await wishlistService.addToWishlist(wishlistItem);
       if(response.success) {
          // Reload wishlist from server to get the complete data
          await loadWishlistFromServer(true);
        }
        return {success:true,message:"product wishlisted"}
   
      }else{
        const response=await wishlistService.removeFromWishlist(id);
         if(response.success) {
          // Update local state
          setWishList(response?.wishList?.products || []);
        }
        return {success:true,message:"product removed succesfully"}
       
      }
    } catch (error) {
         return {success:false,message:error.message}
    
        
    
      // return error.message
    }
  };

  const removeFromWishlist =async (id) => {
     if (!isAuthenticated) {
      setError("error in removing product");
      return { success: false, message: "Please login to remove from wishlist" };
    }
    try {
      const response=await wishlistService.removeFromWishlist(id);
        setWishList(response?.wishList?.products);
        return {success:true,message:"product removed succesfully"}

    } catch (error) {
      return {success:false,message:error.message}
    }
    // setWishList((pre) => pre.filter(item => item.productId !== id));
  };

  const addToCompareItem = (id) => {
    if (!compareItem.includes(id)) {
      setCompareItem((pre) => [...pre, id]);
    }
  };
  const removeFromCompareItem = (id) => {

    if (compareItem.includes(id)) {
      setCompareItem((pre) => [...pre.filter((elm) => elm != id)]);
    }
  };

  // Updated to work with new wishlist structure
  // const isAddedtoWishlist = (id) => {
 
  //   return wishList.some(item => item.productId._id === id);
  // };

  const isAddedtoWishlist = (id) => {
  // Add null/undefined check for wishList
  if (!wishList || !Array.isArray(wishList)) {
    return false;
  }
  return wishList.some(item => item.productId._id === id);
};

  // New function to get wishlist item with variant info
  // const getWishlistItem = (productId) => {
  //   return wishList.find(item => item.productId === productId);
  // };

  const getWishlistItem = (productId) => {
  // Add null/undefined check for wishList
  if (!wishList || !Array.isArray(wishList)) {
    return null;
  }
  return wishList.find(item => item.productId === productId);
};

 

  const isAddedtoCompareItem = (id) => {
    if (compareItem.includes(id)) {
      return true;
    }
    return false;
  };

  // useEffect(() => {
  //   const items = JSON.parse(localStorage.getItem("cartList"));
  //   if (items?.length) {
  //     setCartProducts(items);
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("cartList", JSON.stringify(cartProducts));
  // }, [cartProducts]);

  // useEffect(() => {
  //   const items = JSON.parse(localStorage.getItem("wishlist"));
  //   if (items?.length) {

  //     const formattedItems = items.map(item => {
  //       if (typeof item === 'string' || typeof item === 'number') {
         
  //         return {
  //           productId: item,
  //           variantId: null,
  //           color: null,
  //           size: null
  //         };
  //       }
       
  //       return item;
  //     });
  //     setWishList(formattedItems);
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("wishlist", JSON.stringify(wishList));
  // }, [wishList]);

  // This useEffect will run whenever isAuthenticated changes
  // You can use this to debug or perform actions on auth state change

       useEffect(() => {
     loadData()
  }, []); 
  useEffect(() => {
    if(isAuthenticated){
      loadWishlistFromServer(true);
      loadCartFromServer(true)
      
    }
  }, [isAuthenticated]);

  const contextElement = {
    cartProducts,
    setCartProducts,
    totalPrice,
    addProductToCart,
    isAddedToCartProducts,
    removeFromWishlist,
    addToWishlist,
    isAddedtoWishlist,
    getWishlistItem, // New function to get wishlist item with variant info
    quickViewItem,
    wishList,
    setQuickViewItem,
    quickAddItem,
    setQuickAddItem,
    addToCompareItem,
    isAddedtoCompareItem,
    removeFromCompareItem,
    compareItem,
    setCompareItem,
    updateQuantity,
    login,
    isAuthenticated,
    user,
    loading,
    checkAuthStatus, // Exposing this so you can manually check status if needed
  };
  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}