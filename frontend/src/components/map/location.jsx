import React, { useEffect, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import "./location.scss";
import imagePosition from "../../assets/tabler_location.svg";

function LocationMarker() {
  const [location, setLocation] = useState(null);
  const [motor, setMotor] = useState(false);

  // Find the location
  const map = useMapEvents({
    locationfound(e) {
      setLocation(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  // Click handler for location button
  useEffect(() => {
    map.locate();
  }, [motor]);

  return (
    <div>
      {location && (
        <>
          <button
            type="button"
            className="buttonLocation"
            onClick={() => setMotor(!motor)}
          >
            <img src={imagePosition} alt="Location" />
          </button>
          <Marker position={location}>
            <Popup>Vous êtes ici</Popup>
          </Marker>
        </>
      )}
    </div>
  );
}

export default LocationMarker;
