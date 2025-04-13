import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";

const PostReview = () => {
  const [rating, setRating] = useState<number>(0); // User-selected rating
  const [review, setReview] = useState<string>(""); // User's review text
  const [photos, setPhotos] = useState<{ uri: string }[]>([]); // Selected photos
  const [chargeStatus, setChargeStatus] = useState<string | null>(null); // Charge status (successful/unsuccessful)
  const [selectedPlug, setSelectedPlug] = useState<string | null>(null); // Plug type
  const [waitTime, setWaitTime] = useState<string | null>(null); // Wait time for charger
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false); // Review submission status

  // Handle star rating
  const handlePress = (star: number) => {
    setRating(star);
  };

  // Handle adding photos
  const handleAddPhoto = async () => {
    try {
      const options: ImagePicker.ImageLibraryOptions = {
        mediaType: "photo", // Only allow photo selection
        selectionLimit: 1, // Customize limit for selection count
      };
      const result = await ImagePicker.launchImageLibrary(options);

      // Process selected photo
      if (result.assets && result.assets.length > 0) {
        const selected = result.assets[0];
        setPhotos((prev) => [...prev, { uri: selected.uri || "" }]);
      } else {
        console.log("No photo selected or operation canceled.");
      }
    } catch (error) {
      console.error("Error selecting photo:", error);
    }
  };

  // Handle charge status selection
  const handleChargeStatus = (status: string) => {
    setChargeStatus(status);
  };

  // Handle plug selection
  const handlePlugSelection = (plug: string) => {
    setSelectedPlug(plug);
  };

  // Handle wait time selection
  const handleWaitTimeSelection = (time: string) => {
    setWaitTime(time);
  };

  // Handle review submission action
  const handlePostReview = () => {
    console.log("Review posted successfully!");
    console.log({ rating, review, photos, chargeStatus, selectedPlug, waitTime });
    setReviewSubmitted(true); // Set the review status to submitted
  };

  // Dynamically render stars for rating
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
        <TouchableOpacity key={star} onPress={() => handlePress(star)}>
          <Text style={[styles.star, rating >= star ? styles.selectedStar : null]}>
            ★
          </Text>
        </TouchableOpacity>
    ));
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>RATE CHARGING STATION</Text>

        {/* Star Rating */}
        <View style={styles.starsContainer}>{renderStars()}</View>

        {/* Conditional rendering for review input and photos */}
        {rating > 0 ? (
            <>
              {/* Review Input */}
              <TextInput
                  style={styles.reviewInput}
                  placeholder="Write your review here..."
                  placeholderTextColor="#aaa"
                  multiline
                  numberOfLines={4}
                  value={review}
                  onChangeText={(text) => setReview(text)}
              />

              {/* Add Photo Button */}
              <TouchableOpacity style={styles.mediaButton} onPress={handleAddPhoto}>
                <Text style={styles.mediaButtonText}>Add Photos</Text>
              </TouchableOpacity>

              {/* Display selected photos */}
              <View style={styles.mediaContainer}>
                {photos.map((item, index) => (
                    <Image
                        key={index}
                        source={{ uri: item.uri }}
                        style={styles.mediaImage}
                        resizeMode="cover"
                    />
                ))}
              </View>

              {/* Ask about charge status */}
              <Text style={styles.chargeQuestion}>Did you charge successfully?</Text>
              <View style={styles.chargeButtonsContainer}>
                <TouchableOpacity
                    style={[
                      styles.chargeButton,
                      chargeStatus === "success" && styles.chargeButtonSelected,
                    ]}
                    onPress={() => handleChargeStatus("success")}
                >
                  <Text
                      style={[
                        styles.chargeButtonText,
                        chargeStatus === "success" && styles.chargeButtonTextSelected,
                      ]}
                  >
                    Successful Charge
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                      styles.chargeButton,
                      chargeStatus === "failure" && styles.chargeButtonSelected,
                    ]}
                    onPress={() => handleChargeStatus("failure")}
                >
                  <Text
                      style={[
                        styles.chargeButtonText,
                        chargeStatus === "failure" && styles.chargeButtonTextSelected,
                      ]}
                  >
                    Unable to Charge
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Conditionally render plug type and wait time questions */}
              {chargeStatus && (
                  <>
                    {/* Plug Type */}
                    <Text style={styles.plugQuestion}>Which plug did you use?</Text>
                    <View style={styles.plugButtonsContainer}>
                      {["Type 1", "Type 2", "Type 3", "Type 4"].map((plug, index) => (
                          <TouchableOpacity
                              key={index}
                              style={[
                                styles.plugButton,
                                selectedPlug === plug && styles.plugButtonSelected,
                              ]}
                              onPress={() => handlePlugSelection(plug)}
                          >
                            <Text
                                style={[
                                  styles.plugButtonText,
                                  selectedPlug === plug && styles.plugButtonTextSelected,
                                ]}
                            >
                              {plug}
                            </Text>
                          </TouchableOpacity>
                      ))}
                    </View>

                    {/* Wait Time */}
                    {selectedPlug && (
                        <>
                          <Text style={styles.waitTimeQuestion}>
                            How long did you wait for a charger to become available?
                          </Text>
                          <View style={styles.waitTimeButtonsContainer}>
                            {["No Wait", "Up to 10 min", "10-20 min", "20+ min"].map(
                                (time, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                          styles.waitTimeButton,
                                          waitTime === time && styles.waitTimeButtonSelected,
                                        ]}
                                        onPress={() => handleWaitTimeSelection(time)}
                                    >
                                      <Text
                                          style={[
                                            styles.waitTimeButtonText,
                                            waitTime === time && styles.waitTimeButtonTextSelected,
                                          ]}
                                      >
                                        {time}
                                      </Text>
                                    </TouchableOpacity>
                                )
                            )}
                          </View>
                        </>
                    )}

                    {/* Post Review Button */}
                    {waitTime && !reviewSubmitted && (
                        <TouchableOpacity style={styles.postReviewButton} onPress={handlePostReview}>
                          <Text style={styles.postReviewButtonText}>Post Review</Text>
                        </TouchableOpacity>
                    )}
                  </>
              )}

              {/* Thank You Message */}
              {reviewSubmitted && (
                  <Text style={styles.thankYouMessage}>
                    Thank you for your review!
                  </Text>
              )}
            </>
        ) : (
            <Text style={styles.instructionText}>
              Please select a star rating to write a review
            </Text>
        )}
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    fontFamily: "Futura",

  },
  starsContainer: {
    flexDirection: "row",
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
  instructionText: {
    fontSize: 16,
    color: "#888",
    marginTop: 20,
    textAlign: "center",
  },
  reviewInput: {
    height: 100,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    fontSize: 16,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  mediaButton: {
    backgroundColor: "#007bff",
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  mediaButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  mediaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    width: "100%",
  },
  mediaImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  chargeQuestion: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
    textAlign: "center",
  },
  chargeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 10,
  },
  chargeButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  chargeButtonSelected: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  chargeButtonText: {
    color: "#555",
    fontWeight: "600",
  },
  chargeButtonTextSelected: {
    color: "#fff",
  },
  plugQuestion: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  plugButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 10,
  },
  plugButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  plugButtonSelected: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  plugButtonText: {
    color: "#555",
    fontWeight: "600",
  },
  plugButtonTextSelected: {
    color: "#fff",
  },
  waitTimeQuestion: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  waitTimeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 10,
  },
  waitTimeButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  waitTimeButtonSelected: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  waitTimeButtonText: {
    color: "#555",
    fontWeight: "600",
  },
  waitTimeButtonTextSelected: {
    color: "#fff",
  },
  postReviewButton: {
    backgroundColor: "#28a745",
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  postReviewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  thankYouMessage: {
    fontSize: 18,
    color: "#28a745",
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
});

export default PostReview;