import React, { useState } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker"; // Date Picker
import CountryPicker from "react-native-country-picker-modal"; // Country Picker
import * as ImagePicker from "expo-image-picker"; // Image Picker

const FillProfilePage = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [countryCode, setCountryCode] = useState("US");
  const [callingCode, setCallingCode] = useState("+1");
  const [name, setName] = useState("Andrew Ainsley");
  const [lastName, setLastName] = useState("Andrew");
  const [email, setEmail] = useState("andrew_ainsley@yourdomain.com");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("267 New Avenue Park, New York");
  const [cnicNumber, setCnicNumber] = useState("");
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  // Handle Date Picker
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  // Handle Image Selection
  const pickImage = async (setImage) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImage(result.uri);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#111" barStyle="light-content" />
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fill Your Profile</Text>
          <View style={{ width: 24 }} /> {/* Empty view for alignment */}
        </View>

        {/* Profile Image */}
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: profileImage || "https://via.placeholder.com/100",
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

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <View style={styles.inputField}>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              style={styles.inputText}
            />
          </View>
          <View style={styles.inputField}>
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#999"
              value={lastName}
              onChangeText={setLastName}
              style={styles.inputText}
            />
          </View>
          {/* Date Picker */}
          <View style={styles.inputField}>
            <TextInput
              placeholder="Date of Birth"
              placeholderTextColor="#999"
              value={date.toLocaleDateString()}
              editable={false}
              style={styles.inputText}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Icon name="calendar-outline" size={20} color="#8b5cf6" />
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeDate}
            />
          )}
          {/* Email */}
          <View style={styles.inputField}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              style={styles.inputText}
            />
            <Icon name="mail-outline" size={20} color="#8b5cf6" />
          </View>
          {/* Phone with Country Picker */}
          <View style={styles.inputField}>
            <CountryPicker
              countryCode={countryCode}
              withCallingCode
              withFlag
              onSelect={(country) => {
                setCountryCode(country.cca2);
                setCallingCode(country.callingCode[0]);
              }}
              containerButtonStyle={styles.countryPicker}
            />
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              style={styles.inputText}
              keyboardType="phone-pad"
            />
          </View>
          {/* Address */}
          <View style={styles.inputField}>
            <TextInput
              placeholder="Address"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
              style={styles.inputText}
            />
            <Icon name="location-outline" size={20} color="#8b5cf6" />
          </View>
          {/* CNIC Number */}
          <View style={styles.inputField}>
            <TextInput
              placeholder="CNIC Number"
              placeholderTextColor="#999"
              value={cnicNumber}
              onChangeText={setCnicNumber}
              style={styles.inputText}
              keyboardType="numeric"
            />
          </View>
          {/* CNIC Front Picture */}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickImage(setCnicFront)}
          >
            <Text style={styles.uploadText}>
              {cnicFront ? "CNIC Front Uploaded" : "Upload CNIC Front"}
            </Text>
          </TouchableOpacity>
          {/* CNIC Back Picture */}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickImage(setCnicBack)}
          >
            <Text style={styles.uploadText}>
              {cnicBack ? "CNIC Back Uploaded" : "Upload CNIC Back"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FillProfilePage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#111",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: "#fff",
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
    backgroundColor: "#333",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#8b5cf6",
    borderRadius: 15,
    padding: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#333",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputText: {
    flex: 1,
    color: "#fff",
    paddingVertical: 10,
  },
  countryPicker: {
    marginRight: 10,
  },
  uploadButton: {
    backgroundColor: "#333",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  uploadText: {
    color: "#8b5cf6",
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: "#8b5cf6",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
