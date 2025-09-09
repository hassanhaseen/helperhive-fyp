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
  Dimensions,
  RefreshControl,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { FlatGrid } from 'react-native-super-grid';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { auth, db } from "../firebase";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import FloatingActionButton from "../components/FloatingActionButton";

const { width, height } = Dimensions.get('window');

const EnhancedHomePage = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const { colors, isDarkMode } = useContext(ThemeContext);

  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");

  const cities = [
    "Lahore", "Faisalabad", "Islamabad", "Karachi", "Rawalpindi",
    "Peshawar", "Multan", "Quetta", "Sialkot", "Gujranwala",
  ];

  const categories = [
    { name: "All", icon: "grid-outline", color: "#4A90E2" },
    { name: "Cleaning", icon: "brush-outline", color: "#34D399" },
    { name: "Repairing", icon: "build-outline", color: "#F59E0B" },
    { name: "Painting", icon: "color-palette-outline", color: "#EF4444" },
    { name: "Laundry", icon: "shirt-outline", color: "#8B5CF6" },
    { name: "Appliance", icon: "tv-outline", color: "#06B6D4" },
    { name: "Plumbing", icon: "water-outline", color: "#10B981" },
    { name: "Beauty", icon: "cut-outline", color: "#F97316" },
    { name: "AC Repair", icon: "snow-outline", color: "#3B82F6" },
  ];

  // Animation values
  const headerOpacity = useSharedValue(1);
  const searchScale = useSharedValue(1);

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
    fetchUserDetails();
    fetchServices();
  }, []);

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

  const fetchServices = () => {
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
        setRefreshing(false);
      }
    );

    return () => unsubscribeServices();
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchServices();
  };

  const filterServices = () => {
    let filtered = services;

    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    if (selectedCity) {
      filtered = filtered.filter(service => service.city === selectedCity);
    }

    setFilteredServices(filtered);
  };

  useEffect(() => {
    filterServices();
  }, [searchQuery, selectedCategory, selectedCity, services]);

  const handleSearchFocus = () => {
    searchScale.value = withSpring(1.02);
  };

  const handleSearchBlur = () => {
    searchScale.value = withSpring(1);
  };

  const animatedSearchStyle = useAnimatedStyle(() => ({
    transform: [{ scale: searchScale.value }],
  }));

  const renderServiceCard = ({ item, index }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      style={[styles.serviceCard, { backgroundColor: colors.card }]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("ServiceDetails", { service: item })}
        style={styles.serviceCardContent}
      >
        <View style={styles.serviceHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + '20' }]}>
            <Icon name={getCategoryIcon(item.category)} size={16} color={getCategoryColor(item.category)} />
            <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]} numberOfLines={1}>
              {item.category}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.priceText, { color: colors.primary }]} numberOfLines={1}>
          PKR {item.priceRange}
        </Text>
        
        <Text style={[styles.serviceTitle, { color: colors.text }]} numberOfLines={2}>
          {item.serviceName}
        </Text>
        
        <Text style={[styles.serviceDescription, { color: colors.text + '80' }]} numberOfLines={3}>
          {item.description}
        </Text>
        
        <View style={styles.serviceFooter}>
          <View style={styles.locationContainer}>
            <Icon name="location-outline" size={14} color={colors.text + '60'} />
            <Text style={[styles.locationText, { color: colors.text + '60' }]} numberOfLines={1}>
              {item.city}
            </Text>
          </View>
          <View style={styles.availabilityContainer}>
            <Icon name="time-outline" size={14} color={colors.success || '#10B981'} />
            <Text style={[styles.availabilityText, { color: colors.success || '#10B981' }]} numberOfLines={1}>
              Available
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderCategoryChip = ({ item, index }) => (
    <Animated.View entering={SlideInRight.delay(index * 50)}>
      <TouchableOpacity
        style={[
          styles.categoryChip,
          {
            backgroundColor: selectedCategory === item.name ? item.color : colors.card,
            borderColor: item.color,
          }
        ]}
        onPress={() => setSelectedCategory(selectedCategory === item.name ? null : item.name)}
      >
        <Icon
          name={item.icon}
          size={20}
          color={selectedCategory === item.name ? '#fff' : item.color}
        />
        <Text
          style={[
            styles.categoryChipText,
            {
              color: selectedCategory === item.name ? '#fff' : colors.text,
            }
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.name === category);
    return categoryData ? categoryData.icon : 'construct-outline';
  };

  const getCategoryColor = (category) => {
    const categoryData = categories.find(cat => cat.name === category);
    return categoryData ? categoryData.color : '#4A90E2';
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading services...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.primary} barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <Animated.View 
        entering={FadeInUp.springify()}
        style={[styles.header, { backgroundColor: colors.primary }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userNameText}>{userName}! 👋</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Image
              source={{
                uri: userImage || "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Search Section */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={[animatedSearchStyle, styles.searchSection]}
        >
          <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
            <Icon name="search-outline" size={20} color={colors.text + '60'} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search services..."
              placeholderTextColor={colors.text + '60'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Icon name="close-circle" size={20} color={colors.text + '60'} />
              </TouchableOpacity>
            ) : null}
          </View>
        </Animated.View>

        {/* City Filter */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          style={styles.filterSection}
        >
          <View style={[styles.pickerContainer, { backgroundColor: colors.card }]}>
            <Icon name="location-outline" size={20} color={colors.primary} />
            <Picker
              selectedValue={selectedCity}
              onValueChange={setSelectedCity}
              style={[styles.picker, { color: colors.text }]}
            >
              <Picker.Item label="All Cities" value="" />
              {cities.map((city, index) => (
                <Picker.Item key={index} label={city} value={city} />
              ))}
            </Picker>
          </View>
        </Animated.View>

        {/* Categories */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryChip}
            keyExtractor={(item) => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </Animated.View>

        {/* Services Grid */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Available Services ({filteredServices.length})
          </Text>
          <FlatGrid
            itemDimension={width / 2 - 30}
            data={filteredServices}
            style={styles.gridList}
            spacing={15}
            renderItem={renderServiceCard}
            staticDimension={width}
            fixed={true}
            maxItemsPerRow={2}
          />
        </Animated.View>
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton navigation={navigation} colors={colors} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  userNameText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 2,
  },
  profileButton: {
    padding: 2,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  picker: {
    flex: 1,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryChipText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  gridList: {
    paddingHorizontal: 20,
  },
  serviceCard: {
    borderRadius: 15,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
    minHeight: 180, // Ensure consistent minimum height
  },
  serviceCardContent: {
    flex: 1,
    justifyContent: 'space-between', // Distribute content evenly
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start', // Align to start instead of stretching
  },
  categoryText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'flex-start', // Align to start
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 22, // Better line spacing
    minHeight: 44, // Consistent height for 2 lines
  },
  serviceDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    flex: 1, // Take available space
    minHeight: 60, // Consistent height for 3 lines
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto', // Push to bottom
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 12,
    flexShrink: 1, // Allow text to shrink if needed
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0, // Prevent shrinking
  },
  availabilityText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default EnhancedHomePage;
