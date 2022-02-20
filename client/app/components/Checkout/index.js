/**
 *
 * Checkout
 *
 */

import React, { useState, useEffect } from "react";
import axios from "axios";

import Button from "../Button";

import { Link } from "react-router-dom";
import { toggleCart } from "../../containers/Navigation/actions";

import Paypal from "../Paypal/Paypal";

const Checkout = (props) => {
  const {
    authenticated,
    handleShopping,
    handleCheckout,
    placeOrder,
    cartTotal,
    cartItems,
  } = props;

  // const [pay , setPay] = useState(false)

  // useEffect(() => {
  //   console.log("in useEffect")
  //   placeOrder(cartTotal , cartItems)

  // } , [pay === true])

  const transactionSuccess = (data) => {
    try {
      // console.log('in transaction success')

      let variables = {
        cartItems: cartItems,
        paymentData: data,
      };

      const apiResponse = async function successFunction() {
        const response = await axios.post("/api/user/successBuy", variables);

        if (response.data.success === true) {
          placeOrder(cartTotal, cartItems);
        }
        return response;
      };

      const yoo = apiResponse();
    } catch (error) {
      // console.log(error);
    }
  };

  const transactionError = () => {
    console.log("Paypal Error");
  };

  const transactionCancel = () => {
    console.log("transaction canceled");
  };

  return (
    <div className="easy-checkout">
      {/* {console.log(cartItems)} */}
      <div className="checkout-actions">
        <Button text="Continue shopping" onClick={() => handleShopping()} />
        <br />
        <br />
        {authenticated ? (
          // <Button text='Place Order' onClick = {() => placeOrder()}  />

          <Paypal
            toPay={cartTotal}
            transactionSuccess={transactionSuccess}
            transactionError={transactionError}
            transactionCancel={transactionCancel}
          />
        ) : (
          <Button text="Proceed To Checkout" onClick={() => handleCheckout()} />
        )}
      </div>
    </div>
  );
};

export default Checkout;
