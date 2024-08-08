import { useState, useContext } from "react";
import UserContext from '../../Context/UserContext.jsx';

const Modal = ({ message, onClose }) => {
  // const {
  //   setRecipientPreference,
  //   setRecipientsLoaded,
  // } = useContext(UserContext);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-50 absolute inset-0" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-10">
        <h2 className="text-lg font-semibold mb-4">Notice</h2>
        <p className="mb-4">{message}</p>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
