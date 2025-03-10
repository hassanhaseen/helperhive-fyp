import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { db } from "../firebase";
import { collection, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [pendingServices, setPendingServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({ user: null, provider: null, service: null });

  useEffect(() => {
    setLoading(true);

    // Fetch Pending Users & Service Providers
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPendingUsers(usersData.filter(user => user.requestStatus === "Pending" && !user.isServiceProvider));
      setServiceProviders(usersData.filter(user => user.isServiceProvider === true));
      setLoading(false);
    });

    // Fetch Pending & Available Services
    const unsubscribeServices = onSnapshot(collection(db, "services"), (snapshot) => {
      const servicesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPendingServices(servicesData.filter(service => service.status === "Pending"));
      setAvailableServices(servicesData.filter(service => service.status === "Approved"));
      setLoading(false);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeServices();
    };
  }, []);

  const toggleExpand = (type, id) => {
    setExpanded((prev) => ({
      ...prev,
      [type]: prev[type] === id ? null : id,
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      {loading && <ActivityIndicator size="large" color="#4a90e2" />}

      {/* Pending Users */}
      <Text style={styles.sectionTitle}>Pending Users</Text>
      {pendingUsers.length > 0 ? pendingUsers.map((user) => (
        <View key={user.id} style={styles.card}>
          <TouchableOpacity onPress={() => toggleExpand("user", user.id)}>
            <Text style={styles.cardTitle}>{user.name} - {user.email}</Text>
          </TouchableOpacity>
          {expanded.user === user.id && (
            <View style={styles.expandedContent}>
              <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
              <Text style={styles.infoText}>Phone: {user.phone}</Text>
              <Text style={styles.infoText}>Address: {user.address}</Text>
              <Text style={styles.infoText}>CNIC: {user.cnicNumber}</Text>
              <Text style={styles.infoText}>Date of Birth: {user.dateOfBirth}</Text>
              <Image source={{ uri: user.cnicFront }} style={styles.cnicImage} />
              <Image source={{ uri: user.cnicBack }} style={styles.cnicImage} />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.approveButton} onPress={() => approveUser(user.id)}>
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton} onPress={() => rejectUser(user.id)}>
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )) : <Text style={styles.noDataText}>No Pending Users</Text>}

      {/* Service Providers */}
      <Text style={styles.sectionTitle}>Service Providers</Text>
      {serviceProviders.length > 0 ? serviceProviders.map((provider) => (
        <View key={provider.id} style={styles.card}>
          <Text style={styles.cardTitle}>{provider.name} - {provider.email}</Text>
          <TouchableOpacity style={styles.rejectButton} onPress={() => deleteServiceProvider(provider.id)}>
            <Text style={styles.buttonText}>Delete Provider</Text>
          </TouchableOpacity>
        </View>
      )) : <Text style={styles.noDataText}>No Service Providers</Text>}

      {/* Pending Services */}
      <Text style={styles.sectionTitle}>Pending Services</Text>
      {pendingServices.length > 0 ? pendingServices.map((service) => (
        <View key={service.id} style={styles.card}>
          <Text style={styles.cardTitle}>{service.name} - {service.category}</Text>
          <Text style={styles.infoText}>Description: {service.description}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.approveButton} onPress={() => approveService(service.id)}>
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectButton} onPress={() => rejectService(service.id)}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      )) : <Text style={styles.noDataText}>No Pending Services</Text>}

      {/* Available Services */}
      <Text style={styles.sectionTitle}>Available Services</Text>
      {availableServices.length > 0 ? availableServices.map((service) => (
        <View key={service.id} style={styles.card}>
          <Text style={styles.cardTitle}>{service.name} - {service.category}</Text>
          <TouchableOpacity style={styles.rejectButton} onPress={() => deleteAvailableService(service.id)}>
            <Text style={styles.buttonText}>Delete Service</Text>
          </TouchableOpacity>
        </View>
      )) : <Text style={styles.noDataText}>No Available Services</Text>}
    </ScrollView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#4a90e2", textAlign: "center", marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, color: "#333" },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 15, marginVertical: 8, shadowOpacity: 0.1, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#4a90e2" },
  expandedContent: { marginTop: 10 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  approveButton: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5, alignItems: "center", flex: 1, marginRight: 5 },
  rejectButton: { backgroundColor: "#f44336", padding: 10, borderRadius: 5, alignItems: "center", flex: 1, marginLeft: 5 },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginVertical: 10 },
  cnicImage: { width: 150, height: 90, marginVertical: 5, borderRadius: 5 },
  noDataText: { textAlign: "center", fontSize: 14, color: "#888", marginVertical: 10 }
});
