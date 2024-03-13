import { useCallback, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, ZoomControl } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import { Icon, DivIcon, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import VectorImage from "../../assets/el_map-marker.svg";
import LocationMarker from "./location";
import LeafletGeocoder from "./search";
import Reservation from "./Reservation";

function Map() {
  const { VITE_BACKEND_URL } = import.meta.env;
  const position = [43.596152, 1.455223];
  const userLocation = JSON.parse(localStorage.getItem("userLocation"));
  const [chargingStations, setChargingStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [id, setId] = useState(0);
  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        const jsonUserLocation = JSON.stringify(userLocation);
        localStorage.setItem("userLocation", jsonUserLocation);
      });
    }
  };

  useEffect(() => {
    getCurrentPosition();
    const intervalId = setInterval(getCurrentPosition, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // Fonction pour récupérer les stations de recharge depuis le backend
  const fetchChargingStations = useCallback(async () => {
    try {
      const response = await fetch(
        `${VITE_BACKEND_URL}/api/charging-stations-positions`
      );
      const data = await response.json();

      // Traitement des données garder 6 chiffres après la virgule
      const processedData = data.map((station) => {
        const latitude = parseFloat(station.consolidated_latitude).toFixed(6);
        const longitude = parseFloat(station.consolidated_longitude).toFixed(6);

        return {
          ...station,
          consolidated_latitude: latitude,
          consolidated_longitude: longitude,
        };
      });

      // Supprimer les doublons
      const uniqueData = processedData.filter(
        (station, index, self) =>
          index ===
          self.findIndex(
            (s) =>
              s.consolidated_latitude === station.consolidated_latitude &&
              s.consolidated_longitude === station.consolidated_longitude
          )
      );

      setChargingStations(uniqueData);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchChargingStations();
  }, [fetchChargingStations]);

  // Fonction pour créer une icône personnalisée pour les clusters
  const createClusterCustomIcon = useCallback((cluster) => {
    return new DivIcon({
      html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
      className: "custom-marker-cluster",
      iconSize: point(33, 33, true),
    });
  }, []);

  // Icône personnalisée pour les marqueurs individuels
  const customIcon = new Icon({
    iconUrl: VectorImage,
    iconSize: [38, 38],
  });
  const customIconClicked = new Icon({
    iconUrl: VectorImage,
    iconSize: [68, 68],
  });

  return (
    <MapContainer
      center={userLocation ? userLocation : position}
      zoom={13}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token={accessToken}"
        accessToken="Ub2AxCLkCgIdI6pF2eBFVaPDSbbrCWDR9aQaCd8oiLatz7jRZajpn2Wi949QupSD"
      />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
        maxClusterRadius={60}
      >
        {chargingStations.map((station) => (
          <Marker
            key={station.id}
            position={[
              station.consolidated_latitude,
              station.consolidated_longitude,
            ]}
            icon={station === selectedStation ? customIconClicked : customIcon}
            eventHandlers={{
              click: () => {
                setId(station.id);
                setSelectedStation(station);
              },
            }}
          ></Marker>
        ))}
      </MarkerClusterGroup>
      {userLocation && <LocationMarker />}
      <ZoomControl position="topleft" />
      <LeafletGeocoder />
      {id !== 0 && <Reservation id={id} setId={setId} />}
    </MapContainer>
  );
}

export default Map;
