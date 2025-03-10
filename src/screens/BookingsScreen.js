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
  ScrollView,
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
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import Navbar from "./navbar";
import { ThemeContext } from "../context/ThemeContext";
import Toast from "react-native-toast-message";

const BookingsScreen = ({ route, navigation }) => {
  const { colors, isDarkMode } = useContext(ThemeContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const bookingsRef = collection(db, "bookings");

    const q = query(
      bookingsRef,
      where("participants", "array-contains", user.uid)
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

  useEffect(() => {
    if (route.params?.service && route.params?.selectedDate) {
      handleNewBooking(route.params.service, route.params.selectedDate);
    }
  }, [route.params?.service, route.params?.selectedDate]);

  const handleNewBooking = async (service, selectedDate) => {
    if (!user) {
      Toast.show({
        type: "error",
        text1: "You must be logged in to book a service.",
      });
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        providerId: service.userId,
        participants: [user.uid, service.userId],
        serviceId: service.id,
        serviceName: service.serviceName,
        providerName: service.providerName || "Unknown",
        status: "Pending",
        bookingDateTime: selectedDate.toISOString(),
        timestamp: serverTimestamp(),
      });

      Toast.show({
        type: "success",
        text1: "Booking placed successfully!",
      });
    } catch (error) {
      console.error("Error booking service:", error);
      Toast.show({
        type: "error",
        text1: "Failed to book service.",
      });
    }
  };

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

  const renderBooking = ({ item }) => (
    <View style={[styles.bookingItem, { backgroundColor: colors.card }]}>
      <View style={styles.bookingInfo}>
        <Text style={[styles.serviceText, { color: colors.text }]}>{item.serviceName}</Text>
        <Text style={[styles.providerText, { color: colors.text }]}>
          {item.userId === user.uid ? "Provider" : "Customer"}: {item.providerName}
        </Text>
        <Text style={[styles.dateText, { color: colors.text }]}>
          Date & Time: {new Date(item.bookingDateTime).toLocaleString()}
        </Text>
        <Text style={[styles.status, styles[item.status]]}>{item.status}</Text>
      </View>

      {item.status === "Pending" && item.userId === user.uid && (
        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: colors.error || "#ff4d4d" }]}
          onPress={() => cancelBooking(item.id)}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      )}

      {item.status === "Pending" && item.providerId === user.uid && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.acceptButton, { backgroundColor: colors.success || "#34d399" }]}
            onPress={() => acceptBooking(item.id)}
          >
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rejectButton, { backgroundColor: colors.error || "#ff4d4d" }]}
            onPress={() => rejectBooking(item.id)}
          >
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar backgroundColor={colors.background} barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Your Bookings</Text>

          {bookings.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.text }]}>No bookings found</Text>
          ) : (
            bookings.map((item) => renderBooking({ item }))
          )}
        </ScrollView>

        <Navbar navigation={navigation} activeTab="Bookings" />
      </View>
    </SafeAreaView>
  );
};

export default BookingsScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 90,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  bookingItem: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  bookingInfo: {
    marginBottom: 10,
  },
  serviceText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  providerText: {
    fontSize: 14,
    marginTop: 5,
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
    justifyContent: "flex-start",
    gap: 10,
  },
  acceptButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  acceptText: {
    color: "#fff",
    fontWeight: "bold",
  },
  rejectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  rejectText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
  },
});
