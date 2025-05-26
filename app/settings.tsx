import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useRouter } from "expo-router";
import { auth, db, storage } from "../firebase";
import { onAuthStateChanged, updatePassword, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Settings = () => {
  const router = useRouter();

  // User data
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [chargerType, setChargerType] = useState("Type 2");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load authenticated user and their profile data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setEmail(user.email || "");
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFullName(data.fullName || "");
          setVehicle(data.vehicleType || "");
          setChargerType(data.chargerType || "Type 2");
          setProfileImage(data.profileImageUrl || null);
        }
      } else {
        // Redirect to login if user not authenticated
        router.replace("/login");
      }
    });

    return unsubscribe;
  }, []);

  // Save profile updates to Firestore
  const handleSaveChanges = async () => {
    if (!userId) return;
    try {
      await updateDoc(doc(db, "users", userId), {
        fullName,
        email,
        vehicleType: vehicle,
        chargerType,
      });
      Alert.alert("Saved", "Your profile has been updated.", [
        {
          text: "OK",
          onPress: () => router.replace("/home"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Could not update profile.");
    }
  };

  // Update password through Firebase Auth
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match.");
    }

    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        Alert.alert("Success", "Password updated successfully.");
        setShowPasswordModal(false);
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not update password.");
    }
  };

  // Logout and return to login screen
  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  // Upload a compressed JPEG image to Firebase Storage
  const uploadImageAsync = async (imageUri: string): Promise<string | null> => {
    try {
      const manipulated = await ImageManipulator.manipulateAsync(imageUri, [], {
        compress: 0.9,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      const response = await fetch(manipulated.uri);
      const fileBlob = await response.blob();

      const filePath = `profileImages/${userId}/profile.jpg`;
      const storageRef = ref(storage, filePath);
      const metadata = { contentType: "image/jpeg" };

      await uploadBytes(storageRef, fileBlob, metadata);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error: any) {
      Alert.alert("Upload Error", error.message || "Upload failed.");
      return null;
    }
  };

  // Pick an image from the device gallery and upload
  const handleSelectProfileImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && userId) {
      const downloadUrl = await uploadImageAsync(result.assets[0].uri);
      if (downloadUrl) {
        setProfileImage(downloadUrl);
        await updateDoc(doc(db, "users", userId), {
          profileImageUrl: downloadUrl,
        });
      }
    }
  };

  // Take a new photo using device camera and upload
  const handleCaptureProfileImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && userId) {
      const downloadUrl = await uploadImageAsync(result.assets[0].uri);
      if (downloadUrl) {
        setProfileImage(downloadUrl);
        await updateDoc(doc(db, "users", userId), {
          profileImageUrl: downloadUrl,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <TouchableOpacity style={styles.bannerContainer} onPress={() => router.replace("/home")}>
        <Image source={require("../assets/images/chargeTrackerLogo.png")} style={styles.bannerImage} />
      </TouchableOpacity>

      {/* Scrollable Form Content */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.settingsHeader}>Settings</Text>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity>
              <Text style={[styles.tab, styles.activeTab]}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/about")}>
              <Text style={styles.tab}>About</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}

            <TouchableOpacity style={styles.profileButton} onPress={handleSelectProfileImage}>
              <Text style={styles.uploadButtonText}>Upload Picture</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileButton} onPress={handleCaptureProfileImage}>
              <Text style={styles.uploadButtonText}>Take Picture</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.row}>
              <Text style={styles.label}>Full Name:</Text>
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <TextInput style={styles.input} value={email} editable={false} />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Password:</Text>
              <Text style={styles.passwordValue}>************</Text>
              <TouchableOpacity
                style={styles.passwordButtonInline}
                onPress={() => setShowPasswordModal(true)}
              >
                <Text style={styles.passwordButtonText}>Change Password</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Vehicle Type:</Text>
              <TextInput style={styles.input} value={vehicle} onChangeText={setVehicle} />
            </View>

            {/* Charger Type Selection */}
            <Text style={styles.sectionLabel}>Charger Type:</Text>
            <View style={styles.radioContainer}>
              {["CCS", "CHAdeMO", "Type 2"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.radioOption}
                  onPress={() => setChargerType(type)}
                >
                  <View style={[styles.radioCircle, chargerType === type && styles.radioCircleSelected]} />
                  <Text style={styles.radioLabel}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Save & Logout Buttons */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: "#dc3545", marginTop: 10 }]}
              onPress={handleLogout}
            >
              <Text style={styles.saveButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Password Change Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={showPasswordModal}
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              placeholder="New Password"
              secureTextEntry
              style={styles.modalInput}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              style={styles.modalInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handlePasswordChange}>
              <Text style={styles.saveButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
              <Text style={{ color: "red", marginTop: 10, textAlign: "center" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 40 },
  bannerContainer: {
    width: "100%",
    backgroundColor: "#0F81c7",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingBottom: 10,
  },
  bannerImage: { width: "100%", height: 180, resizeMode: "contain" },
  settingsHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
    paddingHorizontal: 20,
    color: "#333",
  },
  profileImageContainer: { alignItems: "center", marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  placeholderImage: {
    width: 100,
    height: 100,
    backgroundColor: "#ddd",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  placeholderText: { color: "#888" },
  profileButton: {
    backgroundColor: "#007BFF",
    width: 160,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 8,
    alignItems: "center",
  },
  uploadButtonText: { color: "#fff", fontWeight: "bold" },
  form: { paddingHorizontal: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    flexWrap: "wrap",
  },
  label: {
    width: 110,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#007BFF",
    paddingVertical: 4,
    backgroundColor: "transparent",
  },
  passwordValue: {
    flex: 1,
    fontSize: 16,
    color: "#007BFF",
  },
  passwordButtonInline: {
    backgroundColor: "#007BFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  passwordButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  sectionLabel: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 10,
    color: "#333",
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#007BFF",
    marginRight: 6,
  },
  radioCircleSelected: {
    backgroundColor: "#007BFF",
  },
  radioLabel: {
    fontSize: 14,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "stretch",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
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
});

export default Settings;

