import {
  allProducts,
  Jewelleryproducts,
  dummyJewellery,
} from "@/data/products";
import { wishlistService } from "@/services/wishlistService";
import { openCartModal } from "@/utlis/openCartModal";
import { toast } from "sonner";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { userServices } from "@/services/userService";
import { cartService } from "@/services/cartService";

const dataContext = React.createContext();

export const useContextElement = () => {
  return useContext(dataContext);
};

export default function Context({ children }) {
  // State management
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [compareItem, setCompareItem] = useState([1, 2, 3]);
  const [quickViewItem, setQuickViewItem] = useState(allProducts[0]);
  const [quickAddItem, setQuickAddItem] = useState({
    productid: "",
    variant: [],
    realproduct: {},
  });
  const [totalPrice, setTotalPrice] = useState(0); // This will now come from backend
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Optimized auth check with better error handling
  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userServices.checkauth();
      if (response?.data?.isAuthenticated) {
        const userdata = await userServices.getuser();
        return userdata;
      }
      return null;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Authentication check failed";
      setError(errorMessage);
      setIsAuthenticated(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data
  const loadData = useCallback(async () => {
    const response = await checkAuthStatus();
    if (response?.user) {
      setUser(response.user);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [checkAuthStatus]);

  // Load wishlist with optimized error handling
  const loadWishlistFromServer = useCallback(async (forceLoad = false) => {
    if (!isAuthenticated && !forceLoad) return;
    
    try {
      const response = await wishlistService.getUserWishlist();
      if (response.success && response.wishList?.products) {
        setWishList(response.wishList.products);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
      // Don't show toast for wishlist errors as it's not critical
    }
  }, [isAuthenticated]);

  // Load cart with backend total - KEY CHANGE HERE
  const loadCartFromServer = useCallback(async (forceLoad = false) => {
    if (!isAuthenticated && !forceLoad) return;

    try {
      const response = await cartService.getCartProducts();
      console.log("Cart products response:", response);
      
      if (response?.success && response?.data?.cart) {
        const { items, subTotal } = response.data.cart;
        
        // Set cart products
        setCartProducts(items || []);
        
        // Set total price from backend (KEY CHANGE)
        setTotalPrice(subTotal || 0);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      // Reset cart state on error
      setCartProducts([]);
      setTotalPrice(0);
    }
  }, [isAuthenticated]);

  // Authentication functions with better error handling
  const login = useCallback(async (formData) => {
    try {
      setLoading(true);
      const response = await userServices.userLogin(formData);
      
      setUser(response?.data?.existUser);
      setIsAuthenticated(true);
      toast.success("Login successful");
      
      // Load user data after login
      await Promise.all([
        loadWishlistFromServer(true),
        loadCartFromServer(true)
      ]);
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data?.error,
      };
    } finally {
      setLoading(false);
    }
  }, [loadWishlistFromServer, loadCartFromServer]);

  const googleSignup = useCallback(async (tokenResponse) => {
    try {
      setLoading(true);
      const response = await userServices.googleRegister(tokenResponse);
      
      setUser(response?.data?.user);
      setIsAuthenticated(true);
      toast.success("Google registration successful");
      
      await Promise.all([
        loadWishlistFromServer(true),
        loadCartFromServer(true)
      ]);
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Google registration failed";
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, [loadWishlistFromServer, loadCartFromServer]);

  const googleSignin = useCallback(async (tokenResponse) => {
    try {
      setLoading(true);
      const response = await userServices.googleLogin(tokenResponse);
      
      setUser(response?.data?.user);
      setIsAuthenticated(true);
      toast.success("Google signin successful");
      
      await Promise.all([
        loadWishlistFromServer(true),
        loadCartFromServer(true)
      ]);
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Google signin failed";
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, [loadWishlistFromServer, loadCartFromServer]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await userServices.userLogout();
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with logout even if API fails
    } finally {
      // Clear all user-related state
      setUser(null);
      setIsAuthenticated(false);
      setCartProducts([]);
      setWishList([]);
      setTotalPrice(0); // Reset total price
      setError(null);
      setLoading(false);
      
      toast.success("Logged out successfully");
    }
    
    return { success: true, message: "Logged out successfully" };
  }, []);

  // Optimized cart functions
  const addProductToCart = useCallback(async (id, variant, qty = 1) => {
    if (!isAuthenticated) {
      toast.error("Please login to add product to cart");
      return { success: false, message: "Not authenticated" };
    }

    if (!variant || !variant._id) {
      toast.error("Please select a variant", {
        description: "No variant selected",
        duration: 4000,
      });
      return { success: false, message: "No variant selected" };
    }

    // Check if item already exists
    const existingItem = cartProducts.find((item) => 
      item.productId._id === id && item.variantId === variant._id
    );

    if (existingItem) {
      toast.info("Product already in cart");
      return { success: false, message: "Product already exists" };
    }

    const cartItem = {
      productId: id,
      quantity: qty,
      variantId: variant._id,
    };

    try {
      setLoading(true);
      const response = await cartService.addToCart(cartItem);
      
      if (response.success) {
        // Reload cart to get updated data including new total
        await loadCartFromServer(true);
        openCartModal();
        toast.success("Product added to cart");
        return { success: true, message: "Product added successfully" };
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to add to cart";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, cartProducts, loadCartFromServer]);

  const isAddedToCartProducts = useCallback((id, selectedVariant) => {
    return cartProducts.some((item) =>
      item.productId._id.toString() === id.toString() &&
      item.variantId.toString() === selectedVariant.toString()
    );
  }, [cartProducts]);

  // Simplified update quantity - let backend handle the calculation
  const updateQuantity = useCallback(async (id, qty, variantId) => {
    try {
      // You might need to implement updateQuantity API call here
      // For now, we'll reload the cart after any quantity change
      await loadCartFromServer(true);
      openCartModal();
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  }, [loadCartFromServer]);

  // Wishlist functions
  const addToWishlist = useCallback(async (id, currentVariant) => {
    if (!isAuthenticated) {
      const errorMessage = "Please login to add items to wishlist";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }

    const wishlistItem = {
      productId: id,
      variantId: currentVariant?._id || null,
      color: currentVariant?.color?.name || null,
      size: currentVariant?.size?.value || null,
    };

    const existingItem = wishList.find((item) => item.productId._id === id);

    try {
      if (!existingItem) {
        const response = await wishlistService.addToWishlist(wishlistItem);
        if (response.success) {
          await loadWishlistFromServer(true);
          toast.success("Product added to wishlist", {
            description: "🖤",
            duration: 4000,
          });
        }
      } else {
        const response = await wishlistService.removeFromWishlist(id);
        if (response.success) {
          setWishList(response?.wishList?.products || []);
          toast.success(response.message);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  }, [isAuthenticated, wishList, loadWishlistFromServer]);

  const removeFromWishlist = useCallback(async (id) => {
    if (!isAuthenticated) {
      toast.error("Please login to remove from wishlist");
      return { success: false, message: "Not authenticated" };
    }

    try {
      const response = await wishlistService.removeFromWishlist(id);
      if (response.success) {
        setWishList(response?.wishList?.products || []);
        toast.success("Product removed successfully");
      }
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [isAuthenticated]);

  // Compare functions
  const addToCompareItem = useCallback((id) => {
    setCompareItem((prev) => 
      prev.includes(id) ? prev : [...prev, id]
    );
  }, []);

  const removeFromCompareItem = useCallback((id) => {
    setCompareItem((prev) => prev.filter((item) => item !== id));
  }, []);

  // Helper functions
  const isAddedtoWishlist = useCallback((id) => {
    return Array.isArray(wishList) && wishList.some((item) => item.productId._id === id);
  }, [wishList]);

  const getWishlistItem = useCallback((productId) => {
    return Array.isArray(wishList) ? wishList.find((item) => item.productId === productId) : null;
  }, [wishList]);

  const isAddedtoCompareItem = useCallback((id) => {
    return compareItem.includes(id);
  }, [compareItem]);

  // Effects
  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (isAuthenticated) {
      Promise.all([
        loadWishlistFromServer(true),
        loadCartFromServer(true)
      ]);
    }
  }, [isAuthenticated, loadWishlistFromServer, loadCartFromServer]);

  // REMOVED: Frontend cart total calculation useEffect since we now use backend total

  const contextValue = {
    // Cart related
    cartProducts,
    setCartProducts,
    totalPrice, // Now comes from backend
    addProductToCart,
    isAddedToCartProducts,
    updateQuantity,
    
    // Wishlist related
    wishList,
    addToWishlist,
    removeFromWishlist,
    isAddedtoWishlist,
    getWishlistItem,
    
    // Compare related
    compareItem,
    setCompareItem,
    addToCompareItem,
    removeFromCompareItem,
    isAddedtoCompareItem,
    
    // Quick view/add
    quickViewItem,
    setQuickViewItem,
    quickAddItem,
    setQuickAddItem,
    
    // Authentication
    isAuthenticated,
    user,
    setUser,
    loading,
    login,
    logout,
    googleSignup,
    googleSignin,
    checkAuthStatus,
    setTotalPrice,
    // Error handling
    error,
    setError,
  };

  return (
    <dataContext.Provider value={contextValue}>
      {children}
    </dataContext.Provider>
  );
}