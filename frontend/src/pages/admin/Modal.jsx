// UsersManagement.jsx
import { useEffect, useState } from "react";
import BodyModal from "./BodyModal";
import FooyerModal from "./FooyerModal";

function Modal(route) {
  const [dataLoad, setDataLoad] = useState([]);
  const [dataLenght, setDataLenght] = useState();
  const [sort, setSort] = useState();
  const [limit, setLimit] = useState();
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const { VITE_BACKEND_URL } = import.meta.env;
  const { id } = JSON.parse(localStorage.getItem("user"));
  // sort the chosen tights. Separate sorted items and put at the beginning
  const sortData = (data, sort) => {
    const specificNameEntries = [];
    const otherEntries = [];
    const key = Object.keys(sort);
    const value = Object.values(sort);
    // if chosen value is a number
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
  // get the data ,depending on the categories clicked
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
  // cut out and display 20 elements based on the page figures which is presented by limit
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
                value={sort ? sort[key] : ""}
                onChange={(e) => setSort({ [key]: e.target.value })}
                onClick={() => setSort()}
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
