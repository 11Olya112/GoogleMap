import React, { useRef } from "react";
import { TextInput, View, Text, Image, StyleSheet } from "react-native";

export const NavBar = ({
  setOrigin,
  setDestination,
  distance,
  duration,
}) => {
  const destiantionRef = useRef(null);
  const originRef = useRef(null);

  return (
    <View style={styles.view}>
      <Image source={require("../assets/top.png")} style={{ width: "100%" }} />
      <Text style={styles.routeText}>Ваш маршрут</Text>
      <Text style={styles.input}>{`Distance:${distance}`}</Text>
      <Text style={styles.input}>{`Duration:${duration}`}</Text>
      <TextInput
        placeholder="Start"
        ref={originRef}
        onChangeText={(text) => setOrigin(text)}
        style={styles.inputField}
        placeholderTextColor="white"
      />
      <TextInput
        placeholder="End"
        ref={destiantionRef}
        onChangeText={(text) => setDestination(text)}
        style={styles.inputField}
        placeholderTextColor="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  routeText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: "center",
    color: "#665CD1",
    marginTop: 8,
    marginBottom: 8,
  },
  view: {
    backgroundColor: '#0F0F0F',
  },
  input: {
    color: '#EBEBEB',
  },
  inputField: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
});
