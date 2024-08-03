import React, { createContext, useReducer } from "react";

// Initial state
const initialState = {
  linkSuccess: false,
  isItemAccess: true,
  linkToken: "",
  linkTokenRetrieved: false,
  itemId: null,
  isError: false,
  backend: true,
  products: ["transactions"],
  linkTokenError: {
    error_type: "",
    error_code: "",
    error_message: "",
  },
};

// Action type
const SET_STATE = "SET_STATE";

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case SET_STATE:
      return { ...state, ...action.state };
    default:
      return state;
  }
};

// Create context
const PlaidContext = createContext({
  ...initialState,
  dispatch: () => null
});

// Provider component
export const PlaidProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <PlaidContext.Provider value={{ ...state, dispatch }}>
      {children}
    </PlaidContext.Provider>
  );
};

export default PlaidContext;
