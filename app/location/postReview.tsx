import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { auth, db } from "../../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  increment,
} from "firebase/firestore";

const PostReview = () => {
  const { id: stationId } = useLocalSearchParams();
  const [station, setStation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedPlug, setSelectedPlug] = useState<string | null>(null);
  const [waitTime, setWaitTime] = useState<string | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const ref = doc(db, "chargingStations", stationId as string);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setStation(snap.data());
        }
      } catch (err) {
        console.error("Error fetching station:", err);
      } finally {
        setLoading(false);
      }
    };

    if (stationId) fetchStation();
  }, [stationId]);

  const renderStars = () =>
    Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
      <TouchableOpacity key={star} onPress={() => setRating(star)}>
        <Text style={[styles.star, rating >= star && styles.selectedStar]}>★</Text>
      </TouchableOpacity>
    ));

  const handlePostReview = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not signed in");

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userName = userSnap.data()?.fullName || "Anonymous";

      await addDoc(collection(db, "reviews"), {
        stationId,
        rating,
        text: comment,
        userId: user.uid,
        userName,
        timestamp: serverTimestamp(),
        chargerTypeUsed: selectedPlug,
        waitTime,
      });

      const stationRef = doc(db, "chargingStations", stationId as string);
      const stationSnap = await getDoc(stationRef);
      const prevRating = stationSnap.data()?.rating || 0;
      const prevCount = stationSnap.data()?.reviews || 0;

      const newCount = prevCount + 1;
      const newAvg = ((prevRating * prevCount) + rating) / newCount;

      await updateDoc(stationRef, {
        rating: parseFloat(newAvg.toFixed(2)),
        reviews: increment(1),
      });

      Alert.alert("Review Posted", "Thank you for your feedback!", [
        {
          text: "OK",
          onPress: () => router.replace(`/location/reviews?id=${stationId}`),
        },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message);
      console.error(err.message);
    }
  };

  const handleCancel = () => {
    router.replace(`/location/reviews?id=${stationId}`);
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Top Banner */}
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

      {/* Station Info */}
      <View style={styles.header}>
        <Text style={styles.stationName}>{station?.stationName || "Station"}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.rating}>{station?.rating?.toFixed(1) || "N/A"}</Text>
          <Text style={styles.starText}>⭐</Text>
          <Text style={styles.reviewCount}>({station?.reviews ?? 0})</Text>
        </View>
        <Text style={styles.availability}>
          ⚡ {station.availableDocks} of {station.totalDocks} Docks Available
        </Text>
        <Text style={styles.distance}>Type: {station.chargerTypes?.join(", ")}</Text>
      </View>

      {/* Rating */}
      <View style={styles.starContainer}>{renderStars()}</View>

      {/* Review Input */}
      <TextInput
        style={styles.commentInput}
        placeholder="Choose a star rating first, then add a review."
        multiline
        numberOfLines={4}
        value={comment}
        onChangeText={setComment}
      />

      {/* Plug Type */}
      <Text style={styles.sectionLabel}>Which plug did you use?</Text>
      <View style={styles.plugContainer}>
        {station?.chargerTypes?.map((plug: string) => (
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

      {/* Wait Time */}
      <Text style={styles.sectionLabel}>How long did you wait?</Text>
      <View style={styles.waitTimeContainer}>
        {["No Wait", "1-10 min", "10-20 min", "20+ min"].map((time) => (
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

      {/* Submit & Cancel Buttons */}
      <TouchableOpacity style={styles.postReviewButton} onPress={handlePostReview}>
        <Text style={styles.postReviewButtonText}>Post Review</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>

      {reviewSubmitted && (
        <Text style={styles.thankYou}>Thank you for your review!</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  header: { padding: 15 },
  stationName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  rating: { fontSize: 16, fontWeight: "bold", color: "#333" },
  starText: { fontSize: 16, color: "#FFD700", marginHorizontal: 5 },
  reviewCount: { fontSize: 14, color: "#555" },
  status: { fontSize: 14, color: "#007BFF", marginBottom: 5 },
  availability: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
    marginBottom: 5,
  },
  distance: { fontSize: 14, color: "#555", marginBottom: 15 },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  star: {
    fontSize: 36,
    color: "#ccc",
    marginHorizontal: 5,
  },
  selectedStar: {
    color: "#f1c40f",
  },
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
  plugContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  plugButton: {
    flexBasis: "30%",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    backgroundColor: "#f4f4f4",
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
    flexBasis: "45%",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
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
    marginBottom: 10,
  },
  postReviewButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  cancelButtonText: {
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
