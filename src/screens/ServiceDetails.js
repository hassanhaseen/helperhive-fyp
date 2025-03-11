import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Toast from "react-native-toast-message";
import { ThemeContext } from "../context/ThemeContext";

const ServiceDetails = ({ route, navigation }) => {
  const { service } = route.params;
  const { colors } = useContext(ThemeContext);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, where("serviceId", "==", service.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsList = snapshot.docs.map((doc) => doc.data());
      setReviews(reviewsList);
    });
    return () => unsubscribe();
  }, [service.id]);

  const handleMessage = () => {
    if (!service.userId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "The service provider's information is missing.",
      });
      return;
    }
    navigation.navigate("ChatScreen", {
      recipientId: service.userId,
      recipientName: service.serviceName,
    });
  };

  const handleBook = () => {
    navigation.navigate("BookingDetails", { service });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={{
          uri:
            service.image ||
            "https://norakramerdesigns.b-cdn.net/wp-content/uploads/2022/05/home_remodeling_website_design.jpg",
        }}
        style={styles.bannerImage}
      />

      <View style={[styles.detailsContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {service.serviceName || "Service Name Unavailable"}
        </Text>

        <Text style={[styles.category, { color: colors.primary }]}>
          <Icon name="pricetag-outline" size={18} color={colors.primary} />{" "}
          {service.category || "Category Unavailable"}
        </Text>

        <Text style={[styles.description, { color: colors.text }]}>
          {service.description || "No description provided for this service."}
        </Text>

        <Text style={[styles.price, { color: colors.primary }]}>
          <Icon name="cash-outline" size={18} color={colors.primary} /> Price Range:{" "}
          {service.priceRange || "Not Specified"}
        </Text>
      </View>

      {/* Reviews Section */}
      <View style={[styles.reviewsContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.reviewsTitle, { color: colors.text }]}>Reviews</Text>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <Text style={[styles.reviewText, { color: colors.text }]}>{review.text}</Text>
              <Text style={[styles.reviewRating, { color: colors.primary }]}>
                Rating: {review.rating}
              </Text>
            </View>
          ))
        ) : (
          <Text style={[styles.noReviewsText, { color: colors.text }]}>No reviews yet.</Text>
        )}
      </View>

      {/* Submit Review Button */}
      <TouchableOpacity
        style={[styles.reviewButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate("SubmitReview", { serviceId: service.id })}
      >
        <Text style={styles.reviewButtonText}>Submit a Review</Text>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.messageButton, { backgroundColor: colors.primary }]}
          onPress={handleMessage}
        >
          <Icon name="chatbubble-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: "#34d399" }]}
          onPress={handleBook}
        >
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
  },
  bannerImage: {
    width: "100%",
    height: 220,
    marginBottom: 20,
  },
  detailsContainer: {
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  category: {
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  price: {
    fontSize: 14,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 30,
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: "45%",
    justifyContent: "center",
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: "45%",
    justifyContent: "center",
  },
  reviewsContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reviewItem: {
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 14,
  },
  reviewRating: {
    fontSize: 14,
  },
  noReviewsText: {
    fontSize: 14,
    textAlign: "center",
  },
  reviewButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  reviewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
