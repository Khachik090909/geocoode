import { useLoaderData, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AddCar from "./AddCar";

function ModifyCar() {
  const [dataModifyCar, setDataModifyCar] = useState();
  const [dataDeleteCar, setDataDeleteCar] = useState();
  const [cordoneClick, setCordoneClick] = useState("");
  const dataCars = useLoaderData();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  useEffect(() => {
    if (cordoneClick) {
      window.scrollTo({
        top: cordoneClick,
        behavior: "smooth",
      });
    }
  }, [cordoneClick]);
  const handlerClickModify = (index) => {
    setDataModifyCar(dataCars[index]);
  };
  const handlerClickDelete = (index, e) => {
    setCordoneClick(e.pageY);
    setDataDeleteCar(dataCars[index]);
  };
  const handlerDeleteCar = async () => {
    try {
      const { id } = dataDeleteCar;
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cars/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(dataDeleteCar),
        }
      );
      await response.json();

      setDataDeleteCar(null);
    } catch (error) {
      console.error(error);
    }
    setDataDeleteCar(null);
    navigate("/profile");
  };
  return (
    <div className="modify-delete-car">
      {dataCars.length > 0 && !dataDeleteCar && (
        <div className="modify-delete-car-content">
          {dataCars.map((car, index) => (
            <div key={car.model}>
              <button type="button" onClick={() => handlerClickModify(index)}>
                Modifier: {car.Marque}
              </button>
              <button
                type="button"
                onClick={(e) => handlerClickDelete(index, e)}
              >
                Supprimer: {car.Marque}
              </button>
            </div>
          ))}
        </div>
      )}
      {dataDeleteCar && (
        <div className="delete-car-modal">
          <h1>Voulez-vous supprimer ce véhicule ?</h1>
          <div className="delete-car-modal-content">
            <ul className="delete-car-modal-content-text">
              <li>Marque: {dataDeleteCar.Marque}</li>
              <li>Model: {dataDeleteCar.model}</li>
              <li>Type: {dataDeleteCar.type}</li>
            </ul>
            <div className="buttons-content">
              <button type="button" onClick={() => setDataDeleteCar(null)}>
                Annuler
              </button>
              <button type="button" onClick={() => handlerDeleteCar()}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
      {dataModifyCar && (
        <AddCar state={setDataModifyCar} dataProps={dataModifyCar} />
      )}
    </div>
  );
}

export default ModifyCar;
