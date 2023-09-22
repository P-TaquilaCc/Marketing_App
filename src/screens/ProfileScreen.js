import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../api/server";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [text, setText] = useState("");

  const onCerrarSesion = () => {
    getLogout();
    navigation.navigate("SignIn");
  };

  const onEditProfile = () => {
    navigation.navigate("editProfile");
  };

  /* Método para cerrar sesión del usuario */
  const getLogout = async () => {
    /* Obtiene el token del usuario */
    const dataToken = await AsyncStorage.getItem("userToken");
    /* Hace uso del endPoint Logout para cerrar sesión del usuario */
    axios
      .get("/api/logout", {
        headers: {
          Authorization: "Bearer " + dataToken,
        },
      })
      .then((response) => {
        console.log(response.data);
      });
  };

  React.useEffect(() => {
    /* Obtiene el usuario objeto con sus atributos */
    AsyncStorage.getItem("user_object").then((value) => {
      const data = JSON.parse(value);
      setText(data.name);
    });
  }, []);

  /* Muestra la vista del Perfil */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={style.containerMain}>
        <Text style={style.title}>Mi Perfil</Text>
        <Text style={style.user}>Hola, {text}</Text>
      </View>
      <View style={style.containerSettings}>
        <TouchableOpacity style={style.optionEdit} onPress={onEditProfile}>
          <Text style={style.textOptions}>Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.optionSesion} onPress={onCerrarSesion}>
          <Text style={style.textOptions}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  containerMain: {
    alignItems: "center",
    marginTop: 50,
  },
  title: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
  user: {
    marginTop: 40,
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  containerSettings: {
    marginTop: 50,
    marginLeft: 80,
    marginRight: 80,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
  },
  optionEdit: {
    margin: 20,
  },
  optionSesion: {
    marginLeft: 20,
    marginBottom: 20,
  },
  textOptions: {
    fontWeight: "bold",
  },
});

export default ProfileScreen;
