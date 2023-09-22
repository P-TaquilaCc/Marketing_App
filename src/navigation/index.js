import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ConfirmEmailScreen from "../screens/ConfirmEmailScreen";
import HomeScreen from "../screens/HomeScreen";
import DetailsBusinessScreen from "../screens/DetailsBusinessScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import editProfileScreen from "../screens/EditProfileScreen";

import Icon from "react-native-vector-icons/Ionicons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";
          switch (route.name) {
            case "Inicio":
              iconName = focused ? "home" : "home-outline";
              break;

            case "Carrito":
              iconName = focused ? "cart" : "cart-outline";
              break;

            case "Perfil":
              iconName = focused ? "person-circle" : "person-circle-outline";
              break;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Carrito" component={CartScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen
          name="ConfirmEmailScreen"
          component={ConfirmEmailScreen}
        />
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen
          name="DetailsBusiness"
          component={DetailsBusinessScreen}
        />
        <Stack.Screen name="editProfile" component={editProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
