import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Linking,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import Navbar from './navbar';
import Toast from 'react-native-toast-message';

const HelpCenterPage = ({ navigation }) => {
  const { colors, isDarkMode } = useContext(ThemeContext);

  const [activeTab, setActiveTab] = useState('FAQ');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [expandedQuestions, setExpandedQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = ['General', 'Account', 'Payment'];

  const faqData = {
    General: [
        { 
          question: 'What is HelperHive?', 
          answer: 'HelperHive is your one-stop solution for all home services, offering a wide range of trusted professionals like cleaners, electricians, and more.' 
        },
        { 
          question: 'How to use HelperHive?', 
          answer: 'Simply sign up, browse available services, select the one you need, and confirm your booking in just a few steps.' 
        },
        { 
          question: 'Is HelperHive free to use?', 
          answer: 'Yes, browsing services is completely free. You only pay for the services you book through the platform.' 
        },
        { 
          question: 'How to add a promo on HelperHive?', 
          answer: 'You can enter valid promo codes during the checkout process to receive discounts on your booking.' 
        },
        { 
          question: 'How to unsubscribe from premium?', 
          answer: 'Go to your account settings, select "Manage Subscription," and choose "Cancel Premium Membership".' 
        },
        { 
          question: 'Is HelperHive available in my city?', 
          answer: 'HelperHive is expanding rapidly. You can check service availability by entering your location on our app or website.' 
        },
        { 
          question: 'Can I schedule services in advance?', 
          answer: 'Yes! You can book services immediately or schedule them for a future date and time as per your convenience.' 
        },
        { 
          question: 'Are service providers verified?', 
          answer: 'All professionals on HelperHive undergo background checks and verification to ensure your safety and satisfaction.' 
        },
      ],
      Account: [
        { 
          question: 'How to reset my password?', 
          answer: 'On the login screen, tap "Forgot Password" and follow the instructions sent to your registered email address.' 
        },
        { 
          question: 'How to edit profile?', 
          answer: 'Go to the Profile section in the app and click "Edit Profile" to update your personal details and preferences.' 
        },
        { 
          question: 'How to delete account?', 
          answer: 'For account deletion, contact our customer support team via the Help Center. They will assist you with the process.' 
        },
        { 
          question: 'How to change email?', 
          answer: 'Go to Account Settings, select "Edit Email", enter your new email address, and verify it to update your account.' 
        },
        { 
          question: 'How to change language?', 
          answer: 'Navigate to the Profile section, tap on Language Settings, and select your preferred language from the list.' 
        },
        { 
          question: 'How to update my phone number?', 
          answer: 'In Account Settings, tap "Edit Phone Number" and follow the verification steps after entering your new number.' 
        },
        { 
          question: 'How to enable two-factor authentication?', 
          answer: 'Go to Security Settings in your account, enable Two-Factor Authentication, and follow the setup instructions.' 
        },
        { 
          question: 'Why can’t I log into my account?', 
          answer: 'Ensure you are using the correct login details. If the issue persists, try resetting your password or contact support.' 
        },
      ],
      Payment: [
        { 
          question: 'What payment methods are accepted?', 
          answer: 'HelperHive accepts major credit/debit cards, PayPal, and selected digital wallets for secure and easy transactions.' 
        },
        { 
          question: 'How to add payment method?', 
          answer: 'Go to Payment Settings, tap "Add Payment Method," and enter your card or PayPal details securely.' 
        },
        { 
          question: 'Is payment secure?', 
          answer: 'Absolutely. All transactions are encrypted and comply with industry security standards to protect your data.' 
        },
        { 
          question: 'How to apply promo code?', 
          answer: 'During checkout, enter your promo code in the designated field and the discount will be applied automatically if valid.' 
        },
        { 
          question: 'How to request refund?', 
          answer: 'If you’re not satisfied with a service, you can request a refund by contacting customer support within 24 hours of service completion.' 
        },
        { 
          question: 'When will I be charged for a service?', 
          answer: 'You’ll be charged only after your booking is confirmed. For some services, payment may be processed after completion.' 
        },
        { 
          question: 'Can I get an invoice for my payment?', 
          answer: 'Yes, invoices are automatically generated and can be downloaded from the Payment History section in your account.' 
        },
        { 
          question: 'What if my payment fails?', 
          answer: 'Check your payment details or try a different method. If issues persist, reach out to customer support for assistance.' 
        },
      ],
  };

  const contactLinks = [
    { label: 'Customer Service', url: 'mailto:hassanhaseen512@gmail.com', icon: 'headset-outline' },
    { label: 'WhatsApp', url: 'https://wa.me/923487473099', icon: 'logo-whatsapp' },
    { label: 'Website', url: 'https://helperhive.com', icon: 'globe-outline' },
    { label: 'Facebook', url: 'https://facebook.com/hassanhaseen512', icon: 'logo-facebook' },
    { label: 'Instagram', url: 'https://instagram.com/hassan._.haseen', icon: 'logo-instagram' },
    { label: 'Twitter', url: 'https://twitter.com/hassanhaseen4', icon: 'logo-twitter' },
  ];

  const toggleExpand = (question) => {
    setExpandedQuestions((prev) =>
      prev.includes(question)
        ? prev.filter((q) => q !== question)
        : [...prev, question]
    );
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredQuestions = faqData[selectedCategory].filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Toast.show({ type: 'error', text1: 'Invalid link' });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Help Center</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab('FAQ')}
            style={[
              styles.tabButton,
              {
                backgroundColor:
                  activeTab === 'FAQ' ? colors.primary : colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'FAQ' ? '#fff' : colors.text },
              ]}
            >
              FAQ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('Contact')}
            style={[
              styles.tabButton,
              {
                backgroundColor:
                  activeTab === 'Contact' ? colors.primary : colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'Contact' ? '#fff' : colors.text },
              ]}
            >
              Contact Us
            </Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        {activeTab === 'FAQ' ? (
          <>
            {/* Categories */}
            <View style={styles.categoryContainer}>
              {faqCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor:
                        selectedCategory === cat ? colors.primary : colors.card,
                    },
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={{
                      color:
                        selectedCategory === cat ? '#fff' : colors.text,
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Search */}
            <View style={[
              styles.searchContainer,
              {
                backgroundColor: colors.card,
                borderColor: isDarkMode ? colors.border : '#ccc',
              },
            ]}>
              <Icon name="search-outline" size={20} color={colors.text} />
              <TextInput
                placeholder="Search FAQs"
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={handleSearch}
                style={[styles.searchInput, { color: colors.text }]}
              />
            </View>

            {/* FAQ Dropdown */}
            {filteredQuestions.map(({ question, answer }) => (
              <TouchableOpacity
                key={question}
                style={[styles.faqItem, { backgroundColor: colors.card }]}
                onPress={() => toggleExpand(question)}
              >
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQuestion, { color: colors.text }]}>{question}</Text>
                  <Icon
                    name={
                      expandedQuestions.includes(question)
                        ? 'chevron-up-outline'
                        : 'chevron-down-outline'
                    }
                    size={20}
                    color={colors.text}
                  />
                </View>
                {expandedQuestions.includes(question) && (
                  <View style={[
                    styles.faqAnswerContainer,
                    { borderTopColor: colors.border }
                  ]}>
                    <Text
                      style={[
                        styles.faqAnswer,
                        {
                          color: isDarkMode
                            ? 'rgba(255,255,255,0.7)'
                            : colors.textSecondary
                        },
                      ]}
                    >
                      {answer}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            {contactLinks.map((link) => (
              <TouchableOpacity
                key={link.label}
                style={[styles.contactItem, { backgroundColor: colors.card }]}
                onPress={() => openLink(link.url)}
              >
                <View style={styles.contactContent}>
                  <Icon name={link.icon} size={24} color={colors.primary} />
                  <Text style={[styles.contactLabel, { color: colors.text }]}>{link.label}</Text>
                </View>
                <Icon name="chevron-forward-outline" size={20} color={colors.text} />
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      {/* Bottom Navbar */}
      <Navbar navigation={navigation} activeTab="Profile" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tabButton: {
    marginHorizontal: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  faqItem: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  faqAnswerContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default HelpCenterPage;
