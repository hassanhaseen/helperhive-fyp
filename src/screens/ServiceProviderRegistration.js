import React, { useState, useEffect } from "react";
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
import { Picker } from "@react-native-picker/picker";
import { auth, db } from "../firebase";
import { collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";

const ServiceProviderForm = ({ navigation }) => {
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [availability, setAvailability] = useState("");
  const [city, setCity] = useState(""); // State for City
  const [isCityEditable, setIsCityEditable] = useState(true); // State to control city dropdown
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Cleaning",
    "Repairing",
    "Painting",
    "Laundry",
    "Appliance",
    "Plumbing",
    "Shifting",
    "Beauty",
    "AC Repair",
    "Vehicle",
    "Electronics",
    "Massage",
  ];

  const availabilityOptions = [
    "Weekdays Only",
    "Weekends Only",
    "Full Week",
    "Custom Schedule",
  ];

  const cities = [
    "Lahore",
    "Faisalabad",
    "Islamabad",
    "Karachi",
    "Rawalpindi",
    "Peshawar",
    "Multan",
    "Quetta",
    "Sialkot",
    "Gujranwala",
  ];

  useEffect(() => {
    if (!auth.currentUser) {
      Alert.alert("Error", "You must be logged in to register a service.");
      navigation.navigate("SignIn");
      return;
    }

    // Fetch the previously selected city for the user
    const fetchUserCity = async () => {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.city) {
            setCity(userData.city); // Pre-select the previously chosen city
            setIsCityEditable(false); // Disable city selection for subsequent submissions
          }
        }
      } catch (error) {
        console.error("Error fetching user city:", error);
      }
    };

    fetchUserCity();
  }, []);

  const handleSubmit = async () => {
    if (!auth.currentUser) return;

    // Validate required fields
    if (!serviceName || !category || !description || !priceRange || !availability || !city) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (parseInt(priceRange) < 500 || parseInt(priceRange) > 10000) {
      Alert.alert("Error", "Price must be between 500 and 10000.");
      return;
    }

    if (description.split(" ").length < 10) {
      Alert.alert("Error", "Description must be at least 10 words long.");
      return;
    }

    const userId = auth.currentUser.uid;
    setIsSubmitting(true);

    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : {};

      // Add the new service request with status set to "Pending"
      await addDoc(collection(db, "services"), {
        userId,
        serviceName,
        category,
        description,
        priceRange,
        availability,
        city, // Include the selected city
        createdAt: new Date(),
        status: "Pending",
      });

      // Save the city in the user's document if not already saved
      if (!userData.city) {
        await setDoc(
          userRef,
          { city }, // Save the selected city
          { merge: true }
        );
      }

      // If user is not yet a provider, update their requestStatus
      if (!userData.isServiceProvider) {
        await setDoc(userRef, { requestStatus: "Pending" }, { merge: true });
      }

      Alert.alert("Success", "Your service request has been submitted and is pending approval!");
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Error submitting service:", error);
      Alert.alert("Error", "Could not submit service. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Register Your Service</Text>

        <TextInput
          placeholder="Service Name"
          value={serviceName}
          onChangeText={setServiceName}
          style={styles.input}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
            dropdownIconColor="#fff"
            mode="dropdown"
          >
            <Picker.Item label="Select a Category" value="" />
            {categories.map((cat, index) => (
              <Picker.Item key={index} label={cat} value={cat} />
            ))}
          </Picker>
        </View>

        <TextInput
          placeholder="Price Range (500 - 10000)"
          value={priceRange}
          onChangeText={(value) => {
            if (/^\d*$/.test(value)) {
              setPriceRange(value);
            }
          }}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Description (At least 10 words)"
          value={description}
          onChangeText={setDescription}
          style={styles.textArea}
          multiline
          numberOfLines={5}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={availability}
            onValueChange={(itemValue) => setAvailability(itemValue)}
            style={styles.picker}
            dropdownIconColor="#fff"
            mode="dropdown"
          >
            <Picker.Item label="Select Availability" value="" />
            {availabilityOptions.map((option, index) => (
              <Picker.Item key={index} label={option} value={option} />
            ))}
          </Picker>
        </View>

        {/* City Dropdown */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={city}
            onValueChange={(itemValue) => setCity(itemValue)}
            style={styles.picker}
            dropdownIconColor="#fff"
            mode="dropdown"
            enabled={isCityEditable} // Enable only for the first-time selection
          >
            <Picker.Item label="Select a City" value="" />
            {cities.map((cityName, index) => (
              <Picker.Item key={index} label={cityName} value={cityName} />
            ))}
          </Picker>
        </View>
        {city && <Text style={styles.alreadySelectedText}>Already Selected: {city}</Text>}

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
  safeArea: { flex: 1, backgroundColor: "#005bea" },
  container: { flex: 1, backgroundColor: "#005bea", padding: 20 },
  title: { color: "#fff", fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  input: { backgroundColor: "#e6e9ee", borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16 },
  pickerContainer: { backgroundColor: "#4a90e2", borderRadius: 10, marginBottom: 15, overflow: "hidden", paddingHorizontal: 10 },
  picker: { color: "#fff", padding: 15 },
  textArea: { backgroundColor: "#e6e9ee", borderRadius: 10, padding: 15, marginBottom: 15, textAlignVertical: "top", fontSize: 16 },
  submitButton: { backgroundColor: "#4a90e2", padding: 15, borderRadius: 10, marginTop: 20, alignItems: "center" },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  disabledButton: { backgroundColor: "#777" },
  alreadySelectedText: { color: "#fff", fontSize: 14, marginTop: 5, textAlign: "center" },
});
