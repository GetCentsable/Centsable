import React, { useContext, useEffect, useState, useRef } from 'react';
import AccountHeader from '../Components/General/AccountHeader';
import PlaidLinkButton from '../Components/Plaid/PlaidLinkButton.jsx';
import SimpleButton from '../Components/General/SimpleButton.jsx';
import Card from '../Components/General/Card';
import PlaidConnectInstructions from '../Components/Plaid/PlaidConnectInstructions.jsx';
import PlaidContext from '../Context/PlaidContext';
import { app } from "../Firebase/firebase.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { HashNavigation } from 'swiper/modules';

const Accounts = ({ isUserDrawerOpen }) => {
  const { linked_accounts, link_ready, linkSuccess, linkCallStarted, dispatch } = useContext(PlaidContext);
  const [ loading, setLoading ] = useState(false);
  const [ ready, setReady ] = useState(false);
  const prevLinkCallStartedRef = useRef(linkCallStarted);
  const [isAdmin, setIsAdmin] = useState(false);

  // Instantiate firebase firestore
  const db = getFirestore();
  // Insantiate firebase auth
  const auth = getAuth(app);

  // Function that loads user accounts
  // from db, then adds those accounts to
  // the page
  const getLinkedAccounts = async () => {
    // Path to firebase function, requires authorization verification
    const path = 'https://us-central1-centsable-6f179.cloudfunctions.net/getLinkedAccounts';

    try {
      // Getting current user object from firebase auth
      const currentUser = auth.currentUser;

      if (currentUser) {
        // Generate firebase user id token from current user
        const idToken = await currentUser.getIdToken();

        // Fetch call to getLinkedAcounts function
        // to get all users accounts
        const response = await fetch(path, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            uid: currentUser.uid,
          }),
        });

        // If request failed, set linked_accounts state to empty array and return
        if (!response.ok) {
          dispatch({ type: "SET_STATE", state: { linked_accounts: [] } });
          setLoading(false);
          const errorData = response.json();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
        }

        // Check the data for errors
        const data = await response.json();
        if (!data) {
          dispatch({ type: "SET_STATE", state: { linked_accounts: [] } });
          setLoading(false);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const loadResponse = await fetch('https://us-central1-centsable-6f179.cloudfunctions.net/loadAllUserTransactions', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!loadResponse.ok) {
          setLoading(false);
          const errorData = loadResponse.json();
          throw new Error(`HTTP error! status: ${loadResponse.status}, message: ${errorData.error}`);
        }

        // If there are no errors, add the linked accounts
        // array to the context linked account
        dispatch({ type: "SET_STATE", state: { linked_accounts: data.user_banks } });
        // console.log('Successful linked account retrieval, data is:', data.user_banks);
        // console.log('Link ready is:', link_ready);
      } else {
        throw new Error('No current user found');
      }
    } catch (err) {
      console.log('There was an error fetching user linked accounts:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    
    // Invoke the async function without timeout on page load
    if (prevLinkCallStartedRef.current === linkCallStarted) {
      getLinkedAccounts();
    }

    // Invoke the async function with timeout if linkCallStarted toggles from true to false
    if (prevLinkCallStartedRef.current && !linkCallStarted) {
      setTimeout(() => {
        getLinkedAccounts();
      }, 300);
    }

    // Update prevLinkCallStartedRef to the current value
    prevLinkCallStartedRef.current = linkCallStarted;
  }, [dispatch, linkCallStarted])

  const removeLinkedAccount = async (bank, account) => {
    // Function that removes an account from the users linked accounts
    const removeAccount = async () => {
      // Path to firebase function, requires authorization verification
      const path = 'https://us-central1-centsable-6f179.cloudfunctions.net/removeLinkedAccount';

      try {
        // Getting current user object from firebase auth
        const currentUser = auth.currentUser;

        if (currentUser) {
          // Generate firebase user id token from current user
          const idToken = await currentUser.getIdToken();

          // Fetch call to getLinkedAcounts function
          // to get all users accounts
          const response = await fetch(path, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              uid: currentUser.uid,
              bank: bank,
              account: account,
            }),
          });

          // If request failed, set linked_accounts state to empty array and return
          if (!response.ok) {
            setLoading(false);
            const errorData = response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
          }

          // Check the data for errors
          const data = await response.json();
          if (!data) {
            setLoading(false);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          // If there are no errors, call get linked accounts again
          await getLinkedAccounts();
          // console.log('Link ready is:', link_ready);
        } else {
          throw new Error('No current user found');
        }
      } catch (err) {
        console.log('There was an error removing the account:', err);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    
    // Invoke the async function without timeout on page load
    if (prevLinkCallStartedRef.current === linkCallStarted) {
      removeAccount();
    }

    // Invoke the async function with timeout if linkCallStarted toggles from true to false
    if (prevLinkCallStartedRef.current && !linkCallStarted) {
      setTimeout(() => {
        removeAccount();
      }, 300);
    }

    // Update prevLinkCallStartedRef to the current value
    prevLinkCallStartedRef.current = linkCallStarted;
  };

  useEffect(() => {
    if(link_ready) {
      setTimeout(() => {
        setReady(true);
      }, 300)
    }
  }, [link_ready])

  const handleRemoveCard = (bankIndex, accountIndex) => {
    const updatedAccounts = [...linked_accounts];
    updatedAccounts[bankIndex].accounts.splice(accountIndex, 1);
    if (updatedAccounts[bankIndex].accounts.length === 0) {
      updatedAccounts.splice(bankIndex, 1);
    }
    dispatch({ type: "SET_STATE", state: { linked_accounts: updatedAccounts } });
  };

  const handleChangeCardColor = (bankIndex, accountIndex, newColor) => {
    const updatedAccounts = [...linked_accounts];
    updatedAccounts[bankIndex].accounts[accountIndex].color = newColor;
    dispatch({ type: "SET_STATE", state: { linked_accounts: updatedAccounts } });
  };

  return (
    <div className="p-6 pt-6">
      <AccountHeader
        pageTopic="All Accounts"
        supportingText="Manage your contribution accounts"
        buttonText="Add account"
        isUserDrawerOpen={isUserDrawerOpen}
      />
      {!isAdmin && !linked_accounts && <PlaidConnectInstructions/>}
      {loading ? (
        <div className="loading-spinner-container flex items-center justify-center h-full" style={{ minHeight: '70vh' }}>
          <div role="status">
            <svg aria-hidden="true" className="inline w-36 h-36 text-gray-200 animate-spin dark:text-neutral-300 fill-red-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        linked_accounts.length !== 0  ? (
          <div className="linked-account-container max-w-8xl">
            <div className="flex flex-wrap justify-center">
              {linked_accounts.map((bank, bankIndex) => (
                bank.accounts.map((account, accountIndex) => (
                  <div
                    key={`${bank.institution_name}-${account.account_name}`}
                    className="w-full md-lg:w-1/2 xl:w-1/3 3xl:w-1/4 p-4"
                  >
                    <Card
                      bank_name={bank.institution_name}
                      mask={account.mask}
                      account_name={account.account_name}
                      account_subtype={account.subtype}
                      onRemove={() => removeLinkedAccount(bank.institution_name, account.account_name)}
                      onChangeColor={(newColor) => handleChangeCardColor(bankIndex, accountIndex, newColor)}
                    />
                  </div>
                ))
              ))}
            </div>
          </div>
        ) : (
          !ready ? (
            <div className="flex items-center justify-center h-full flex-col" style={{ minHeight: '70vh' }}>
            <h1 className='xl:mb-6 xl:text-2xl text-xl'>Get Started Contributing</h1>
              <SimpleButton
                  title={'Loading...'}
                  className='inline-flex items-center xl:p-6 xl:text-6xl max-w-80 text-center mt-6'
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full flex-col" style={{ minHeight: '70vh' }}>
            <h1 className='xl:mb-0 xl:text-2xl text-xl'>Get Started Contributing</h1>
            <PlaidLinkButton
              button_text={'Link Your First Account'}
              className="inline-flex mt-3 items-center xl:p-3 xl:text-3xl max-w-none"
            />
            </div>
          )
        )
      )}
    </div>
  );
};

export default Accounts;