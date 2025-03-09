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
  StatusBar,
  Image,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const FillProfilePage = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cnicNumber, setCnicNumber] = useState("");
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [experience, setExperience] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setName(currentUser.displayName || "");
      setEmail(currentUser.email || "");
      checkExistingRequest(currentUser.uid);
    }
  }, []);

  const checkExistingRequest = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setRequestStatus(userSnap.data().requestStatus);
      }
    } catch (error) {
      console.error("Error checking request status:", error);
    }
  };

  const pickImage = async (setImage) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need to allow access to your gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDateOfBirth(selectedDate);
  };

  const saveProfileData = async () => {
    if (!name || !email || !cnicNumber || !phone || !experience || !address || !city || !country || !dateOfBirth) {
      Alert.alert("Validation Error", "Please fill all required fields.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "You must be signed in to save your profile.");
      return;
    }

    if (requestStatus === "Pending") {
      Alert.alert("Error", "You already have a pending request.");
      return;
    }

    setLoading(true);
    const userId = currentUser.uid;

    try {
      
      await setDoc(doc(db, "users", userId), {
        name,
        email,
        phone,
        address,
        //dateOfBirth: date.toISOString(),
        cnicNumber,
        cnicFront,
        cnicBack,
        profileImage,
        isServiceProvider: false, // Require admin approval
        requestStatus: "Pending",
        updatedAt: new Date(),
      });

      Alert.alert("Success", "Your request has been submitted and is pending admin approval!");
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#005bea" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Become a Service Provider</Text>

        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={() => pickImage(setProfileImage)}>
            <Image source={{ uri: profileImage || "https://cdn-icons-png.flaticon.com/512/9187/9187604.png" }} style={styles.profileImage} />
          </TouchableOpacity>
        </View>

        <TextInput placeholder="Full Name*" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Email*" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
        <TextInput placeholder="Phone Number*" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
        <TextInput placeholder="CNIC Number*" value={cnicNumber} onChangeText={setCnicNumber} style={styles.input} keyboardType="numeric" />

        <TouchableOpacity style={[styles.input, styles.datePicker]} onPress={() => setShowDatePicker(true)}>
          <Text>{dateOfBirth.toDateString()}</Text>
          <Icon name="calendar-outline" size={20} color="#4a90e2" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker value={dateOfBirth} mode="date" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={onChangeDate} />
        )}

        <TextInput placeholder="Experience (Years)*" value={experience} onChangeText={setExperience} style={styles.input} keyboardType="numeric" />
        <TextInput placeholder="Address*" value={address} onChangeText={setAddress} style={styles.input} />
        <TextInput placeholder="City*" value={city} onChangeText={setCity} style={styles.input} />
        <TextInput placeholder="Country*" value={country} onChangeText={setCountry} style={styles.input} />

        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setCnicFront)}>
          <Text style={styles.uploadText}>{cnicFront ? "CNIC Front Uploaded ✅" : "Upload CNIC Front"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setCnicBack)}>
          <Text style={styles.uploadText}>{cnicBack ? "CNIC Back Uploaded ✅" : "Upload CNIC Back"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={saveProfileData} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Submit Request</Text>}
        </TouchableOpacity>
      </ScrollView>
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
