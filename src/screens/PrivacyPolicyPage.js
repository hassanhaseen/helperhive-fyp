import React, { useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "../context/ThemeContext";

const PrivacyPolicyPage = ({ navigation }) => {
  const { colors, isDarkMode } = useContext(ThemeContext);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={{ flexDirection: "row", alignItems: "center", padding: 15 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: "bold", color: colors.text }}>
          Privacy Policy
        </Text>
      </View>

      <ScrollView style={{ padding: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.primary, marginTop: 10 }}>
          1. Information We Collect
        </Text>
        <Text style={{ color: colors.text, marginVertical: 10 }}>
          • Name, email, phone number, and address{"\n"}
          • Payment details (if applicable){"\n"}
          • Location (with your permission){"\n"}
          • Service provider information (CNIC, work history)
        </Text>

        <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.primary, marginTop: 20 }}>
          2. How We Use Your Information
        </Text>
        <Text style={{ color: colors.text, marginVertical: 10 }}>
          • To provide and manage home services{"\n"}
          • To connect you with service providers{"\n"}
          • To process payments securely{"\n"}
          • To improve our app and customer support
        </Text>

        <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.primary, marginTop: 20 }}>
          3. Sharing of Information
        </Text>
        <Text style={{ color: colors.text, marginVertical: 10 }}>
          • Only shared with trusted service providers and payment processors{"\n"}
          • We do not sell your data{"\n"}
          • Shared if required by law
        </Text>

        <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.primary, marginTop: 20 }}>
          4. Data Security
        </Text>
        <Text style={{ color: colors.text, marginVertical: 10 }}>
          We use encryption and secure systems, but no system is 100% secure.
        </Text>

        <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.primary, marginTop: 20 }}>
          5. Your Rights
        </Text>
        <Text style={{ color: colors.text, marginVertical: 10 }}>
          You can access, update, or delete your information anytime. Contact us at support@helperhive.com
        </Text>

        <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.primary, marginTop: 20 }}>
          6. Children’s Privacy
        </Text>
        <Text style={{ color: colors.text, marginVertical: 10 }}>
          HelperHive is not for users under 18. We do not knowingly collect data from children.
        </Text>

        <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.primary, marginTop: 20 }}>
          7. Contact Us
        </Text>
        <Text style={{ color: colors.text, marginVertical: 10 }}>
          📧   support@helperhive.com{"\n"}
          📞   111-HELPER-HIVE
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyPage;
