import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import AddCar from "./AddCar";
import ModifyCar from "./ModifyCar";
import flachBase from "../../../assets/flachBase.svg";
import flachHaute from "../../../assets/flachHaute.svg";
import line from "../../../assets/Line.svg";
import stylo from "../../../assets/stylo.svg";
import addCar from "../../../assets/add_car.svg";
import croix from "../../../assets/croix.svg";
import carImag from "../../../assets/car-imag.svg";

function CardCar() {
  const [modalCar, setModalCar] = useState(false);
  const [show, setShow] = useState(false);
  const [modifyCar, setModifyCar] = useState(false);
  const [dataUser, setDataUser] = useState();
  const [cordoneClick, setCordoneClick] = useState("");
  const dataCars = useLoaderData();
  useEffect(() => {
    const fetchUser = async () => {
      const { VITE_BACKEND_URL } = import.meta.env;
      const { id } = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${VITE_BACKEND_URL}/api/users/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!data) {
          return null;
        }
        setDataUser(data.number_vehicles);
      } catch (error) {
        console.error(error);
      }
      return null;
    };
    fetchUser();
  }, []);
  useEffect(() => {
    if (cordoneClick) {
      window.scrollTo({
        top: cordoneClick,
        behavior: "smooth",
      });
    }
  }, [cordoneClick]);
  return (
    <div
      className={
        show ? "card-profile-show card-profile add" : "card-profile add"
      }
    >
      <div className="card-profile-header">
        <div className="card-profile-button-title">
          <button
            type="button"
            className="card-profile-header-button"
            onClick={(e) => {
              setShow(!show);
              setCordoneClick(e.pageY);
            }}
          >
            {show ? (
              <img src={flachHaute} alt="flach" />
            ) : (
              <img src={flachBase} alt="flach" />
            )}
          </button>

          <h1>Véhicule</h1>
        </div>

        <button
          type="button"
          onClick={() => {
            setModifyCar(!modifyCar);
            setCordoneClick(cordoneClick + 1);
          }}
        >
          <img src={modifyCar ? croix : stylo} alt="stylo" />
        </button>
      </div>
      <img className="card-profile-line" src={line} alt="line" />
      {dataCars.length
        ? !modifyCar && (
            <div className="cart-content">
              <div className="cart-content-up">
                <img className="car-profil-user" src={carImag} alt="profile" />
                <ul className="cart-content-text">
                  <li>Marque: {dataCars[0].Marque}</li>
                  <li>Modèle: {dataCars[0].model}</li>
                  <li>Type de prise: {dataCars[0].type}</li>
                </ul>
              </div>
              {show &&
                dataCars.map(
                  (car, index) =>
                    index > 0 && (
                      <>
                        <img
                          className="card-profile-line"
                          src={line}
                          alt="line"
                        />
                        <div key={car.model} className="cart-content-up ">
                          <img
                            className="car-profil-user"
                            src={carImag}
                            alt="profile"
                          />

                          <ul className="cart-content-text">
                            <li>Marque: {car.Marque}</li>
                            <li>Modèle: {car.model}</li>
                            <li>Type de prise: {car.type}</li>
                          </ul>
                        </div>
                      </>
                    )
                )}
              {show && dataCars.length < dataUser && (
                <div className="cart-content-down">
                  <button type="button" onClick={() => setModalCar(true)}>
                    <div className="cart-content-up car-picture">
                      <img src={addCar} alt="add car" />
                    </div>
                  </button>
                </div>
              )}
            </div>
          )
        : ""}
      {modalCar && <AddCar state={setModalCar} dataProps={null} />}
      {modifyCar && <ModifyCar />}
    </div>
  );
}

export default CardCar;
