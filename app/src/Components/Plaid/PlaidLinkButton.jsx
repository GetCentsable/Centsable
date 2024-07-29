import React, { useContext, useCallback } from "react";
import PlaidContext from "../../Context/PlaidContext.jsx";

const PlaidLinkButton = () => {
  const { linkSuccess, isItemAccess, isPaymentInitiation, dispatch } = useContext(PlaidContext);

  const generateToken = useCallback(
    // Step 1: Send request back end to generate link token
    async (isPaymentInitiation) => {
      // Link tokens for 'payment_initiation' use a different creation flow in your backend.
      const path = isPaymentInitiation
        ? "/centsable/create_link_token_for_payment"
        : "/centsable/create_link_token";
      const response = await fetch(path, {
        method: "POST",
      });
      if (!response.ok) {
        dispatch({ type: "SET_STATE", state: { linkToken: null } });
        return;
      }
      const data = await response.json();
      if (data) {
        if (data.error != null) {
          dispatch({
            type: "SET_STATE",
            state: {
              linkToken: null,
              linkTokenError: data.error,
            },
          });
          return;
        }
        dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
      }
      // Save the link_token to be used later in the Oauth flow.
      localStorage.setItem("link_token", data.link_token);
    },
    [dispatch]
  );

  const updateLinkSuccess = () => {
    dispatch({
      type: "SET_STATE",
      state: { linkSuccess: !linkSuccess }
    });
  };

  const updateIsItemAccess = () => {
    dispatch({
      type: "SET_STATE",
      state: { isItemAccess: !isItemAccess }
    });
  };

  const handleClick = async () => {
    // Determine paymentInitiation directly or from another source
    const paymentInitiation = isPaymentInitiation; // Default value false or another method to determine this
  
    // Update state and generate token
    updateIsItemAccess();
    updateLinkSuccess();
    await generateToken(paymentInitiation);
  }

  return (
    <div>
      <p>Link Success: {linkSuccess.toString()}</p>
      <p>Item Access: {isItemAccess.toString()}</p>
      <button onClick={handleClick}>Link your account</button>
    </div>
  );
};

export default PlaidLinkButton;
