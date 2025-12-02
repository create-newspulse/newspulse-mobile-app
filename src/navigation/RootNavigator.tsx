import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import ArticleScreen from "../screens/ArticleScreen";
import AudioScreen from "../screens/AudioScreen";
import BreakingScreen from "../screens/BreakingScreen";
import HomeScreen from "../screens/HomeScreen";
import SavedScreen from "../screens/SavedScreen";

export type RootStackParamList = {
  Tabs: undefined;
  Article: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Breaking" component={BreakingScreen} />
      <Tab.Screen name="Audio" component={AudioScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
    </Tab.Navigator>
  );
}

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Article"
          component={ArticleScreen}
          options={{ title: "News Pulse" }} // brand name with space
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
