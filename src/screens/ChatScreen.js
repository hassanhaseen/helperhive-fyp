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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { auth, db } from "../firebase";
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
} from "firebase/firestore";
import { ThemeContext } from "../context/ThemeContext";
import Navbar from "./navbar";

const ChatScreen = ({ route, navigation }) => {
  const { recipientId, recipientName, bookingId } = route.params || {};
  const { colors, isDarkMode } = useContext(ThemeContext);

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [userStatus, setUserStatus] = useState({
    isOnline: false,
    lastSeen: null,
  });
  const [bookingStatus, setBookingStatus] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);

  const flatListRef = useRef();

  // Fetch messages
  useEffect(() => {
    if (!recipientId) return;

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
            (msg.senderId === auth.currentUser.uid &&
              msg.recipientId === recipientId) ||
            (msg.recipientId === auth.currentUser.uid &&
              msg.senderId === recipientId)
        );

      setMessages(msgs);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => unsubscribe();
  }, [recipientId]);

  // Listen for recipient's online/lastSeen status
  useEffect(() => {
    if (!recipientId) return;

    const userDocRef = doc(db, "users", recipientId);

    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setUserStatus({
          isOnline: data.isOnline,
          lastSeen: data.lastSeen,
        });
      }
    });

    return () => unsubscribe();
  }, [recipientId]);

  // Fetch booking status and check if the user has already submitted a review
  useEffect(() => {
    if (!bookingId) return;

    const bookingDocRef = doc(db, "bookings", bookingId);

    const unsubscribe = onSnapshot(bookingDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const bookingData = docSnapshot.data();
        setBookingStatus(bookingData.status);
        setHasReviewed(bookingData.hasReviewed || false);
        console.log("Booking status:", bookingData.status);
        console.log("Has reviewed:", bookingData.hasReviewed);
      }
    });

    return () => unsubscribe();
  }, [recipientId, bookingId]);

  // Send message
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
        <Text
          style={{
            color: isSender ? "#fff" : colors.text,
          }}
        >
          {item.text || ""}
        </Text>

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
      <StatusBar
        backgroundColor={colors.background}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />

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

            <Text
              style={{
                fontSize: 12,
                color: userStatus.isOnline ? "green" : colors.text,
              }}
            >
              {userStatus.isOnline
                ? "Online"
                : userStatus.lastSeen
                ? `Last seen: ${formatLastSeen(userStatus.lastSeen)}`
                : "Offline"}
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
            <Text style={{ textAlign: 'center', color: colors.text, marginTop: 20 }}>
              No messages yet.
            </Text>
          }
        />

        {/* Message Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={90}
        >
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
              style={{
                flex: 1,
                color: colors.text,
                paddingHorizontal: 10,
                maxHeight: 120,
              }}
              multiline
            />
            <TouchableOpacity onPress={sendMessage}>
              <Icon name="send" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Submit Review Button */}
        {bookingStatus === "Completed" && !hasReviewed && (
          <TouchableOpacity
            style={{
              backgroundColor: "green", // Set the button color to green
              padding: 15,
              borderRadius: 10,
              margin: 15,
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("SubmitReview", { serviceId: recipientId, bookingId })}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Submit Review</Text>
          </TouchableOpacity>
        )}

        {/* Bottom Navbar */}
        <Navbar navigation={navigation} activeTab="Inbox" />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;