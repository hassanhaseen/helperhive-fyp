import React, { useState, useContext } from "react";
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
  ActivityIndicator,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import Navbar from "./navbar";

import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";

import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const ProfilePage = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext(UserContext);
  const { isDarkMode, toggleDarkMode, colors } = useContext(ThemeContext);

  const [userData, setUserData] = useState(null);
  const [isServiceProvider, setIsServiceProvider] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        if (auth.currentUser) {
          try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              const userInfo = userDoc.data();
              setUserData(userInfo);
              setUser((prev) => ({ ...prev, ...userInfo }));
              setIsServiceProvider(!!userInfo.isServiceProvider);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            Toast.show({
              type: "error",
              text1: "Error loading profile",
              text2: error.message || "An error occurred",
            });
          } finally {
            setLoading(false);
          }
        }
      };

      fetchUserData();
    }, [])
  );

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        Toast.show({ type: "success", text1: "Logged out successfully" });
        navigation.navigate("SignIn");
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: "Logout failed",
          text2: error.message,
        });
      });
  };

  const handleUploadProfileImage = () => {
    Toast.show({
      type: "info",
      text1: "Coming Soon!",
      text2: "Profile image upload not implemented yet.",
    });
  };

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loaderText, { color: colors.text }]}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Header */}
        <View style={styles.headerWrapper}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleUploadProfileImage}>
              <Image
                source={{
                  uri:
                    userData?.profileImage ||
                    "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
                }}
                style={styles.profileImage}
              />
              <View style={styles.editIconWrapper}>
                <Icon name="camera-outline" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {userData?.name || "Guest User"}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.text }]}>
              {userData?.email || "No email"}
            </Text>
          </View>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {/* Become Service Provider */}
          {!isServiceProvider && userData?.requestStatus !== "Pending" && (
            <OptionItem
              icon="briefcase-outline"
              text="Become a Service Provider"
              onPress={() => navigation.navigate("FillProfile")}
              color={colors.primary}
              textColor={colors.text}
              cardColor={colors.card}
            />
          )}

          {/* Privacy Policy */}
          <OptionItem
            icon="lock-closed-outline"
            text="Privacy Policy"
            onPress={() => navigation.navigate("PrivacyPolicyPage")}
            color={colors.primary}
            textColor={colors.text}
            cardColor={colors.card}
          />

          {/* Help Center */}
          <OptionItem
            icon="help-circle-outline"
            text="Help Center"
            onPress={() => navigation.navigate("HelpCenterPage")}
            color={colors.primary}
            textColor={colors.text}
            cardColor={colors.card}
          />

          {/* Language */}
          <OptionItem
            icon="language-outline"
            text="Language"
            rightLabel="English (US)"
            onPress={() => Toast.show({ text1: "Coming Soon!" })}
            color={colors.primary}
            textColor={colors.text}
            cardColor={colors.card}
          />

          {/* Dark Mode */}
          <View style={[styles.optionRow, { backgroundColor: colors.card }]}>
            <View style={styles.leftRow}>
              <Icon name="moon-outline" size={24} color={colors.primary} />
              <Text style={[styles.optionText, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbColor={isDarkMode ? "#fff" : "#fff"}
              trackColor={{
                false: "#bbb",
                true: colors.primary,
              }}
            />
          </View>

          {/* Logout */}
          <TouchableOpacity
            style={[styles.optionRow, { backgroundColor: colors.card }]}
            onPress={handleLogout}
          >
            <View style={styles.leftRow}>
              <Icon name="log-out-outline" size={24} color="#f87171" />
              <Text style={[styles.optionText, { color: "#f87171" }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Navbar navigation={navigation} activeTab="Profile" />
    </SafeAreaView>
  );
};

/**
 * Reusable Option Item component
 */
const OptionItem = ({
  icon,
  text,
  onPress,
  disabled,
  rightLabel,
  color,
  textColor,
  cardColor,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.optionRow,
        {
          backgroundColor: cardColor,
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      onPress={disabled ? null : onPress}
    >
      <View style={styles.leftRow}>
        <Icon name={icon} size={24} color={color} />
        <Text style={[styles.optionText, { color: textColor }]}>{text}</Text>
      </View>

      {rightLabel ? (
        <Text style={[styles.rightLabel, { color: textColor }]}>{rightLabel}</Text>
      ) : (
        <Icon name="chevron-forward-outline" size={20} color={color} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 100,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
  },
  headerWrapper: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerContent: {
    alignItems: "center",
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4a90e2",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  profileEmail: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  optionsContainer: {
    width: "90%",
    marginTop: 30,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  rightLabel: {
    fontSize: 14,
  },
});

export default ProfilePage;
