import { StyleSheet } from "react-native";

export const PINK = "white";

export const screenOptions = {
  headerStyle: {
    backgroundColor: PINK,
  },
  headerTintColor: "#fff",
};

export default StyleSheet.create({
  homePage: {
    backgroundColor: "white"
  },
  jobPage: {
    backgroundColor: "white"
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    color: "white"
  },
  item: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  header: {
    fontWeight: "bold",
  },
  subheader: {
    paddingTop: 10,
  },
});
