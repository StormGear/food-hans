import React, { useEffect, useContext } from "react";
import { CartContext } from "../../../contextproviders/Cartcontext";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../../constants";
import CartItem from "./CartItem";
import { IoCloseCircleOutline } from "react-icons/io5";


const Cart = () => {
  // const getTotal = () =>
  //   cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const {  cartItems, totalCost, setTotalCost, clearCart, setCartItems, placeOrder } = useContext(CartContext);
  const { userId } = useParams()

  useEffect(() => {
    const cart_id = userId;
 // Fetch data when the component mounts
 const fetchCartItems = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/cartitems/allcart-totalcost/${cart_id}`)
    const data = await response.data;
    console.log('cart items', data)
    setCartItems([...data.items]);
    setTotalCost(data.total_cost)
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};

  fetchCartItems();
    return () => console.log("Cart unmounted");
  }, [])

  const handleClearCart = async (item) => {
    try {
      const response = await clearCart(item);
      if (response.success) {
        setCartItems([]);
        setTotalCost(0);
      } else {
        console.error("Error clearing cart:", response.message);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  }

  const handlePlaceOrder = async (userId, total_cost) => {
    try {
      const response = await placeOrder(userId, total_cost);
      if (response.success) {
        setCartItems([]);
        setTotalCost(0);
      } else {
        console.error("Error placing order:", response.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  }




  return (
    <div className="p-4 mt-4">
      <h2 className="text-2xl font-semibold mb-7">Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="flex flex-col justify-center items-center min-h-full">
        <p className="text-gray-700 mb-4 font-bold">Your cart is empty.</p>
        <NavLink
        to={`/users/${userId}`}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Back to Menu
      </NavLink>
      </div>
      ) : (
        <>
          <ul className="divide-y">
            {cartItems.map((item, index) => {
              console.log(`cart item at ${index}`, item)
               return <CartItem key={item.cartitem_id} item={item} />
            }
              
            
            )}
          </ul>
          <div className="mt-4">
            <p className="font-semibold">
              Total: GH₵ {totalCost}
            </p>
            <div className="flex flex-col sm:flex-row justify-between mt-4">
              <button
                onClick={() => handleClearCart(userId)}
                className="bg-red-500 text-white px-4 py-2 my-2 rounded max-w-max" 
              >
                Clear Cart
              </button>

              <NavLink
                to={`/users/${userId}`}
                className="bg-green-500 text-white px-4 py-2 my-2 rounded max-w-max"
              >
                Back to Menu
              </NavLink>
              <button
                onClick={() => handlePlaceOrder(userId, totalCost)}
                className="bg-secondary-color text-white px-4 py-2 my-2 rounded max-w-max"
              >
                Place Order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
