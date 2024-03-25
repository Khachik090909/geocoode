// UsersManagement.jsx
import { useEffect, useState } from "react";
import BodyModal from "./BodyModal";
import FooyerModal from "./FooyerModal";

function Modal(route) {
  const [dataLoad, setDataLoad] = useState([]);
  const [dataLenght, setDataLenght] = useState();
  const [sort, setSort] = useState();
  const [sortValue, setSortValue] = useState();
  const [limit, setLimit] = useState();
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const { VITE_BACKEND_URL } = import.meta.env;
  const { id } = JSON.parse(localStorage.getItem("user"));

  const handlerSort = (e, key) => {
    setSort({ [key]: e.target.value });
    setSortValue(e.target.value);
  };
  const sortData = (data, sort) => {
    const specificNameEntries = [];
    const otherEntries = [];
    const key = Object.keys(sort);
    const value = Object.values(sort);

    if (!isNaN(data[0][key])) {
      for (let i = 0; i < data.length; i++) {
        if (data[i][key] == value) {
          specificNameEntries.push(data[i]);
        } else {
          otherEntries.push(data[i]);
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i][key].includes(value)) {
          specificNameEntries.push(data[i]);
        } else {
          otherEntries.push(data[i]);
        }
      }
    }

    // Fusionner les entrées spécifiques et les autres entrées
    const sortedData = specificNameEntries.concat(otherEntries);

    return sortedData;
  };
  const fetchDataUsers = async () => {
    try {
      const response = await fetch(
        `${VITE_BACKEND_URL}/api/${route.route}?id=${id}?`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
      }
      const data = await response.json();

      setDataLenght(data.length);

      setData(data);

      setDataLoad(data.slice(0, 20));
    } catch (error) {
      throw Error("error", error);
    }
  };
  useEffect(() => {
    if (sort) {
      const dataSort = sortData(data, sort);
      setDataLoad(dataSort.slice(limit * 20 - 20, limit * 20));
    } else {
      setDataLoad(data.slice(limit * 20 - 20, limit * 20));
    }
  }, [limit, data, sort]);
  useEffect(() => {
    setSort();
    setSortValue();
    fetchDataUsers();
  }, [route]);

  return (
    <>
      {dataLoad.length > 0 && dataLoad.length < 21 && (
        <div className="admin-information">
          <header className="admin-information-header">
            <div style={{ width: "30px", height: "30px" }}></div>
            {Object.keys(dataLoad[0]).map((key) => (
              <input
                type="text"
                id={key}
                className={`admin-information-input-sort admin-information-input-${key}`}
                key={key}
                placeholder={key}
                value={sortValue && Object.keys(sort) == key ? sortValue : ""}
                onChange={(e) => handlerSort(e, key)}
                onClick={() => {
                  setSort();
                  setSortValue();
                }}
              />
            ))}
          </header>

          <BodyModal
            dataLoad={dataLoad}
            setDataLoad={setDataLoad}
            fetchDataUsers={fetchDataUsers}
            route={route}
          />
          <FooyerModal dataLenght={dataLenght} setLimit={setLimit} />
        </div>
      )}
    </>
  );
}

export default Modal;
