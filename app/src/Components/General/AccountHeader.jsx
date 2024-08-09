import React, { useState, useEffect, useContext, useCallback } from "react";
import PlaidContext from "../../Context/PlaidContext.jsx";
// import UserContext from "../../Context/UserContext.jsx";
import SimpleButton from "../General/SimpleButton.jsx";
import { getAuth } from 'firebase/auth';
import { app } from "../../Firebase/firebase.js";
import PlaidLinkButton from '../Plaid/PlaidLinkButton';

const AccountHeader = ({ pageTopic, supportingText }) => {
  const [loading, setLoading] = useState(false);
  const {
    linkTokenRetrieved,
    linkTokenError,
    linked_accounts,
    link_ready,
    dispatch
  } = useContext(PlaidContext);

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

            // Step 2.a:
            // If there are no errors and data has the link token
            // set linkToken state in context to the returned linkToken
            // and start next step using isLinkToken state
            dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
            dispatch({ type: "SET_STATE", state: { linkTokenRetrieved: true } });
            // console.log('!!!!Link token from plaid api!!!!:', data.link_token);
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
          // console.log('Link Token Error:', linkTokenError, error);
        }
      } finally {
        dispatch({ type: "SET_STATE", state: { link_ready: true } });
      }
    },
    [dispatch]
  );

  // Call generateToken on page load
  useEffect(() => {
    const fetchToken = () => {
      // console.log('Fetching link token');
      setLoading(true);
      generateToken();
      setLoading(false);
    };

    fetchToken();
  }, []);

  return (
    <div className="mb-6 flex flex-col row-auto">
        <div>
          <h1 className="text-2xl font-bold">{pageTopic}</h1>
          <p className="text-gray-600">{supportingText}</p>
        </div>
        <div>
          {linked_accounts.length !== 0 ?
            loading ? 
              <SimpleButton
                title={'Loading...'}
                className='mt-2 px-4 py-3 max-w-56 text-md bg-red-400 text-neutral-100 rounded-lg'
              /> : linkTokenRetrieved ? <PlaidLinkButton button_text={'Add Another Account'} /> : (
                <SimpleButton
                title={'Loading...'}
                className='mt-2 px-4 py-3 max-w-56 text-md bg-red-400 text-neutral-100 rounded-lg'
                />
              )
           : <div></div>
          }
        </div>
      </div>
  )
};

export default AccountHeader;