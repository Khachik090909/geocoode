import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Alert from "../../alert/alert";
import croix from "../../../assets/croix.svg";

function ContactPage({ setOpenContact }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isErrors, setIsErrors] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [subject, setSubject] = useState("");
  const { VITE_BACKEND_URL } = import.meta.env;
  const [data, setData] = useState({
    name: user ? user.firstname + " " + user.name : "",
    email: user ? user.email : "",
  });
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const handleChange = (e) => {
    setSubject(e.target.value);
    setData({ ...data, subject: e.target.value });
  };
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${VITE_BACKEND_URL}/api/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const dataresponse = await response.json();
      if (dataresponse.validationErrors.length > 0) {
        setIsErrors(dataresponse.validationErrors);
      }
    } else {
      setIsErrors(null);
      setIsSubmit(true);
    }
  };
  return (
    <div className="background-modal">
      {(isErrors || isSubmit) && <Alert errors={isErrors} submit={isSubmit} />}
      <div className="background-modal-content">
        <button
          type="button"
          className="background-modal-content-close"
          onClick={() => setOpenContact(false)}
        >
          <img src={croix} alt="close" />
        </button>
        <div className="background-modal-content-form">
          <select
            className="background-modal-content-input"
            name="demande"
            onChange={(e) => setData({ ...data, object: e.target.value })}
          >
            <option value="">{"--Objet de la demande--"}</option>
            <option value="information">Demande d'information</option>
            <option value="partenariat">Demande de partenariat</option>
            <option value="autres">Autres</option>
          </select>
          <input
            className="background-modal-content-input"
            type="text"
            name="name"
            placeholder="Nom et Prénom"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <input
            className="background-modal-content-input"
            type="email"
            name="email"
            placeholder="Adresse email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <input
            className="background-modal-content-input textarea"
            type="textArea"
            name="subject"
            placeholder="Sujet de la demande"
            value={subject}
            onChange={handleChange}
          />
        </div>

        <button
          className="background-modal-content-button-valid"
          type="submit"
          onClick={handleSubmit}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
export default ContactPage;

ContactPage.propTypes = {
  setOpenContact: PropTypes.func.isRequired,
};
