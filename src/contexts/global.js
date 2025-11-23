import React, { createContext, useContext, useState, useMemo } from 'react';

const GlobalContext = createContext({});

export function GlobalProvider({ children }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingOrders, setPendingOrders] = useState(0);

  const value = useMemo(
    () => ({
      isSyncing,
      setIsSyncing,
      pendingOrders,
      setPendingOrders,
    }),
    [isSyncing, pendingOrders],
  );

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}

export const useGlobal = () => useContext(GlobalContext);
