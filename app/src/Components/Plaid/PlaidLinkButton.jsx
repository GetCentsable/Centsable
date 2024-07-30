import React, { useContext, useCallback } from "react";
import PlaidContext from "../../Context/PlaidContext.jsx";
import UserContext from "../../Context/UserContext.jsx";
import SimpleButton from "../General/SimpleButton.jsx";

const PlaidLinkButton = () => {
  const { linkSuccess, isItemAccess, dispatch } = useContext(PlaidContext);
  const { user } = useContext(UserContext);

  const generateToken = useCallback(
    // Step 1: Send request back end to generate link token
    async () => {
      // Path to firebase function, requires authorization verification
      const path = '';

      // Getting id token for authorized user to send as bearer token
      if (user) {
        const idToken = await user.getIdToken();
        // Fetch call to getPlaidLinkToken function,
        // sending bearer token for authorization
        const response = await fetch(path, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,          
          }
        });

        // If request failed, set linkToken state to null and return
        if (!response.ok) {
          dispatch({ type: "SET_STATE", state: { linkToken: null } });
          return;
        }

        // Check the data and make sure there are no errors
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
          // If there are no errors and data has the link token
          // set linkToken state in context to the returned linkToken
          dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
        }
        // Save the link_token to be used later in the Oauth flow
        // for future google or apple authentication
        localStorage.setItem("link_token", data.link_token);
      } else {
        console.error('User not signed in or bad request for link token');
      }
    },
    [dispatch, user]
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

  const handleClick = async (e) => {
    // Update state and generate token
    e.preventDefault;
    updateIsItemAccess();
    updateLinkSuccess();
    await generateToken();
  }

  return (
    <div>
      <p>Link Success: {linkSuccess.toString()}</p>
      <p>Item Access: {isItemAccess.toString()}</p>
      <SimpleButton
        title='Link your Bank'
        className='w-30'
        onClick={handleClick}
      />
    </div>
  );
};

export default PlaidLinkButton;
