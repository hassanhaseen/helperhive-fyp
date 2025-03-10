import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import Navbar from "./navbar";
import { ThemeContext } from "../context/ThemeContext";

const InboxScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useContext(ThemeContext);

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("participants", "array-contains", auth.currentUser?.uid),
        orderBy("timestamp", "desc")
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const messages = snapshot.docs.map((doc) => doc.data());
        const groupedConversations = {};
        const userInfoCache = {};

        for (const msg of messages) {
          const otherUserId =
            msg.senderId === auth.currentUser?.uid
              ? msg.recipientId
              : msg.senderId;

          if (!groupedConversations[otherUserId]) {
            if (!userInfoCache[otherUserId]) {
              const userDoc = await getDoc(doc(db, "users", otherUserId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                userInfoCache[otherUserId] = {
                  name: userData.name || "User",
                  image: userData.image || null,
                  isOnline: userData.isOnline || false,
                  lastSeen: userData.lastSeen || null,
                };
              } else {
                userInfoCache[otherUserId] = {
                  name: "User",
                  image: null,
                  isOnline: false,
                  lastSeen: null,
                };
              }
            }

            groupedConversations[otherUserId] = {
              ...msg,
              id: otherUserId,
              name: userInfoCache[otherUserId].name,
              image: userInfoCache[otherUserId].image,
              isOnline: userInfoCache[otherUserId].isOnline,
              lastSeen: userInfoCache[otherUserId].lastSeen,
            };
          }
        }

        setConversations(Object.values(groupedConversations));
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchConversations();
  }, []);

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.chatItem, { backgroundColor: colors.card }]}
      onPress={() =>
        navigation.navigate("ChatScreen", {
          recipientId: item.id,
          recipientName: item.name,
        })
      }
    >
      <View style={styles.chatImageContainer}>
        <Image
          source={{
            uri:
              item.image ||
              "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
          }}
          style={styles.chatImage}
        />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.chatInfo}>
        <Text style={[styles.chatName, { color: colors.text }]}>{item.name}</Text>

        {item.isOnline ? (
          <Text style={styles.onlineText}>Online</Text>
        ) : item.lastSeen ? (
          <Text style={styles.lastSeenText}>
            Last seen: {new Date(item.lastSeen.toDate()).toLocaleString()}
          </Text>
        ) : null}

        <Text style={[styles.chatMessage, { color: colors.text }]} numberOfLines={1}>
          {item.text || "No messages yet"}
        </Text>
      </View>

      <Text style={[styles.chatTime, { color: colors.text }]}>
        {item.timestamp?.seconds
          ? new Date(item.timestamp.seconds * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : ""}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
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
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          ListHeaderComponent={
            <Text style={[styles.headerTitle, { color: colors.primary }]}>Inbox</Text>
          }
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.text }]}>No chats available</Text>
          }
          contentContainerStyle={styles.listContainer}
        />

        <Navbar navigation={navigation} activeTab="Inbox" />
      </View>
    </SafeAreaView>
  );
};

export default InboxScreen;

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 90,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  chatImageContainer: {
    position: "relative",
    marginRight: 12,
  },
  chatImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#0f0",
    borderWidth: 2,
    borderColor: "#fff",
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  chatMessage: {
    fontSize: 14,
  },
  chatTime: {
    fontSize: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
  },
  onlineText: {
    color: "#0f0",
    fontSize: 14,
    marginBottom: 3,
  },
  lastSeenText: {
    color: "#999",
    fontSize: 12,
    marginBottom: 3,
  },
});
