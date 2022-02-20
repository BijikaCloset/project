/*
 *
 * Cart actions
 *
 */

import { push } from "connected-react-router";
import { success, info } from "react-notification-system-redux";
import axios from "axios";
import cookie from "react-cookies";
import { tax } from "../../tax";

import {
  HANDLE_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  HANDLE_CART_TOTAL,
  SET_CART_ID,
  CLEAR_CART,
} from "./constants";

import {
  SET_PRODUCT_SHOP_FORM_ERRORS,
  RESET_PRODUCT_SHOP,
} from "../Product/constants";

import handleError from "../../utils/error";
import { toggleCart } from "../Navigation/actions";
import { allFieldsValidation } from "../../utils/validation";

// Handle Add To Cart
export const handleAddToCart = (product) => {
  // console.log(product);
  return (dispatch, getState) => {
    // console.log("THis is user" , getstate() )
    // console.log("This is global state", getState());
    product.size = Number(getState().product.productShopData.size);
    product.quantity = Number(getState().product.productShopData.quantity);
    product.totalPrice = product.quantity * product.price;
    const inventory = getState().product.product.inventory;
    // console.log(inventory);

    const result = calculatePurchaseQuantity(inventory);

    const rules = {
      quantity: `min:1`,
    };

    const { isValid, errors } = allFieldsValidation(product, rules);

    if (!isValid) {
      return dispatch({ type: SET_PRODUCT_SHOP_FORM_ERRORS, payload: errors });
    }

    dispatch({
      type: RESET_PRODUCT_SHOP,
    });

    dispatch({
      type: ADD_TO_CART,
      payload: product,
    });
    dispatch(calculateCartTotal());
    dispatch(toggleCart());
  };
};

// Handle Remove From Cart
export const handleRemoveFromCart = (product) => {
  return (dispatch, getState) => {
    dispatch({
      type: REMOVE_FROM_CART,
      payload: product,
    });
    dispatch(calculateCartTotal());
    // dispatch(toggleCart());
  };
};

export const calculateCartTotal = () => {
  return (dispatch, getState) => {
    let zipcode = getState().account.user.zipcode;
    const cartItems = getState().cart.cartItems;

    let total = 0;

    cartItems.map((item) => {
      // console.log(item);
      total += item.price * item.quantity;
      // console.log(total);
    });

    let taxPercentage = (tax[zipcode] / 100) * total;
    // console.log(taxPercentage);

    total = total + taxPercentage;
    total = Number(total).toFixed(2);

    dispatch({
      type: HANDLE_CART_TOTAL,
      payload: total,
    });
  };
};

// set cart store from cookie
export const handleCart = () => {
  const cart = {
    cartItems: cookie.load("cart_items"),
    itemsInCart: cookie.load("items_in_cart"),
    cartTotal: cookie.load("cart_total"),
    cartId: cookie.load("cart_id"),
  };

  return (dispatch, getState) => {
    if (cart.cartItems != undefined || cart.itemsInCart != undefined) {
      dispatch({
        type: HANDLE_CART,
        payload: cart,
      });
    }
  };
};

export const handleCheckout = () => {
  return (dispatch, getState) => {
    const successfulOptions = {
      title: `Please Login to proceed to checkout`,
      position: "tr",
      autoDismiss: 1,
    };

    dispatch(toggleCart());
    dispatch(push("/login"));
    dispatch(success(successfulOptions));
  };
};

// Continue shopping use case
export const handleShopping = () => {
  return (dispatch, getState) => {
    dispatch(push("/shop"));
    dispatch(toggleCart());
  };
};

// create cart id api
export const getCartId = () => {
  return async (dispatch, getState) => {
    try {
      const cartId = cookie.load("cart_id");
      const cartItems = getState().cart.cartItems;
      const products = getCartItems(cartItems);

      // create cart id if there is no one
      if (!cartId) {
        const response = await axios.post(`/api/cart/add`, { products });

        dispatch(setCartId(response.data.cartId));
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const setCartId = (cartId) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_CART_ID,
      payload: cartId,
    });
  };
};

export const clearCart = () => {
  return (dispatch, getState) => {
    cookie.remove("cart_items", { path: "/" });
    cookie.remove("items_in_cart", { path: "/" });
    cookie.remove("cart_total", { path: "/" });
    cookie.remove("cart_id", { path: "/" });

    dispatch({
      type: CLEAR_CART,
    });
  };
};

const getCartItems = (cartItems) => {
  const newCartItems = [];
  cartItems.map((item) => {
    const newItem = {};
    newItem.quantity = item.quantity;
    newItem.totalPrice = item.totalPrice;
    newItem.product = item._id;
    newCartItems.push(newItem);
  });

  return newCartItems;
};

const calculatePurchaseQuantity = (inventory) => {
  if (inventory <= 25) {
    return 1;
  } else if (inventory > 25 && inventory <= 100) {
    return 5;
  } else if (inventory > 100 && inventory < 500) {
    return 25;
  } else {
    return 50;
  }
};
