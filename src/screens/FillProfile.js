import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ThemeContext } from "../context/ThemeContext";
import Toast from 'react-native-toast-message';

const FillProfilePage = ({ navigation }) => {
  const { colors, isDarkMode } = useContext(ThemeContext);

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
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");
  const [showModal, setShowModal] = useState(false);

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
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "You need to allow gallery access."
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      Toast.show({
        type: "success",
        text1: "Image Uploaded"
      });
    }
  };

  const formatDOBInput = (input) => {
    const cleaned = input.replace(/[^\d]/g, "");
    let formatted = "";
    if (cleaned.length <= 2) {
      formatted = cleaned;
    } else if (cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    } else {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)}`;
    }
    setDateOfBirth(formatted);
  };

  const formatCNICInput = (input) => {
    const cleaned = input.replace(/[^\d]/g, "");
    let formatted = "";
    if (cleaned.length <= 5) {
      formatted = cleaned;
    } else if (cleaned.length <= 12) {
      formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    } else {
      formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12, 13)}`;
    }
    setCnicNumber(formatted);
  };

  const validateDate = (dob) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)\d\d$/;
    return regex.test(dob);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    if (!name || !email || !cnicNumber || !phone || !experience || !address || !city || !dateOfBirth) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill all required fields."
      });
      return false;
    }

    if (!validateEmail(email)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address."
      });
      return false;
    }

    if (!profileImage || !cnicFront || !cnicBack) {
      Toast.show({
        type: "error",
        text1: "Missing Images",
        text2: "Please upload Profile, CNIC Front and CNIC Back images."
      });
      return false;
    }

    if (!validateDate(dateOfBirth)) {
      Toast.show({
        type: "error",
        text1: "Invalid Date",
        text2: "Enter Date of Birth in DD-MM-YYYY format."
      });
      return false;
    }

    if (cnicNumber.length !== 15) {
      Toast.show({
        type: "error",
        text1: "Invalid CNIC",
        text2: "Enter a valid CNIC number (XXXXX-XXXXXXX-X)."
      });
      return false;
    }

    return true;
  };

  const saveProfileData = async () => {
    if (!validateForm()) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Toast.show({
        type: "error",
        text1: "User not logged in"
      });
      return;
    }

    if (requestStatus === "Pending") {
      Toast.show({
        type: "info",
        text1: "Request Pending",
        text2: "You already have a pending request."
      });
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
        dateOfBirth,
        cnicNumber,
        cnicFront,
        cnicBack,
        profileImage,
        isServiceProvider: false,
        requestStatus: "Pending",
        updatedAt: new Date(),
      });

      Toast.show({
        type: "success",
        text1: "Request Submitted",
        text2: "Pending Admin Approval!"
      });

      setShowModal(true);

    } catch (error) {
      console.error("Error saving profile:", error);
      Toast.show({
        type: "error",
        text1: "Submission Failed",
        text2: "Try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar backgroundColor={colors.background} barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Become a Service Provider</Text>

          {/* Profile Image */}
          <TouchableOpacity style={styles.profileContainer} onPress={() => pickImage(setProfileImage)}>
            <Image
              source={{
                uri: profileImage || "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
              }}
              style={styles.profileImage}
            />
            <View style={styles.editIconContainer}>
              <Icon name="camera-outline" size={18} color="#fff" />
            </View>
          </TouchableOpacity>

          <View style={styles.form}>
            {/* Form Inputs */}
            {[
              { value: name, setter: setName, placeholder: "Full Name*", keyboardType: "default" },
              { value: email, setter: setEmail, placeholder: "Email*", keyboardType: "email-address" },
              { value: phone, setter: setPhone, placeholder: "Phone Number*", keyboardType: "phone-pad" },
              { value: experience, setter: setExperience, placeholder: "Experience (Years)*", keyboardType: "numeric" },
              { value: address, setter: setAddress, placeholder: "Address*", keyboardType: "default" },
              { value: city, setter: setCity, placeholder: "City*", keyboardType: "default" },
            ].map((field, index) => (
              <TextInput
                key={index}
                placeholder={field.placeholder}
                placeholderTextColor={colors.placeholder || (isDarkMode ? "#888" : "#888")}
                value={field.value}
                onChangeText={field.setter}
                keyboardType={field.keyboardType}
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }
                ]}
              />
            ))}

            {/* CNIC */}
            <TextInput
              placeholder="CNIC Number (XXXXX-XXXXXXX-X)*"
              placeholderTextColor={colors.placeholder || (isDarkMode ? "#888" : "#888")}
              value={cnicNumber}
              onChangeText={formatCNICInput}
              keyboardType="numeric"
              maxLength={15}
              style={[
                styles.input,
                { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }
              ]}
            />

            {/* Date of Birth */}
            <TextInput
              placeholder="Date of Birth (DD-MM-YYYY)*"
              placeholderTextColor={colors.placeholder || (isDarkMode ? "#888" : "#888")}
              value={dateOfBirth}
              onChangeText={formatDOBInput}
              keyboardType="numeric"
              maxLength={10}
              style={[
                styles.input,
                { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }
              ]}
            />

            {/* CNIC Upload Buttons */}
            <TouchableOpacity
              style={[styles.uploadButton, { backgroundColor: colors.primary }]}
              onPress={() => pickImage(setCnicFront)}
            >
              <Text style={styles.uploadText}>{cnicFront ? "CNIC Front Uploaded ✅" : "Upload CNIC Front"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uploadButton, { backgroundColor: colors.primary }]}
              onPress={() => pickImage(setCnicBack)}
            >
              <Text style={styles.uploadText}>{cnicBack ? "CNIC Back Uploaded ✅" : "Upload CNIC Back"}</Text>
            </TouchableOpacity>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={saveProfileData}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Submit Request</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Success Modal */}
        <Modal visible={showModal} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <Icon name="checkmark-circle-outline" size={60} color={colors.primary} />
              <Text style={[styles.modalText, { color: colors.text }]}>
                Your request has been submitted successfully!
              </Text>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setShowModal(false);
                  navigation.navigate("Profile");
                }}
              >
                <Text style={styles.modalButtonText}>Go to Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
};

export default FillProfilePage;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ccc",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 5,
    right: 10,
    backgroundColor: "#4a90e2",
    padding: 5,
    borderRadius: 15,
  },
  form: {
    marginTop: 10,
  },
  input: {
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 14,
    borderWidth: 1,
  },
  uploadButton: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "500",
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 15,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
