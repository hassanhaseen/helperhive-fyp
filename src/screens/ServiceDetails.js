import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ServiceDetails = ({ route, navigation }) => {
  const { service } = route.params;

  const handleMessage = () => {
    if (!service.userId) {
      Alert.alert("Error", "The service provider's information is missing.");
      return;
    }
    navigation.navigate("ChatScreen", {
      recipientId: service.userId,
      recipientName: service.serviceName,
    });
  };

  const handleBook = () => {
    Alert.alert("Success", "Service booked successfully!");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Service Banner */}
      <Image
        source={{
          uri: service.image || "https://norakramerdesigns.b-cdn.net/wp-content/uploads/2022/05/home_remodeling_website_design.jpg",
        }}
        style={styles.bannerImage}
      />

      {/* Service Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>
          {service.serviceName || "Service Name Unavailable"}
        </Text>
        <Text style={styles.category}>
          <Icon name="pricetag-outline" size={18} color="#4a90e2" />{" "}
          {service.category || "Category Unavailable"}
        </Text>
        <Text style={styles.description}>
          {service.description || "No description provided for this service."}
        </Text>
        <Text style={styles.price}>
          <Icon name="cash-outline" size={18} color="#4a90e2" /> Price Range:{" "}
          {service.priceRange || "Not Specified"}
        </Text>
        <Text style={styles.availability}>
          <Icon name="calendar-outline" size={18} color="#4a90e2" />{" "}
          Availability: {service.availability || "Not Specified"}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
          <Icon name="chatbubble-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
          <Icon name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Book</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ServiceDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Light background
  },
  bannerImage: {
    width: "100%",
    height: 220,
    marginBottom: 20,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: "#ffffff", // White background for content
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Darker text for better contrast
    marginBottom: 15,
    textAlign: "center",
  },
  category: {
    fontSize: 16,
    color: "#555", // Subtle grey for secondary info
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666", // Neutral text color
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "justify",
  },
  price: {
    fontSize: 16,
    color: "#4a90e2", // Highlight color
    marginBottom: 10,
  },
  availability: {
    fontSize: 16,
    color: "#333", // Darker text for better readability
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4a90e2", // Primary color
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: "45%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#34d399", // Success color
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: "45%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
});
