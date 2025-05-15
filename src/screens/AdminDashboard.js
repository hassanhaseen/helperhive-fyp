import React, { useEffect, useState, useContext } from "react";
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
import { ThemeContext } from "../context/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";

const AdminDashboard = () => {
  const { colors } = useContext(ThemeContext);

  const [pendingUsers, setPendingUsers] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [pendingServices, setPendingServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({ user: null, provider: null, service: null, allUser: null });
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    setLoading(true);

    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      setPendingUsers(usersData.filter(user => user.requestStatus === "Pending" && !user.isServiceProvider));
      setServiceProviders(usersData.filter(user => user.isServiceProvider === true));
      setAllUsers(usersData);
      setLoading(false);
    });

    const unsubscribeServices = onSnapshot(collection(db, "services"), (snapshot) => {
      const servicesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPendingServices(servicesData.filter(service => service.status === "Pending"));
      setAvailableServices(servicesData.filter(service => service.status === "Approved"));
      setLoading(false);
    });

    const unsubscribeTickets = onSnapshot(collection(db, "tickets"), (snapshot) => {
      setTickets(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeUsers();
      unsubscribeServices();
      unsubscribeTickets();
    };
  }, []);

  const toggleExpand = (type, id) => {
    setExpanded((prev) => ({
      ...prev,
      [type]: prev[type] === id ? null : id,
    }));
  };

  const approveUser = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        isServiceProvider: true,
        requestStatus: "Approved",
      });
      Alert.alert("Success", "User approved successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to approve user");
    }
  };

  const rejectUser = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        requestStatus: "Rejected",
      });
      Alert.alert("Success", "User rejected successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to reject user");
    }
  };

  const approveService = async (serviceId) => {
    try {
      await updateDoc(doc(db, "services", serviceId), { status: "Approved" });
      Alert.alert("Success", "Service approved successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to approve service");
    }
  };

  const rejectService = async (serviceId) => {
    try {
      await deleteDoc(doc(db, "services", serviceId));
      Alert.alert("Success", "Service rejected successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to reject service");
    }
  };

  const deleteServiceProvider = async (providerId) => {
    try {
      await deleteDoc(doc(db, "users", providerId));
      Alert.alert("Success", "Service provider deleted successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to delete service provider");
    }
  };

  const deleteAvailableService = async (serviceId) => {
    try {
      await deleteDoc(doc(db, "services", serviceId));
      Alert.alert("Success", "Service deleted successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to delete service");
    }
  };

  const suspendService = async (serviceId) => {
    try {
      await updateDoc(doc(db, "services", serviceId), { status: "Pending" });
      Alert.alert("Success", "Service suspended successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to suspend service");
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Admin Dashboard</Text>

      {loading && <ActivityIndicator size="large" color={colors.primary} />}

      {/* Metrics Overview */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Ionicons name="people-outline" size={24} color={colors.primary} />
          <Text style={styles.metricNumber}>{allUsers.length}</Text>
          <Text style={styles.metricLabel}>Total Users</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="construct-outline" size={24} color={colors.primary} />
          <Text style={styles.metricNumber}>{availableServices.length}</Text>
          <Text style={styles.metricLabel}>Available Services</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="alert-circle-outline" size={24} color={colors.primary} />
          <Text style={styles.metricNumber}>{tickets.filter(t => t.status !== "Resolved").length}</Text>
          <Text style={styles.metricLabel}>Open Tickets</Text>
        </View>
      </View>
      {/* Pending Users */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Pending Users</Text>
      {pendingUsers.length > 0 ? pendingUsers.map((user) => (
        <View key={user.id} style={[styles.card, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={() => toggleExpand("user", user.id)}>
            <Text style={[styles.cardTitle, { color: colors.primary }]}>{user.name} - {user.email}</Text>
          </TouchableOpacity>
          {expanded.user === user.id && (
            <View style={styles.expandedContent}>
              <Image source={{ uri: user.userAvatar || "https://cdn-icons-png.flaticon.com/512/9187/9187604.png" }} style={styles.userAvatar} />
              <Text style={styles.infoText}>📞 {user.phone}</Text>
              <Text style={styles.infoText}>📍 {user.address}</Text>
              <Text style={styles.infoText}>🆔 {user.cnicNumber}</Text>
              <Text style={styles.infoText}>🎂 {user.dateOfBirth}</Text>
              <Image source={{ uri: user.cnicFrontPath }} style={styles.cnicImage} />
              <Image source={{ uri: user.cnicBackPath }} style={styles.cnicImage} />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.approveButton, { backgroundColor: "#34d399" }]} onPress={() => approveUser(user.id)}>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.rejectButton, { backgroundColor: "#f44336" }]} onPress={() => rejectUser(user.id)}>
                  <Ionicons name="close-circle-outline" size={18} color="#fff" />
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )) : <Text style={styles.noDataText}>No Pending Users</Text>}

      {/* Service Providers */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Service Providers</Text>
      {serviceProviders.length > 0 ? serviceProviders.map((provider) => (
        <View key={provider.id} style={[styles.card, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={() => toggleExpand("provider", provider.id)}>
            <Text style={[styles.cardTitle, { color: colors.primary }]}>{provider.name} - {provider.email}</Text>
          </TouchableOpacity>
          {expanded.provider === provider.id && (
            <View style={styles.expandedContent}>
              <Image source={{ uri: provider.userAvatar || "https://cdn-icons-png.flaticon.com/512/9187/9187604.png" }} style={styles.userAvatar} />
              <Text style={styles.infoText}>📞 {provider.phone}</Text>
              <Text style={styles.infoText}>📍 {provider.address}</Text>
              <Text style={styles.infoText}>🆔 {provider.cnicNumber}</Text>
              <Text style={styles.infoText}>🎂 {provider.dateOfBirth}</Text>
              <TouchableOpacity style={[styles.rejectButton, { backgroundColor: "#f44336" }]} onPress={() => deleteServiceProvider(provider.id)}>
                <Ionicons name="trash-outline" size={18} color="#fff" />
                <Text style={styles.buttonText}>Delete Provider</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )) : <Text style={styles.noDataText}>No Service Providers</Text>}

      {/* Pending Services */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Pending Services</Text>
      {pendingServices.length > 0 ? pendingServices.map((service) => {
        const requestedBy = users.find(user => user.id === service.userId);
        return (
          <View key={service.id} style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.primary }]}>{service.serviceName} - <Text style={styles.badgePending}>Pending</Text></Text>
            <Text style={styles.infoText}>🛠 {service.category}</Text>
            <Text style={styles.infoText}>📝 {service.description}</Text>
            <Text style={styles.infoText}>💰 {service.priceRange} PKR</Text>
            <Text style={styles.infoText}>📅 {service.availability}</Text>
            {requestedBy && (
              <>
                <Text style={styles.infoText}>👤 Requested by: {requestedBy.name} - {requestedBy.email}</Text>
                <Text style={styles.infoText}>📞 {requestedBy.phone}</Text>
              </>
            )}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.approveButton, { backgroundColor: "#34d399" }]} onPress={() => approveService(service.id)}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.rejectButton, { backgroundColor: "#f44336" }]} onPress={() => rejectService(service.id)}>
                <Ionicons name="close-circle-outline" size={18} color="#fff" />
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }) : <Text style={styles.noDataText}>No Pending Services</Text>}
      {/* Available Services */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Services</Text>
      {availableServices.length > 0 ? availableServices.map((service) => {
        const serviceProvider = users.find(user => user.id === service.userId);

        return (
          <View key={service.id} style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.primary }]}>{service.serviceName} - <Text style={styles.badgeResolved}>Approved</Text></Text>
            <Text style={styles.infoText}>👤 Provider: {serviceProvider ? serviceProvider.name : 'Unknown'} - {service.userId}</Text>
            <Text style={styles.infoText}>🛠 Category: {service.category}</Text>
            <Text style={styles.infoText}>💰 Price: {service.priceRange} PKR</Text>
            <Text style={styles.infoText}>📝 Description: {service.description}</Text>
            <Text style={styles.infoText}>📅 Availability: {service.availability}</Text>
            <Text style={styles.infoText}>🏙 City: {service.city}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.rejectButton, { backgroundColor: "#f44336" }]} onPress={() => deleteAvailableService(service.id)}>
                <Ionicons name="trash-outline" size={18} color="#fff" />
                <Text style={styles.buttonText}>Delete Service</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.rejectButton, { backgroundColor: "#fbbf24" }]} onPress={() => suspendService(service.id)}>
                <Ionicons name="pause-circle-outline" size={18} color="#fff" />
                <Text style={styles.buttonText}>Suspend</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }) : <Text style={styles.noDataText}>No Available Services</Text>}


      {/* Support Tickets */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Support Tickets</Text>
      {tickets.length > 0 ? tickets.map((ticket) => {
        const fromUser = allUsers.find(user => user.id === ticket.fromId); // Updated to use fromId
        const againstUser = allUsers.find(user => user.id === ticket.againstId); // Updated to use againstId
        const badgeStyle =
          ticket.status === "Resolved"
            ? styles.badgeResolved
            : ticket.status === "Open"
              ? styles.badgeOpen
              : styles.badgePending;

        return (
          <View key={ticket.id} style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.primary }]}>{ticket.subject}</Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>From:</Text> {fromUser?.name || "Unknown"} ({ticket.fromId})
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Against:</Text> {againstUser?.name || "Unknown"} ({ticket.againstId})
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Status:</Text>{" "}
              <Text style={badgeStyle}>{ticket.status}</Text>
            </Text>
            <Text style={styles.infoText}>📝 {ticket.description}</Text>
            {ticket.adminResponse && (
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Admin Response:</Text> {ticket.adminResponse}
              </Text>
            )}
            {ticket.status !== "Resolved" && (
              <TouchableOpacity
                style={[styles.approveButton, { backgroundColor: colors.primary }]}
                onPress={async () => {
                  try {
                    await updateDoc(doc(db, "tickets", ticket.id), {
                      status: "Resolved",
                      updatedAt: new Date(),
                    });
                    Alert.alert("Success", "Ticket marked as Resolved.");
                  } catch (error) {
                    Alert.alert("Error", "Failed to mark as Resolved.");
                  }
                }}
              >
                <Ionicons name="checkmark-done-outline" size={18} color="#fff" />
                <Text style={styles.buttonText}>Mark Resolved</Text>
              </TouchableOpacity>

            )}
          </View>
        );
      }) : <Text style={styles.noDataText}>No Support Tickets</Text>}

      {/* All Users */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>All Users</Text>
      {allUsers.length > 0 ? allUsers.map((user) => (
        <View key={user.id} style={[styles.card, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={() => toggleExpand("allUser", user.id)}>
            <Text style={[styles.cardTitle, { color: colors.primary }]}>{user.name} - {user.email}</Text>
          </TouchableOpacity>
          {expanded.allUser === user.id && (
            <View style={styles.expandedContent}>
              <Image source={{ uri: user.userAvatar || "https://cdn-icons-png.flaticon.com/512/9187/9187604.png" }} style={styles.userAvatar} />
              <Text style={styles.infoText}>📞 {user.phone}</Text>
              <Text style={styles.infoText}>📍 {user.address}</Text>
              <Text style={styles.infoText}>🆔 {user.cnicNumber}</Text>
              <Text style={styles.infoText}>🎂 {user.dateOfBirth}</Text>
            </View>
          )}
        </View>
      )) : <Text style={styles.noDataText}>No Users Found</Text>}

    </ScrollView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginTop: 30, marginBottom: 10 },
  card: {
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  badgePending: { color: "#f59e0b", fontWeight: "bold" },
  badgeResolved: { color: "#10b981", fontWeight: "bold" },
  expandedContent: { marginTop: 10 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  buttonText: { color: "#fff", fontSize: 14, fontWeight: "bold", marginLeft: 5 },
  approveButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  rejectButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  userAvatar: { width: 80, height: 80, borderRadius: 40, marginVertical: 10 },
  cnicImage: { width: 150, height: 90, marginVertical: 5, borderRadius: 5 },
  infoText: { fontSize: 14, marginVertical: 3 },
  noDataText: { textAlign: "center", fontSize: 14, color: "#888", marginVertical: 10 },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: "center",
    elevation: 2,
    shadowOpacity: 0.1,
  },
  metricNumber: { fontSize: 20, fontWeight: "bold", marginTop: 8 },
  metricLabel: { fontSize: 12, color: "#666", marginTop: 4 },
});
