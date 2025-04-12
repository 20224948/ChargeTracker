import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const About = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>About</Text>
      <Text style={styles.developedBy}>
        Developed By: The Charge Tracker Team!
      </Text>
      <Text style={styles.teamMembers}>
        Peter Edwards, Mark Prado and Jamie Norton
      </Text>
      <Text style={styles.date}>Date: 5/04/2025</Text>
      <Text style={styles.version}>Charge Tracker Version: v0000.1</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  developedBy: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  teamMembers: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  date: {
    fontSize: 16,
    marginBottom: 10,
  },
  version: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default About;
