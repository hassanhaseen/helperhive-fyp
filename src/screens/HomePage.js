import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "react-native";
import Navbar from "./navbar";
import Icon from "react-native-vector-icons/Ionicons";
import { auth, db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const HomePage = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        setUserName(currentUser.displayName || "User");

        if (currentUser.photoURL) {
          setUserImage(currentUser.photoURL);
        } else {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserImage(userDoc.data()?.profileImage || "");
          }
        }
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesCollection = collection(db, "services");
        const servicesSnapshot = await getDocs(servicesCollection);
        const servicesList = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setServices(servicesList);
        setFilteredServices(servicesList);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter((service) =>
        service.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#005bea" barStyle="light-content" />
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <View style={styles.profileContainer}>
              <Image
                source={{
                  uri:
                    userImage ||
                    "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
                }}
                style={styles.profileImage}
              />
              <Text style={styles.greetingText}>
                Welcome Back, <Text style={styles.userName}>{userName}</Text>! 👋
              </Text>
            </View>
          </View>

          <View style={styles.searchBar}>
            <TextInput
              placeholder="Search by category"
              placeholderTextColor="#aaa"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <Icon name="search-outline" size={20} color="#fff" />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Services</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.serviceList}
          >
            {filteredServices.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() =>
                  navigation.navigate("ServiceDetails", { service })
                }
              >
                <Text style={styles.serviceName}>{service.serviceName}</Text>
                <Text style={styles.serviceCategory}>{service.category}</Text>
                <Text style={styles.serviceDescription}>
                  {service.description}
                </Text>
                <Text style={styles.servicePrice}>{service.priceRange}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {filteredServices.length === 0 && (
            <Text style={styles.noResultsText}>
              No services found for "{searchQuery}".
            </Text>
          )}

          {/* Services Section */}
          <View style={styles.section00}>
            <Text style={styles.sectionTitle00}>Service</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll00}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.serviceGrid00}>
            {[
              { name: "Cleaning", icon: "leaf-outline", color: "#8b5cf6" },
              { name: "Repairing", icon: "construct-outline", color: "#fbbf24" },
              { name: "Painting", icon: "color-palette-outline", color: "#60a5fa" },
              { name: "Laundry", icon: "shirt-outline", color: "#f87171" },
              { name: "Appliance", icon: "tv-outline", color: "#34d399" },
              { name: "Plumbing", icon: "water-outline", color: "#4ade80" },
              { name: "Shifting", icon: "cube-outline", color: "#f472b6" },
              { name: "More", icon: "ellipsis-horizontal-outline", color: "#c084fc" },
            ].map((service, index) => (
              <TouchableOpacity key={index} style={styles.serviceItem00}>
                <View style={[styles.serviceIcon00, { backgroundColor: service.color }]}>
                  <Icon name={service.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.serviceText00}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          

          {/* Special Offers */}
          <View style={styles.section00}>
            <Text style={styles.sectionTitle00}>Special Offers</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SpecialOffers")}>
              <Text style={styles.seeAll00}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.offerContainer}
          >
            {[1, 2, 3].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.offerCard}
                onPress={() => navigation.navigate("SpecialOffers")}
              >
                <Text style={styles.offerText}>30%</Text>
                <Text style={styles.offerSubtext}>Today's Special!</Text>
                <Text style={styles.offerDesc}>
                  Get discount for every order, only valid for today
                </Text>
                
              </TouchableOpacity>
            ))}
          </ScrollView>











        </ScrollView>

        <Navbar navigation={navigation} activeTab="HomePage" />
      </View>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#005bea",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greetingText: {
    color: "#333",
    marginLeft: 10,
    fontSize: 16,
  },
  userName: {
    fontWeight: "bold",
    color: "#4a90e2",
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#e6e9ee",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: "#333",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
  },
  serviceList: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  serviceCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginRight: 15,
    width: 250,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  serviceName: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  serviceCategory: {
    color: "#555",
    marginBottom: 5,
  },
  serviceDescription: {
    color: "#777",
    marginBottom: 10,
  },
  servicePrice: {
    color: "#4a90e2",
    fontWeight: "bold",
  },
  noResultsText: {
    color: "#555",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
/*Service Categories Style*/
  section00: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitle00: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll00: {
    color: "#005bea",
  },
  serviceGrid00: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginHorizontal: 10,
  },
  serviceItem00: {
    width: "25%",
    alignItems: "center",
    marginBottom: 20,
  },
  serviceIcon00: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceText00: {
    fontSize: 14,
    color: '#000', // Set text color to black
    fontWeight: 'bold', // Make the text bold
    textAlign: 'center', // Optional: Center-align text
    marginTop: 8, // Optional: Add spacing if needed
  },


  /*Special Offers Style*/
  offerContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  offerCard: {
    //add gradient background
    backgroundColor: "#4a90e2",
    borderRadius: 10,
    padding: 20,
    marginRight: 15,
    width: 250,
  },
  offerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  offerSubtext: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 5,
  },
  offerDesc: {
    color: "#fff",
    fontSize: 12,
  },
});