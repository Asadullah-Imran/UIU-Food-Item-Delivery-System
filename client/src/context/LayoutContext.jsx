import React, { createContext, useContext, useState } from 'react';

const LayoutContext = createContext({
  headerActions: null,
  setHeaderActions: () => {},
  hideGlobalSearch: false,
  setHideGlobalSearch: () => {},
  noPadding: false,
  setNoPadding: () => {},
});

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider = ({ children }) => {
  const [headerActions, setHeaderActions] = useState(null);
  const [hideGlobalSearch, setHideGlobalSearch] = useState(false);
  const [noPadding, setNoPadding] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        headerActions,
        setHeaderActions,
        hideGlobalSearch,
        setHideGlobalSearch,
        noPadding,
        setNoPadding,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
