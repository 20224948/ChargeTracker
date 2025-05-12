import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  Linking,
  Pressable
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

// Type definition for each station
interface ChargingStation {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  status: string;
  availability: string;
  available: boolean;
  latitude: number;
  longitude: number;
}

const Home = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Search and region state
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

  const [chargingStations, setChargingStations] = useState<ChargingStation[]>([]);

  // Fetch charging station data from Firestore
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const snapshot = await getDocs(collection(db, "chargingStations"));
        const stations: ChargingStation[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.stationName,
            rating: data.rating || 0,
            reviews: data.reviews || 0,
            status: data.openNow !== false ? "Open Now" : "Closed",
            availability: data.availableDocks > 0 ? "Chargers Available" : "Chargers Unavailable",
            available: data.availableDocks > 0,
            latitude: data.coordinates.latitude,
            longitude: data.coordinates.longitude,
          };
        });
        setChargingStations(stations);
      } catch (error) {
        console.error("Error fetching stations:", error);
        Alert.alert("Error", "Unable to load charging stations.");
      }
    };

    fetchStations();
  }, []);

  // Get current location and address
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;

          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          setCurrentLocation({ latitude, longitude });

          const [geo] = await Location.reverseGeocodeAsync({ latitude, longitude });
          setAddress(
            geo
              ? `${geo.street || ""} ${geo.name || ""}, ${geo.city || ""}, ${geo.region || ""} ${geo.postalCode || ""}`
              : "Unknown address"
          );
        } else if (!canAskAgain) {
          Alert.alert("Location Blocked", "Please enable location access in Settings to use this feature.", [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]);
        } else {
          Alert.alert("Permission Denied", "We need location access to show nearby chargers.");
        }
      } catch (err) {
        console.error("Location error:", err);
        Alert.alert("Error", "Unable to get your location.");
      }
    };

    getLocation();
  }, []);

  // Handle manual search and pin-drop
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const locations = await Location.geocodeAsync(searchQuery);
      if (locations.length > 0) {
        const { latitude, longitude } = locations[0];

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
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

  // Render individual station cards
  const renderStation = ({ item }: { item: ChargingStation }) => (
    <Pressable
      onPress={() => router.push(`/location/${item.id}`)}
      style={styles.stationCard}
    >
      <View style={styles.stationHeader}>
        <Text style={styles.stationName}>{item.name}</Text>
        <Text style={styles.stationRating}>
          {item.rating} ⭐ ({item.reviews})
        </Text>
      </View>

      <Text style={styles.stationStatus}>{item.status}</Text>
      <Text style={[styles.stationAvailability, { color: item.available ? "green" : "red" }]}>
        {item.availability}
      </Text>

      <View style={styles.stationActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: item.available ? "#28a745" : "#dc3545" }]}
          onPress={(e) => {
            e.stopPropagation(); // Prevent Pressable trigger
            router.push(`/location/checkIn?id=${item.id}`);
          }}
        >
          <Text style={styles.actionButtonText}>
            {item.available ? "Check In" : "Unavailable"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation(); // Prevent Pressable trigger
            const lat = item.latitude;
            const lng = item.longitude;
            const label = encodeURIComponent(item.name);
            const url = Platform.select({
              ios: `http://maps.apple.com/?daddr=${lat},${lng}&q=${label}`,
              android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
            });
            if (url) Linking.openURL(url);
          }}
        >
          <Text style={styles.actionButtonText}>Directions</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search bar and settings icon */}
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

      {/* Map rendering */}
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
      >
        {chargingStations.map((station) =>
          station.latitude != null && station.longitude != null ? (
            <Marker
              key={station.id}
              coordinate={{ latitude: station.latitude, longitude: station.longitude }}
              title={station.name}
              description={station.availability}
            />
          ) : null
        )}

        {currentLocation && (
          <Marker coordinate={currentLocation} title="You Are Here" pinColor="blue" />
        )}

        {searchedLocation && (
          <Marker coordinate={searchedLocation} title="Searched Location" pinColor="purple" />
        )}
      </MapView>

      {/* Address display */}
      {address !== "" && (
        <View style={styles.locationHeader}>
          <Text style={styles.locationTitle}>EV Chargers Near Me</Text>
          <Text style={styles.locationSubText}>Your Location: {address}</Text>
        </View>
      )}

      {/* Station List */}
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
