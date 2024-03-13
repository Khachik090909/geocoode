import { redirect } from "react-router-dom";

const { VITE_BACKEND_URL } = import.meta.env;

const verifyTokenOnServer = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${VITE_BACKEND_URL}/api/verify-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return token; // Retourne le token une fois vérifié avec succès
    }
    return redirect("/logout");
  } catch (error) {
    throw Error("Erreur lors de la vérification :", error.message);
  }
};

export const fetchDataUsers = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${VITE_BACKEND_URL}/api/users/${id}/admin`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      return redirect("/");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw Error("error", error);
  }
};

export default verifyTokenOnServer;
