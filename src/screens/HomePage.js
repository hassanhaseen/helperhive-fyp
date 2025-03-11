import React, { useState, useEffect, useContext } from "react";
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
  StatusBar,
} from "react-native";
import Navbar from "./navbar";
import Icon from "react-native-vector-icons/Ionicons";
import { auth, db } from "../firebase";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import Toast from "react-native-toast-message";

const HomePage = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const { colors, isDarkMode } = useContext(ThemeContext);

  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (!user) {
      Toast.show({
        type: "info",
        text1: "Session Expired",
        text2: "Please log in again.",
      });
      navigation.navigate("SignIn");
    }
  }, [user]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        setUserName(currentUser.name || "User");

        if (currentUser.photoURL) {
          setUserImage(currentUser.photoURL);
        } else {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            let userData = userDoc.data();
            setUserImage(userData?.userAvatar || "");
            setUserName(userData?.name || "User");
          }
        }
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    setLoading(true);

    const unsubscribeServices = onSnapshot(
      collection(db, "services"),
      (snapshot) => {
        const servicesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const approvedServices = servicesData.filter(
          (service) => service.status === "Approved"
        );

        setServices(approvedServices);
        setFilteredServices(approvedServices);
        setLoading(false);
      }
    );

    return () => unsubscribeServices();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedCategory(null);

    if (query.trim() === "") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter((service) =>
        service.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  };

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setFilteredServices(services);
    } else {
      setSelectedCategory(category);
      const filtered = services.filter(
        (service) => service.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredServices(filtered);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.primary }]}>Loading Services...</Text>
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
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
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
              <Text style={[styles.greetingText, { color: colors.text }]}>
                Welcome Back,{" "}
                <Text style={{ color: colors.primary }}>{userName}</Text>! 👋
              </Text>
            </View>
          </View>

          {/* Search */}
          <View
            style={[
              styles.searchBar,
              { backgroundColor: isDarkMode ? colors.card : "#e6e9ee" },
            ]}
          >
            <TextInput
              placeholder="Search by category"
              placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
              style={[styles.searchInput, { color: colors.text }]}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <Icon name="search-outline" size={20} color={colors.text} />
          </View>

          {/* Services */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Available Services
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.serviceList}
          >
            {filteredServices.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[styles.serviceCard, { backgroundColor: colors.card }]}
                onPress={() =>
                  navigation.navigate("ServiceDetails", { service })
                }
              >
                <Text style={[styles.serviceName, { color: colors.text }]}>
                  {service.serviceName}
                </Text>
                <Text style={[styles.serviceCategory, { color: colors.text }]}>
                  {service.category}
                </Text>
                <Text style={[styles.serviceDescription, { color: colors.text }]}>
                  {service.description}
                </Text>
                <Text style={[styles.servicePrice, { color: colors.primary }]}>
                  {service.priceRange}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {filteredServices.length === 0 && (
            <Text style={[styles.noResultsText, { color: colors.text }]}>
              No services found for "{searchQuery || selectedCategory}".
            </Text>
          )}

          {/* Categories */}
          <View style={styles.section00}>
            <Text style={[styles.sectionTitle00, { color: colors.text }]}>
              Service Categories
            </Text>
            <TouchableOpacity>
              <Text style={{ color: colors.primary }}></Text>
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
              { name: "Other", icon: "ellipsis-horizontal-outline", color: "#c084fc" },
            ].map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.serviceItem00,
                  selectedCategory === category.name && {
                    transform: [{ scale: 1.05 }],
                  },
                ]}
                onPress={() => handleCategorySelect(category.name)}
              >
                <View
                  style={[
                    styles.serviceIcon00,
                    {
                      backgroundColor:
                        selectedCategory === category.name
                          ? colors.primary
                          : category.color,
                    },
                  ]}
                >
                  <Icon name={category.icon} size={24} color="#fff" />
                </View>
                <Text
                  style={[
                    styles.serviceText00,
                    {
                      color: colors.text,
                      fontWeight:
                        selectedCategory === category.name ? "bold" : "normal",
                    },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Special Offers */}
          <View style={styles.section00}>
            <Text style={[styles.sectionTitle00, { color: colors.text }]}>
              Special Offers
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SpecialOffers")}
            >
              <Text style={{ color: colors.primary }}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.offerContainer}
          >
            {[
              { text: "30%", sub: "Today's Special!", color: "#ff6b6b" },
              { text: "25%", sub: "Friday Special!", color: "#fbbf24" },
              { text: "35%", sub: "Weekend Special!", color: "#34d399" },
            ].map((offer, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.offerCard, { backgroundColor: offer.color }]}
                onPress={() => navigation.navigate("SpecialOffers")}
              >
                <Text style={styles.offerText}>{offer.text}</Text>
                <Text style={styles.offerSubtext}>{offer.sub}</Text>
                <Text style={styles.offerDesc}>
                  Get discount for every order, only valid for today!
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
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
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  greetingText: {
    marginLeft: 10,
    fontSize: 16,
  },
  searchBar: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
    fontSize: 14,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  serviceList: {
    paddingLeft: 20,
  },
  serviceCard: {
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: 250,
    elevation: 3,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  serviceCategory: {
    marginBottom: 5,
  },
  serviceDescription: {
    marginBottom: 10,
  },
  servicePrice: {
    fontWeight: "bold",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  section00: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitle00: {
    fontSize: 18,
    fontWeight: "bold",
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
    textAlign: "center",
    marginTop: 8,
  },
  offerContainer: {
    flexDirection: "row",
    paddingLeft: 20,
  },
  offerCard: {
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
