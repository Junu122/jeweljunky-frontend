import { allProducts, Jewelleryproducts,dummyJewellery} from "@/data/products";
import { wishlistService } from "@/services/wishlistService";
import { openCartModal } from "@/utlis/openCartModal";
// import { openCart } from "@/utlis/toggleCart";
import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { userServices } from "@/services/userService";
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
  //   useEffect(() => {
  //    loadData()
  // }, []); 

  // Login functionality
  const login = async (formData) => {
    try {
      const response = await userServices.userLogin(formData);
      setUser(response?.data?.existUser);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
  
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  useEffect(() => {
    const subtotal = cartProducts.reduce((accumulator, product) => {
      return accumulator + product.quantity * product.variant.pricing.price;
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);

  const addProductToCart = (id, variant,qty) => {
   
    const product = dummyJewellery.find((elm) => elm.id == id);
   
    if (!cartProducts.find((elm) => elm.id == id &&  JSON.stringify(elm.variant) === JSON.stringify(variant))  || !cartProducts.length=== 0) {
      const item = {
       
        id: id,
        product: product,
        quantity: qty ? qty : 1,
        variant:variant 
      };
      setCartProducts((pre) => [...pre, item]);
      openCartModal();

      // openCart();
    }
  };
  const isAddedToCartProducts = (id,selectedVariant) => {
   
    if (cartProducts.find((elm) => elm.id == id && JSON.stringify(elm.variant) === JSON.stringify(selectedVariant))) {
      return true;
    }
    return false;
  };

  const updateQuantity = (id, qty) => {
    if (isAddedToCartProducts(id)) {
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

    console.log("id   :",id)
    console.log("currentVariant   :",currentVariant)
    
    const wishlistItem = {
      productId: id,
      variantId: currentVariant?._id || null,
      color: currentVariant?.color?.name || null,
      size: currentVariant?.size?.value || null
    };
    
    const existingItemIndex = wishList.findIndex(item => item.productId === id);
  

    try {
      if(existingItemIndex==-1){
        setWishList((pre) => [...pre, wishlistItem]);
      const response=  await wishlistService.addToWishlist(wishlistItem);

      console.log(response,"00000000000000000000000")
      }else{
        const response=await wishlistService.removeFromWishlist(id);
         setWishList((pre) => pre.filter(item => item.productId !== wishlistItem.productId));
        console.log(response,"response on removing wishlist product")
      }
    } catch (error) {
      console.log(error)
    }
  };

  const removeFromWishlist = (id) => {
    setWishList((pre) => pre.filter(item => item.productId !== id));
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
  const isAddedtoWishlist = (id) => {
 
    return wishList.some(item => item.productId === id);
  };

  // New function to get wishlist item with variant info
  const getWishlistItem = (productId) => {
    return wishList.find(item => item.productId === productId);
  };

  const isAddedtoCompareItem = (id) => {
    if (compareItem.includes(id)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartList"));
    if (items?.length) {
      setCartProducts(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartList", JSON.stringify(cartProducts));
  }, [cartProducts]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("wishlist"));
    if (items?.length) {
      // Handle backward compatibility - convert old format to new format if needed
      const formattedItems = items.map(item => {
        if (typeof item === 'string' || typeof item === 'number') {
          // Old format - just product ID
          return {
            productId: item,
            variantId: null,
            color: null,
            size: null
          };
        }
        // New format - already an object
        return item;
      });
      setWishList(formattedItems);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  // This useEffect will run whenever isAuthenticated changes
  // You can use this to debug or perform actions on auth state change
  useEffect(() => {
    
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