import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Alert,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

const Settings = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("user@example.com");
  const [vehicle, setVehicle] = useState("Tesla Model 3");
  const [chargerType, setChargerType] = useState("Type 1");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveChanges = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    Alert.alert("Saved", "Your changes have been saved.");
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    Alert.alert("Password Updated", "Your password has been changed.");
    setShowPasswordModal(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <View style={styles.container}>
      {/* Banner Logo */}
      <TouchableOpacity
        style={styles.bannerContainer}
        activeOpacity={0.7}
        onPress={() => router.push("/home")}
      >
        <Image
          source={require("../assets/chargeTrackerLogo.png")}
          style={styles.bannerImage}
        />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.settingsHeader}>Settings</Text>

          {/* NAVIGATION: Settings | About */}
          <View style={styles.tabs}>
            <TouchableOpacity onPress={() => router.push("/settings")}>
              <Text style={[styles.tab, styles.activeTab]}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/about")}>
              <Text style={styles.tab}>About</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.row}>
              <Text style={styles.label}>First Name:</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Last Name:</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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

            <Text style={[styles.sectionLabel]}>Charger Type:</Text>
            <View style={styles.radioContainer}>
              {["Type 1", "Type 2", "Type 3", "Type 4"].map((type) => (
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

            <View style={styles.row}>
              <Text style={styles.label}>Notifications:</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveChanges}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal: Change Password */}
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
              <Text
                style={{ color: "red", marginTop: 10, textAlign: "center" }}
              >
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
