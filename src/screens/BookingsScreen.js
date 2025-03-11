import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import Navbar from "./navbar";
import { ThemeContext } from "../context/ThemeContext";
import Toast from "react-native-toast-message";

const BookingsScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useContext(ThemeContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const bookingsRef = collection(db, "bookings");

    // Fetch bookings where user is either a customer or service provider
    const q = query(
      bookingsRef,
      where("participants", "array-contains", user.uid) // Fetch bookings where the user is involved
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const cancelBooking = async (bookingId) => {
    Toast.show({
      type: "info",
      text1: "Cancelling Booking...",
    });

    try {
      await updateDoc(doc(db, "bookings", bookingId), { status: "Canceled" });
      Toast.show({
        type: "success",
        text1: "Booking canceled.",
      });
    } catch (error) {
      console.error("Error canceling booking:", error);
      Toast.show({
        type: "error",
        text1: "Failed to cancel booking.",
      });
    }
  };

  const acceptBooking = async (bookingId) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), { status: "Confirmed" });
      Toast.show({
        type: "success",
        text1: "Booking accepted!",
      });
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  const rejectBooking = async (bookingId) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), { status: "Rejected" });
      Toast.show({
        type: "success",
        text1: "Booking rejected.",
      });
    } catch (error) {
      console.error("Error rejecting booking:", error);
      Toast.show({
        type: "error",
        text1: "Failed to reject booking.",
      });
    }
  };

  const completeBooking = async (bookingId) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        status: "Completed",
        isCompleted: true, // Update the isCompleted field
      });
      Toast.show({
        type: "success",
        text1: "Booking marked as completed.",
      });
    } catch (error) {
      console.error("Error completing booking:", error);
      Toast.show({
        type: "error",
        text1: "Failed to mark booking as completed.",
      });
    }
  };

  const renderBooking = ({ item }) => (
    <View style={[styles.bookingItem, { backgroundColor: colors.card }]}>
      <View style={styles.bookingInfo}>
        <Text style={[styles.serviceText, { color: colors.text }]}>
          {item.serviceName}
        </Text>

        {/* Display Date of Service */}
        <Text style={[styles.dateText, { color: colors.text }]}>
          📅 Date: {item.date}
        </Text>

        {/* Display Start Time */}
        <Text style={[styles.dateText, { color: colors.text }]}>
          ⏰ Time: {item.time}
        </Text>

        {/* Display Total Hours of Work */}
        <Text style={[styles.dateText, { color: colors.text }]}>
          ⏳ Total Hours: {item.workingHours} hrs
        </Text>

        {/* Display Booking Status */}
        <Text style={[styles.status, styles[item.status]]}>
          {item.status}
        </Text>
      </View>

      {/* User (Customer) can only cancel the booking */}
      {item.status === "Pending" && item.userId === user.uid && (
        <TouchableOpacity
          style={[
            styles.cancelButton,
            { backgroundColor: colors.error || "#ff4d4d" },
          ]}
          onPress={() => cancelBooking(item.id)}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      )}

      {/* Service Provider sees "Accept" & "Reject" buttons */}
      {item.status === "Pending" && item.providerId === user.uid && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.acceptButton,
              { backgroundColor: colors.success || "#34d399" },
            ]}
            onPress={() => acceptBooking(item.id)}
          >
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.rejectButton,
              { backgroundColor: colors.error || "#ff4d4d" },
            ]}
            onPress={() => rejectBooking(item.id)}
          >
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Service Provider sees "Mark as Completed" button */}
      {item.status === "Confirmed" && item.providerId === user.uid && (
        <TouchableOpacity
          style={[
            styles.completeButton,
            { backgroundColor: colors.success || "#34d399" },
          ]}
          onPress={() => completeBooking(item.id)}
        >
          <Text style={styles.completeText}>Mark as Completed</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View
        style={[styles.loaderContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />

      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>
          Your Bookings
        </Text>

        {bookings.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No bookings found
          </Text>
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={renderBooking}
            contentContainerStyle={{ paddingBottom: 90 }}
          />
        )}

        <Navbar navigation={navigation} activeTab="Bookings" />
      </View>
    </SafeAreaView>
  );
};

export default BookingsScreen;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  bookingItem: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  bookingInfo: {
    marginBottom: 10,
  },
  serviceText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 14,
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  Pending: {
    color: "orange",
  },
  Confirmed: {
    color: "green",
  },
  Rejected: {
    color: "red",
  },
  Completed: {
    color: "blue",
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  cancelText: {
    color: "#fff",
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  acceptButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  rejectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  completeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  completeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
  },
});