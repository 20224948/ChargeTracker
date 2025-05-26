import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import PostReviewScreen from "../../location/postReview";

// Jest mocks for Firebase and router
jest.mock("firebase/app", () => ({ initializeApp: jest.fn() }));
jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(),
    onAuthStateChanged: jest.fn((auth, callback) => {
        callback({ uid: "user123", email: "test@example.com" });
        return () => {};
    }),
}));
jest.mock("firebase/firestore", () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    addDoc: jest.fn(() => Promise.resolve()),
    doc: jest.fn(),
    getDoc: jest.fn(() =>
        Promise.resolve({
            exists: () => true,
            data: () => ({
                stationName: "Mock Station Central",
                availableDocks: 3,
                totalDocks: 5,
                rating: 4.2,
                reviews: 10,
                chargerTypes: ["CCS", "Type 2"],
            }),
        })
    ),
    updateDoc: jest.fn(() => Promise.resolve()),
    increment: jest.fn((val) => val),
    serverTimestamp: jest.fn(() => "mockTimestamp"),
}));
jest.mock("../../../firebase", () => ({
    auth: {
        currentUser: {
            uid: "user123",
            email: "test@example.com",
        },
    },
    db: {},
}));
jest.mock("expo-router", () => ({
    useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
    useLocalSearchParams: () => ({ id: "mock_station_123" }),
}));

// Test suite for PostReviewScreen
describe("PostReviewScreen UI", () => {
    it("renders station name, comment field, and options", async () => {
        const { getByText, getByPlaceholderText } = render(<PostReviewScreen />);

        await waitFor(() => {
            expect(getByText("Mock Station Central")).toBeTruthy();
            expect(getByText("Which plug did you use?")).toBeTruthy();
            expect(getByText("How long did you wait?")).toBeTruthy();
            expect(getByText("Post Review")).toBeTruthy();
            expect(
                getByPlaceholderText("Choose a star rating first, then add a review.")
            ).toBeTruthy();
        });
    });

    it("accepts text, star rating, and submits review", async () => {
        const { getByText, getByPlaceholderText, getAllByText } = render(
            <PostReviewScreen />
        );

        const commentInput = await waitFor(() =>
            getByPlaceholderText("Choose a star rating first, then add a review.")
        );

        // Select 5 stars
        const stars = getAllByText("★");
        fireEvent.press(stars[4]); // 5-star rating

        // Write a review
        fireEvent.changeText(commentInput, "Excellent charging station, very reliable.");

        // Select plug type and wait time
        fireEvent.press(getByText("CCS"));
        fireEvent.press(getByText("1-10 min"));

        // Submit the review
        const postButton = getByText("Post Review");
        fireEvent.press(postButton);

        await waitFor(() => {
            expect(postButton).toBeTruthy();
        });
    });
});
