import { useEffect, useState } from "react";
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
  const dataUser = JSON.parse(localStorage.getItem("user"));
  const dataCars = useLoaderData();
  const dataProps = null;
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
            onClick={() => setShow(!show)}
          >
            {show ? (
              <img src={flachHaute} alt="flach" />
            ) : (
              <img src={flachBase} alt="flach" />
            )}
          </button>

          <h1>Véhicule</h1>
        </div>

        <button type="button" onClick={() => setModifyCar(!modifyCar)}>
          <img src={modifyCar ? croix : stylo} alt="stylo" />
        </button>
      </div>
      <img className="card-profile-line" src={line} alt="line" />
      {dataCars.length ? (
        !modifyCar && (
          <div className="cart-content">
            <div className="cart-content-up">
              <div className="car-profil-user-fond">
                <img className="car-profil-user" src={carImag} alt="profile" />
              </div>
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
                    <div key={car.model} className="cart-content-down">
                      <div className="car-profil-user-fond">
                        <img
                          className="car-profil-user"
                          src={carImag}
                          alt="profile"
                        />
                      </div>
                      <ul className="cart-content-text">
                        <li>Marque: {car.Marque}</li>
                        <li>Modèle: {car.model}</li>
                        <li>Type de prise: {car.type}</li>
                      </ul>
                    </div>
                  )
              )}
            {show && dataCars.length < dataUser.number_vehicles && (
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
      ) : (
        <div className="cart-content">
          <button type="button" onClick={() => setModalCar(true)}>
            <img src={addCar} alt="add car" />
          </button>
        </div>
      )}
      {modalCar && <AddCar state={setModalCar} dataProps={dataProps} />}
      {modifyCar && <ModifyCar />}
    </div>
  );
}

export default CardCar;
