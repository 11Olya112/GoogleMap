import React, { useState } from 'react';
import { View, StyleSheet, Text, Button, TextInput } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

export const GoogleMap = () => {
  const [map, setMap] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const center = { latitude: 48.8584, longitude: 2.2945 };

  const calculateRoute = async () => {
    if (!origin || !destination) {
      return { error: 'Missing origin or destination' };
    }
  
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&key=YOUR_GOOGLE_MAPS_API_KEY`
      );
  
      if (response.ok) {
        const data = await response.json();
        if (data.routes.length > 0) {
          const route = data.routes[0];
          setDistance(route.legs[0]?.distance?.text || '');
          setDuration(route.legs[0]?.duration?.text || '');
          setDirectionsRoute(
            route.legs[0]?.steps.map((step) => ({
              latitude: step.end_location.lat,
              longitude: step.end_location.lng,
            }))
          );
          return { success: true, route };
        }
      } else {
        console.error('Directions request failed');
        return { error: 'Directions request failed' };
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      return { error: 'Error calculating route' };
    }
  };
  

  const geocodeAddress = async (address) => {
    try {
      const result = await Location.geocodeAsync(address);
      if (result.length > 0) {
        return {
          latitude: result[0].latitude,
          longitude: result[0].longitude,
        };
      }
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {/* Відображення маркера початку */}
        {routeCoordinates.length > 0 && (
          <Marker coordinate={routeCoordinates[0]} title="Start" />
        )}

        {/* Відображення маркера кінця */}
        {routeCoordinates.length > 0 && (
          <Marker
            coordinate={routeCoordinates[routeCoordinates.length - 1]}
            title="End"
          />
        )}

        {/* Відображення лінії маршруту */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={3}
            strokeColor="blue"
          />
        )}
      </MapView>

      <TextInput
        style={styles.input}
        placeholder="Origin"
        value={origin}
        onChangeText={(text) => setOrigin(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Destination"
        value={destination}
        onChangeText={(text) => setDestination(text)}
      />

      <Button title="Calculate Route" onPress={calculateRoute} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 5,
  },
});
