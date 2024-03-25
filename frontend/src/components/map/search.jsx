import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

// Creating a function to search for a city using leafle-control-geocoder
function LeafletGeocoder() {
  // Getting the map instance using the useMap hook
  const map = useMap();

  useEffect(() => {
    // Using the Leaflet library to create a geocoding control
    L.Control.geocoder({
      defaultMarkGeocode: false,
      position: "topleft",
      placeholder: "Search for a city or address",
    })
      // Event handler for the geocoded mark
      .on("markgeocode", function handleMarkGeocodeEvent(e) {
        // Retrieving the coordinates of the geocoded location
        const latlng = e.geocode.center;

        // Adding a marker at the position on the map
        L.marker(latlng).addTo(map).bindPopup(e.geocode.name).openPopup();

        // Adjusting the map's zoom to include the geocoded area
        map.fitBounds(e.geocode.bbox);
      })

      .addTo(map);
  }, []);

  return null;
}

export default LeafletGeocoder;
