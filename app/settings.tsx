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
import { useRouter } from "expo-router";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  updatePassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const Settings = () => {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [chargerType, setChargerType] = useState("Type 2");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        }
      } else {
        router.replace("/login");
      }
    });

    return unsubscribe;
  }, []);

  const handleSaveChanges = async () => {
    if (!userId) return;

    try {
      await updateDoc(doc(db, "users", userId), {
        fullName,
        email,
        vehicleType: vehicle,
        chargerType,
      });

      Alert.alert("Saved", "Your profile has been updated.");
    } catch (error) {
      Alert.alert("Error", "Could not update profile.");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
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

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {/* Logo / Home */}
      <TouchableOpacity
        style={styles.bannerContainer}
        onPress={() => router.replace("/home")}
      >
        <Image
          source={require("../assets/images/chargeTrackerLogo.png")}
          style={styles.bannerImage}
        />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
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

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.row}>
              <Text style={styles.label}>Full Name:</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                value={email}
                editable={false}
              />
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
              <TextInput
                style={styles.input}
                value={vehicle}
                onChangeText={setVehicle}
              />
            </View>

            <Text style={styles.sectionLabel}>Charger Type:</Text>
            <View style={styles.radioContainer}>
              {["CCS", "CHAdeMO", "Type 2"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.radioOption}
                  onPress={() => setChargerType(type)}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      chargerType === type && styles.radioCircleSelected,
                    ]}
                  />
                  <Text style={styles.radioLabel}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveChanges}
            >
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

      {/* Password Modal */}
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
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handlePasswordChange}
            >
              <Text style={styles.saveButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
              <Text style={{ color: "red", marginTop: 10, textAlign: "center" }}>
                Cancel
              </Text>
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
  bannerImage: {
    width: "100%",
    height: 180,
    resizeMode: "contain",
  },
  settingsHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
    paddingHorizontal: 20,
    color: "#333",
  },
  form: {
    paddingHorizontal: 20,
  },
  sectionLabel: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 10,
    color: "#333",
  },
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
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    borderBottomWidth: 0,
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
