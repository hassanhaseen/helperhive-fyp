import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = ({ navigation, activeTab }) => {
  const { colors, isDarkMode } = useContext(ThemeContext);

  const tabs = [
    { name: "HomePage", label: "Home", icon: "home-outline" },
    { name: "Bookings", label: "Bookings", icon: "file-tray-full-outline" },
    { name: "Inbox", label: "Inbox", icon: "chatbox-ellipses-outline" },
    { name: "Profile", label: "Profile", icon: "person-outline" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            onPress={() => navigation.navigate(tab.name)}
          >
            <Icon
              name={tab.icon}
              size={24}
              color={isActive ? colors.primary : "#aaa"}
              style={isActive ? styles.activeIcon : styles.inactiveIcon}
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive ? colors.primary : "#aaa",
                  fontWeight: isActive ? "bold" : "normal",
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -1 },
    shadowRadius: 4,
    borderTopWidth: 1,
    borderColor: "#e6e6e6",
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIcon: {
    transform: [{ scale: 1.1 }],
  },
  inactiveIcon: {
    transform: [{ scale: 1 }],
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
export default Navbar;
