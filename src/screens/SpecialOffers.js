import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const SpecialOffers = ({ navigation }) => {
  const offers = [
    {
      id: 1,
      discount: "30%",
      title: "Today's Special!",
      description: "Get discount for every order, only valid for today",
      backgroundColor: "#4a90e2",
    },
    {
      id: 2,
      discount: "25%",
      title: "Friday Special!",
      description: "Get discount for every order, only valid for today",
      backgroundColor: "#ff6b6b",
    },
    {
      id: 3,
      discount: "40%",
      title: "New Promo!",
      description: "Get discount for every order, only valid for today",
      backgroundColor: "#fbbf24",
    },
    {
      id: 4,
      discount: "35%",
      title: "Weekend Special!",
      description: "Get discount for every order, only valid for today",
      backgroundColor: "#34d399",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#005bea" barStyle="light-content" />
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Special Offers</Text>
          <Icon name="ellipsis-horizontal-outline" size={24} color="#fff" />
        </View>

        {/* Offers List */}
        <ScrollView>
          {offers.map((offer) => (
            <View
              key={offer.id}
              style={[
                styles.offerCard,
                { backgroundColor: offer.backgroundColor },
              ]}
            >
              <Text style={styles.discount}>{offer.discount}</Text>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerDescription}>{offer.description}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SpecialOffers;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#005bea",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  headerTitle: {
    fontSize: 22,
    color: "#4a90e2",
    fontWeight: "bold",
  },
  offerCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  discount: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  offerTitle: {
    color: "#fff",
    fontSize: 20,
    marginVertical: 5,
    fontWeight: "600",
  },
  offerDescription: {
    color: "#f0f0f0",
    fontSize: 16,
  },
});
