import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
} from "firebase/firestore";

const ChatScreen = ({ route, navigation }) => {
  const { recipientId, recipientName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch messages between sender and recipient
  useEffect(() => {
    const messagesRef = collection(db, "messages");

    const q = query(
      messagesRef,
      where("participants", "array-contains", auth.currentUser?.uid),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter messages for the current conversation
        setMessages(
          fetchedMessages.filter(
            (msg) =>
              (msg.senderId === auth.currentUser?.uid &&
                msg.recipientId === recipientId) ||
              (msg.senderId === recipientId &&
                msg.recipientId === auth.currentUser?.uid)
          )
        );
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [recipientId]);

  const sendMessage = async () => {
    if (newMessage.trim().length === 0) return;

    try {
      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, {
        senderId: auth.currentUser.uid,
        recipientId,
        participants: [auth.currentUser.uid, recipientId],
        text: newMessage.trim(),
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderMessage = ({ item }) => {
    const isSender = item.senderId === auth.currentUser?.uid;
    return (
      <View
        style={[
          styles.messageBubble,
          isSender ? styles.senderBubble : styles.receiverBubble,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        {item.timestamp && (
          <Text style={styles.timestampText}>
            {new Date(item.timestamp.seconds * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{recipientName}</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4a90e2" style={styles.loader} />
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No messages yet</Text>
          }
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message"
          placeholderTextColor="#bbb"
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name="send-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4a90e2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#4a90e2",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "75%",
  },
  senderBubble: {
    backgroundColor: "#24539c",
    alignSelf: "flex-start",
  },
  receiverBubble: {
    backgroundColor: "#24539c",
    alignSelf: "flex-end",
  },
  messageText: {
    color: "#fff",
    fontSize: 14,
  },
  timestampText: {
    color: "#ddd",
    fontSize: 10,
    marginTop: 5,
    alignSelf: "flex-end",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
    backgroundColor: "#4a90e2",
  },
  input: {
    flex: 1,
    color: "#333",
    backgroundColor: "#e6e9ee",
    paddingHorizontal: 15,
    borderRadius: 20,
    height: 50, // Ensure consistent height
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#005bea",
    padding: 10,
    borderRadius: 20,
  },
});
