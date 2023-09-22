import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import React, { useEffect } from "react";
import COLORS from "../assets/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "../api/server";

const CartScreen = ({ navigation }) => {
  const [product, setProduct] = React.useState();
  const [direccion, setDireccion] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getDataProduct();
    });
    return unsubscribe;
  }, [navigation]);

  /* Método para obtener del almacenamiento local los productos del carrito */
  const getDataProduct = async () => {
    let items = await AsyncStorage.getItem("cartItems");
    items = JSON.parse(items);
    if (items) {
      setProduct(items);
    }
  };

  /* Borrar producto del carrito */
  const removeItemFromCart = async (id) => {
    let itemArray = await AsyncStorage.getItem("cartItems");
    itemArray = JSON.parse(itemArray);
    if (itemArray) {
      let array = itemArray;
      for (let index = 0; index < array.length; index++) {
        if (array[index].id == id) {
          array.splice(index, 1);
        }
        await AsyncStorage.setItem("cartItems", JSON.stringify(array));
        getDataProduct();
      }
    }
  };

  const renderProducts = (data, index) => {
    return (
      <TouchableOpacity
        key={data.key}
        style={{
          width: "100%",
          height: 100,
          marginVertical: 6,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <View
          style={{
            width: "30%",
            height: 100,
            padding: 14,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F0F0F3",
            borderRadius: 10,
            marginRight: 22,
          }}
        >
          <Image
            source={{
              uri: global.url + "/storage/uploads/productos/" + data.image,
            }}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          ></Image>
        </View>
        <View
          style={{
            flex: 1,
            height: "100%",
            justifyContent: "space-around",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 14,
                maxWidth: "100%",
                color: COLORS.dark,
                fontWeight: "bold",
              }}
            >
              {data.name}
            </Text>
            <View>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  maxWidth: "85%",
                  marginRight: 4,
                  marginTop: 3,
                  color: "gray",
                }}
              >
                S/. {data.price}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  borderRadius: 100,
                  marginRight: 20,
                  padding: 4,
                  borderWidth: 1,
                  borderColor: "#B9B9B9",
                  opacity: 0.5,
                }}
              >
                <MaterialCommunityIcons
                  name="minus"
                  style={{
                    fontSize: 16,
                    color: "#777777",
                  }}
                />
              </View>
              <Text>1</Text>
              <View
                style={{
                  borderRadius: 100,
                  marginLeft: 20,
                  padding: 4,
                  borderWidth: 1,
                  borderColor: "#B9B9B9",
                  opacity: 0.5,
                }}
              >
                <MaterialCommunityIcons
                  name="plus"
                  style={{
                    fontSize: 16,
                    color: "#777777",
                  }}
                />
              </View>
            </View>
            <TouchableOpacity onPress={() => removeItemFromCart(data.id)}>
              <MaterialCommunityIcons
                name="delete-outline"
                style={{
                  fontSize: 16,
                  color: "#777777",
                  backgroundColor: "#F0F0F3",
                  padding: 8,
                  borderRadius: 100,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /* Enviar notificación del pedido al Administrador */
  const onSend = async () => {
    let itemArray = await AsyncStorage.getItem("cartItems");
    itemArray = JSON.parse(itemArray);
    let detalle_pedido = [
      {
        idProducto: itemArray[0].id,
        cantidad: 1,
      },
    ];
    AsyncStorage.getItem("object_pedido").then((value) => {
      const data = JSON.parse(value);
      axios
        .post("/api/sendNotification", {
          idCliente: data.idCliente,
          idNegocio: data.idNegocio,
          direccion: direccion,
          descripcion: descripcion,
          producto: detalle_pedido,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
    let array = itemArray;
    array.splice(0, array.length);
    await AsyncStorage.setItem("cartItems", JSON.stringify(array));
    getDataProduct();
    setDescripcion("");
    setDireccion("");

    alert("El pedido fue enviado con éxito");
  };

  /* Método para mostrar el diseño del botón Enviar, input indicaciones y descripcion en la vista */
  const Card = () => {
    let contentNotification;
    if (product != 0) {
      contentNotification = (
        <Pressable style={style.btnEnviar}>
          <Text style={style.btnText} onPress={onSend}>
            Enviar
          </Text>
        </Pressable>
      );
    }

    return <View>{contentNotification}</View>;
  };

  /* Método principal para mostrar la vista */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={style.containerMain}>
        <Text style={style.title}>Pedidos</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16 }}>
          {product ? product.map(renderProducts) : null}
        </View>
        <TextInput
          style={style.direccion}
          onChangeText={(text) => setDireccion(text)}
          value={direccion}
          placeholder="Ingrese su dirección"
        />
        <TextInput
          multiline={true}
          numberOfLines={10}
          style={style.comentario}
          onChangeText={(text) => setDescripcion(text)}
          value={descripcion}
          placeholder="Ingrese una descripción"
        />
        <Card />
      </ScrollView>
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
  direccion: {
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    padding: 8,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    borderRadius: 8,
  },
  comentario: {
    height: 80,
    textAlignVertical: "top",
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    padding: 8,
    margin: 15,
    borderRadius: 8,
  },
  btnEnviar: {
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#3093FA",
    marginLeft: 15,
    marginRight: 15,
  },
  btnText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
  },
});

export default CartScreen;
