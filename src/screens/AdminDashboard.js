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
  const [expanded, setExpanded] = useState({ user: null, provider: null, service: null, allUser: null });
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    setLoading(true);

    // Fetch Users
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      setPendingUsers(usersData.filter(user => user.requestStatus === "Pending" && !user.isServiceProvider));
      setServiceProviders(usersData.filter(user => user.isServiceProvider === true));
      setAllUsers(usersData);
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
              <Text style={styles.infoText}><Text style={styles.infoLabel}>Phone:</Text> {user.phone}</Text>
              <Text style={styles.infoText}><Text style={styles.infoLabel}>Address:</Text> {user.address}</Text>
              <Text style={styles.infoText}><Text style={styles.infoLabel}>CNIC:</Text> {user.cnicNumber}</Text>
              <Text style={styles.infoText}><Text style={styles.infoLabel}>Date of Birth:</Text> {user.dateOfBirth}</Text>
              <Image source={{ uri: user.cnicFrontPath }} style={styles.cnicImage} />
              <Image source={{ uri: user.cnicBackPath }} style={styles.cnicImage} />
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
          <TouchableOpacity onPress={() => toggleExpand("provider", provider.id)}>
            <Text style={styles.cardTitle}>{provider.name} - {provider.email}</Text>
          </TouchableOpacity>
          {expanded.provider === provider.id && (
            <View style={styles.expandedContent}>
              <Image source={{ uri: provider.profileImage }} style={styles.profileImage} />
              <Text style={styles.infoText}><Text style={styles.infoLabel}>Phone:</Text> {provider.phone}</Text>
              <Text style={styles.infoText}><Text style={styles.infoLabel}>Address:</Text> {provider.address}</Text>
              <Text style={styles.infoText}><Text style={styles.infoLabel}>CNIC:</Text> {provider.cnicNumber}</Text>
              <Text style={styles.infoText}><Text style={styles.infoLabel}>Date of Birth:</Text> {provider.dateOfBirth}</Text>
              <Image source={{ uri: provider.cnicFrontPath }} style={styles.cnicImage} />
              <Image source={{ uri: provider.cnicBackPath }} style={styles.cnicImage} />
              <TouchableOpacity style={styles.rejectButton} onPress={() => deleteServiceProvider(provider.id)}>
                <Text style={styles.buttonText}>Delete Provider</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )) : <Text style={styles.noDataText}>No Service Providers</Text>}

      {/* Pending Services */}
      <Text style={styles.sectionTitle}>Pending Services</Text>
      {pendingServices.length > 0 ? pendingServices.map((service) => {
        const requestedBy = users.find(user => user.id === service.userId);
        return (
          <View key={service.id} style={styles.card}>
            <Text style={styles.cardTitle}>{service.serviceName} - {service.category}</Text>
            <Text style={styles.infoText}>Description: {service.description}</Text>
            <Text style={styles.infoText}>Price Range: {service.priceRange}</Text>
            <Text style={styles.infoText}>Availability: {service.availability}</Text>
            {requestedBy && (
              <>
                <Text style={styles.infoText}><Text style={styles.infoLabel}>Requested by:</Text> {requestedBy.name} - {requestedBy.email}</Text>
                <Image source={{ uri: requestedBy.profileImage }} style={styles.profileImage} />
                <Text style={styles.infoText}><Text style={styles.infoLabel}>Phone:</Text> {requestedBy.phone}</Text>
                <Text style={styles.infoText}><Text style={styles.infoLabel}>Address:</Text> {requestedBy.address}</Text>
                <Text style={styles.infoText}><Text style={styles.infoLabel}>CNIC:</Text> {requestedBy.cnicNumber}</Text>
                <Text style={styles.infoText}><Text style={styles.infoLabel}>Date of Birth:</Text> {requestedBy.dateOfBirth}</Text>
                <Image source={{ uri: requestedBy.cnicFrontPath }} style={styles.cnicImage} />
                <Image source={{ uri: requestedBy.cnicBackPath }} style={styles.cnicImage} />
              </>
            )}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.approveButton} onPress={() => approveService(service.id)}>
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={() => rejectService(service.id)}>
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }) : <Text style={styles.noDataText}>No Pending Services</Text>}

      {/* Available Services */}
      <Text style={styles.sectionTitle}>Available Services</Text>
      {availableServices.length > 0 ? availableServices.map((service) => (
        <View key={service.id} style={styles.card}>
          <Text style={styles.cardTitle}>{service.name} - {service.category}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.rejectButton} onPress={() => deleteAvailableService(service.id)}>
              <Text style={styles.buttonText}>Delete Service</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suspendButton} onPress={() => suspendService(service.id)}>
              <Text style={styles.buttonText}>Suspend</Text>
            </TouchableOpacity>
          </View>
        </View>
      )) : <Text style={styles.noDataText}>No Available Services</Text>}

      {/* All Users of HelperHive */}
      <Text style={styles.sectionTitle}>All Users of HelperHive</Text>
      <Text style={styles.infoText}>Total Users: {allUsers.length}</Text>
      {allUsers.length > 0 ? allUsers.map((user) => (
        <View key={user.id} style={styles.card}>
          <TouchableOpacity onPress={() => toggleExpand("allUser", user.id)}>
            <Text style={styles.cardTitle}>{user.name} - {user.email}</Text>
          </TouchableOpacity>
          {expanded.allUser === user.id && (
            <View style={styles.expandedContent}>
              <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
              <Text style={styles.infoText}><Text style={styles.infoLabel}>Phone:</Text> {user.phone}</Text>
              <Text style={styles.infoText}><Text style={styles.infoLabel}>Address:</Text> {user.address}</Text>
              <Text style={styles.infoText}><Text style={styles.infoLabel}>CNIC:</Text> {user.cnicNumber}</Text>
              <Text style={styles.infoText}><Text style={styles.infoLabel}>Date of Birth:</Text> {user.dateOfBirth}</Text>
              <Image source={{ uri: user.cnicFrontPath }} style={styles.cnicImage} />
              <Image source={{ uri: user.cnicBackPath }} style={styles.cnicImage} />
            </View>
          )}
        </View>
      )) : <Text style={styles.noDataText}>No Users Found</Text>}
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
  suspendButton: { backgroundColor: "#FFA500", padding: 10, borderRadius: 5, alignItems: "center", flex: 1, marginLeft: 5 },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginVertical: 10 },
  cnicImage: { width: 150, height: 90, marginVertical: 5, borderRadius: 5 },
  noDataText: { textAlign: "center", fontSize: 14, color: "#888", marginVertical: 10 },
  infoText: { fontSize: 14, color: "#333", marginVertical: 2 },
  infoLabel: { fontWeight: "bold", color: "#4a90e2" },
});