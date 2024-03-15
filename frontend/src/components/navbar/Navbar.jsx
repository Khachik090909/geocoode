import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContactPage from "../user/ContactPage/ContactPage";
import "./navbar.scss";

function Navbar() {
  const navigate = useNavigate();
  const [buttonClicked, setButtonClick] = useState(false);
  const [navbarData, setNavbarData] = useState([]);
  const [mobile, setMobile] = useState();
  const [openContact, setOpenContact] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (window.innerWidth < 450) {
      setMobile(true);
      setButtonClick(false);
    } else {
      setMobile(false);
      setButtonClick(true);
    }
  }, []);

  useEffect(() => {
    if (token) {
      setNavbarData(["Map", "Profile", "contact", "Se deconnecter"]);
    } else {
      setNavbarData(["Map", "contact", "Se connecter"]);
    }
  }, [token]);

  const handlerClick = (item) => {
    if (item === "Map") {
      navigate("/");
    } else if (item === "Profile") {
      navigate("/profile");
    } else if (item === "contact") {
      setOpenContact(true);
    } else if (item === "Se deconnecter") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.reload();
    } else if (item === "Se connecter") {
      navigate("/login");
    }
    if (mobile) setButtonClick(false);
  };

  return (
    <div className="navbar">
      {mobile && (
        <button
          type="button"
          className={`hamburger ${buttonClicked ? "active" : ""}`}
          onClick={() => setButtonClick(!buttonClicked)}
          aria-label="burger-menu"
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      )}

      {buttonClicked && (
        <div
          className={mobile ? "mobile-btn-container" : "desktop-btn-container"}
        >
          {navbarData.map((item) => (
            <button
              type="button"
              key={item}
              className={mobile ? "mobile-btn" : "desktop-btn"}
              onClick={() => handlerClick(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {openContact && <ContactPage setOpenContact={setOpenContact} />}
    </div>
  );
}

export default Navbar;
