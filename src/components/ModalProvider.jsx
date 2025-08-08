import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [activeModals, setActiveModals] = useState([]);

  const registerModal = (modalId) => {
    setActiveModals(prev => [...prev, modalId]);
  };

  const unregisterModal = (modalId) => {
    setActiveModals(prev => prev.filter(id => id !== modalId));
  };

  const isModalActive = (modalId) => {
    return activeModals.includes(modalId);
  };

  const getHighestZIndex = () => {
    return 9999 + (activeModals.length * 10);
  };

  return (
    <ModalContext.Provider value={{
      registerModal,
      unregisterModal,
      isModalActive,
      getHighestZIndex,
      activeModals
    }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
}
