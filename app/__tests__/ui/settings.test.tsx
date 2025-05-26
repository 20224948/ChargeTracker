import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SettingsScreen from "../../settings";

// Jest mocks for Firebase and router
jest.mock("firebase/app", () => ({ initializeApp: jest.fn() }));
jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(),
    updatePassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn((auth, callback) => {
        callback({ uid: "user123", email: "test@example.com" });
        return () => {};
    }),
}));
jest.mock("firebase/firestore", () => ({
    getFirestore: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(() =>
        Promise.resolve({
            exists: () => true,
            data: () => ({
                fullName: "Mock Name",
                vehicleType: "MockCar",
                chargerType: "CCS",
                profileImageUrl: null,
            }),
        })
    ),
    updateDoc: jest.fn(),
}));
jest.mock("firebase/storage", () => ({
    getStorage: jest.fn(),
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn(() => Promise.resolve("https://mockimage.com")),
}));
jest.mock("../../../firebase", () => ({
    auth: {},
    db: {},
    storage: {},
}));
jest.mock("expo-router", () => ({
    useRouter: () => ({ replace: jest.fn() }),
}));

// Test suite for SettingsScreen
describe("SettingsScreen UI", () => {
    it("renders visible labels and buttons", async () => {
        const { getByText } = render(<SettingsScreen />);

        await waitFor(() => {
            expect(getByText("Full Name:")).toBeTruthy();
            expect(getByText("Email:")).toBeTruthy();
            expect(getByText("Password:")).toBeTruthy();
            expect(getByText("Vehicle Type:")).toBeTruthy();
            expect(getByText("Charger Type:")).toBeTruthy();
        });

        expect(getByText("Save Changes")).toBeTruthy();
        expect(getByText("Logout")).toBeTruthy();
        expect(getByText("Change Password")).toBeTruthy();
    });

    it("opens and closes password modal", async () => {
        const { getByText, queryByPlaceholderText } = render(<SettingsScreen />);

        fireEvent.press(getByText("Change Password"));

        await waitFor(() => {
            expect(queryByPlaceholderText("New Password")).toBeTruthy();
            expect(queryByPlaceholderText("Confirm Password")).toBeTruthy();
        });

        fireEvent.press(getByText("Cancel"));

        await waitFor(() => {
            expect(queryByPlaceholderText("New Password")).toBeNull();
            expect(queryByPlaceholderText("Confirm Password")).toBeNull();
        });
    });

    it("displays Firebase mock user values", async () => {
        const { getByDisplayValue } = render(<SettingsScreen />);

        await waitFor(() => {
            expect(getByDisplayValue("Mock Name")).toBeTruthy();
            expect(getByDisplayValue("test@example.com")).toBeTruthy();
            expect(getByDisplayValue("MockCar")).toBeTruthy();
        });
    });
});
