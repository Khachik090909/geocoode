import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import Statistic from "./Statistic";
import Avatar from "../../assets/images/avatar.png";
import Email from "../../assets/images/clarity_email-solid.svg";
import Car from "../../assets/images/fa-solid_car.svg";
import User from "../../assets/images/fa-solid_users.svg";
import Logout from "../../assets/images/solar_logout-2-bold.svg";
import Calender from "../../assets/images/uis_schedule.svg";
import flachBase from "../../assets/flachBase.svg";
import flachHaute from "../../assets/flachHaute.svg";
import Home from "../../assets/images/clarity_home-solid.png";
import "./AdminLayout.scss";

function AdminLayout() {
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [show, setShow] = useState(true);
  const buttones = [
    { img: User, text: "Utilisateurs", route: "users" },
    { img: Car, text: "Voitures", route: "cars" },
    { img: Email, text: "Messages", route: "contacts" },
    {
      img: Calender,
      text: "Reservations",
      route: "reservations",
    },
    { img: Home, text: "Stations", route: "charging-stations" },
    { img: Home, text: "Vers le site", path: "/" },
    { img: Logout, text: "Deconnexion", path: "/logout" },
  ];
  const HandlerClick = (button) => {
    if (button.route) {
      setRoute(button.route);
    } else {
      navigate(button.path);
    }
  };
  return (
    <div className="admin-layout">
      <div className="admin-layout-content">
        <div className={show ? "admin-layout-show" : "admin-layout-hide"}>
          <header className="admin-layout-header">
            <img src={Avatar} alt="" />
            <span>
              <h4>Admin</h4>
              <p>Bonjour</p>
            </span>
          </header>
          <section className="admin-layout-section">
            {buttones.map((button) => (
              <button
                key={button.text}
                onClick={() => {
                  HandlerClick(button);
                }}
              >
                <img src={button.img} alt={button.text} />
                <h5>{button.text}</h5>
              </button>
            ))}
          </section>
        </div>
        <div className="admin-chow-hiddem">
          <button onClick={() => setShow(!show)}>
            <img src={show ? flachHaute : flachBase} alt="flach" />
          </button>
        </div>
      </div>
      {!route && <Statistic />}
      {route && <Modal route={route} />}
      <div className="admin-body">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
