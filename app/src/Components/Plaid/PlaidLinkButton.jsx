import React, { useState, useEffect, useContext, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import PlaidContext from "../../Context/PlaidContext.jsx";
// import UserContext from "../../Context/UserContext.jsx";
import SimpleButton from "../General/SimpleButton.jsx";
import { usePlaidLink } from 'react-plaid-link';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { getAuth } from 'firebase/auth';
import { app } from "../../Firebase/firebase.js";

const PlaidLinkButton = ({ button_text, className }) => {
  const {
    linkToken,
    linkCallBackToggle,
    dispatch
  } = useContext(PlaidContext);
  // const { user } = useContext(UserContext);

  // Insantiate firebase auth
  const auth = getAuth(app);

  // const onSuccess = () => {
    //   console.log('SUUUUCCCESSSS!!!')
    // }
    
    const onSuccess = useCallback(
      (public_token) => {
      // Toggle link to start page refresh
      dispatch({ type: "SET_STATE", state: { linkCallStarted: true } });

      // Step 4:
      // On link success, send passed in public_token to server
      // to exchange with Plaid API for access token
      const exchangePublicTokenForAccessToken = async () => {
        // Path to firbase function
        const path = 'https://us-central1-centsable-6f179.cloudfunctions.net/exchangePublicToken';
        
        // Debug logging
        // console.log('Public token is:', public_token)
        
        try {
          // Getting current user object from firebase auth
          const currentUser = auth.currentUser;
          const uid = currentUser.uid;
  
          if (currentUser) {
            // Generate firebase user id token from current user
            const idToken = await currentUser.getIdToken();
            // console.log('IdToken', idToken);

            // Fetch call to exchangePublicToken,
            // Sending bearer(id) for auth
            const response = await fetch(path, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`,
              },
              body: JSON.stringify({
                public_token: public_token,
                uid: uid
              }),
            });

            if (!response.ok) {
              dispatch({
                type: "SET_STATE",
                state: {
                  itemId: `no item_id retrieved`,
                  accessToken: `no access_token retrieved`,
                  isItemAccess: false,
                },
              });
              return;
            }

          }
        } catch (err) {
          console.error('There was an error exchanging access token:', err);
        } finally {
          dispatch({ type: "SET_STATE", state: { linkSuccess: true } });
          // Toggle link to end page refresh
          dispatch({ type: "SET_STATE", state: { linkCallStarted: false } });
          console.log('On success callback completed!');
        }
      };
      
      exchangePublicTokenForAccessToken();
      
      window.history.pushState("", "", "/");
    },
    [dispatch]
  );

  // Step 3:
  // Calling usePlaidLink with the link token
  // First create a config to be passed into usePlaidLink
  const linkConfig = {
    token: linkToken,
    onSuccess
  }

  // Call usePlaidLink with token to start link initiation,
  // destructure the ready boolean to check if link widget is
  // ready, and open function to launch link widget
  const { open, ready } = usePlaidLink(linkConfig);
  
  const handleClick = async (e) => {
    // Update state and generate token
    e.preventDefault();
    // console.log('Link Button Clicked, Token is:', linkToken)
    open();
    // console.log('OPEN CALLED, ready is:', ready)
  }

  // useEffect(() => {
  //   console.log('MOUNTED LINK TOKEN:', linkToken)
  // }, [])

  return (
    <>
      <div>
        <SimpleButton
          title={button_text}
          className={twMerge(`mt-6 px-4 py-3 max-w-56 text-md bg-red-400 text-neutral-100 rounded-lg`, className)}
          onClick={handleClick}
          disabled={!ready}
          icon={faPlus}
        />
      </div>
    </>
  );
};

export default PlaidLinkButton;

