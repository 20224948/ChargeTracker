import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

const About = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
{/* Banner Logo */}
<TouchableOpacity
  style={styles.bannerContainer}
  activeOpacity={0.8}
  onPress={() => router.push("/home")}
>
  <Image
    source={require("../assets/chargeTrackerLogo.png")}
    style={styles.bannerImage}
  />
</TouchableOpacity>

        onPress={() => router.push("/home")}
      >
        <Image
          source={require("../assets/chargeTrackerLogo.png")}
          style={styles.bannerImage}
        />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.settingsHeader}>About</Text>

          {/* NAVIGATION: Settings | About */}
          <View style={styles.tabs}>
            <TouchableOpacity onPress={() => router.push("/settings")}>
              <Text style={styles.tab}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/about")}>
              <Text style={[styles.tab, styles.activeTab]}>About</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <Text style={styles.label}>Developed By:</Text>
              <Text style={styles.readOnlyValue}>The Charge Tracker Team!</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Team Members:</Text>
              <Text style={styles.readOnlyValue}>
                Peter Edwards, Mark Prado and Jamie Norton
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Last Update:</Text>
              <Text style={styles.readOnlyValue}>25/04/2025</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Charge Tracker Version:</Text>
              <Text style={styles.readOnlyValue}>Charge Tracker v000.1</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 40 },
  bannerContainer: {
    width: "100%",
    backgroundColor: "#0F81c7",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingBottom: 10,
  },
  bannerImage: {
    width: "100%",
    height: 180,
    resizeMode: "contain",
  },
  settingsHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
    paddingHorizontal: 20,
    color: "#333",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tab: {
    fontSize: 16,
    color: "#555",
    paddingBottom: 5,
  },
  activeTab: {
    color: "#007BFF",
    borderBottomWidth: 2,
    borderBottomColor: "#007BFF",
  },
  form: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    flexWrap: "wrap",
  },
  label: {
    width: 110,
    fontWeight: "bold",
    color: "#333",
  },
  readOnlyValue: {
    flex: 1,
    fontSize: 16,
    color: "#007BFF",
  },
});

export default About;
