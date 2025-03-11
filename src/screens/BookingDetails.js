import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ThemeContext } from "../context/ThemeContext";

const BookingDetails = ({ navigation, route }) => {
  const { service } = route.params;
  const { colors } = useContext(ThemeContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [workingHours, setWorkingHours] = useState(1);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Get today's date to disable past dates
  const today = new Date().toISOString().split("T")[0];

  // Generate time slots from 9:00 AM to 9:00 PM (every 30 minutes)
  const generateTimeSlots = () => {
    let slots = [];
    let startHour = 9;
    let endHour = 21;
    let minutes = ["00", "30"];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min of minutes) {
        let period = hour >= 12 ? "PM" : "AM";
        let formattedHour = hour > 12 ? hour - 12 : hour;
        formattedHour = formattedHour === 0 ? 12 : formattedHour;
        slots.push(`${formattedHour}:${min} ${period}`);
      }
    }
    return slots;
  };

  const availableTimes = generateTimeSlots();

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time for the booking.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("You need to be logged in to make a booking.");
      return;
    }

    try {
      // Save booking to Firestore
      const bookingRef = await addDoc(collection(db, "bookings"), {
        userId: currentUser.uid,
        providerId: service.userId,
        participants: [currentUser.uid, service.userId], // ✅ Include provider in participants
        serviceId: service.id,
        serviceName: service.serviceName,
        date: selectedDate,
        time: selectedTime,
        workingHours: workingHours,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      // Send notification to the service provider
      await addDoc(collection(db, "notifications"), {
        recipientId: service.userId,
        message: `New booking request for ${service.serviceName} on ${selectedDate} at ${selectedTime}.`,
        bookingId: bookingRef.id, // ✅ Attach booking ID for reference
        createdAt: serverTimestamp(),
        read: false,
      });

      // Show success popup
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error booking service: ", error);
      alert("Failed to book service. Please try again.");
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Booking Details</Text>
        <Icon name="ellipsis-horizontal" size={24} color={colors.text} />
      </View>

      {/* Select Date */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Date</Text>
      <Calendar
        minDate={today}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: colors.primary } } : {}}
        theme={{
          selectedDayBackgroundColor: colors.primary,
          arrowColor: colors.primary,
          todayTextColor: colors.primary,
          textSectionTitleColor: colors.text,
          monthTextColor: colors.text,
        }}
      />

      {/* Working Hours */}
      <View style={[styles.hoursContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.hoursTitle, { color: colors.text }]}>Working Hours</Text>
        <Text style={[styles.hoursSubtitle, { color: colors.text }]}>Cost increases after 2 hrs of work</Text>
        <View style={styles.hoursSelector}>
          <TouchableOpacity
            onPress={() => setWorkingHours(Math.max(1, workingHours - 1))}
            style={styles.hoursButton}
          >
            <Icon name="remove-circle-outline" size={24} color={colors.primary} />
          </TouchableOpacity>

          <Text style={[styles.hoursValue, { color: colors.text }]}>{workingHours}</Text>

          <TouchableOpacity
            onPress={() => setWorkingHours(workingHours + 1)}
            style={styles.hoursButton}
          >
            <Icon name="add-circle-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Choose Start Time */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Start Time</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeContainer}>
        {availableTimes.map((time, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.timeButton, selectedTime === time && styles.selectedTime]}
            onPress={() => setSelectedTime(time)}
          >
            <Text style={[styles.timeText, selectedTime === time && styles.selectedTimeText]}>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleBooking}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      {/* Booking Success Modal */}
      <Modal animationType="slide" transparent={true} visible={showSuccessModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Icon name="checkmark-circle" size={60} color={colors.primary} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Booking Successful!</Text>
            <Text style={[styles.modalText, { color: colors.text }]}>Your service has been booked successfully.</Text>

            {/* "Message Workers" Button */}
            <TouchableOpacity
              style={[styles.modalButton, styles.darkMessageButton]}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate("ChatScreen", { recipientId: service.userId });
              }}
            >
              <Text style={styles.modalButtonText}>Message Workers</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default BookingDetails;


const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 15 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  hoursContainer: { borderRadius: 10, padding: 15, marginTop: 10 },
  hoursSelector: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 },
  hoursButton: { padding: 5 },
  hoursValue: { fontSize: 18, fontWeight: "bold", marginHorizontal: 10 },
  timeContainer: { flexDirection: "row", paddingVertical: 10 },
  timeButton: { backgroundColor: "#f6f0ff", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, marginRight: 10 },
  selectedTime: { backgroundColor: "#7b61ff" },
  timeText: { fontSize: 14, color: "#7b61ff" },
  selectedTimeText: { color: "#fff" },
  continueButton: { backgroundColor: "#7b61ff", borderRadius: 20, paddingVertical: 15, alignItems: "center", marginTop: 20 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  modalContainer: { width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  modalText: { fontSize: 14, textAlign: "center", marginBottom: 15 },
  modalButton: { padding: 10, borderRadius: 5, width: "80%", alignItems: "center" },
  modalButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  darkMessageButton: { backgroundColor: "#34276f" },
});
