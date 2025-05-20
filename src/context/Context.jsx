import { allProducts } from "@/data/products";
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
  const [wishList, setWishList] = useState([1, 2, 3, 4, 5, 6]);
  const [compareItem, setCompareItem] = useState([1, 2, 3]);
  const [quickViewItem, setQuickViewItem] = useState(allProducts[0]);
  const [quickAddItem, setQuickAddItem] = useState(1);
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
      console.error("Auth check failed:", err);
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
      console.log(error);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  useEffect(() => {
    const subtotal = cartProducts.reduce((accumulator, product) => {
      return accumulator + product.quantity * product.price;
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);

  const addProductToCart = (id, qty) => {
    if (!cartProducts.filter((elm) => elm.id == id)[0]) {
      const item = {
        ...allProducts.filter((elm) => elm.id == id)[0],
        quantity: qty ? qty : 1,
      };
      setCartProducts((pre) => [...pre, item]);
      openCartModal();

      // openCart();
    }
  };
  const isAddedToCartProducts = (id) => {
    if (cartProducts.filter((elm) => elm.id == id)[0]) {
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
  const addToWishlist = (id) => {
    if (!wishList.includes(id)) {
      setWishList((pre) => [...pre, id]);
    } else {
      setWishList((pre) => [...pre].filter((elm) => elm != id));
    }
  };
  const removeFromWishlist = (id) => {
    if (wishList.includes(id)) {
      setWishList((pre) => [...pre.filter((elm) => elm != id)]);
    }
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
  const isAddedtoWishlist = (id) => {
    if (wishList.includes(id)) {
      return true;
    }
    return false;
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
      setWishList(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  // This useEffect will run whenever isAuthenticated changes
  // You can use this to debug or perform actions on auth state change
  useEffect(() => {
    console.log("Auth state changed:", isAuthenticated);
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