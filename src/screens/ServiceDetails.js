import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { collection, query, where, onSnapshot, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Toast from "react-native-toast-message";
import { ThemeContext } from "../context/ThemeContext";

const ServiceDetails = ({ route, navigation }) => {
  const { service } = route.params;
  const { colors } = useContext(ThemeContext);
  const [reviews, setReviews] = useState([]);
  const [isServiceProvider, setIsServiceProvider] = useState(null); // Initial state as null (not false)
  const user = auth.currentUser;

  useEffect(() => {
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, where("serviceId", "==", service.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsList = snapshot.docs.map((doc) => doc.data());
      setReviews(reviewsList);
    });
    return () => unsubscribe();
  }, [service.id]);

  useEffect(() => {
    if (user) {
      const checkUserType = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().isServiceProvider) {
          setIsServiceProvider(true);
        } else {
          setIsServiceProvider(false);
        }
      };
      checkUserType();
    } else {
      setIsServiceProvider(false);
    }
  }, [user]);

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

      {/* ✅ Prevent buttons from appearing until we confirm user type */}
      {isServiceProvider === null ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
      ) : (
        !isServiceProvider && user?.uid !== service.userId && (
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
        )
      )}

      {!isServiceProvider && user?.uid !== service.userId && (
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() =>
            navigation.navigate("CreateTicket", {
              providerId: service.userId,
              serviceId: service.id,
            })
          }
        >
          <Text style={styles.reviewButtonText}>Report / Dispute</Text>
        </TouchableOpacity>
      )}
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
    borderRadius: 10,
    marginBottom: 20,
  },
  detailsContainer: {
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  category: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  price: {
    fontSize: 14,
    marginBottom: 12,
    fontWeight: "bold",
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "48%",
    justifyContent: "center",
    backgroundColor: "#4A90E2", // Updated primary button color
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "48%",
    justifyContent: "center",
    backgroundColor: "#34d399", // Updated success button color
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  reviewButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#7B61FF", // Updated review button color
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  reviewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});