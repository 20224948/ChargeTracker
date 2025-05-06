import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

const AddReview = () => {
  const router = useRouter();
  const [isExpanded1, setIsExpanded1] = useState(false);
  const [isFavourited1, setIsFavourited1] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  const [isFavourited2, setIsFavourited2] = useState(false);

  return (
    <View style={styles.container}>
      {/* Top Banner Image */}
      <Image
        source={{ uri: "https://via.placeholder.com/400x200" }}
        style={styles.image}
      />

      {/* Scrollable Content */}
      <ScrollView style={styles.detailsContainer}>
        {/* Header */}
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

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.checkInButton]}
            onPress={() => router.push("/location/checkIn")}>
            <Text style={styles.actionButtonText}>Check In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs Section */}
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => router.push("/location/[locationId]")}>
            <Text style={styles.tab}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.tab, styles.activeTab]}>Reviews</Text>
          </TouchableOpacity>
        </View>

        {/* Sort/Add Row */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.actionButtonText}>Sort By</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.checkInButton]}
            onPress={() => router.push("/location/postReview")}
          >
            <Text style={styles.actionButtonText}>Add Review</Text>
          </TouchableOpacity>
        </View>

        {/* First Review */}
        <View style={styles.reviewContainer}>
          <View style={styles.reviewHeader}>
            <Image
              source={{ uri: "https://images.pexels.com/photos/4567833/pexels-photo-4567833.jpeg" }}
              style={styles.profilePicture}
            />
            <View>
              <Text style={styles.username}>Caitlin Peacock</Text>
              <Text style={styles.rating}>⭐ - 2 years ago</Text>
            </View>
          </View>
          <Text style={styles.reviewText}>
            {!isExpanded1
              ? "Unfortunately, this charger didn’t work with my car..."
              : "Unfortunately, it looks as though this destination charger has been configured for Tesla-only as it doesn't work with a Polestar 2. The number on this listing is incorrect as I tried to call and I couldn't get through."}
          </Text>
          <TouchableOpacity onPress={() => setIsExpanded1(!isExpanded1)}>
            <Text style={styles.moreText}>{isExpanded1 ? "See less" : "More"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsFavourited1(!isFavourited1)}>
            <Text
              style={[
                styles.heartIcon,
                { color: isFavourited1 ? "#ff4d4d" : "#808080" },
              ]}
            >
              ❤️
            </Text>
          </TouchableOpacity>
        </View>

        {/* Second Review */}
        <View style={styles.reviewContainer}>
          <View style={styles.reviewHeader}>
            <Image
              source={{ uri: "https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" }}
              style={styles.profilePicture}
            />
            <View>
              <Text style={styles.username}>Stuart Vasepuru</Text>
              <Text style={styles.rating}>⭐⭐⭐⭐ - 5 months ago</Text>
            </View>
          </View>
          <Text style={styles.reviewText}>
            {!isExpanded2
              ? "The charger location is fantastic! It's easy to find and situated in a convenient spot with plenty of parking. Charging was faster than..."
              : "The charger location is fantastic! It's easy to find and situated in a convenient spot with plenty of parking. Charging was faster than expected, and the nearby amenities made the experience even better. Only downside was the wait due to a single charger, but overall a great spot I'd recommend!"}
          </Text>
          <TouchableOpacity onPress={() => setIsExpanded2(!isExpanded2)}>
            <Text style={styles.moreText}>{isExpanded2 ? "See less" : "More"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsFavourited2(!isFavourited2)}>
            <Text
              style={[
                styles.heartIcon,
                { color: isFavourited2 ? "#ff4d4d" : "#808080" },
              ]}
            >
              ❤️
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 200, resizeMode: "cover" },
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
  rating: { fontSize: 16, fontWeight: "bold", color: "#333" },
  star: { fontSize: 16, color: "#FFD700", marginHorizontal: 5 },
  reviews: { fontSize: 14, color: "#555" },
  status: { fontSize: 14, color: "#007BFF", marginBottom: 5 },
  availability: { fontSize: 14, fontWeight: "bold", color: "green", marginBottom: 5 },
  distance: { fontSize: 14, color: "#555", marginBottom: 15 },
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
  checkInButton: { backgroundColor: "#28a745" },
  actionButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tab: { fontSize: 16, color: "#555", paddingBottom: 5 },
  activeTab: {
    color: "#007BFF",
    borderBottomWidth: 2,
    borderBottomColor: "#007BFF",
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
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "#ddd",
  },
  username: { fontSize: 16, fontWeight: "600", color: "#333" },
  reviewText: { fontSize: 14, color: "#555", lineHeight: 20 },
  moreText: { fontSize: 14, color: "#007BFF", marginTop: 5 },
  heartIcon: { fontSize: 20, marginTop: 10 },
  sortButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#6c757d",
  },
  addButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#28a745",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default AddReview;