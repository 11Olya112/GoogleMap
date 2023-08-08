import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { NavBar } from './components/NavBar';
import { View, Image, TouchableOpacity } from 'react-native';

export default App = () => {
  const [map, setMap] = useState(null);
  const [directionsRoute, setDirectionsRoute] = useState(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const center = { latitude: 48.8584, longitude: 2.2945 };
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const calculateRoute = async () => {
    if (!origin || !destination) {
      console.log("Missing origin or destination");
      return { error: "Missing origin or destination" };
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&key=AIzaSyAYd6GORf3u4BNL9OSI4QaYaRGQVLsOYfU`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.routes.length > 0) {
          const route = data.routes[0];
          setDistance(route.legs[0]?.distance?.text || "");
          setDuration(route.legs[0]?.duration?.text || "");
          setDirectionsRoute(route.overview_polyline.points);
          console.log("Route calculated:", route);
          return { success: true, route };
        }
      } else {
        console.error("Directions request failed");
        return { error: "Directions request failed" };
      }
    } catch (error) {
      console.error("Error calculating route:", error);
      return { error: "Error calculating route" };
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <NavBar setOrigin={setOrigin} setDestination={setDestination} distance={distance} duration={duration} />
      
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        onMapReady={() => setMap(true)}
      >
        <Marker coordinate={center} />
        {directionsRoute && (
          <MapView.Polyline
            coordinates={directionsRoute}
            strokeWidth={4}
            strokeColor="blue"
          />
        )}
      </MapView>
      <TouchableOpacity
        onPress={calculateRoute}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
      >
        <Image
          source={require('./assets/navbar.png')}
          style={{ width: '100%', height: 100 }}
        />
      </TouchableOpacity>
    </View>
  );
};
