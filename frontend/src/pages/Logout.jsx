import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUserContext } from "../contexte/CurrentUserContext";

function Logout() {
  const navigate = useNavigate();
  const { setAuth } = useCurrentUserContext();
  // Effacer le localStorage
  localStorage.clear();

  useEffect(() => {
    // Utiliser useEffect pour appeler navigate() après le rendu initial
    setAuth(null);
    navigate("/login");
  }, [navigate]);
  return null;
}

export default Logout;
