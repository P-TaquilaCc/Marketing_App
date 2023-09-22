import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import COLORS from "../assets/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LogBox } from "react-native";
import axios from "../api/server";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");

/* Muestra la vista para los negocios */
const Card = ({ pet, navigation }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate("DetailsBusiness", pet)}
    >
      <View style={style.cardContainer}>
        <View style={style.cardImageContainer}>
          <Image
            source={{
              uri: global.url + "storage/images/negocio/" + pet?.imagen,
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View style={style.cardDetailContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{ fontWeight: "bold", color: COLORS.dark, fontSize: 20 }}
            >
              {pet?.nombre}
            </Text>
          </View>
          <Text style={{ fontSize: 12, marginTop: 5, color: COLORS.dark }}>
            Horario: {pet?.hora_inicio + " - " + pet?.hora_fin}
          </Text>
          <View
            style={{ marginTop: 5, flexDirection: "row", alignItems: "center" }}
          >
            <Icon name="map-marker" color={COLORS.primary} size={18} />
            <Text style={{ fontSize: 12, color: COLORS.grey, marginLeft: 5 }}>
              Dirección: {pet?.direccion}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [business, setBusiness] = useState([]);
  const [selectedCategoryIndex, setSeletedCategoryIndex] = useState(0);
  const [filteredNegocios, setFilterNegocio] = useState([]);
  const [text, setText] = useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
        if (token) {
          await handleGetToken(token);
          const userObject = await AsyncStorage.getItem("user_object");
          const data = JSON.parse(userObject);
          setText(data.name);
        } else {
          console.error("Token de usuario no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    if (business.length > 0 && categories.length > 0) {
      filterNegocio(0);
    }
  }, [business, categories]);

  const handleGetToken = async (dataToken) => {
    try {
      const responseCategories = await axios.get("/api/categoriasNegocio", {
        headers: {
          Authorization: "Bearer " + dataToken,
        },
      });
      setCategories(responseCategories.data);

      const responseBusiness = await axios.get("/api/negocios", {
        headers: {
          Authorization: "Bearer " + dataToken,
        },
      });
      setBusiness(responseBusiness.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  /* Filtrar las categorias por ID del negocio */
  const filterNegocio = async (index) => {
    const negocios = business.filter(
      (item) => item?.idCategoria == categories[index].id
    );
    setFilterNegocio(negocios);
  };

  /* Muestra toda la vista de la pantalla principal (Home) */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={style.header}>
        <View>
          <Text style={style.user}>{text}</Text>
          <Text style={style.message}>¡Bienvenido! a nuestro Marketplace</Text>
        </View>
        <Image
          source={require("../assets/img/perfil.jpg")}
          style={style.imgUser}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.mainContainer}>
          {/* Buscador */}
          <View style={style.searchInputContainer}>
            <Icon name="magnify" size={24} color={COLORS.grey} />
            <TextInput
              placeholder="Ingrese un negocio que desee buscar"
              style={{ flex: 1, paddingLeft: 5 }}
              placeholderTextColor={COLORS.grey}
            />
          </View>
          {/* Render de las categorías de los negocio */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
            }}
          >
            {/* Bucle para mostrar las categorias en la vista */}
            {categories.map((item, index) => (
              <View
                key={"business" + index}
                style={{ alignItems: "center", marginRight: 10 }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setSeletedCategoryIndex(index);
                    filterNegocio(index);
                  }}
                  style={[
                    style.categoryBtn,
                    {
                      backgroundColor:
                        selectedCategoryIndex == index
                          ? "#3093FA"
                          : COLORS.white,
                    },
                  ]}
                >
                  <Image
                    source={{
                      uri:
                        global.url +
                        "storage/images/categoriaNegocio/" +
                        item.imagen,
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                    }}
                  />
                </TouchableOpacity>
                <Text style={style.categoryBtnName}>{item.nombre}</Text>
              </View>
            ))}
          </View>

          {/* Render de Negocios */}
          <View style={{ marginTop: 20 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filteredNegocios}
              renderItem={({ item }) => (
                <Card pet={item} navigation={navigation} />
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  cardContainer: {
    padding: 10,
    backgroundColor: COLORS.white,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,

    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cardImageContainer: {
    height: 120,
    width: 140,
    backgroundColor: COLORS.background,
  },
  cardDetailContainer: {
    height: 120,
    backgroundColor: COLORS.white,
    flex: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
  },

  user: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },

  message: {
    fontSize: 12,
    color: "gray",
  },

  imgUser: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },

  mainContainer: {
    minHeight: height,
    backgroundColor: COLORS.light,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
  },

  searchInputContainer: {
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 7,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  categoryBtn: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    padding: 3,
  },

  categoryBtnName: {
    color: COLORS.dark,
    fontSize: 10,
    marginTop: 5,
    fontWeight: "bold",
  },
});

export default HomeScreen;
