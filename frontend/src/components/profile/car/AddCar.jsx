import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import croix from "../../../assets/croix.svg";

function AddCar({ state, dataProps }) {
  const { VITE_BACKEND_URL } = import.meta.env;
  const navigate = useNavigate();
  const { id } = JSON.parse(localStorage.getItem("user"));
  const [dataBrands, setDataBrands] = useState([]);
  const [dataPlugs, setDataPlugs] = useState([]);
  const [valueModal, setValueModal] = useState(
    dataProps ? dataProps.Marque : []
  );
  const [propose, setPropose] = useState([]);
  const [marque, setMarque] = useState([]);
  const [modele, setModele] = useState([]);
  const [plugId, setPlugId] = useState([]);
  const [brandId, setBrandId] = useState([]);
  const [data, setData] = useState();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      const [brandsResponse, plugsResponse] = await Promise.all([
        fetch(`${VITE_BACKEND_URL}/api/brands`),
        fetch(`${VITE_BACKEND_URL}/api/plugs`),
      ]);

      const brandsData = await brandsResponse.json();
      setDataBrands(brandsData);
      const plugsData = await plugsResponse.json();
      setDataPlugs(plugsData);
      return null;
    };
    fetchBrands();
  }, []);

  const handlePostCar = async () => {
    if (data) {
      if (dataProps) {
        const response = await fetch(
          `${VITE_BACKEND_URL}/api/cars/${dataProps.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json", // Spécifier le type de contenu JSON
            },
            body: JSON.stringify(data), // Convertir l'objet data en chaîne JSON
          }
        );
        if (!response.ok) {
          await response.json();
        }

        state(false);
        navigate("/profile");
      } else {
        const response = await fetch(`${VITE_BACKEND_URL}/api/cars`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Spécifier le type de contenu JSON
          },
          body: JSON.stringify(data), // Convertir l'objet data en chaîne JSON
        });
        if (!response.ok) {
          await response.json();
        }

        state(false);
        navigate("/profile");
      }
    }
  };
  useEffect(() => {
    if (plugId.length === 1 && brandId.length === 1) {
      setData({ user_id: id, plug_id: plugId[0].id, brand_id: brandId[0].id });
    }
  }, [plugId, brandId]);

  useEffect(() => {
    const dataMarque = [];
    dataBrands.map((item) => {
      if (!dataMarque.includes(item.Marque)) {
        dataMarque.push(item.Marque);
        setMarque(dataMarque);
      }
      return null;
    });
    if (dataProps) {
      setModele(dataBrands.filter((item) => item.Marque === dataProps.Marque));
      setBrandId(modele.filter((item) => item.model === dataProps.model));
    }
  }, [dataBrands]);
  useEffect(() => {
    if (valueModal.length > 1) {
      setPropose(marque.filter((item) => item.includes(valueModal)));
    } else {
      setPropose([]);
    }
  }, [valueModal]);

  useEffect(() => {
    if (propose[0] === valueModal && valueModal) {
      setModele(dataBrands.filter((item) => item.Marque === valueModal));
      setPropose([]);
    } else if (propose !== valueModal && propose.length !== 0) {
      setModele([]);
    }
  }, [propose, valueModal]);
  return (
    <div className="background-modal">
      <div className="background-modal-content">
        <button
          type="button"
          className="background-modal-content-close"
          onClick={() => state(false)}
        >
          <img src={croix} alt="close" />
        </button>
        <section className="add-car-section-form">
          <h2> Ma voiture</h2>
          <div>
            <label htmlFor="marque">Marque :</label>
            <input
              type="text"
              id="marque"
              name="marque"
              autoComplete="off"
              value={valueModal}
              onChange={(e) => {
                setValueModal(e.target.value.toUpperCase());
              }}
            />
            {propose &&
              propose.map(
                (item, index) =>
                  index < 3 && (
                    <button
                      type="button"
                      className="proposition"
                      key={item}
                      onClick={() => {
                        setValueModal(item);
                        setPropose([]);
                      }}
                    >
                      {item}
                    </button>
                  )
              )}
          </div>
          <div>
            <label htmlFor="model">Modèle :</label>
            <select
              name="model"
              id="model"
              onChange={(e) =>
                setBrandId(
                  modele.filter((item) => item.model === e.target.value)
                )
              }
            >
              <option value="">--Modèle--</option>
              {modele.map((item) => (
                <option key={item.id} value={item.model}>
                  {item.model}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="type">Type de prise :</label>

            <select
              name="type"
              id="type"
              onChange={(e) =>
                setPlugId(
                  dataPlugs.filter((item) => item.type === e.target.value)
                )
              }
            >
              <option value="">--prise--</option>
              {dataPlugs.map((item) => (
                <option key={item.id} value={item.type}>
                  {item.type}
                </option>
              ))}
            </select>
          </div>
        </section>
        <button
          type="button"
          className="background-modal-content-button-valid"
          onClick={handlePostCar}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}

export default AddCar;
