import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

// Création d'une fonction pour rechercher une ville à l'aide de leafle-control-geocoder
function LeafletGeocoder() {
  // Obtention de l'instance de carte à partir de l'hook useMap
  const map = useMap();

  useEffect(() => {
    // Utilisation de la bibliothèque Leaflet pour créer un contrôle de géocodage
    L.Control.geocoder({
      defaultMarkGeocode: false,
      position: "topleft",
      placeholder: "Rechercher une ville ou une adresse",
    })
      // Gestionnaire d'événement pour le marquage géocodé
      .on("markgeocode", function handleMarkGeocodeEvent(e) {
        // Récupération des coordonnées du lieu géocodé
        const latlng = e.geocode.center;

        // Ajout d'un marqueur à la position sur la carte
        L.marker(latlng).addTo(map).bindPopup(e.geocode.name).openPopup();

        // Ajustement du zoom de la carte pour inclure la zone géocodée
        map.fitBounds(e.geocode.bbox);
      })

      .addTo(map);
  }, []);

  return null;
}

export default LeafletGeocoder;
