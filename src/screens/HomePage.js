import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "react-native";
import Navbar from "./navbar"; // Import Navbar
import Icon from "react-native-vector-icons/Ionicons";

const HomePage = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#111" barStyle="light-content" />
      <View style={styles.container}>
        <ScrollView>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.profileContainer}>
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/women/44.jpg",
                }}
                style={styles.profileImage}
              />
              <Text style={styles.greetingText}>
                Good Morning <Text style={styles.username}>Andrew Ainsley</Text> 👋
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity>
                <Icon name="notifications-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Bookmarks")}>
                <Icon name="bookmarks-outline" size={24} color="#fff" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
            <Icon name="options-outline" size={20} color="#fff" />
          </View>

          {/* Special Offers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SpecialOffers")}>
              <Text style={styles.seeAll}>See All</Text>
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
                <Image
                  source={{ uri: "https://via.placeholder.com/150" }}
                  style={styles.offerImage}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Services Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.serviceGrid}>
            {[
              { name: "Cleaning", icon: "broom-outline", color: "#8b5cf6" },
              { name: "Repairing", icon: "construct-outline", color: "#fbbf24" },
              { name: "Painting", icon: "color-palette-outline", color: "#60a5fa" },
              { name: "Laundry", icon: "shirt-outline", color: "#f87171" },
              { name: "Appliance", icon: "tv-outline", color: "#34d399" },
              { name: "Plumbing", icon: "water-outline", color: "#4ade80" },
              { name: "Shifting", icon: "truck-outline", color: "#f472b6" },
              { name: "More", icon: "ellipsis-horizontal-outline", color: "#c084fc" },
            ].map((service, index) => (
              <TouchableOpacity key={index} style={styles.serviceItem}>
                <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
                  <Icon name={service.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.serviceText}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Most Popular Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Most Popular</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filters}>
            {["All", "Cleaning", "Painting", "Laundry"].map((filter, index) => (
              <TouchableOpacity key={index} style={styles.filterButton}>
                <Text style={styles.filterText}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <Navbar navigation={navigation} activeTab="HomePage" />
      </View>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111",
  },
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingTop: StatusBar.currentHeight,
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
    color: "#fff",
    marginLeft: 10,
  },
  username: {
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#333",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    color: "#8b5cf6",
  },
  offerContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  offerCard: {
    backgroundColor: "#8b5cf6",
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
  offerImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginHorizontal: 10,
  },
  serviceItem: {
    width: "25%",
    alignItems: "center",
    marginBottom: 20,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  filters: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    flexWrap: "wrap",
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#333",
    marginHorizontal: 5,
    marginBottom: 10,
  },
  filterText: {
    color: "#8b5cf6",
    fontSize: 14,
  },
});
