import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import {router} from "expo-router";


const AddReview = () => {
  const [isExpanded1, setIsExpanded1] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  const [isFavourited1, setIsFavourited1] = useState(false);
  const [isFavourited2, setIsFavourited2] = useState(false);

  const toggleExpanded1 = () => setIsExpanded1((prevState) => !prevState);
  const toggleFavorite1 = () => setIsFavourited1((prevState) => !prevState);

  const toggleExpanded2 = () => setIsExpanded2((prevState) => !prevState);
  const toggleFavorite2 = () => setIsFavourited2((prevState) => !prevState);

  return (
      <View style={styles.container}>
        {/* Action Buttons: Check In, Directions, Call */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.checkInButton}>
            <Text style={styles.checkInButtonText}>Check In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.blueButton}>
            <Text style={styles.blueButtonText}>Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.blueButton}>
            <Text style={styles.blueButtonText}>Call</Text>
          </TouchableOpacity>
        </View>

        {/* Categories: Overview, Check In, Reviews */}
        <View style={styles.sectionLabelsContainer}>
          <Text style={[styles.sectionLabel, styles.fadedLabel]}>Overview</Text>
          <Text style={[styles.sectionLabel, styles.fadedLabel]}>Check In</Text>
          <View>
            <Text style={styles.reviewsLabel}>Reviews</Text>
            <View style={styles.reviewsUnderline} />
          </View>
        </View>

        {/* Button Row */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortButtonText}>Sort By</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton}
                            onPress={() => router.push("/postReview")}>

            <Text style={styles.addButtonText}>Add Review</Text>

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
                ? "Unfortunately, it looks as though this destination charger has been configured for Tesla-only as it doesn't work with a Polestar 2. The number on this listing is incorrect as..."
                : "Unfortunately, it looks as though this destination charger has been configured for Tesla-only as it doesn't work with a Polestar 2. The number on this listing is incorrect as I tried to call and I couldn't get through."}
          </Text>
          <TouchableOpacity onPress={toggleExpanded1}>
            <Text style={styles.moreText}>
              {isExpanded1 ? "See less" : "More"}
            </Text>
          </TouchableOpacity>
          <View style={styles.reactionContainer}>
            <TouchableOpacity onPress={toggleFavorite1} style={styles.actionButton}>
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
                : "The charger location is fantastic! It's easy to find and situated in a convenient spot with plenty of parking. Charging was faster than expected, and the nearby amenities made the experience even better. Only downside was the wait due to a single charger, but overall a great spot I'd recommend!\n"}
          </Text>
          <TouchableOpacity onPress={toggleExpanded2}>
            <Text style={styles.moreText}>
              {isExpanded2 ? "See less" : "More"}
            </Text>
          </TouchableOpacity>
          <View style={styles.reactionContainer}>
            <TouchableOpacity onPress={toggleFavorite2} style={styles.actionButton}>
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
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "70%",
    alignSelf: "center",
  },
  checkInButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  blueButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  checkInButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  blueButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  sectionLabelsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
    width: "80%",
  },
  sectionLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "normal",
    paddingHorizontal: 5,
  },
  fadedLabel: {
    opacity: 0.5, // Lower opacity for inactive labels (Overview, Check In)
  },
  reviewsLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333", // Higher contrast for active label (Reviews)
    alignSelf: "center",
  },
  reviewsUnderline: {
    height: 3,
    width: 50,
    backgroundColor: "#007bff",
    marginTop: 5,
    alignSelf: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  sortButton: {
    backgroundColor: "#6c757d",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginRight: 10,
  },
  sortButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  reviewContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    width: "90%",
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
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  rating: {
    fontSize: 14,
    color: "#ff9500",
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },
  moreText: {
    fontSize: 14,
    color: "#007bff",
    textDecorationLine: "underline",
    marginTop: 5,
  },
  reactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  heartIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  actionButton: {
    marginHorizontal: 5,
  },
});

export default AddReview;