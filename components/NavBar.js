import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

function InputAutocomplete({ placeholder, onPlaceSelected }) {
  return (
    <GooglePlacesAutocomplete
      styles={{
        container: { width: "100%" },
        textInputContainer: {
          width: "100%",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
        textInput: styles.input,
      }}
      placeholder={placeholder || ""}
      fetchDetails
      onPress={(data, details = null) => {
        onPlaceSelected(details);
      }}
      query={{
        key: "AIzaSyAYd6GORf3u4BNL9OSI4QaYaRGQVLsOYfU",
        language: "pt-BR",
      }}
      textInputProps={{
        placeholderTextColor: "#7E7E7E",
      }}
    />
  );
}

export const NavBar = ({ setOrigin, setDestination, mapRef }) => {
  const moveTo = async (position) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  const onPlaceSelected = (details, flag) => {
    const set = flag === "origin" ? setOrigin : setDestination;
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    };
    set(position);
    moveTo(position);
  };

  return (
    <View style={styles.view}>
      <Image source={require("../assets/top.png")} style={styles.image} />
      <Text style={styles.routeText}>Ваш маршрут</Text>
      <View style={styles.searchContainer}>
        <InputAutocomplete
          label="Origin"
          onPlaceSelected={(details) => {
            onPlaceSelected(details, "origin");
          }}
        />
        <InputAutocomplete
          label="Destination"
          onPlaceSelected={(details) => {
            onPlaceSelected(details, "destination");
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  routeText: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: "center",
    color: "#665CD1",
    marginTop: 8,
    marginBottom: 8,
  },
  image: {
    width: "100%",
  },
  searchContainer: {
    width: 350,
    height: 120,
    left: 20,
    gap: 5,
    backgroundColor: "#0F0F0F",
    borderRadius: 8,
    elevation: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
  },

  input: {
    width: "100%",
    borderColor: "#888",
    backgroundColor: "#0F0F0F",
    color: "#fff",
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
    textAlign: "left",
  },

  view: {
    backgroundColor: "#0F0F0F",
    height: "auto",
  },
  inputs: {
    color: "#EBEBEB",
  },
  inputField: {
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
});
