import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUserContext } from "../../../contexte/CurrentUserContext";
import Alert from "../../alert/alert";
import "./login.scss";
import RegistrationForm from "../RegistrationPage/RegistrationForm";
import email from "../../../assets/images/email.png";
import password from "../../../assets/images/password.png";
import hidden from "../../../assets/images/Hidden.png";
import show from "../../../assets/images/Show.png";

function LoginPage() {
  const { VITE_BACKEND_URL } = import.meta.env;
  const { auth, setAuth } = useCurrentUserContext();
  const navigate = useNavigate();
  const [isErrors, setIsErrors] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isSignupModal, setIsSignupModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const formPostData = async () => {
    try {
      const response = await fetch(`${VITE_BACKEND_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Spécifier le type de contenu JSON
        },
        body: JSON.stringify(data), // Convertir l'objet data en chaîne JSON
      });
      const user = await response.json();
      if (response.status === 200) {
        if (user.user.is_admin === 1) {
          delete user.user.is_admin;
          if (auth) {
            setAuth(user.user);
          }
          localStorage.setItem("user", JSON.stringify(user.user));
          localStorage.setItem("token", user.token);
          navigate("/admin");
        } else {
          delete user.user.is_admin;
          setAuth(user.user);
          localStorage.setItem("user", JSON.stringify(user.user));
          localStorage.setItem("token", user.token);
          navigate("/");
        }
      } else {
        if (user.validationErrors.length > 0) {
          setIsErrors(user.validationErrors);
          setIsSubmit(true);
        }
        throw new Error("Erreur lors de la connexion");
      }
    } catch (error) {
      console.error("error", error);
      setIsErrors({ field: "server", message: "Erreur de serveur" });
      setIsSubmit(true);
    }
  };

  return (
    <section className="login-page">
      <div className="img-oval"></div>
      <div className="login-contain">
        <label className="form-email-password">
          <div>
            <img src={email} alt="email" />
            <input
              className="login-page-input-text"
              type="text"
              placeholder="Adresse email"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>
        </label>
        <label className="form-email-password">
          <div>
            <img src={password} alt="email" />
            <input
              className="login-page-input-password"
              type={isVisible ? "text" : "password"}
              placeholder="Mot de passe"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>

          <button type="button" onClick={() => setIsVisible(!isVisible)}>
            <img src={isVisible ? show : hidden} alt="eye" />
          </button>
        </label>

        <button
          className="signin-btn-submit"
          type="submit"
          onClick={formPostData}
        >
          Se connecter
        </button>
        <button
          type="button"
          className="login-button-modal"
          onClick={() => setIsSignupModal(true)}
        >
          S'inscrire
        </button>
        <div className="pos-relative">
          {isErrors && isSubmit && (
            <Alert errors={isErrors} submit={isSubmit} />
          )}
        </div>
      </div>

      {isSignupModal && (
        <RegistrationForm setIsSignupModal={setIsSignupModal} />
      )}
    </section>
  );
}

export default LoginPage;
