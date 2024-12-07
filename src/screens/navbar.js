import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Navbar = ({ navigation, activeTab }) => {
  const tabs = [
    { name: "Home", icon: "home", route: "HomePage" }, 
    { name: "Bookings", icon: "document-text-outline", route: "Bookings" },
    { name: "Inbox", icon: "chatbubble-outline", route: "Inbox" },
    { name: "Profile", icon: "person-outline", route: "Profile" },
  ];

  return (
    <View style={styles.navbarContainer}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={() => navigation.navigate(tab.route)}
        >
          <Icon
            name={tab.icon}
            size={30}
            color={activeTab === tab.name ? "#8b5cf6" : "#bbb"}
          />
          <Text
            style={[
              styles.navText,
              { color: activeTab === tab.name ? "#8b5cf6" : "#bbb" },
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
    backgroundColor: "#111",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  navText: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "400",
  },
});

export default Navbar;
