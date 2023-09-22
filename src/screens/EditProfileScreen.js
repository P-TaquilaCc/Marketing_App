import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import axios from "../api/server";

const EditProfileScreen = () => {
  const [idUser, setidUser] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [dniError, setdniError] = useState("");
  const [telefonoError, settelefonoError] = useState("");
  const [nameError, setnameError] = useState("");
  const [emailError, setemailError] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [confirmationpasswordError, setconfirmationpasswordError] =
    useState("");

  React.useEffect(() => {
    /* Obtiene el objeto usuario */
    AsyncStorage.getItem("user_object").then((value) => {
      const data = JSON.parse(value);
      setidUser(data.id);
      setDni(data.dni);
      setTelefono(data.telefono);
      setName(data.name);
      setEmail(data.email);
    });
  }, []);

  /* Método para editar el perfil */
  const onEditProfile = async () => {
    /* Obtiene el token del usuario */
    const dataToken = await AsyncStorage.getItem("userToken");
    /* Utiliza el endPoint update para actualizar el usuario */
    axios
      .put(
        "/api/update/" + idUser,
        {
          dni: dni,
          telefono: telefono,
          name: name,
          email: email,
          password: password,
          password_confirmation: passwordConfirmation,
        },
        {
          headers: {
            Authorization: "Bearer " + dataToken,
          },
        }
      )
      .then(function (response) {
        setdniError(response.data.dni);
        settelefonoError(response.data.telefono);
        setnameError(response.data.name);
        setemailError(response.data.email);
        setpasswordError(response.data.password);
        setconfirmationpasswordError(response.data.password);

        if (response.data.message == "Actualizado con éxito!!") {
          /* Actualiza los datos del usuario actualizado en el objeto usuario */
          let user_object = {
            dni: dni,
            telefono: telefono,
            name: name,
            email: email,
          };

          /* Actualiza en el almacenamiento local el nuevo objeto del usuario*/
          AsyncStorage.setItem("user_object", JSON.stringify(user_object));

          alert(response.data.message);
          setPassword("");
          setPasswordConfirmation("");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  /* Muestra la vista Editar Perfil */
  return (
    <ScrollView>
      <View style={style.root}>
        <Text style={style.title}>Editar Perfil</Text>

        <CustomInput placeholder="DNI" value={dni} setValue={setDni} />
        <Text style={{ color: "red" }}>{dniError}</Text>

        <CustomInput
          placeholder="Celular"
          value={telefono}
          setValue={setTelefono}
        />
        <Text style={{ color: "red" }}>{telefonoError}</Text>

        <CustomInput
          placeholder="Nombres y Apellidos"
          value={name}
          setValue={setName}
        />
        <Text style={{ color: "red" }}>{nameError}</Text>

        <CustomInput placeholder="Correo" value={email} setValue={setEmail} />
        <Text style={{ color: "red" }}>{emailError}</Text>

        <CustomInput
          placeholder="Contraseña"
          value={password}
          setValue={setPassword}
          secureTextEntry={true}
        />
        <Text style={{ color: "red" }}>{passwordError}</Text>

        <CustomInput
          placeholder="Repetir Contraseña"
          value={passwordConfirmation}
          setValue={setPasswordConfirmation}
          secureTextEntry={true}
        />
        <Text style={{ color: "red" }}>{confirmationpasswordError}</Text>

        <CustomButton text="Actualizar" onPress={onEditProfile} />
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

export default EditProfileScreen;
