import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import './GoogleMapComp.css'; // Import the CSS file

function GoogleMapComp() {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [markerIcon, setMarkerIcon] = useState(null);
  const [showInfoBox, setShowInfoBox] = useState({ MGIP: false, USPTO: false });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBkUqTWrqUzv16mdBfOzNvAXAUs9YdCSso", // Replace with your actual API key
    libraries: ['places']
  });
  const center = {
    lat: 38.80388,
    lng: -77.043918
  };
  
  const uspto = {
    lat: 38.80139,
    lng: -77.0640639171357
  };
  useEffect(() => {
    if (isLoaded) {
      setMarkerIcon({
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: new window.google.maps.Size(42, 42),
      });

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route({
        origin: center,
        destination: uspto,
        travelMode: window.google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
        } else {
          console.error(`error fetching directions ${status}`);
        }
      });
    }
  }, [isLoaded]);

  const toggleInfoBox = (marker) => {
    setShowInfoBox(prevState => ({ ...prevState, [marker]: !prevState[marker] }));
  };

  return (
    
    <div className="map-container">
      <div className="sidebar">
        <div className="sidebar-info">
            <h2>ADDRESS</h2>
            <p>125 S Royal St, Alexandria, VA 22314<br/>Alexandria, VA 22314</p>
            <h2>CALL US</h2>
            <p>1 (703) 621-7140</p>
            <h2>TO USPTO</h2>
            <p>Driving 10 minutes</p>
        </div>
      </div>

      {isLoaded ? (
        <GoogleMap
          mapContainerClassName="map-style"
          center={center}
          zoom={15}
        >
          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              options={{ suppressMarkers: true }}
            />
          )}
          {markerIcon && (
            <Marker
              position={center}
              icon={markerIcon}
              title="MGIP"
              onClick={() => toggleInfoBox('MGIP')}
            >
              {showInfoBox.MGIP && (
                <div className="info-box">
                  <h1>MGIP</h1>
                  <p>Info about MGIP</p>
                  <button onClick={() => toggleInfoBox('MGIP')}>Close</button>
                </div>
              )}
            </Marker>
          )}
          {markerIcon && (
            <Marker
              position={uspto}
              icon={markerIcon}
              title="USPTO"
              onClick={() => toggleInfoBox('USPTO')}
            >
              {showInfoBox.USPTO && (
                <div className="info-box">
                  <h1>USPTO</h1>
                  <p>Info about USPTO</p>
                  <button onClick={() => toggleInfoBox('USPTO')}>Close</button>
                </div>
              )}
            </Marker>
          )}
        </GoogleMap>
      ) : <div>Loading...</div>}
    </div>
  );
}

export default GoogleMapComp;
