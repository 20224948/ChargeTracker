import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Platform, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc, getDocs, collection, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const openDirections = (latitude: number, longitude: number, name: string) => {
  const label = encodeURIComponent(name);
  const url = Platform.select({
    ios: `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${label}`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
  });
  if (url) Linking.openURL(url);
};

interface Dock {
  id: string;
  status: string;
  chargerType: string;
}

interface Station {
  stationName: string;
  availableDocks: number;
  totalDocks: number;
  rating?: number;
  location?: string;
  chargerTypes?: string[];
  openNow?: boolean;
  reviews?: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const CheckIn = () => {
  const router = useRouter();
  const { id: locationId } = useLocalSearchParams();
  const [station, setStation] = useState<Station | null>(null);
  const [docks, setDocks] = useState<Dock[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCheckedInDockId, setUserCheckedInDockId] = useState<string | null>(null);

  useEffect(() => {
    if (!locationId) return;

    const fetchStationAndDocks = async () => {
      try {
        const stationDoc = await getDoc(doc(db, "chargingStations", locationId as string));
        if (stationDoc.exists()) {
          setStation(stationDoc.data() as Station);
        }

        const dockSnapshot = await getDocs(
          collection(db, "chargingStations", locationId as string, "docks")
        );
        const dockList: Dock[] = dockSnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Dock, "id">),
        }));
        setDocks(dockList);

        // Check if user is already checked into a dock
        const checkedInDock = dockList.find(d => d.status === "In Use"); // Simulate one dock per user
        if (checkedInDock) {
          setUserCheckedInDockId(checkedInDock.id);
        }
      } catch (error) {
        console.error("Error fetching station/docks:", error);
        Alert.alert("Error", "Failed to load check-in data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStationAndDocks();
  }, [locationId]);

  const handleCheckIn = async (dockId: string) => {
    if (userCheckedInDockId) {
      Alert.alert(
        "Already Checked In",
        "You can only check into one dock at a time. Please check out first."
      );
      return;
    }

    const dockRef = doc(db, "chargingStations", locationId as string, "docks", dockId);
    const dockSnap = await getDoc(dockRef);
    const currentStatus = dockSnap.data()?.status;

    if (currentStatus === "In Use") {
      Alert.alert("Dock In Use", "This dock is already in use.");
      return;
    }

    await updateDoc(dockRef, { status: "In Use" });

    const stationRef = doc(db, "chargingStations", locationId as string);
    await updateDoc(stationRef, {
      availableDocks: (station?.availableDocks || 1) - 1,
    });

    setDocks(prev => prev.map(d => (d.id === dockId ? { ...d, status: "In Use" } : d)));
    setStation(prev =>
      prev ? { ...prev, availableDocks: prev.availableDocks - 1 } : prev
    );
    setUserCheckedInDockId(dockId);
  };

  const handleCheckOut = async (dockId: string) => {
    const dockRef = doc(db, "chargingStations", locationId as string, "docks", dockId);

    await updateDoc(dockRef, { status: "Available" });

    const stationRef = doc(db, "chargingStations", locationId as string);
    await updateDoc(stationRef, {
      availableDocks: (station?.availableDocks || 0) + 1,
    });

    setDocks(prev => prev.map(d => (d.id === dockId ? { ...d, status: "Available" } : d)));
    setStation(prev =>
      prev ? { ...prev, availableDocks: prev.availableDocks + 1 } : prev
    );
    setUserCheckedInDockId(null);
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  if (!station) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Charging station not found.
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
            <Text style={styles.rating}>{station.rating?.toFixed(1) || "N/A"}</Text>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.reviews}>({station.reviews ?? 0})</Text>
          </View>
          <Text style={styles.status}>
            {station.openNow !== false ? "Open Now" : "Closed"}
          </Text>
          <Text style={styles.availability}>
                      ⚡ {station.availableDocks} of {station.totalDocks} Docks Available
                    </Text>
                    <Text style={styles.distance}>Type: {station.chargerTypes?.join(", ")}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionButton, styles.checkInButton]}>
            <Text style={styles.actionButtonText}>Check In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openDirections(station?.coordinates?.latitude, station?.coordinates?.longitude, station?.stationName || "Charging Station")}
          >
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => router.push(`/location/${locationId}`)}>
            <Text style={styles.tab}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/location/reviews?id=${locationId}`)}>
            <Text style={styles.tab}>Reviews</Text>
          </TouchableOpacity>
        </View>

        {docks.map((dock, index) => (
          <TouchableOpacity
            key={dock.id}
            style={[
              styles.checkInConfirmButton,
              {
                backgroundColor:
                  dock.status === "Available"
                    ? "#28a745"
                    : userCheckedInDockId === dock.id
                      ? "#ffc107"
                      : "#dc3545",
              },
            ]}
            onPress={() =>
              dock.status === "Available"
                ? handleCheckIn(dock.id)
                : userCheckedInDockId === dock.id
                  ? handleCheckOut(dock.id)
                  : null
            }
          >
            <Text style={styles.checkInConfirmButtonText}>
              {dock.status === "Available"
                ? `✅ Check Into Dock ${index + 1} (${dock.chargerType})`
                : userCheckedInDockId === dock.id
                  ? `🔓 Check Out of Dock ${index + 1}`
                  : `❌ Dock ${index + 1} In Use`}
            </Text>
          </TouchableOpacity>
        ))}
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
    backgroundColor: "#fff"
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
  checkInConfirmButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  checkInConfirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CheckIn;
