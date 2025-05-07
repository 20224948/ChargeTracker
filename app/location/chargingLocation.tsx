import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Platform, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const openDirections = (latitude: number, longitude: number, name: string) => {
  const label = encodeURIComponent(name);
  const url = Platform.select({
    ios: `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${label}`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
  });
  if (url) Linking.openURL(url);
};

const ChargingLocation = () => {
  const router = useRouter();
  const { id: locationId } = useLocalSearchParams();
  const [station, setStation] = useState<any>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!locationId) return;

    const unsub = onSnapshot(doc(db, "chargingStations", locationId as string), (docSnap) => {
      if (docSnap.exists()) {
        setStation(docSnap.data());
      } else {
        console.warn("No such station:", locationId);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [locationId]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  if (!station) {
    return (
      <View style={styles.container}>
        <Text style={{ marginTop: 50, textAlign: "center", color: "red" }}>
          Station not found.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
          style={styles.bannerContainer}
          activeOpacity={0.8}
          onPress={() => router.push("/home")}
      >
        <Image
            source={require("../../assets/images/chargeTrackerLogo.png")}
            style={styles.bannerImage}
        />
      </TouchableOpacity>

      <ScrollView style={styles.detailsContainer}>
        <View style={styles.header}>
          <Text style={styles.stationName}>{station.stationName}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{station.rating?.toFixed(1)}</Text>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.reviews}>({station.reviewCount || 0})</Text>
          </View>
          <Text style={styles.status}>
            {station.openNow ? "Open Now" : "Closed"}
          </Text>
          <Text style={styles.availability}>
            ⚡ {station.availableDocks} of {station.totalDocks} Docks Available
          </Text>
          <Text style={styles.distance}>Type: {station.chargerTypes?.join(", ")}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.checkInButton]}
            onPress={() => router.push(`/location/checkIn?id=${locationId}`)}
          >
            <Text style={styles.actionButtonText}>Check In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openDirections(station.coordinates.latitude, station.coordinates.longitude, station.stationName)}
          >
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity>
            <Text style={[styles.tab, styles.activeTab]}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/location/addReview")}>
            <Text style={styles.tab}>Reviews</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Operator:</Text> Tesla
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Address:</Text> {station.location}
          </Text>
          
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Total Charging Stations:</Text> {station.totalDocks}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Charging Stations Available:</Text> {station.availableDocks}
          </Text>
        </View>

        <Image
          source={{ uri: "https://via.placeholder.com/400x200" }}
          style={styles.additionalImage}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: "bold",
  },
  additionalImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginTop: 15,
  },
});

export default ChargingLocation;
