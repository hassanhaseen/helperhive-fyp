import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Navbar from "./navbar"; // Import Navbar for bottom navigation

const ProfilePage = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#111" barStyle="light-content" />
      <View style={styles.container}>
        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header Section */}
          <View style={styles.header}>
            <Icon name="logo-laravel" size={30} color="#8b5cf6" />
            <Text style={styles.headerTitle}>Profile</Text>
            <Icon name="ellipsis-horizontal-outline" size={24} color="#fff" />
          </View>

          {/* Profile Picture and Info */}
          <View style={styles.profileContainer}>
            <View>
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.profileImage}
              />
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate("FillProfile")}
              >
                <Icon name="pencil-outline" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>Andrew Ainsley</Text>
            <Text style={styles.profileEmail}>andrew_ainsley@yourdomain.com</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {/* Settings Options */}
            {[
              {
                name: "Edit Profile",
                icon: "person-outline",
                route: "FillProfile", // Navigate to FillProfile screen
              },
              { name: "Notification", icon: "notifications-outline" },
              { name: "Payment", icon: "wallet-outline" },
              { name: "Security", icon: "shield-outline" },
            ].map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionRow}
                onPress={() => {
                  if (option.route) {
                    navigation.navigate(option.route);
                  }
                }}
              >
                <View style={styles.optionLeft}>
                  <Icon name={option.icon} size={24} color="#fff" />
                  <Text style={styles.optionText}>{option.name}</Text>
                </View>
                <Icon name="chevron-forward-outline" size={20} color="#fff" />
              </TouchableOpacity>
            ))}

            {/* Language Option */}
            <TouchableOpacity style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Icon name="settings-outline" size={24} color="#fff" />
                <Text style={styles.optionText}>Language</Text>
              </View>
              <Text style={styles.languageText}>English (US)</Text>
            </TouchableOpacity>

            {/* Dark Mode Toggle */}
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Icon name="moon-outline" size={24} color="#fff" />
                <Text style={styles.optionText}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={(value) => setDarkMode(value)}
                thumbColor={darkMode ? "#8b5cf6" : "#fff"}
                trackColor={{ false: "#333", true: "#8b5cf6" }}
              />
            </View>

            {/* Privacy, Help, Invite Options */}
            {[
              { name: "Privacy Policy", icon: "lock-closed-outline" },
              { name: "Help Center", icon: "information-circle-outline" },
              { name: "Invite Friends", icon: "people-outline" },
            ].map((option, index) => (
              <TouchableOpacity key={index} style={styles.optionRow}>
                <View style={styles.optionLeft}>
                  <Icon name={option.icon} size={24} color="#fff" />
                  <Text style={styles.optionText}>{option.name}</Text>
                </View>
                <Icon name="chevron-forward-outline" size={20} color="#fff" />
              </TouchableOpacity>
            ))}

            {/* Logout */}
            <TouchableOpacity style={styles.logoutRow}>
              <View style={styles.optionLeft}>
                <Icon name="log-out-outline" size={24} color="#f87171" />
                <Text style={[styles.optionText, { color: "#f87171" }]}>
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Navbar */}
        <Navbar navigation={navigation} activeTab="Profile" />
      </View>
    </SafeAreaView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111",
  },
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  scrollContent: {
    paddingHorizontal: 20,
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
    marginBottom: 10,
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#8b5cf6",
    borderRadius: 15,
    padding: 5,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: "#888",
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 15,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 10,
  },
  languageText: {
    fontSize: 16,
    color: "#888",
  },
});
