import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  limit,
  updateDoc,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../firebase";
import { ThemeContext } from "../context/ThemeContext";
import Navbar from "./navbar";

const ChatScreen = ({ route, navigation }) => {
  const { recipientId, recipientName } = route.params || {};
  const { colors, isDarkMode } = useContext(ThemeContext);

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [userStatus, setUserStatus] = useState({ isOnline: false, lastSeen: null });
  const [bookingStatus, setBookingStatus] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [isServiceProvider, setIsServiceProvider] = useState(false); // Default value to avoid null issues
  const [serviceId, setServiceId] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const flatListRef = useRef();

  // Fetch messages
  useEffect(() => {
    if (!recipientId || !auth.currentUser) return;

    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("participants", "array-contains", auth.currentUser.uid),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (msg) =>
            (msg.senderId === auth.currentUser.uid && msg.recipientId === recipientId) ||
            (msg.recipientId === auth.currentUser.uid && msg.senderId === recipientId)
        );

      setMessages(msgs);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => unsubscribe();
  }, [recipientId]);

  // Fetch latest booking details
  const fetchLatestBooking = async () => {
    if (!auth.currentUser?.uid) return;

    const bookingsRef = collection(db, "bookings");
    const q = query(
      bookingsRef,
      where("participants", "array-contains", auth.currentUser.uid),
      where("serviceProviderId", "==", recipientId),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const latestBooking = querySnapshot.docs[0].data();
      setServiceId(latestBooking.serviceId);
      setBookingStatus(latestBooking.status);
      setHasReviewed(latestBooking.hasReviewed || false);
      setIsCompleted(latestBooking.isCompleted || false);
      console.log("Latest Booking:", latestBooking); // Debug statement
      console.log("isCompleted from DB:", latestBooking.isCompleted); // Debug statement
      console.log("hasReviewed from DB:", latestBooking.hasReviewed); // Debug statement
      console.log("isCompleted state:", isCompleted); // Debug statement
      console.log("hasReviewed state:", hasReviewed); // Debug statement
    } else {
      console.log("No booking found for the current user and service provider."); // Debug statement
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLatestBooking();
    }, [recipientId])
  );

  // Fetch current user's role and determine if they are a service provider
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!auth.currentUser?.uid) return;

      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRole(userData.role);
        setIsServiceProvider(userData.isServiceProvider || false);
        console.log("User Role:", userData.role); // Debug statement
        console.log("Is Service Provider:", userData.isServiceProvider); // Debug statement
      }
    };

    fetchUserRole();
  }, [auth.currentUser?.uid]);

  // Handle Submit Review button press
  const handleSubmitReviewPress = () => {
    console.log("isCompleted:", isCompleted); // Debug statement
    console.log("hasReviewed:", hasReviewed); // Debug statement
    console.log("isServiceProvider:", isServiceProvider); // Debug statement

    if (isCompleted && !hasReviewed) {
      navigation.navigate("SubmitReview", {
        serviceId,
        onGoBack: async () => {
          await updateDoc(doc(db, "bookings", serviceId), {
            hasReviewed: true,
          });
          fetchLatestBooking();
        },
      });
    } else {
      Alert.alert("Notification", "You can only submit a review once the service is completed and you haven't reviewed yet.");
    }
  };

  // Send message function
  const sendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        senderId: auth.currentUser.uid,
        recipientId,
        participants: [auth.currentUser.uid, recipientId],
        text: messageText,
        timestamp: serverTimestamp(),
      });

      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Render each message
  const renderMessage = ({ item }) => {
    const isSender = item.senderId === auth.currentUser.uid;

    return (
      <View
        style={{
          alignSelf: isSender ? "flex-end" : "flex-start",
          backgroundColor: isSender ? colors.primary : colors.card,
          marginBottom: 8,
          padding: 10,
          borderRadius: 10,
          maxWidth: "75%",
        }}
      >
        <Text style={{ color: isSender ? "#fff" : colors.text }}>{item.text || ""}</Text>
        <Text style={{ fontSize: 10, color: "#888", marginTop: 4 }}>
          {item.timestamp?.seconds
            ? new Date(item.timestamp.seconds * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                month: "short",
                day: "numeric",
              })
            : ""}
        </Text>
      </View>
    );
  };

  // Format last seen time
  const formatLastSeen = (timestamp) => {
    if (!timestamp?.seconds) return "";

    const date = new Date(timestamp.seconds * 1000);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar backgroundColor={colors.background} barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 15,
            paddingHorizontal: 10,
            borderBottomWidth: 1,
            borderColor: colors.border,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.primary }}>
              {recipientName || "Chat"}
            </Text>

            <Text style={{ fontSize: 12, color: userStatus.isOnline ? "green" : colors.text }}>
              {userStatus.isOnline
                ? "Online"
                : userStatus.lastSeen
                ? `${recipientName} last seen: ${formatLastSeen(userStatus.lastSeen)}`
                : `${recipientName} is Offline`}
            </Text>
          </View>

          {/* Optional: Online status dot */}
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: userStatus.isOnline ? "green" : "gray",
              marginRight: 10,
            }}
          />
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 15 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: colors.text, marginTop: 20 }}>No messages yet.</Text>
          }
        />

        {/* Debugging statements */}
        {console.log("isServiceProvider:", isServiceProvider)}
        {console.log("isCompleted:", isCompleted)}
        {console.log("hasReviewed:", hasReviewed)}

        {/* Submit Review Button */}
        {isServiceProvider === false && isCompleted && !hasReviewed && (
          <TouchableOpacity
            style={{ backgroundColor: "green", padding: 15, borderRadius: 10, margin: 15, alignItems: "center" }}
            onPress={handleSubmitReviewPress}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Submit Review</Text>
          </TouchableOpacity>
        )}

        {/* Message Input */}
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
          <View
            style={{
              flexDirection: "row",
              padding: 10,
              backgroundColor: colors.card,
              borderTopWidth: 1,
              borderColor: colors.border,
            }}
          >
            <TextInput
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Type a message..."
              placeholderTextColor={colors.text}
              style={{ flex: 1, color: colors.text, paddingHorizontal: 10, maxHeight: 120 }}
              multiline
            />
            <TouchableOpacity onPress={sendMessage}>
              <Icon name="send" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Bottom Navbar */}
        <Navbar navigation={navigation} activeTab="Inbox" />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;