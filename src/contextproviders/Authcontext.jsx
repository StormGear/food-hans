// @ts-nocheck
import React, { useState,  createContext, useContext } from "react";
import axios from "axios";
import baseUrl from "../constants";
import { AuthContext } from "./Authcontext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const { authState } = useContext(AuthContext)

  const addToCart =  async (item, newOptions) => {
    console.log('input item', item);
    const cart_id = authState.user.user_id
    try {
      let cartitem_res;
      let response;
      console.log('newOptions', newOptions)
      console.log('adding to cart')
        response = await axios.post(`${baseUrl}/api/cartitems/create-cartitem`, 
          {
            cart_id: cart_id,
            menuitem_id: item.menuitem_id,
            extra_toppings: newOptions
          }
        );
        cartitem_res = await axios.get(`${baseUrl}/api/cartitems/${cart_id}`)
        console.log('cartitem_res', cartitem_res.data)
        setCartItems((prevCart) => {
        return [...prevCart, { ...item }];
           }
        );
        return {
          success: 'success',
          message: response.data.cartitem_id
        }
    } catch (error) {
      if (error.response) {
        console.log('error', error.response.data.message ?? error.message)
        return {
          error: 'error',
          message: error.response.data.message ?? error.message
        }
      } else {
        console.log('error', error.message)
        return {
          error: 'error',
          message:  error.message
        }

      }
    }
  }
  
 
  const updateQuantity = async (item, quantity) => {
    console.log('input item', item);
    try {
      let response;
      console.log(`updating the quantity for ${item.cartitem_id} from cart`)
        response = await axios.put(`${baseUrl}/api/cartitems/update-cartitem-quantity`, {
          cartitem_id: item.cartitem_id,
          quantity: quantity
        });
        return {
          success: 'success',
          quantity: response.data.quantity
        }
    } catch (error) {
      if (error.response) {
        console.log('error', error.response.data.message ?? error.message)
        return {
          error: 'error',
          message: error.response.data.message ?? error.message
        }
      } else {
        console.log('error', error.message)
        return {
          error: 'error',
          message:  error.message
        }

      }
    }   
  }

  const placeOrder = async (userId, total_cost) => {
    console.log('user with Id',  userId);
    try {
      let response;
      console.log(`placing order for ${userId} at total cost of ${total_cost} from cart`)

        response = await axios.put(`${baseUrl}/api/orders/add-order`, {
          user_id: userId,
          total_amount: total_cost
        });
        return {
          success: 'success',
          quantity: response.data.order_id
        }
    } catch (error) {
      if (error.response) {
        console.log('error', error.response.data.message ?? error.message)
        return {
          error: 'error',
          message: error.response.data.message ?? error.message
        }
      } else {
        console.log('error', error.message)
        return {
          error: 'error',
          message:  error.message
        }

      }
    }   
  }


  const removeCartItem = async (item) => {
    console.log('input item', item);
    try {
      let response;
        response = await axios.delete(`${baseUrl}/api/cartitems/remove-cartitem/${item.cartitem_id}/${item.menuitem_id}`);
        return {
          success: 'success',
          message: response.data.message
        }
    } catch (error) {
      if (error.response) {
        console.log('error', error.response.data.message ?? error.message)
        return {
          error: 'error',
          message: error.response.data.message ?? error.message
        }
      } else {
        console.log('error', error.message)
        return {
          error: 'error',
          message:  error.message
        }

      }
    }
  };

  const clearCart = async (item) => {

    try {

      let response;
        response = await axios.delete(`${baseUrl}/api/cartitems/clear-cart/${item}`);
        console.log('cartitem_res', response.data)
        return {
          success: 'success',
        }
    } catch (error) {
      if (error.response) {
        console.log('error', error.response.data.message ?? error.message)
        return {
          error: 'error',
          message: error.response.data.message ?? error.message
        }
      } else {
        console.log('error', error.message)
        return {
          error: 'error',
          message:  error.message
        }

      }
    } 
  };

  return (
    <CartContext.Provider value={{  cartItems, setCartItems, addToCart, removeCartItem, clearCart, updateQuantity, totalCost, setTotalCost, placeOrder}}>
      {children}
    </CartContext.Provider>
  );
};
