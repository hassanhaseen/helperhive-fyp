import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native-animatable';
import Toast from 'react-native-toast-message'; // Optional feedback
import logo from '../assets/logo.png';

const { width } = Dimensions.get('window');

const LandingPage = ({ navigation }) => {
  const handleGetStarted = () => {
    Toast.show({
      type: 'info',
      text1: 'Welcome!',
      text2: 'Please log in to continue.',
    });

    navigation.navigate('SignIn');
  };

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
        <Text style={styles.heroTitle}>Your One-Stop Home Services Solution</Text>
        <Text style={styles.heroSubtitle}>
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

      <TouchableOpacity
        style={styles.ctaButton}
        onPress={handleGetStarted}
        activeOpacity={0.8}
        accessibilityLabel="Get Started Now"
        accessibilityRole="button"
      >
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
    marginTop: 20,
  },
  heroImage: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 20,
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
    borderRadius: 10,
    elevation: 3, // adds shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LandingPage;
