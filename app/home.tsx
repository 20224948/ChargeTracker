import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import 'firebase.js'

const {firebaseConfig} = require('./firebase.js');
const app = initializeApp(firebaseConfig);

interface ChargingStation {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  status: string;
  availability: string;
  price: string;
  available: boolean;
  latitude: number;
  longitude: number;
}

const Home = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState("");
  const [region, setRegion] = useState<Region>({
    latitude: -27.4698,
    longitude: 153.0251,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [searchedLocation, setSearchedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState<string>("");

  const [chargingStations] = useState<ChargingStation[]>([
    {
      id: "1",
      name: "Belmont EV Charging Station",
      rating: 4.9,
      reviews: 309,
      status: "Open 24 Hours",
      availability: "Chargers Available",
      price: "$0.64 AUD per kWh",
      available: true,
      latitude: -27.4705,
      longitude: 153.026,
    },
    {
      id: "2",
      name: "Carina EV Charging Station",
      rating: 4.7,
      reviews: 410,
      status: "Open 24 Hours",
      availability: "Chargers Unavailable",
      price: "$0.62 AUD per kWh",
      available: false,
      latitude: -27.472,
      longitude: 153.03,
    },
    {
      id: "3",
      name: "Morningside EV Charging Station",
      rating: 4.5,
      reviews: 511,
      status: "Open 24 Hours",
      availability: "Chargers Available",
      price: "$0.68 AUD per kWh",
      available: true,
      latitude: -27.468,
      longitude: 153.02,
    },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Location permission is required to show nearby charging stations."
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });

        setCurrentLocation({ latitude, longitude });

        const geo = await Location.reverseGeocodeAsync({ latitude, longitude });
        const formatted = geo[0]
          ? `${geo[0].street || ""} ${geo[0].name || ""}, ${geo[0].city || ""}, ${geo[0].region || ""} ${geo[0].postalCode || ""}`
          : "Unknown address";

        setAddress(formatted);
      } catch (error) {
        console.error("Error fetching location:", error);
        Alert.alert("Error", "Unable to fetch location. Please try again.");
      }
    })();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const locations = await Location.geocodeAsync(searchQuery);
      if (locations.length > 0) {
        const { latitude, longitude } = locations[0];

        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };

        setRegion(newRegion);
        setSearchedLocation({ latitude, longitude });

        const geo = await Location.reverseGeocodeAsync({ latitude, longitude });
        const formatted = geo[0]
          ? `${geo[0].street || ""} ${geo[0].name || ""}, ${geo[0].city || ""}, ${geo[0].region || ""} ${geo[0].postalCode || ""}`
          : "Unknown address";

        setAddress(formatted);
      } else {
        Alert.alert("Location Not Found", "Unable to find the specified location.");
      }
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Unable to find location. Please try again.");
    }
  };

  const renderStation = ({ item }: { item: ChargingStation }) => (
    <View style={styles.stationCard}>
      <View style={styles.stationHeader}>
        <Text style={styles.stationName}>{item.name}</Text>
        <Text style={styles.stationRating}>
          {item.rating} ⭐ ({item.reviews})
        </Text>
      </View>
      <Text style={styles.stationStatus}>{item.status}</Text>
      <Text
        style={[
          styles.stationAvailability,
          { color: item.available ? "green" : "red" },
        ]}
      >
        {item.availability}
      </Text>
      <Text style={styles.stationPrice}>{item.price}</Text>
      <View style={styles.stationActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: item.available ? "#28a745" : "#dc3545" },
          ]}
        >
          <Text style={styles.actionButtonText}>
            {item.available ? "Check In" : "Unavailable"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.overlayContainer, { top: insets.top + 10 }]}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for area or suburb"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={handleSearch} style={styles.iconButton}>
            <Ionicons name="search" size={20} color="#007BFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/settings")} style={styles.iconButton}>
            <Ionicons name="settings" size={20} color="#007BFF" />
          </TouchableOpacity>
        </View>
      </View>

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
      >
        {chargingStations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            title={station.name}
            description={station.availability}
          />
        ))}

        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="You Are Here"
            pinColor="blue"
          />
        )}

        {searchedLocation && (
          <Marker
            coordinate={searchedLocation}
            title="Searched Location"
            pinColor="purple"
          />
        )}
      </MapView>

      {address !== "" && (
        <View style={styles.locationHeader}>
          <Text style={styles.locationTitle}>EV Chargers Near Me</Text>
          <Text style={styles.locationSubText}>Your Location: {address}</Text>
        </View>
      )}

      <FlatList
        style={{ flexGrow: 0 }}
        data={chargingStations}
        renderItem={renderStation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  overlayContainer: {
    position: "absolute",
    left: 15,
    right: 15,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
    color: "#333",
  },
  iconButton: {
    marginLeft: 10,
  },
  map: {
    height: "40%",
    marginBottom: 10,
  },
  locationHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f4f4f4",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  locationSubText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  listContainer: {
    paddingBottom: 20,
  },
  stationCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  stationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  stationRating: {
    fontSize: 14,
    color: "#555",
  },
  stationStatus: {
    fontSize: 14,
    color: "#007BFF",
    marginBottom: 5,
  },
  stationAvailability: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  stationPrice: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  stationActions: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Home;
