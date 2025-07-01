import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 0;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState({});
  const navigate = useNavigate();

  // ✅ Promo-related global state
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (id) => {
    if (!wishlist.includes(id)) {
      setWishlist((prev) => [...prev, id]);
      toast.success("Added to Wishlist");
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((itemId) => itemId !== id));
    toast.info("Removed from Wishlist");
  };

  const addToCart = async (itemId, size, quantity = 1) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    const cartData = structuredClone(cartItems);

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    if (cartData[itemId][size]) {
      cartData[itemId][size] += quantity;
    } else {
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }

    toast.success("Added to Cart");
  };

  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);

    if (quantity > 0) {
      cartData[itemId][size] = quantity;
    } else {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalCount += cartItems[items][item];
        }
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (!itemInfo) continue;

      for (const size in cartItems[itemId]) {
        const qty = cartItems[itemId][size];
        totalAmount += itemInfo.price * qty;
      }
    }
    return totalAmount;
  };

  const getFirstCartItemImage = () => {
    const cartItemIds = Object.keys(cartItems);
    for (const itemId of cartItemIds) {
      const product = products.find((p) => p._id === itemId);
      if (product && product.image) {
        return product.image;
      }
    }
    return null;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const addReview = async (productId, reviewData) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/review/add",
        { productId, review: reviewData },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Review added successfully!");
        getProductReviews(productId);
      } else {
        toast.error(response.data.message || "Failed to add review.");
      }
    } catch (error) {
      console.error("Review error:", error);
      toast.error("Error while submitting review.");
    }
  };

  const getProductReviews = async (productId) => {
    try {
      const response = await axios.get(`${backendUrl}/api/review/${productId}`);
      if (response.data.success) {
        setReviews((prev) => ({
          ...prev,
          [productId]: response.data.reviews,
        }));
      }
    } catch (error) {
      console.error("Fetch reviews error:", error);
      toast.error("Unable to fetch reviews");
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!token && storedToken) {
      setToken(storedToken);
      getUserCart(storedToken);
    }
    if (token) {
      getUserCart(token);
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    reviews,
    addReview,
    getProductReviews,
    getFirstCartItemImage,

    // ✅ Promo Code
    promoCode,
    setPromoCode,
    discount,
    setDiscount,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
