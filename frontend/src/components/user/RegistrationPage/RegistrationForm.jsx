import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Alert from "../../alert/alert";
import croix from "../../../assets/croix.svg";
import hidden from "../../../assets/hiddem.svg";
import show from "../../../assets/show.svg";

function RegistrationForm({ setIsSignupModal }) {
  const { VITE_BACKEND_URL } = import.meta.env;
  const [isErrors, setIsErrors] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [data, setData] = useState({
    name: "",
    firstname: "",
    email: "",
    gender: "",
    date_of_birth: "",
    postal_code: "",
    city: "",
    number_vehicles: "",
    profil_image: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword1, setShowPassword1] = useState(true);
  const [showPassword2, setShowPassword2] = useState(true);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const formPostData = async () => {
    //Check if password and password confirmation are the same
    try {
      const response = await fetch(`${VITE_BACKEND_URL}/api/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 400) {
          // detect in the server, is there already a user with same email
          setIsErrors([
            {
              message: "L'email existe déjà.",
              field: "email",
            },
          ]);
        }
        const dataresponse = await response.json();
        if (dataresponse.validationErrors.length > 0) {
          setIsErrors(dataresponse.validationErrors);
        }
        throw new Error("Erreur lors de l'inscription");
      } else {
        setIsErrors(null);
        setIsSubmit(true);
        setTimeout(() => {
          setIsSignupModal(false);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }

    return;
  };
  return (
    <div className="background-modal">
      {(isErrors || isSubmit) && <Alert errors={isErrors} submit={isSubmit} />}
      <div className="background-modal-content">
        <button
          type="button"
          className="background-modal-content-close"
          onClick={() => setIsSignupModal(false)}
        >
          <img src={croix} alt="close" />
        </button>
        <div className="background-modal-content-form">
          <input
            type="text"
            className="background-modal-content-input"
            placeholder="Name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <input
            type="text"
            className="background-modal-content-input"
            placeholder="Prenom"
            value={data.firstname}
            onChange={(e) => setData({ ...data, firstname: e.target.value })}
          />

          <input
            type="email"
            className="background-modal-content-input"
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <select
            name="gender"
            className="background-modal-content-input"
            onChange={(e) => setData({ ...data, gender: e.target.value })}
          >
            <option value="">Sexe</option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
          </select>
          <input
            type="date"
            className="background-modal-content-input"
            onChange={(e) =>
              setData({ ...data, date_of_birth: e.target.value })
            }
          />
          <input
            type="text"
            className="background-modal-content-input"
            placeholder="Code Postal"
            onChange={(e) => setData({ ...data, postal_code: e.target.value })}
          />
          <input
            type="text"
            className="background-modal-content-input"
            placeholder="Ville"
            onChange={(e) => setData({ ...data, city: e.target.value })}
          />
          <input
            type="number"
            className="background-modal-content-input"
            placeholder="Nombre de vehicules"
            onChange={(e) =>
              setData({ ...data, number_vehicles: e.target.value })
            }
          />
          <div className="background-modal-content-input password">
            <input
              style={{ background: "none", border: "none", outline: "none" }}
              className="password-input"
              type={showPassword1 ? "password" : "text"}
              placeholder="Mot de passe"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <button
              type="button"
              className="button-password-show"
              onClick={() => setShowPassword1(!showPassword1)}
            >
              <img
                className="button-password-show"
                src={showPassword1 ? hidden : show}
                alt="show"
              />
            </button>
          </div>

          <div className="background-modal-content-input password">
            <input
              className="password-input"
              style={{ background: "none", border: "none", outline: "none" }}
              type={showPassword2 ? "password" : "text"}
              placeholder="Confirmer"
              value={data.confirm_password}
              onChange={(e) =>
                setData({ ...data, confirm_password: e.target.value })
              }
            />
            <button
              type="button"
              className="button-password-show"
              onClick={() => setShowPassword2(!showPassword2)}
            >
              <img
                className="button-password-show"
                src={showPassword2 ? hidden : show}
                alt="show"
              />
            </button>
          </div>
        </div>

        <button
          className="background-modal-content-button-valid"
          type="submit"
          onClick={formPostData}
        >
          Valider
        </button>
      </div>
    </div>
  );
}

export default RegistrationForm;

RegistrationForm.defaultProps = {
  isSignupModal: false,
  setIsSignupModal: null,
};
RegistrationForm.propTypes = {
  isSignupModal: PropTypes.bool,
  setIsSignupModal: PropTypes.func,
};
