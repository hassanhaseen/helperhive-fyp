import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { auth, db } from "../firebase";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

const ServiceProviderForm = ({ navigation }) => {
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [availability, setAvailability] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "You must be logged in to register a service.");
      return;
    }

    if (!serviceName || !category || !description || !priceRange || !availability) {
      Alert.alert("Error", "All fields are required. Please complete the form.");
      return;
    }

    const userId = auth.currentUser.uid;
    setIsSubmitting(true);

    try {
      const servicesRef = collection(db, "services");
      await addDoc(servicesRef, {
        userId,
        serviceName,
        category,
        description,
        priceRange,
        availability,
        createdAt: new Date(),
      });

      const userRef = doc(db, "users", userId);
      await setDoc(
        userRef,
        { isServiceProvider: true },
        { merge: true }
      );

      Alert.alert("Success", "Your service has been uploaded successfully!");
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Error uploading service:", error);
      Alert.alert("Error", "Failed to upload service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Register Your Service</Text>

        <Text style={styles.subtitle}>
          Fill in the details below to register your service and reach more customers.
        </Text>

        <TextInput
          placeholder="Service Name"
          value={serviceName}
          onChangeText={setServiceName}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Category (e.g., Cleaning, Plumbing)"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.textArea}
          multiline
          numberOfLines={5}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Price Range (e.g., $10-$50)"
          value={priceRange}
          onChangeText={setPriceRange}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Availability (e.g., Weekdays 9AM-5PM)"
          value={availability}
          onChangeText={setAvailability}
          style={styles.input}
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceProviderForm;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#005bea",
  },
  container: {
    flex: 1,
    backgroundColor: "#005bea",
    padding: 20,
    paddingTop: 40, // Add gap on top of the screen
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#f0f0f0",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#e6e9ee",
    color: "#333",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: "#e6e9ee",
    color: "#333",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    textAlignVertical: "top",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#777",
  },
});
