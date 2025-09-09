import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withRepeat, 
  withSequence,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const LoadingScreen = ({ onLoadingComplete }) => {
  const logoScale = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    // Logo animation
    logoScale.value = withSpring(1, { damping: 8, stiffness: 100 });
    logoRotation.value = withRepeat(
      withSequence(
        withSpring(360, { duration: 2000 }),
        withSpring(0, { duration: 2000 })
      ),
      -1,
      true
    );

    // Text animation
    setTimeout(() => {
      textOpacity.value = withSpring(1);
    }, 500);

    // Progress animation
    setTimeout(() => {
      progressWidth.value = withSpring(100, { duration: 3000 });
    }, 1000);

    // Complete loading after 4 seconds
    setTimeout(() => {
      if (onLoadingComplete) {
        runOnJS(onLoadingComplete)();
      }
    }, 4000);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotation.value}deg` }
    ],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [
      {
        translateY: interpolate(
          textOpacity.value,
          [0, 1],
          [20, 0]
        )
      }
    ],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <LinearGradient
      colors={['#4a90e2', '#005bea', '#1e3a8a']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>H</Text>
          </View>
        </Animated.View>

        {/* App Name */}
        <Animated.View style={textAnimatedStyle}>
          <Text style={styles.appName}>HelperHive</Text>
          <Text style={styles.tagline}>Your Home Service Solution</Text>
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View style={[styles.progressBar, progressAnimatedStyle]} />
          </View>
          <Animated.View style={textAnimatedStyle}>
            <Text style={styles.loadingText}>Loading amazing services...</Text>
          </Animated.View>
        </View>
      </View>

      {/* Decorative Elements */}
      <View style={styles.decorativeElements}>
        {[...Array(20)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.decorativeCircle,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                animationDelay: `${Math.random() * 3}s`,
              }
            ]}
          />
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 50,
  },
  progressContainer: {
    width: width * 0.7,
    alignItems: 'center',
  },
  progressBackground: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 15,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeCircle: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
  },
});

export default LoadingScreen;
