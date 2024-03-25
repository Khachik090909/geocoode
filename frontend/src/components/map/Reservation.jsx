import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";
import Alert from "../alert/alert";
import "./Reservation.scss";
import PropTypes from "prop-types";
import croix from "../../assets/croix.svg";
import priseTyp2DA from "../../assets/prise/typ2DA.svg";
import priseEfDA from "../../assets/prise/efDA.svg";
import priseChademoDA from "../../assets/prise/chademoDA.svg";
import priseComboCcsDA from "../../assets/prise/combo-ccsDA.svg";
import priseAutreDA from "../../assets/prise/autreDA.svg";
import priseTyp2MA from "../../assets/prise/typ2MA.svg";
import priseEfMA from "../../assets/prise/efMA.svg";
import priseChademoMA from "../../assets/prise/chademoMA.svg";
import priseComboCcsMA from "../../assets/prise/combo-ccsMA.svg";
import priseAutreMA from "../../assets/prise/autreMA.svg";
import telephone from "../../assets/Telephone.svg";
import position from "../../assets/position.svg";
import horloge from "../../assets/horloge-2.svg";

function Reservation({ id, setId }) {
  const { VITE_BACKEND_URL } = import.meta.env;
  const [selectedHour, setSelectedHour] = useState();
  const [selecteDate, setSelectedDate] = useState();
  const token = localStorage.getItem("token");
  const payload = JSON.parse(localStorage.getItem("user"));
  const userLocation = JSON.parse(localStorage.getItem("userLocation"));
  const [isErrors, setIsErrors] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [station, setStation] = useState();
  const [reservation, setReservation] = useState([]);
  const [age, setAge] = useState(null);
  const [dataPrice, setDataPrice] = useState([
    { prise_type_2: priseTyp2DA },
    { prise_type_ef: priseEfDA },
    { prise_type_chademo: priseChademoDA },
    { prise_type_combo_ccs: priseComboCcsDA },
    { prise_type_autre: priseAutreDA },
  ]);
  const price = 4.99;
  const map = useMap();
  const markerRef = useRef(null);
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setDataPrice([
        { prise_type_2: priseTyp2MA },
        { prise_type_ef: priseEfMA },
        { prise_type_chademo: priseChademoMA },
        { prise_type_combo_ccs: priseComboCcsMA },
        { prise_type_autre: priseAutreMA },
      ]);
    }
    if (payload) {
      calculateAge();
    }
    if (localStorage.getItem("user")) {
      fetchReservationUser();
    }
  }, []);

  useEffect(() => {
    const fetchStation = async () => {
      const response = await fetch(
        `${VITE_BACKEND_URL}/api/charging-stations/${id}`
      );
      const data = await response.json();

      setStation(data);
    };
    fetchStation();
  }, [id]);
  const fetchReservationUser = async () => {
    const { id } = JSON.parse(localStorage.getItem("user"));
    const response = await fetch(
      `${VITE_BACKEND_URL}/api/users/${id}/reservations`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await response.json();
    setReservation(data);
  };

  // Function to calculate age based on birthdate
  const calculateAge = () => {
    const birthdateDate = new Date(payload.date_of_birth);
    const currentDate = new Date();
    let calculatedAge = currentDate.getFullYear() - birthdateDate.getFullYear();

    // Adjust age if birthday hasn't occurred yet this year
    if (
      currentDate.getMonth() < birthdateDate.getMonth() ||
      (currentDate.getMonth() === birthdateDate.getMonth() &&
        currentDate.getDate() < birthdateDate.getDate())
    ) {
      calculatedAge -= 1;
    }

    setAge(calculatedAge.toString()); // Convert age to string before setting state
  };
  const reservationVerification = () => {
    setIsErrors([]);
    if (reservation.length > 0) {
      setIsErrors((isErrors) => [
        ...isErrors,
        {
          message:
            "Vous avez déja une réservation Veuillez annuler dans le profil",
          field: "date",
        },
      ]);
    }
    if (!token) {
      setIsErrors((isErrors) => [
        ...isErrors,
        { message: "Veuillez vous connecter pour réserver", field: "token" },
      ]);
    }
    if (age < 18) {
      setIsErrors((isErrors) => [
        ...isErrors,
        {
          message: "Vous devez avoir au moins 18 ans pour réserver",
          field: "age",
        },
      ]);
    }
    if (!selecteDate) {
      setIsErrors((isErrors) => [
        ...isErrors,
        { message: "Veuillez choisir une date", field: "date" },
      ]);
    }
    if (!selectedHour) {
      setIsErrors((isErrors) => [
        ...isErrors,
        { message: "Veuillez choisir une heure", field: "heure" },
      ]);
    }
  };

  const handleValidation = async () => {
    reservationVerification();
    if (isErrors.length === 0 && reservation.length === 0) {
      const dataPost = {
        charging_station_id: id,
        user_id: payload.id,
        reservation_date: selecteDate,
        reservation_heure: selectedHour,
        amount_paid: price,
      };
      try {
        const response = await fetch(`${VITE_BACKEND_URL}/api/reservations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataPost),
        });

        if (response.ok) {
          setIsSubmit(true);
          setTimeout(() => {
            setId(0);
          }, 2000);
        } else {
          console.error("Échec de la réservation !");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  //*******************************Itinerary****************************** */
  const removeRoutingControl = () => {
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }
  };
  useEffect(() => {
    // Récupère les coordonnées de la station de recharge
    if (station && userLocation) {
      const chargingStationsArray = [station];
      const waypoints = chargingStationsArray.map((station) => {
        return L.latLng(
          station.consolidated_latitude,
          station.consolidated_longitude
        );
      });
      // Crée un contrôle de routage avec des options
      const routingControl = L.Routing.control({
        waypoints: [
          {
            latLng: L.latLng(userLocation[0], userLocation[1]),
            name: "Ma localisation",
          },
          ...waypoints,
        ],
        lineOptions: { color: "blue", weight: 4, opacity: 0.7 },
        routeWhileDragging: true,
        geocoder: L.Control.Geocoder.nominatim(),
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false,
        showAlternatives: false,
        language: "fr",
        position: "bottomleft",
      })
        // Événement déclenché lorsque des routes sont trouvées
        .on("routesfound", (e) => {
          const currentMarker = markerRef.current;

          if (currentMarker) {
            // Anime le déplacement du marqueur le long des coordonnées de l'itinéraire
            e.routes[0].coordinates.forEach((c, i) => {
              setTimeout(
                () => currentMarker.setLatLng([c.lat, c.lng]),
                1000 * i
              );
            });
          }
        })
        // Ajoute le contrôle de routage à la carte
        .addTo(map);

      // Stocke la référence au contrôle de routage
      routingControlRef.current = routingControl;
      // Nettoie la carte lorsque le composant est démonté
      return () => {
        removeRoutingControl();
      };
    }
  }, [map, userLocation, station]);
  return (
    <div className="reservation">
      {station && (
        <div className="reservation-modal">
          <div className="reservation-informations">
            <div className="button-close-modal-main">
              <button
                className="boutton-close-modal-reservation"
                type="button"
                onClick={() => setId(0)}
              >
                <img src={croix} alt="close" />
              </button>
            </div>
            <div className="informations-title">
              <h2>{decodeURIComponent(escape(station.nom_enseigne))}</h2>
            </div>
            <div className="informations-data">
              <div className="informations-adresse">
                <img src={position} alt="adresse" />
                <p>{station.adresse_station}</p>
              </div>
              <div className="informations-telephone">
                <img src={telephone} alt="telephone" />
                <p>{station.telephone_operateur}</p>
              </div>
              <div className="informations-horloge">
                <img src={horloge} alt="horloge" />
                <p>{station.horaires}</p>
              </div>
              <h3>Type de prises</h3>
            </div>
            <div className="informations-plug-desktop">
              {dataPrice.map((price) => {
                const objectKey = Object.keys(price);
                return (
                  <img
                    key={objectKey[0]}
                    src={Object.values(price)[0]}
                    alt={price}
                    style={
                      station[objectKey[0]] === "TRUE" ||
                      station[objectKey[0]] === 1
                        ? {}
                        : { filter: "grayscale(100%)" }
                    }
                  />
                );
              })}
            </div>
            <h5 className="informations-price-reservation">
              Tarif de réservation : {price}€
            </h5>
          </div>
          <div className="reservation-validation">
            <h2>Réservation</h2>{" "}
            <div className="time-slot-container">
              <input
                type="date"
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="time-slot-container">
              <input
                type="time"
                onChange={(e) => setSelectedHour(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="button-validation-calendar"
              onClick={handleValidation}
            >
              Réservez et Payez
            </button>
          </div>
        </div>
      )}
      {isErrors.length && <Alert errors={isErrors} submit={null} />}
      {isSubmit && <Alert errors={null} submit={isSubmit} />}
    </div>
  );
}

export default Reservation;

Reservation.propTypes = {
  id: PropTypes.number.isRequired,
  setId: PropTypes.func.isRequired,
};
