import { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

const CurrentUserContext = createContext();

export const useCurrentUserContext = () => useContext(CurrentUserContext);

export function CurrentUserContextProvider({ children }) {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("user")));
  const [adminModalRoute, setAdminModalRoute] = useState(null);

  const memoizedUser = useMemo(() => {
    return { auth, setAuth, adminModalRoute, setAdminModalRoute };
  }, [auth, adminModalRoute, setAuth, setAdminModalRoute]);

  return (
    <CurrentUserContext.Provider value={memoizedUser}>
      {children}
    </CurrentUserContext.Provider>
  );
}
CurrentUserContextProvider.propTypes = {
  children: PropTypes.node,
};
CurrentUserContextProvider.defaultProps = {
  children: "",
};
