import React, { useContext } from "react";
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
import { ThemeContext } from "../context/ThemeContext"; // Global theme context
import Toast from 'react-native-toast-message';

const SpecialOffers = ({ navigation }) => {
  const { colors, isDarkMode } = useContext(ThemeContext);

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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        backgroundColor={colors.primary}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Special Offers</Text>
          <Icon name="gift-outline" size={28} color={colors.primary} />
        </View>

        {/* Offers List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {offers.length === 0 ? (
            Toast.show({
              type: 'info',
              text1: 'No Offers Available',
              text2: 'Please check back later.',
            })
          ) : (
            offers.map((offer) => (
              <TouchableOpacity key={offer.id} activeOpacity={0.9}>
                <View
                  style={[
                    styles.offerCard,
                    {
                      backgroundColor: offer.backgroundColor,
                      borderColor: isDarkMode ? "#333" : "#ddd",
                    },
                  ]}
                >
                  <Text style={styles.discount}>{offer.discount}</Text>
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerDescription}>{offer.description}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SpecialOffers;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  offerCard: {
    borderRadius: 16,
    padding: 25,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  discount: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  offerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },
  offerDescription: {
    color: "#f0f0f0",
    fontSize: 16,
  },
});
