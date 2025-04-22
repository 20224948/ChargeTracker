import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

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
    <>
      {/* Logo Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={require("../assets/chargeTrackerLogo.png")}
          style={styles.bannerImage}
        />
      </View>

      <SafeAreaView style={styles.container}>
        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeLine}>Welcome to</Text>
          <Text style={styles.welcomeLine}>Charge Tracker</Text>
        </View>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
        />

        {/* Forgot Password */}
        <TouchableOpacity onPress={() => setShowForgotModal(true)}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => {
            console.log("Signed in!");
            router.replace("/home");
          }}
        >
          <Text style={styles.signInButtonText}>SIGN IN</Text>
        </TouchableOpacity>

        {/* Create Account */}
        <Text style={styles.createAccountText}>
          Don’t have an account?{" "}
          <Text
            style={styles.createAccountLink}
            onPress={() => setShowSignupModal(true)}
          >
            Create an account
          </Text>
        </Text>

        <Text style={styles.orText}>Or</Text>

        {/* Google Sign-In */}
        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={{
              uri: "https://img.icons8.com/color/48/000000/google-logo.png",
            }}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>CONTINUE WITH GOOGLE</Text>
        </TouchableOpacity>

        {/* Forgot Password Modal */}
        <Modal
          visible={showForgotModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowForgotModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Reset Your Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                value={resetEmail}
                onChangeText={setResetEmail}
                keyboardType="email-address"
              />
              <TouchableOpacity
                style={styles.sendLinkButton}
                onPress={() => {
                  console.log("Reset link sent to:", resetEmail);
                  setShowForgotModal(false);
                }}
              >
                <Text style={styles.sendLinkText}>Send Reset Link</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowForgotModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Sign Up Modal */}
        <Modal
          visible={showSignupModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowSignupModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create an Account</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#aaa"
                value={signupName}
                onChangeText={setSignupName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={signupEmail}
                onChangeText={setSignupEmail}
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={signupPassword}
                onChangeText={setSignupPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={signupConfirm}
                onChangeText={setSignupConfirm}
              />
              <TouchableOpacity
                style={styles.sendLinkButton}
                onPress={() => {
                  console.log("Sign up submitted for:", signupEmail);
                  setShowSignupModal(false);
                }}
              >
                <Text style={styles.sendLinkText}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowSignupModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  welcomeContainer: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  welcomeLine: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
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
    marginBottom: 15,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4285F4",
    borderRadius: 8,
    height: 50,
    width: "100%",
    marginBottom: 20,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
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
