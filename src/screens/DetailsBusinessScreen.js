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
  ToastAndroid,
  Alert,
} from "react-native";
import COLORS from "../assets/colors";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LogBox } from "react-native";
import axios from "../api/server";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");

const DetailsBusinessScreen = ({ navigation, route }) => {
  const [banners, setBanners] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [selectedCategoryIndex, setSeletedCategoryIndex] = React.useState(0);
  const [filteredProducts, setFilteredProducts] = React.useState([]);
  const [idUser, setidUser] = React.useState("");

  const idBusiness = route.params;

  AsyncStorage.getItem("user_object").then((value) => {
    const data = JSON.parse(value);
    setidUser(data.id);
  });

  let object_pedido = {
    idCliente: idUser,
    idNegocio: idBusiness.id,
  };

  AsyncStorage.setItem("object_pedido", JSON.stringify(object_pedido));

  React.useEffect(() => {
    handleGetToken();
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    fliterProducts(0);
  }, []);

  /* Método para ejecutar los endPoints en la vista */
  const handleGetToken = async () => {
    /* Obtiene el token del usuario */
    const dataToken = await AsyncStorage.getItem("userToken");

    /* Utiliza el endPoint Banners para mostrar los registros de la BD en la vista */
    axios
      .get("/api/banners/" + idBusiness.id, {
        headers: {
          Authorization: "Bearer " + dataToken,
        },
      })
      .then((response) => {
        /* console.log(response.data); */
      });

    /* Utiliza el endPoint Categoria de Productos para mostrar los registros de la BD en la vista */
    axios
      .get("/api/categoriaProductos/" + idBusiness.id, {
        headers: {
          Authorization: "Bearer " + dataToken,
        },
      })
      .then((response) => {
        setCategories(response.data);
      });

    /* Utiliza el endPoint de Productos para mostrar los registro de la BD en la Vista */
    axios
      .get("/api/productos/" + idBusiness.id, {
        headers: {
          Authorization: "Bearer " + dataToken,
        },
      })
      .then((response) => {
        setProducts(response.data);
      });

    //console.log(categories);
  };

  /* filtra los productos de acuerdo al ID de la categoría seleccionada */
  const fliterProducts = (index) => {
    const currentProducts = products.filter(
      (item) => item?.idCategoria == categories[index].id
    );
    setFilteredProducts(currentProducts);
  };

  /* Muestra la vista para los productos */
  const Card = ({ product, navigation }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("DetailsBusiness", product)}
      >
        <View style={style.cardContainer}>
          <View style={style.cardImageContainer}>
            <Image
              source={{
                uri:
                  global.url + "/storage/uploads/productos/" + product?.imagen,
              }}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <View style={style.cardDetailContainer}>
            <Text
              style={{ fontWeight: "bold", color: COLORS.dark, fontSize: 20 }}
            >
              {product?.nombre}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 25,
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontWeight: "bold", color: COLORS.dark, fontSize: 15 }}
              >
                S/
                {(product?.precio).toFixed(2)}
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  borderRadius: 5,
                  backgroundColor: "#3093FA",
                  padding: 8,
                }}
                onPress={() =>
                  addToCart(
                    product?.id,
                    product?.nombre,
                    product?.precio,
                    product?.imagen
                  )
                }
              >
                <Text style={{ color: "white" }}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /* Método para agregar el producto al carrito */
  const addToCart = async (id, name, price, img) => {
    let itemArray = await AsyncStorage.getItem("cartItems");
    itemArray = JSON.parse(itemArray);
    if (itemArray) {
      let array = itemArray;
      array.push({ id: id, name: name, price: price, image: img });

      try {
        await AsyncStorage.setItem("cartItems", JSON.stringify(array));
        alert("El Producto fue agregado");
      } catch (error) {
        console.log(error);
      }
    } else {
      let array = [];
      array.push({ id: id, name: name, price: price, image: img });
      try {
        await AsyncStorage.setItem("cartItems", JSON.stringify(array));
        alert("El Producto fue agregado");
      } catch (error) {
        console.log(error);
      }
    }
  };

  /* Muestra la vista principal */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={style.header}></View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.mainContainer}>
          {/* Buscador */}
          <View style={style.searchInputContainer}>
            <Icon name="magnify" size={24} color={COLORS.grey} />
            <TextInput
              placeholder="Ingrese un producto que desee buscar"
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
            {/* utiliza bucle para mostrar los productos filtrados de acuerdo al ID de las categorías */}
            {categories.map((item, index) => (
              <View
                key={"categories" + index}
                style={{ alignItems: "center", marginRight: 10 }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setSeletedCategoryIndex(index);
                    fliterProducts(index);
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
                        "/storage/uploads/categoriaProducto/" +
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
              data={filteredProducts}
              renderItem={({ item }) => (
                <Card product={item} navigation={navigation} />
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

export default DetailsBusinessScreen;
