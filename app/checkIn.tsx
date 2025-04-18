import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

const CheckIn = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Station Header Image */}
      <Image
        source={{ uri: "https://via.placeholder.com/400x200" }} // Replace with actual image later
        style={styles.image}
      />

      <ScrollView style={styles.detailsContainer}>
        {/* Station Summary */}
        <View style={styles.header}>
          <Text style={styles.stationName}>Belmont EV Charging Station</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>4.9</Text>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.reviews}>(309)</Text>
          </View>
          <Text style={styles.status}>Open 24 Hours</Text>
          <Text style={styles.availability}>
            ⚡ Chargers Available @ $0.64 AUD per kWh
          </Text>
          <Text style={styles.distance}>Distance: 3km</Text>
        </View>

        {/* Buttons: Check In / Directions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.checkInButton]}
            onPress={() => console.log("Check In initiated")}
          >
            <Text style={styles.actionButtonText}>Check In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs: Overview | Reviews (No Check In tab) */}
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => router.push("/chargingLocation")}>
            <Text style={styles.tab}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/addReview")}>
            <Text style={styles.tab}>Reviews</Text>
          </TouchableOpacity>
        </View>

        {/* Check-In Details */}
        <View style={styles.details}>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Vehicle Type:</Text> Tesla Model S
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Charger Type:</Text> Type 1 @ 350kWh
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Total Charging Stations:</Text> 48x Type 1 @ 350kWh
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Charging Station Available:</Text> Yes (Charger No. 10)
          </Text>
        </View>

        {/* Final Check In Button */}
        <TouchableOpacity style={styles.checkInConfirmButton}>
          <Text style={styles.checkInConfirmButtonText}>
            ✅ Check In to Charger No. 10
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  detailsContainer: {
    flex: 1,
    padding: 15,
  },
  header: {
    marginBottom: 15,
  },
  stationName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  rating: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  star: {
    fontSize: 16,
    color: "#FFD700",
    marginHorizontal: 5,
  },
  reviews: {
    fontSize: 14,
    color: "#555",
  },
  status: {
    fontSize: 14,
    color: "#007BFF",
    marginBottom: 5,
  },
  availability: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
    marginBottom: 5,
  },
  distance: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#007BFF",
  },
  checkInButton: {
    backgroundColor: "#28a745",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
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
  details: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: "bold",
  },
  checkInConfirmButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  checkInConfirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CheckIn;
