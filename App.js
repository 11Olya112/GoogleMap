import React, { useState, useRef, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { NavBar } from "./components/NavBar";
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Text,
  Button,
} from "react-native";
import MapViewDirections from "react-native-maps-directions";

export default App = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const center = { latitude: 48.8584, longitude: 2.2945 };
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [isMoving, setIsMoving] = useState(false);

  const mapRef = useRef(null);

  const updateLocation = async () => {
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setUserLocation({ latitude, longitude });

    if (isMoving) {
      moveTo({ latitude, longitude }); // Викликаємо вашу функцію moveTo для руху картою
    }
  };

  useEffect(() => {
    if (isMoving) {
      const intervalId = setInterval(updateLocation, 1000); // Оновлювати координати кожну секунду
      return () => clearInterval(intervalId);
    }
  }, [isMoving]);

  const edgePaddingValue = 50;

  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };

  const traceRoute = () => {
    if (origin && destination) {
      setShowDirections(true);
      setShowModal(true);
      mapRef.current?.fitToCoordinates([origin, destination], { edgePadding });
    }
  };

  const traceRouteOnReady = (args) => {
    if (args) {
      // args.distance
      // args.duration
      setDistance(args.distance);
      setDuration(args.duration);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <NavBar
        setOrigin={setOrigin}
        setDestination={setDestination}
        mapRef={mapRef}
      />

      <MapView
        ref={mapRef}
        style={{ flex: 1, zIndex: 1 }}
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        {userLocation && <Marker coordinate={userLocation} />}
        <Marker coordinate={center} />
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {showDirections && origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey="AIzaSyAYd6GORf3u4BNL9OSI4QaYaRGQVLsOYfU"
            strokeColor="#6644ff"
            strokeWidth={4}
            onReady={traceRouteOnReady}
          />
        )}
      </MapView>
      <Button
        title={isMoving ? "Stop Moving" : "Start Moving"}
        onPress={() => setIsMoving(!isMoving)}
        style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}
      />
      <TouchableOpacity
        onPress={traceRoute}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
      >
        <Image
          source={require("./assets/navbar.png")}
          style={{ width: "100%", height: 100 }}
        />
      </TouchableOpacity>
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer} visible={showDirections}>
          <View style={styles.modalContent}>
            {distance && duration ? (
              <View>
                <Text style={styles.infoText}>
                  {Math.floor(duration / 60)} hr {Math.ceil(duration % 60)} min
                </Text>
                <Text style={styles.infoText}>{distance.toFixed(2)}</Text>
              </View>
            ) : null}
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#0F0F0F",
    borderRadius: 10,
    padding: 4,
    width: 87,
    height: 55,
  },
  infoText: {
    color: "#EBEBEB",
    fontSize: 12,
    marginBottom: 5,
  },
  closeButton: {
    position: "absolute",
    bottom: -40,
    alignSelf: "center",
    backgroundColor: "#665CD1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 30,
    shadowColor: "#665CD1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },  
});
