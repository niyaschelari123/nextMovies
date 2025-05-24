// app/contexts/ModalContext.jsx
'use client'; // Make sure it's a client component

import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  return (
    <ModalContext.Provider value={{ isModalOpen, setIsModalOpen, editId, setEditId }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);
