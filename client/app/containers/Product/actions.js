/*
 *
 * Product actions
 *
 */

import { success } from "react-notification-system-redux";
import axios from "axios";

import {
  FETCH_PRODUCTS,
  FETCH_PRODUCT,
  PRODUCT_CHANGE,
  PRODUCT_SHOP_CHANGE,
  SET_PRODUCT_FORM_ERRORS,
  RESET_PRODUCT,
  TOGGLE_ADD_PRODUCT,
  ADD_PRODUCT,
  REMOVE_PRODUCT,
  PRODUCT_SELECT,
  FETCH_PRODUCTS_SELECT,
  SET_PRODUCTS_LOADING,
} from "./constants";

import { RESET_BRAND } from "../Brand/constants";

import handleError from "../../utils/error";
import { formatSelectOptions } from "../../helpers/select";
import { allFieldsValidation } from "../../utils/validation";

export const productChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: PRODUCT_CHANGE,
    payload: formData,
  };
};

export const productShopChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  if (name === "size") {
    // console.log("size is setting");
  }

  return {
    type: PRODUCT_SHOP_CHANGE,
    payload: formData,
  };
};

export const toggleAddProduct = () => {
  return {
    type: TOGGLE_ADD_PRODUCT,
  };
};

export const fetchProducts = (filter, slug) => {
  return async (dispatch, getState) => {
    dispatch({ type: SET_PRODUCTS_LOADING, payload: true });

    try {
      const response = await axios.get(`/api/product/list`);
      console.log(response);

      dispatch({
        type: FETCH_PRODUCTS,
        payload: response.data.products,
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch({ type: SET_PRODUCTS_LOADING, payload: false });
    }
  };
};

export const fetchBrandProducts = (slug) => {
  return async (dispatch, getState) => {
    dispatch({ type: SET_PRODUCTS_LOADING, payload: true });

    try {
      const response = await axios.get(`/api/product/list/brand/${slug}`);

      dispatch({
        type: FETCH_PRODUCTS,
        payload: response.data.products,
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch({ type: SET_PRODUCTS_LOADING, payload: false });
    }
  };
};

export const fetchCategoryProducts = (slug) => {
  return async (dispatch, getState) => {
    dispatch({ type: SET_PRODUCTS_LOADING, payload: true });

    try {
      const response = await axios.get(`/api/product/list/category/${slug}`);
      console.log(response);

      dispatch({
        type: FETCH_PRODUCTS,
        payload: response.data.products,
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch({ type: SET_PRODUCTS_LOADING, payload: false });
    }
  };
};

export const fetchProduct = (slug) => {
  return async (dispatch, getState) => {
    dispatch({ type: SET_PRODUCTS_LOADING, payload: true });

    try {
      const response = await axios.get(`/api/product/item/${slug}`);
      console.log(response);

      const inventory = response.data.product.quantity;
      const product = { ...response.data.product, inventory };

      dispatch({
        type: FETCH_PRODUCT,
        payload: product,
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch({ type: SET_PRODUCTS_LOADING, payload: false });
    }
  };
};

export const handleProductSelect = (value) => {
  return {
    type: PRODUCT_SELECT,
    payload: value,
  };
};

export const fetchProductsSelect = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(`/api/product/list/select`);

      let formattedProducts = formatSelectOptions(response.data.products, true);

      dispatch({
        type: FETCH_PRODUCTS_SELECT,
        payload: formattedProducts,
      });
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const deleteProduct = (id, index) => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.delete(`/api/product/delete/${id}`);

      const successfulOptions = {
        title: `${response.data.message}`,
        position: "tr",
        autoDismiss: 1,
      };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));
        dispatch({
          type: REMOVE_PRODUCT,
          payload: index,
        });
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const addProduct = () => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        sku: "required|min:3",
        name: "required|min:2",
        description: "required|min:10|max:100",
        quantity: "required|numeric",
        price: "required|numeric",
        size: "numeric",
        taxable: "required",
        brand: "required",
      };

      const product = getState().product.productFormData;
      const brand = getState().brand.selectedBrands.value;

      const productData = new FormData();
      productData.append("sku", product.sku);
      productData.append("name", product.name);
      productData.append("description", product.description);
      productData.append("quantity", product.quantity);
      productData.append("price", product.price);
      productData.append("size", product.size);
      productData.append("taxable", product.taxable);
      productData.append("brand", brand);
      productData.append("image", product.image);

      // console.log(product);
      // console.log(brand);

      const newProduct = {
        ...product,
        brand: brand,
      };

      // const { isValid, errors } = allFieldsValidation(newProduct, rules);

      // if (!isValid) {
      //   return dispatch({ type: SET_PRODUCT_FORM_ERRORS, payload: errors });
      // }

      const response = await axios.post(`/api/product/add`, newProduct);

      const successfulOptions = {
        title: `${response.data.message}`,
        position: "tr",
        autoDismiss: 1,
      };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));
        dispatch({
          type: ADD_PRODUCT,
          payload: response.data.product,
        });
        dispatch({ type: RESET_PRODUCT });
        dispatch({ type: RESET_BRAND });
        dispatch(toggleAddProduct());
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};
