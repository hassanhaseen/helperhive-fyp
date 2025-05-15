import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from "react-native";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ThemeContext } from "../context/ThemeContext";
import Toast from "react-native-toast-message";

const CreateTicket = ({ route, navigation }) => {
  const { providerId, serviceId, userId } = route.params || {};
  const { colors } = useContext(ThemeContext);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!subject || !description) {
      Toast.show({ type: "error", text1: "Please fill all fields." });
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "tickets"), {
        fromId: auth.currentUser.uid, // Always the current logged-in user
        againstId: userId || providerId, // The opposite user (userId if provided, otherwise providerId)
        serviceId,
        subject,
        description,
        status: "Open",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      Toast.show({ type: "success", text1: "Ticket submitted!" });
      navigation.goBack();
    } catch (e) {
      Toast.show({ type: "error", text1: "Failed to submit ticket." });
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 20 }}>
        <Text style={{ color: colors.text, fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>Create Support Ticket</Text>
        <TextInput
          placeholder="Subject"
          value={subject}
          onChangeText={setSubject}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />
        <TextInput
          placeholder="Describe your issue"
          value={description}
          onChangeText={setDescription}
          multiline
          style={[styles.input, { height: 120, color: colors.text, borderColor: colors.border }]}
        />
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "bold" }}>Submit Ticket</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 15 },
  button: { padding: 15, borderRadius: 8, alignItems: "center" },
});

export default CreateTicket;