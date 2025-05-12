import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  Alert,
  Platform,
  Linking,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { formatDistanceToNow } from "date-fns";

// Firestore station structure
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

const ReviewsScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [station, setStation] = useState<Station | null>(null);
  const [reviewList, setReviewList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showSortModal, setShowSortModal] = useState(false);
  const [sortMode, setSortMode] = useState("timestamp_desc"); // Default sort mode

  // Fetch station info + sorted review list
  const fetchStationAndReviews = async (sort = sortMode) => {
    try {
      setLoading(true);

      // Fetch station info
      const stationRef = doc(db, "chargingStations", id as string);
      const stationSnap = await getDoc(stationRef);
      if (stationSnap.exists()) {
        setStation(stationSnap.data() as Station);
      }

      // Determine sorting
      let orderField = "timestamp";
      let direction: "asc" | "desc" = "desc";

      if (sort === "timestamp_asc") direction = "asc";
      if (sort === "rating_desc") {
        orderField = "rating";
        direction = "desc";
      }
      if (sort === "rating_asc") {
        orderField = "rating";
        direction = "asc";
      }

      // Query Firestore reviews for this station
      const q = query(
        collection(db, "reviews"),
        where("stationId", "==", id),
        orderBy(orderField, direction)
      );

      const querySnap = await getDocs(q);

      // Enrich each review with the user's profile image
      const reviewsWithPhotos = await Promise.all(
        querySnap.docs.map(async (docSnap) => {
          const reviewData = docSnap.data();
          let profileImageUrl = null;

          try {
            const userRef = doc(db, "users", reviewData.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              profileImageUrl = userSnap.data()?.profileImageUrl || null;
            }
          } catch (error) {
            console.warn("Error fetching user photo", error);
          }

          return {
            id: docSnap.id,
            ...reviewData,
            profileImageUrl,
          };
        })
      );

      setReviewList(reviewsWithPhotos);
    } catch (err) {
      console.error("Failed to load station or reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchStationAndReviews();
  }, [id]);

  // Triggered when a sort option is selected
  const handleSortChange = (option: string) => {
    setSortMode(option);
    setShowSortModal(false);
    fetchStationAndReviews(option);
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  if (!station) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Station not found.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Logo banner */}
      <TouchableOpacity
        style={styles.bannerContainer}
        onPress={() => router.push("/home")}
      >
        <Image
          source={require("../../assets/images/chargeTrackerLogo.png")}
          style={styles.bannerImage}
        />
      </TouchableOpacity>

      <ScrollView style={styles.detailsContainer}>
        {/* Station header details */}
        <View style={styles.header}>
          <Text style={styles.stationName}>{station.stationName}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{station.rating?.toFixed(1) || "N/A"}</Text>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.reviews}>({station.reviews ?? 0})</Text>
          </View>
          <Text style={styles.status}>
            {station.openNow ? "Open Now" : "Closed"}
          </Text>
          <Text style={styles.availability}>
            ⚡ {station.availableDocks} of {station.totalDocks} Docks Available
          </Text>
          <Text style={styles.distance}>Type: {station.chargerTypes?.join(", ")}</Text>
        </View>

        {/* Station action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.checkInButton]}
            onPress={() => router.push(`/location/checkIn?id=${id}`)}
          >
            <Text style={styles.actionButtonText}>Check In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (station?.coordinates?.latitude && station?.coordinates?.longitude) {
                const lat = station.coordinates.latitude;
                const lng = station.coordinates.longitude;
                const label = encodeURIComponent(station.stationName);
                const url = Platform.select({
                  ios: `http://maps.apple.com/?daddr=${lat},${lng}&q=${label}`,
                  android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
                });

                if (url) Linking.openURL(url);
              } else {
                Alert.alert("Error", "Station coordinates not available.");
              }
            }}
          >
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>
        </View>

        {/* Tab navigation */}
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => router.push(`/location/chargingLocation?id=${id}`)}>
            <Text style={styles.tab}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.tab, styles.activeTab]}>Reviews</Text>
          </TouchableOpacity>
        </View>

        {/* Sort and Add Review controls */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.sortButton} onPress={() => setShowSortModal(true)}>
            <Text style={styles.actionButtonText}>Sort By</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.checkInButton]}
            onPress={() => router.push(`/location/postReview?id=${id}`)}
          >
            <Text style={styles.actionButtonText}>Add Review</Text>
          </TouchableOpacity>
        </View>

        {/* Display Reviews */}
        {reviewList.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#aaa", marginTop: 30 }}>
            No reviews yet.
          </Text>
        ) : (
          reviewList.map((review) => (
            <View key={review.id} style={styles.reviewContainer}>
              <View style={styles.reviewHeader}>
                <Image
                  source={{
                    uri:
                      review.profileImageUrl ||
                      "https://img.icons8.com/color/96/user-male-circle--v1.png",
                  }}
                  style={styles.profilePicture}
                />
                <View>
                  <Text style={styles.username}>{review.userName}</Text>
                  <Text style={styles.ratingText}>
                    {`⭐`.repeat(review.rating)} •{" "}
                    {formatDistanceToNow(new Date(review.timestamp?.seconds * 1000), {
                      addSuffix: true,
                    })}
                  </Text>
                </View>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
              {review.chargerTypeUsed && (
                <Text style={styles.metaText}>Charger Used: {review.chargerTypeUsed}</Text>
              )}
              {review.waitTime && (
                <Text style={styles.metaText}>Wait Time: {review.waitTime}</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Sort Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={showSortModal}
        onRequestClose={() => setShowSortModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowSortModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort Reviews</Text>
            {[
              { label: "Newest First", value: "timestamp_desc" },
              { label: "Oldest First", value: "timestamp_asc" },
              { label: "Highest Rating", value: "rating_desc" },
              { label: "Lowest Rating", value: "rating_asc" },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalOption}
                onPress={() => handleSortChange(option.value)}
              >
                <Text style={styles.modalOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalOption: {
    paddingVertical: 12,
  },
  modalOptionText: {
    fontSize: 16,
    color: "#007BFF",
  },
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
  container: { flex: 1, backgroundColor: "#fff" },
  detailsContainer: { flex: 1, padding: 15 },
  header: { marginBottom: 15 },
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
  sortButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#6c757d",
  },
  reviewContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profilePicture: {
    width: 45,
    height: 45,
    borderRadius: 22,
    marginRight: 10,
    backgroundColor: "#ddd",
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  ratingText: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  reviewText: {
    fontSize: 15,
    color: "#444",
    marginTop: 8,
    lineHeight: 20,
  },
  metaText: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },
});

export default ReviewsScreen;
