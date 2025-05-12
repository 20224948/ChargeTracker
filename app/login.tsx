import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import * as Google from "expo-auth-session/providers/google";

const LoginScreen = () => {
  const router = useRouter();

  // Basic email/password login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Modal toggles
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  // Forgot password email field
  const [resetEmail, setResetEmail] = useState("");

  // Sign-up modal fields
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupName, setSignupName] = useState("");

  // Google Auth request setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com", // Replace with real client ID
  });

  // Effect to handle successful Google Sign-In response
  useEffect(() => {
    const handleGoogleSignIn = async () => {
      if (response?.type === "success" && response.authentication?.idToken) {
        const credential = GoogleAuthProvider.credential(response.authentication.idToken);
        try {
          const result = await signInWithCredential(auth, credential);
          const user = result.user;

          // Create or update user in Firestore
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            fullName: user.displayName || "",
            email: user.email,
            createdAt: serverTimestamp(),
          }, { merge: true });

          router.replace("/settings");
        } catch (err: any) {
          Alert.alert("Google Sign-In Error", err.message);
        }
      }
    };

    handleGoogleSignIn();
  }, [response]);

  // Handles login with email/password
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user profile exists in Firestore
      const userSnap = await getDoc(doc(db, "users", user.uid));
      router.replace(userSnap.exists() ? "/home" : "/settings");
    } catch (err: any) {
      Alert.alert("Login Error", err.message);
    }
  };

  // Handles sign-up form submission
  const handleSignup = async () => {
    if (signupPassword !== signupConfirm) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        fullName: signupName,
        email: signupEmail,
        createdAt: serverTimestamp(),
      });
      router.replace("/settings");
    } catch (err: any) {
      Alert.alert("Signup Error", err.message);
    }
  };

  // Sends password reset email
  const handleForgotPassword = async () => {
    if (!resetEmail) {
      Alert.alert("Missing Email", "Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      Alert.alert("Reset Email Sent", "Check your inbox to reset your password.");
      setShowForgotModal(false);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <>
      {/* Top banner/logo */}
      <View style={styles.bannerContainer}>
        <Image
          source={require("../assets/images/chargeTrackerLogo.png")}
          style={styles.bannerImage}
        />
      </View>

      <SafeAreaView style={styles.container}>
        {/* App title */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeLine}>Welcome to</Text>
          <Text style={styles.welcomeLine}>Charge Tracker</Text>
        </View>

        {/* Login form */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Forgot password link */}
        <TouchableOpacity onPress={() => setShowForgotModal(true)}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign-in button */}
        <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
          <Text style={styles.signInButtonText}>SIGN IN</Text>
        </TouchableOpacity>

        {/* Sign-up link */}
        <Text style={styles.createAccountText}>
          Don’t have an account?{" "}
          <Text style={styles.createAccountLink} onPress={() => setShowSignupModal(true)}>
            Create an account
          </Text>
        </Text>

        <Text style={styles.orText}>Or</Text>

        {/* Google login button */}
        <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
          <Image
            source={{ uri: "https://img.icons8.com/color/48/000000/google-logo.png" }}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>CONTINUE WITH GOOGLE</Text>
        </TouchableOpacity>

        {/* Forgot Password Modal */}
        <Modal visible={showForgotModal} animationType="slide" transparent>
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
              <TouchableOpacity style={styles.sendLinkButton} onPress={handleForgotPassword}>
                <Text style={styles.sendLinkText}>Send Reset Link</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowForgotModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Sign-Up Modal */}
        <Modal visible={showSignupModal} animationType="slide" transparent>
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
              <TouchableOpacity style={styles.sendLinkButton} onPress={handleSignup}>
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
