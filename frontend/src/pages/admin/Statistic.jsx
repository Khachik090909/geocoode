import React, { useState, useEffect } from "react";

function Statistic() {
  const { VITE_BACKEND_URL } = import.meta.env;
  const [statistic, setStatistic] = useState([]);
  const routes = [
    {
      name: "voitures",
      route: "cars",
    },
    {
      name: "utilisateurs",
      route: "users",
    },
    {
      name: "reservations",
      route: "reservations",
    },
    {
      name: "message non répondu",
      route: "contacts",
    },
    {
      name: "station de Chargement",
      route: "charging-stations",
    },
  ];
  const fetchData = async (route) => {
    try {
      const response = await fetch(
        `${VITE_BACKEND_URL}/api/${route.route}/statistics`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
      }
      const data = await response.json();
      setStatistic((statistic) => [
        ...statistic,
        { name: route.name, data: data },
      ]);
    } catch (error) {
      throw Error("error", error);
    }
  };
  useEffect(() => {
    routes.forEach((route) => {
      fetchData(route);
    });
  }, []);
  return (
    <div className="admin-information-statistic">
      <h1 className="admin-h1-statistic">Statistiques</h1>
      <div>
        {statistic.length > 0 &&
          statistic.map((data) => (
            <div key={data.name}>
              <h1>{data.name + ":" + " " + Object.values(data.data)}</h1>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Statistic;
