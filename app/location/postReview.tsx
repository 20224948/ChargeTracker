import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {router, useRouter} from "expo-router";

const PostReview = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [chargeStatus, setChargeStatus] = useState<string | null>(null);
  const [selectedPlug, setSelectedPlug] = useState<string | null>(null);
  const [waitTime, setWaitTime] = useState<string | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
      <TouchableOpacity key={star} onPress={() => setRating(star)}>
        <Text style={[styles.star, rating >= star && styles.selectedStar]}>★</Text>
      </TouchableOpacity>
    ));
  };

  const handlePostReview = () => {
    console.log("Review Submitted");
    console.log({ rating, comment, chargeStatus, selectedPlug, waitTime });
    setReviewSubmitted(true);
  };

  return (

      <ScrollView style={styles.container}>
        {/* Top Banner Image */}
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

      {/* Charging Station Info */}
      <View style={styles.header}>
        <Text style={styles.stationName}>Belmont EV Charging Station</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.rating}>4.9</Text>
          <Text style={styles.starText}>⭐</Text>
          <Text style={styles.reviewCount}>(309)</Text>
        </View>
        <Text style={styles.status}>Open 24 Hours</Text>
        <Text style={styles.availability}>
          ⚡ Chargers Available @ $0.64 AUD per kWh
        </Text>
        <Text style={styles.distance}>Distance: 3km</Text>
      </View>

      {/* Rating Stars */}
      <View style={styles.starContainer}>{renderStars()}</View>

      {/* Comment Box */}
      <TextInput
        style={styles.commentInput}
        placeholder="Choose a star rating first, then add a review."
        multiline
        numberOfLines={4}
        value={comment}
        onChangeText={setComment}
      />

      {/* Charge Status */}
      <Text style={styles.sectionLabel}>Did you charge successfully?</Text>
      <View style={styles.chargeOptions}>
        <TouchableOpacity
          style={[
            styles.chargeButton,
            chargeStatus === "success" && styles.chargeSelected,
          ]}
          onPress={() => setChargeStatus("success")}
        >
          <Text
            style={[
              styles.chargeButtonText,
              chargeStatus === "success" && styles.chargeTextSelected,
            ]}
          >
            Successful Charge
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.chargeButton,
            chargeStatus === "fail" && styles.chargeSelected,
          ]}
          onPress={() => setChargeStatus("fail")}
        >
          <Text
            style={[
              styles.chargeButtonText,
              chargeStatus === "fail" && styles.chargeTextSelected,
            ]}
          >
            Unable to Charge
          </Text>
        </TouchableOpacity>
      </View>

      {/* Plug Type */}
      {chargeStatus && (
        <>
          <Text style={styles.sectionLabel}>Which plug did you use?</Text>
          <View style={styles.plugContainer}>
            {["Type 1", "Type 2", "Type 3", "Type 4"].map((plug) => (
              <TouchableOpacity
                key={plug}
                style={[
                  styles.plugButton,
                  selectedPlug === plug && styles.plugSelected,
                ]}
                onPress={() => setSelectedPlug(plug)}
              >
                <Text
                  style={[
                    styles.plugButtonText,
                    selectedPlug === plug && styles.plugTextSelected,
                  ]}
                >
                  {plug}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Wait Time + Post Button */}
      {selectedPlug && (
        <>
          <Text style={styles.sectionLabel}>
            How long did you wait for a charger to become available?
          </Text>
          <View style={styles.waitTimeContainer}>
            {["No Wait", "Up to 10 min", "10-20 min", "20+ min"].map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.waitTimeButton,
                  waitTime === time && styles.waitTimeSelected,
                ]}
                onPress={() => setWaitTime(time)}
              >
                <Text
                  style={[
                    styles.waitTimeText,
                    waitTime === time && styles.waitTimeTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.postReviewButton}
            onPress={handlePostReview}
          >
            <Text style={styles.postReviewButtonText}>Post Review</Text>
          </TouchableOpacity>
        </>
      )}

      {reviewSubmitted && (
        <Text style={styles.thankYou}>Thank you for your review!</Text>
      )}
    </ScrollView>
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
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 200, resizeMode: "cover" },
  header: { padding: 15 },
  stationName: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 5 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  rating: { fontSize: 16, fontWeight: "bold", color: "#333" },
  starText: { fontSize: 16, color: "#FFD700", marginHorizontal: 5 },
  reviewCount: { fontSize: 14, color: "#555" },
  status: { fontSize: 14, color: "#007BFF", marginBottom: 5 },
  availability: { fontSize: 14, fontWeight: "bold", color: "green", marginBottom: 5 },
  distance: { fontSize: 14, color: "#555", marginBottom: 15 },

  starContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 10 },
  star: { fontSize: 36, color: "#ccc", marginHorizontal: 5 },
  selectedStar: { color: "#f1c40f" },

  commentInput: {
    height: 100,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    marginBottom: 20,
  },

  sectionLabel: {
    paddingHorizontal: 15,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },

  chargeOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  chargeButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#f4f4f4",
  },
  chargeSelected: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  chargeButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  chargeTextSelected: {
    color: "#fff",
  },

  plugContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  plugButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#f4f4f4",
    marginBottom: 10,
  },
  plugSelected: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  plugButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  plugTextSelected: {
    color: "#fff",
  },

  waitTimeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  waitTimeButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 5,
    backgroundColor: "#f4f4f4",
  },
  waitTimeSelected: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  waitTimeText: {
    color: "#333",
    fontWeight: "bold",
  },
  waitTimeTextSelected: {
    color: "#fff",
  },

  postReviewButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  postReviewButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  thankYou: {
    textAlign: "center",
    color: "#28a745",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 20,
  },
});

export default PostReview;
