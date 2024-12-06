import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Use expo-linear-gradient
import { Image } from 'react-native-animatable'; // Animatable Image
import logo from '../assets/logo.png'; // Import the logo

const { width } = Dimensions.get('window');

const LandingPage = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#4a90e2', '#005bea']} style={styles.heroSection}>
        <View style={styles.logoContainer}>
          <Image
            source={logo}
            style={styles.heroImage}
            animation="bounceIn"
            delay={500}
            duration={1500}
          />
        </View>
        <Text
          style={styles.heroTitle}
          animation="fadeInUp"
          delay={1000}
          duration={1500}
        >
          Your One-Stop Home Services Solution
        </Text>
        <Text
          style={styles.heroSubtitle}
          animation="fadeInUp"
          delay={1200}
          duration={1500}
        >
          Find reliable professionals for all your home needs.
        </Text>
      </LinearGradient>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Choose HelperHive?</Text>
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>🏠 Wide Range of Services</Text>
          <Text style={styles.featureDescription}>
            From cleaning to repairs, we've got you covered.
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>👨‍🔧 Verified Professionals</Text>
          <Text style={styles.featureDescription}>
            All our helpers are background-checked and skilled.
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>⭐ Quality Assurance</Text>
          <Text style={styles.featureDescription}>
            Satisfaction guaranteed or your money back.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.ctaButtonText}>Get Started Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  logoContainer: {
    marginTop: 35, // Add gap above the logo
  },
  heroImage: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 20,
    borderRadius: width * 0.25,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#e0e0e0',
    paddingHorizontal: 20,
  },
  featuresSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  featureItem: {
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4a90e2',
  },
  featureDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    alignItems: 'center',
    margin: 20,
    borderRadius: 5,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LandingPage;
