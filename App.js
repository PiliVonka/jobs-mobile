import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import AsyncStorage from "@react-native-community/async-storage";
import { persistCache } from "apollo3-cache-persist";
import { AppLoading } from "expo";
import { Text } from "react-native";
import { SearchBar } from "react-native-elements";

import HomeScreen from "./src/HomeScreen";
import JobScreen from "./src/JobScreen";
import styles, { screenOptions } from "./src/styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

console.log({ ApolloClient });
console.log({ InMemoryCache });

const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: "http://18.134.26.248:8080/graphql",

  cache,
  defaultOptions: { watchQuery: { fetchPolicy: "cache-and-network" } },

  onError: ({ graphQLErrors, networkError, reponse }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      });
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
});

export default function App () {
  const [searchText, setSearchText] = useState("");
  const [loadingCache, setLoadingCache] = useState(true);
  useEffect(() => {
    persistCache({
      cache,
      storage: AsyncStorage,
    }).then(() => setLoadingCache(false));
  }, []);

  if (loadingCache) {
    return <AppLoading />;
  }
  const stackNavigator = () => {
    return (
        <Stack.Navigator style={{ backgroundColor: "red" }} initialRouteName="Home" screenOptions={screenOptions}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              // eslint-disable-next-line react/display-name
              headerTitle: props => {
                console.log({ props });
                return (
                  <SearchBar
                    inputContainerStyle={{ flex: 1, backgroundColor: "lightgray", }}
                    containerStyle={{ height: 55, flex: 1, borderBottomColor: "white", backgroundColor: "white", borderTopColor: "white" }}
                    placeholder="Программист"
                    value={searchText}
                    onChangeText={setSearchText} />
                );
              }
            }}
            style={{ backgroundColor: "red" }}
          />
          <Stack.Screen
            name="Job"
            component={JobScreen}
            options={({
              route: {
                params: {
                  job: { id, title },
                },
              },
            }) => ({
              title: `${title} - ${id}`,
            })}
          />
        </Stack.Navigator>
    );
  };
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            tabBar name="Home"
            component={stackNavigator}
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={size} />
              ),
            }}/>
        </Tab.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
