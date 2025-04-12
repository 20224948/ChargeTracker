import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";

const LoginScreen = () => {
  const router = useRouter();

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupName, setSignupName] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <Text style={styles.title}>INDEX for Charge Tracker</Text>

      {/* ➕ Navigation Button (example use of router.push) */}
      {/* LOGIN BUTTON */}
      <TouchableOpacity
        style={[styles.signInButton, { backgroundColor: "#6c757d" }]}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.signInButtonText}>Screen 1 - Login</Text>
      </TouchableOpacity>

      {/* ➕ Navigation Button (example use of router.push) */}
      {/* SETTINGS BUTTON */}
      <TouchableOpacity
        style={[styles.signInButton, { backgroundColor: "#6c757d" }]}
        onPress={() => router.push("/settings")}
      >
        <Text style={styles.signInButtonText}>Screen 2 - Settings</Text>
      </TouchableOpacity>

      {/* ➕ Navigation Button (example use of router.push) */}
      {/* ABOUT BUTTON */}
      <TouchableOpacity
        style={[styles.signInButton, { backgroundColor: "#6c757d" }]}
        onPress={() => router.push("/about")}
      >
        <Text style={styles.signInButtonText}>Screen 3 - About</Text>
      </TouchableOpacity>

      {/* ➕ Navigation Button (example use of router.push) */}
      {/* HOME SCREEN BUTTON */}
      <TouchableOpacity
        style={[styles.signInButton, { backgroundColor: "#6c757d" }]}
        onPress={() => router.push("/home")}
      >
        <Text style={styles.signInButtonText}>Screen 4 & 5 - Home Screen</Text>
      </TouchableOpacity>

      {/* ➕ Navigation Button (example use of router.push) */}
      {/* CHARGING LOCATION BUTTON */}
      <TouchableOpacity
        style={[styles.signInButton, { backgroundColor: "#6c757d" }]}
        onPress={() => router.push("/chargingLocation")}
      >
        <Text style={styles.signInButtonText}>
          Screen 6 - Charging Location
        </Text>
      </TouchableOpacity>

      {/* ➕ Navigation Button (example use of router.push) */}
      {/* CheckIn BUTTON */}
      <TouchableOpacity
        style={[styles.signInButton, { backgroundColor: "#6c757d" }]}
        onPress={() => router.push("/checkIn")}
      >
        <Text style={styles.signInButtonText}>Screen 7 - Check-In</Text>
      </TouchableOpacity>

      {/* ➕ Navigation Button (example use of router.push) */}
      {/* ADD REVIEW BUTTON */}
      <TouchableOpacity
        style={[styles.signInButton, { backgroundColor: "#6c757d" }]}
        onPress={() => router.push("/addReview")}
      >
        <Text style={styles.signInButtonText}>Screen 8 - Add Review</Text>
      </TouchableOpacity>

      {/* ➕ Navigation Button (example use of router.push) */}
      {/* POST REVIEW BUTTON */}
      <TouchableOpacity
        style={[styles.signInButton, { backgroundColor: "#6c757d" }]}
        onPress={() => router.push("/postReview")}
      >
        <Text style={styles.signInButtonText}>
          Screen 9 - Posting Review (Page 1 & 2)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#007BFF",
    marginBottom: 20,
  },
  signInButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#28a745",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  createAccountText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  createAccountLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  orText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  socialButton: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  googleButton: {
    borderColor: "#4285F4",
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  sendLinkButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sendLinkText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelText: {
    marginTop: 15,
    color: "red",
    fontWeight: "600",
  },
});

export default LoginScreen;
