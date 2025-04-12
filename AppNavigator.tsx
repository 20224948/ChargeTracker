import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./app/login"; // Import Login screen
import AboutScreen from "./app/about"; // Import About screen
import SettingsScreen from "./app/settings"; // Import Settings screen

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login" // Matches the navigation.navigate call in LoginScreen
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="About" // Matches the navigation.navigate call in LoginScreen
          component={AboutScreen}
          options={{ title: "About" }}
        />
        <Stack.Screen
          name="Settings" // Matches the navigation.navigate call in LoginScreen
          component={SettingsScreen}
          options={{ title: "Settings" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
