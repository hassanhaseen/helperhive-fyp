import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Navbar = ({ navigation, activeTab }) => {
  const tabs = [
    { name: "HomePage", icon: "home", route: "HomePage" },
    { name: "Bookings", icon: "document-text-outline", route: "Bookings" },
    { name: "Inbox", icon: "chatbubble-outline", route: "Inbox" }, // Match the name in AppNavigator
    { name: "Profile", icon: "person-outline", route: "Profile" },
  ];

  return (
    <View style={styles.navbarContainer}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={() => {
            console.log(`Navigating to ${tab.route}`); // Debug route name
            navigation.navigate(tab.route);
          }}
        >
          <Icon
            name={tab.icon}
            size={28}
            color={activeTab === tab.name ? "#4a90e2" : "#bbb"}
            accessibilityLabel={`Navigate to ${tab.name}`}
          />
          <Text
            style={[
              styles.navText,
              { color: activeTab === tab.name ? "#4a90e2" : "#bbb" },
            ]}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#005bea",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
});

export default Navbar;
