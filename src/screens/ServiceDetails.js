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
  const [isServiceProvider, setIsServiceProvider] = useState(null);
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

  // ⭐ Generate stars dynamically based on rating
  const renderStars = (rating) => {
    const filledStars = Math.round(rating);
    const emptyStars = 5 - filledStars;
    return (
      <>
        {Array(filledStars)
          .fill()
          .map((_, i) => (
            <Icon key={`filled-${i}`} name="star" size={18} color="#FFD700" />
          ))}
        {Array(emptyStars)
          .fill()
          .map((_, i) => (
            <Icon key={`empty-${i}`} name="star-outline" size={18} color="#FFD700" />
          ))}
      </>
    );
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
          {service.priceRange ? `${service.priceRange} PKR` : "Not Specified"}
        </Text>
      </View>

      {/* Reviews Section */}
      <View style={[styles.reviewsContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.reviewsTitle, { color: colors.text }]}>Reviews</Text>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <Text style={[styles.reviewText, { color: colors.text }]}>{review.text}</Text>
              <View style={styles.starsContainer}>{renderStars(review.rating)}</View>
            </View>
          ))
        ) : (
          <Text style={[styles.noReviewsText, { color: colors.text }]}>No reviews yet.</Text>
        )}
      </View>

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
  reviewsContainer: {
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
  reviewsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  reviewItem: {
    marginBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  reviewText: {
    fontSize: 14,
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  noReviewsText: {
    fontSize: 14,
    textAlign: 'center',
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
