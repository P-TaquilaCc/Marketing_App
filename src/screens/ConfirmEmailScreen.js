import { View, Text, StyleSheet, ScrollView } from "react-native";

import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

import { useNavigation } from "@react-navigation/native";

const ConfirmEmailScreen = () => {
  const [correo, setCorreo] = useState("");

  const navigation = useNavigation();

  const onConfirmPressed = () => {
    console.warn("Confirmar Email");
  };

  /* Cambia a la vista Iniciar sesiòn */
  const onSignInPress = () => {
    navigation.navigate("SignIn");
  };

  /* Muestra la vista Confirmar correo */
  return (
    <ScrollView>
      <View style={style.root}>
        <Text style={style.title}>Confirma tu Correo</Text>

        <CustomInput placeholder="Correo" value={correo} setValue={setCorreo} />

        <CustomButton text="Confirmar" onPress={onConfirmPressed} />

        <CustomButton text="Regresar" onPress={onSignInPress} type="TERTIARY" />
      </View>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
  },
  logo: {
    marginTop: 50,
    marginBottom: 50,
    width: "70%",
    maxWidth: 300,
    maxHeight: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    marginTop: 40,
    marginBottom: 10,
  },
  text: {
    color: "gray",
    fontWeight: "bold",
    marginVertical: 10,
  },
  link: {
    color: "#3B71F3",
    fontWeight: "bold",
  },
});

export default ConfirmEmailScreen;
