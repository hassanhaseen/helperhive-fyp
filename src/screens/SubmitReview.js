import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { auth, db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { ThemeContext } from "../context/ThemeContext";

const SubmitReview = ({ route, navigation }) => {
  const { serviceId } = route.params;
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const MAX_CHARACTERS = 300;

  const { colors, isDarkMode } = useContext(ThemeContext);

  const submitReview = async () => {
    if (rating === 0 || reviewText.trim() === "") {
      Toast.show({
        type: "error",
        text1: "⚠️ Missing Information",
        text2: "Please provide a rating and review text.",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("Submitting review with serviceId:", serviceId);
      await addDoc(collection(db, "reviews"), {
        serviceId,
        userId: auth.currentUser.uid,
        rating,
        text: reviewText.trim(),
        timestamp: new Date(),
      });

      Toast.show({
        type: "success",
        text1: "✅ Review Submitted!",
        text2: "Thank you for your feedback 🙌",
      });

      setLoading(false);
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting review:", error);
      Toast.show({
        type: "error",
        text1: "❌ Submission Failed",
        text2: "Please try again later.",
      });
      setLoading(false);
    }
  };

  const handleReviewTextChange = (text) => {
    if (text.length <= MAX_CHARACTERS) {
      setReviewText(text);
      setCharCount(text.length);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.primary} barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.text }]}>Submit a Review ✍️</Text>

          <TextInput
            placeholder="Write your review here..."
            placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={reviewText}
            onChangeText={handleReviewTextChange}
            multiline
          />

          {/* Character Counter */}
          <Text
            style={[
              styles.charCounter,
              { color: charCount >= MAX_CHARACTERS ? "red" : colors.text },
            ]}
          >
            {charCount}/{MAX_CHARACTERS}
          </Text>

          <View style={styles.ratingContainer}>
            <Text style={[styles.ratingTitle, { color: colors.text }]}>Rating:</Text>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Icon
                  name={star <= rating ? "star" : "star-outline"}
                  size={32}
                  color={star <= rating ? "#FFD700" : colors.icon}
                  style={styles.starIcon}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: loading
                  ? "#888"
                  : isDarkMode
                    ? "#1E90FF"
                    : "#4A90E2",
              },
            ]}
            onPress={submitReview}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>🚀 Submit Review</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 5,
    height: 150,
    textAlignVertical: "top",
    borderWidth: 1,
    fontSize: 14,
  },
  charCounter: {
    alignSelf: "flex-end",
    fontSize: 12,
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  ratingTitle: {
    fontSize: 18,
    marginRight: 10,
  },
  starIcon: {
    marginHorizontal: 5,
  },
  submitButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SubmitReview;