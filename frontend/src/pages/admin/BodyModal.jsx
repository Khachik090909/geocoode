import React, { useEffect, useState } from "react";
import Alert from "../../components/alert/alert";

function BodyModal({ dataLoad, setDataLoad, fetchDataUsers, route }) {
  const [modifValue, setModifValue] = useState();
  const [modifValueMap, setModifValueMap] = useState();
  const [inputModif, setInputModif] = useState([]);
  const [detectInput, setDetectInput] = useState();
  const [idElementChange, setIdElementChange] = useState();
  const [valeyElementClick, setValeyElementClick] = useState();
  const [idElementModif, setIdElementModif] = useState([]);
  const [idElementDeleite, setIdElementDelete] = useState([]);
  const [isErrors, setIsErrors] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [motor, setMotor] = useState(false);
  const [valider, setValider] = useState(false);
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const apdeteState = () => {
    setModifValue();
    setModifValueMap();
    setDetectInput();
    setValeyElementClick();
    setIdElementChange();
    setIdElementModif([]);
    setIdElementDelete([]);
    setInputModif([]);
    setValider(false);
    setMotor(!motor);
  };
  useEffect(() => {
    apdeteState();
  }, [route]);
  const handlerChangeValue = (e, id) => {
    setModifValue(e.target.value);
    setIdElementChange(id);
    setValeyElementClick(e.target.id);
    setModifValueMap(e.target.value);
    const isAlreadyModified = inputModif.some(
      (item) =>
        item.indexX === detectInput.indexX && item.indexY === detectInput.indexY
    );
    if (!isAlreadyModified) {
      setInputModif([
        ...inputModif,
        { indexX: detectInput.indexX, indexY: detectInput.indexY },
      ]);
    }
  };
  useEffect(() => {
    if (idElementChange && !idElementModif.includes(idElementChange)) {
      setIdElementModif([...idElementModif, idElementChange]);
    }
  }, [idElementChange]);
  useEffect(() => {
    const newDataLoad = dataLoad.map((item) => {
      if (item.id === idElementChange) {
        return { ...item, [valeyElementClick]: modifValueMap };
      }
      return item;
    });
    setDataLoad(newDataLoad);
  }, [motor]);
  const handlerClickValue = (e, indexY, indexX) => {
    setDetectInput({ indexY, indexX });
    setModifValue(e.target.value);
    setMotor(!motor);
  };
  const handlerClickDelete = (id) => {
    if (idElementDeleite.includes(id)) {
      setIdElementDelete(idElementDeleite.filter((item) => item !== id));
    } else {
      setIdElementDelete([...idElementDeleite, id]);
    }
  };
  const postDeleteData = async () => {
    const dataModif = dataLoad.filter((item) =>
      idElementModif.includes(item.id)
    );
    await Promise.all(
      dataModif.map(async (item) => {
        await putData(item);
      })
    );
    await Promise.all(
      idElementDeleite.map(async (item) => {
        await deletedata(item);
      })
    );
    apdeteState();
    await fetchDataUsers();
  };
  const deletedata = async (id) => {
    const response = await fetch(
      `${VITE_BACKEND_URL}/api/${route.route}/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 500) {
      setIsErrors([
        {
          field: "server",
          message:
            "Cet enregistrement ne peut pas être supprimé car il est référencé dans une autre table.",
        },
      ]);
    }
    if (!response.ok) {
      const dataresponse = await response.json();
      if (dataresponse.validationErrors.length > 0) {
        setIsErrors(dataresponse.validationErrors);
      }
      throw new Error("Erreur lors de l'inscription");
    } else {
      setIsErrors(null);
      setIsSubmit(true);
    }
  };
  const putData = async (data) => {
    const response = await fetch(
      `${VITE_BACKEND_URL}/api/${route.route}/${data.id}/admin`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const dataresponse = await response.json();
      if (dataresponse.validationErrors.length > 0) {
        setIsErrors(dataresponse.validationErrors);
      }
      throw new Error("Erreur lors de l'inscription");
    } else {
      setIsErrors(null);
      setIsSubmit(true);
    }
  };
  return (
    <div>
      <section className="admin-information-section">
        {dataLoad.map((item, indexX) => (
          <div
            className={`admin-information-line ${
              indexX % 2 === 0 ? "line-1" : "line-2"
            }`}
            key={item.id}
            style={
              idElementDeleite.includes(item.id)
                ? { backgroundColor: "red" }
                : {}
            }
          >
            <button
              style={{ width: "30px", height: "30px" }}
              onClick={() => handlerClickDelete(item.id)}
            >
              <i style={{ color: "black" }} className="fi fi-rr-trash" />
            </button>
            {Object.entries(item).map((value, indexY) => {
              return (
                <input
                  key={[value[1], item.id, value[0]]}
                  placeholder={value[1]}
                  id={value[0]}
                  value={
                    detectInput &&
                    indexX == detectInput.indexX &&
                    indexY == detectInput.indexY
                      ? modifValue
                      : value[1] !== null
                        ? value[1]
                        : "null"
                  }
                  style={
                    inputModif.some(
                      (item) => item.indexX === indexX && item.indexY === indexY
                    )
                      ? { backgroundColor: "green" }
                      : {}
                  }
                  className={`admin-information-input-${value[0]}`}
                  onChange={(e) => handlerChangeValue(e, item.id)}
                  onClick={(e) => handlerClickValue(e, indexY, indexX)}
                />
              );
            })}
          </div>
        ))}
      </section>
      {!valider && (
        <button
          className="admin-information-button-valider"
          type="batton"
          onClick={() => {
            setMotor(!motor);
            setValider(true);
          }}
        >
          modifier
        </button>
      )}
      {valider && (
        <button
          className="admin-information-button-valider"
          type="batton"
          onClick={() => postDeleteData()}
        >
          valider
        </button>
      )}
      {(isErrors || isSubmit) && <Alert errors={isErrors} submit={isSubmit} />}
    </div>
  );
}

export default BodyModal;
