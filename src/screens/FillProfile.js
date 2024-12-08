import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import CountryPicker from "react-native-country-picker-modal";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const FillProfilePage = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [countryCode, setCountryCode] = useState("US");
  const [callingCode, setCallingCode] = useState("+1");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cnicNumber, setCnicNumber] = useState("");
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setName(currentUser.displayName || "");
      setEmail(currentUser.email || "");
    }
  }, []);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const pickImage = async (setImage) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImage(result.uri);
  };

  const validateFields = () => {
    if (!name || !email || !cnicNumber) {
      Alert.alert("Validation Error", "Please fill all required fields.");
      return false;
    }
    return true;
  };

  const saveProfileData = async () => {
    if (!validateFields()) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "You must be signed in to save your profile.");
      return;
    }

    setLoading(true);
    const userId = currentUser.uid;

    try {
      await setDoc(doc(db, "users", userId), {
        name,
        lastName,
        email,
        phone,
        address,
        dateOfBirth: date.toISOString(),
        cnicNumber,
        cnicFront,
        cnicBack,
        profileImage,
        countryCode,
        callingCode,
        isServiceProvider: true,
        updatedAt: new Date(),
      });

      await setDoc(doc(db, "service_providers", userId), {
        userId,
        name,
        lastName,
        email,
        phone,
        address,
        cnicNumber,
        profileImage,
        countryCode,
        callingCode,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Your profile has been updated!");
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#005bea" barStyle="light-content" />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}></Text>
          </View>

          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: profileImage || "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => pickImage(setProfileImage)}
            >
              <Icon name="camera-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Full Name*"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#aaa"
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
            />
            <TouchableOpacity
              style={[styles.input, styles.datePicker]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {"Select Date of Birth"}
              </Text>
              <Icon name="calendar-outline" size={20} color="#4a90e2" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangeDate}
              />
            )}
            <TextInput
              placeholder="Email*"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            <View style={styles.rowInput}>              
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#aaa"
                value={phone}
                onChangeText={setPhone}
                style={[styles.input, styles.phoneInput]}
                keyboardType="phone-pad"
              />
            </View>
            <TextInput
              placeholder="Address"
              placeholderTextColor="#aaa"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
            />
            <TextInput
              placeholder="CNIC Number*"
              placeholderTextColor="#aaa"
              value={cnicNumber}
              onChangeText={setCnicNumber}
              style={styles.input}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickImage(setCnicFront)}
            >
              <Text style={styles.uploadText}>
                {cnicFront ? "CNIC Front Uploaded" : "Upload CNIC Front"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickImage(setCnicBack)}
            >
              <Text style={styles.uploadText}>
                {cnicBack ? "CNIC Back Uploaded" : "Upload CNIC Back"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveProfileData}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Save Profile</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FillProfilePage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#005bea",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: "#4a90e2",
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4a90e2",
    borderRadius: 15,
    padding: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#e6e9ee",
    color: "#333",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  rowInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneInput: {
    flex: 1,
  },  
  datePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    color: "#aaa",
  },
  uploadButton: {
    backgroundColor: "#4a90e2",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  uploadText: {
    color: "#fff",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#4a90e2",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
