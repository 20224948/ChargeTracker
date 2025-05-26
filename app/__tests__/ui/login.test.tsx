import React from "react";
import { render } from "@testing-library/react-native";
import LoginScreen from "../../login";

// Jest mocks for Firebase and router
jest.mock("firebase/app", () => ({ initializeApp: jest.fn() }));
jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    onAuthStateChanged: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    addDoc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    doc: jest.fn(),
}));
jest.mock("firebase/storage", () => ({
    getStorage: jest.fn(),
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn(),
}));
jest.mock("../../../firebase", () => ({
    auth: {},
    db: {},
    storage: {},
}));
jest.mock("expo-router", () => ({
    useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("expo-auth-session/providers/google", () => ({
    useAuthRequest: () => [
        {}, // request
        {}, // response
        jest.fn(), // promptAsync
    ],
}));

// Test suite for LoginScreen
describe("LoginScreen UI", () => {
    it("renders email and password input fields", () => {
        const { getByPlaceholderText, getByText } = render(<LoginScreen />);
        expect(getByPlaceholderText("Email")).toBeTruthy();
        expect(getByPlaceholderText("Password")).toBeTruthy();
        expect(getByText("SIGN IN")).toBeTruthy();
    });
});
