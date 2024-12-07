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
      backgroundColor: "#8b5cf6",
    },
    {
      id: 2,
      discount: "25%",
      title: "Friday Special!",
      description: "Get discount for every order, only valid for today",
      backgroundColor: "#f87171",
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
      <StatusBar backgroundColor="#111" barStyle="light-content" />
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
    backgroundColor: "#111",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#111",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  offerCard: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
  },
  discount: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  offerTitle: {
    color: "#fff",
    fontSize: 18,
    marginVertical: 5,
  },
  offerDescription: {
    color: "#fff",
    fontSize: 14,
  },
});
