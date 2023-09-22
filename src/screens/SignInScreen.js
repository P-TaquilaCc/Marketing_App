import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Text,
} from "react-native";

import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import axios from "../api/server";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const [emailError, setemailError] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [loginError, setloginError] = useState("");

  /* Acciona el botón Iniciar sesión */
  const onSignInPressed = () => {
    if (email != "" && password != "") {
      /* Llama al endPoint Login para iniciar sesión con las credenciales ingresadas */
      axios
        .post("/api/login", {
          email: email,
          password: password,
        })
        .then(function (response) {
          if (response.status == 200) {
            if (response.data.error) {
              const errorMessage = response.data.error;
              setloginError(errorMessage);
            } else {
              let user_object = {
                id: response.data["user"]["id"],
                dni: response.data["user"]["dni"],
                telefono: response.data["user"]["telefono"],
                name: response.data["user"]["name"],
                email: response.data["user"]["email"],
              };

              /* Se guarda en el sistema de almacenamiento el objeto usuario y el token */
              AsyncStorage.setItem("user_object", JSON.stringify(user_object));
              AsyncStorage.setItem("userToken", response.data["token"]);

              navigation.navigate("Home");
              setloginError("");
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });

      setemailError("");
      setpasswordError("");
    } else if (email == "" && password != "") {
      setpasswordError("");
      setloginError("");
      setemailError("Ingrese un email");
    } else if (password == "" && email != "") {
      setemailError("");
      setloginError("");
      setpasswordError("Ingrese un password");
    } else {
      setloginError("");
      setemailError("Ingrese un email");
      setpasswordError("Ingrese un password");
    }
  };

  /* Cambia a la vista para confirmar email */
  const onForgotPasswordPressed = () => {
    navigation.navigate("ConfirmEmailScreen");
  };

  /* Cambia a la vista para registrarse */
  const onSignUpPress = () => {
    navigation.navigate("SignUpScreen");
  };

  /* Muestra la vista para iniciar sesión */
  return (
    <ScrollView>
      <View style={style.root}>
        <Image
          source={Logo}
          style={[style.logo, { height: height * 0.3 }]}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 35, fontWeight: "bold" }}>Bienvenido</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16 }}>Inicie sesión para continuar</Text>
        </View>
        <CustomInput placeholder="Correo" value={email} setValue={setEmail} />
        <Text style={{ color: "red" }}>{emailError}</Text>
        <CustomInput
          placeholder="Contraseña"
          value={password}
          setValue={setPassword}
          secureTextEntry={true}
        />
        <Text style={{ color: "red" }}>{passwordError}</Text>
        <CustomButton text="Iniciar Sesión" onPress={onSignInPressed} />
        <Text style={{ color: "red" }}>{loginError}</Text>
        <CustomButton
          text="¿Olvidaste tu contraseña?"
          onPress={onForgotPasswordPressed}
          type="TERTIARY"
        />

        <CustomButton
          text="¿No tienes una cuenta? Registrate"
          onPress={onSignUpPress}
          type="TERTIARY"
        />
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
    marginBottom: 10,
    width: "70%",
    maxWidth: 300,
    maxHeight: 200,
  },
});

export default SignInScreen;
