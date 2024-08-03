import React, { useState, useEffect, useContext, useCallback } from "react";
import PlaidContext from "../../Context/PlaidContext.jsx";
// import UserContext from "../../Context/UserContext.jsx";
import SimpleButton from "../General/SimpleButton.jsx";
import { usePlaidLink } from 'react-plaid-link';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { getAuth } from 'firebase/auth';
import { app } from "../../Firebase/firebase.js";

const PlaidLinkButton = () => {
  const [linkWidget, setLinkWidget] = useState(false);
  const { linkToken, 
    linkTokenRetrieved,
    linkSuccess,
    isItemAccess,
    linkTokenError,
    dispatch
  } = useContext(PlaidContext);
  // const { user } = useContext(UserContext);

  // Insantiate firebase auth
  const auth = getAuth(app);

  const generateToken = useCallback(
    // Step 1: Send request back end to generate link token
    async () => {
      // Path to firebase function, requires authorization verification
      const path = 'https://us-central1-centsable-6f179.cloudfunctions.net/createLinkToken';

      // Getting current user object from firebase auth
      const currentUser = auth.currentUser;

      try {
        if (currentUser) {
          // Generate firebase user id token from current user
          const idToken = await currentUser.getIdToken();
          // console.log('IdToken', idToken);

          // Fetch call to getPlaidLinkToken function,
          // sending bearer(id) token for authorization
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

          // Check the data and make sure there are no errors and link token is present
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

            // Step 2.a
            // If there are no errors and data has the link token
            // set linkToken state in context to the returned linkToken
            // and start next step using isLinkToken state
            dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
            dispatch({ type: "SET_STATE", state: { linkTokenRetrieved: true } });
            console.log('Link token from plaid api:', data);
          }

          // Save the link_token to be used later in the Oauth flow
          // for future google or apple authentication
          localStorage.setItem("link_token", data.link_token);
        } else {
          console.error('User not signed in or bad request for link token');
        }
      } catch (error) {
        console.error('Error fetching link token:', error);
        if(linkTokenError) {
          console.log('Link Token Error:', linkTokenError, error);
        }
      }
    },
    [dispatch]
  );

  const onSuccess = React.useCallback(
    (public_token) => {
      // If the access_token is needed, send public_token to server
      const exchangePublicTokenForAccessToken = async () => {
        const response = await fetch("/api/set_access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: `public_token=${public_token}`,
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
        const data = await response.json();
        dispatch({
          type: "SET_STATE",
          state: {
            itemId: data.item_id,
            accessToken: data.access_token,
            isItemAccess: true,
          },
        });
      };

      exchangePublicTokenForAccessToken();


      dispatch({ type: "SET_STATE", state: { linkSuccess: true } });
      window.history.pushState("", "", "/");
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

  // Step 3: Calling usePlaidLink with the link token
  const linkConfig = {
    token: linkToken,
    onSuccess
  }

  // Call usePlaidLink with token to start link initiation,
  // destructure the ready boolean to check if link widget is
  // ready, and open function to launch link widget
  const { open, ready } = usePlaidLink(linkConfig);

  // Use effect to check if link is ready to open
  useEffect(() => {
    console.log('Checking ready:', ready)
    // If the link is ready, open the link widget
    if (ready) {
      open();
    }
  }, [ready]);
  
  const handleClick = async (e) => {
    // Update state and generate token
    e.preventDefault();
    // updateIsItemAccess();
    // updateLinkSuccess();
    await generateToken();
  }

  return (
    <>
      <div>
        <SimpleButton
          title='Link your Bank'
          className='mt-2 px-4 py-3 text-md bg-red-400 text-neutral-100 rounded-lg'
          onClick={handleClick}
          icon={faPlus}
        />
      </div>
      {/* {linkWidget && <PlaidLink />} */}
    </>
  );
};

export default PlaidLinkButton;

