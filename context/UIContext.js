'use client';
import { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
};

export function UIProvider({ children }) {
  const [isCuratorOpen, setIsCuratorOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);

  const openCurator = () => setIsCuratorOpen(true);
  const closeCurator = () => setIsCuratorOpen(false);

  const openVisualSearch = () => setIsVisualSearchOpen(true);
  const closeVisualSearch = () => setIsVisualSearchOpen(false);

  return (
    <UIContext.Provider value={{
      isCuratorOpen,
      openCurator,
      closeCurator,
      isVisualSearchOpen,
      openVisualSearch,
      closeVisualSearch
    }}>
      {children}
    </UIContext.Provider>
  );
}
