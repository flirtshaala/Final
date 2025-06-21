import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ThemedGradientBackground } from '@/components/ThemedGradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import { User, Mail, ArrowLeft, Save } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function EditProfileScreen() {
  const { user, userProfile, updateProfile } = useAuth();
  const { colors } = useTheme();
  
  const [name, setName] = useState(userProfile?.name || user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [age, setAge] = useState(userProfile?.age?.toString() || '');
  const [gender, setGender] = useState(userProfile?.gender || 'prefer_not_to_say');
  const [loading, setLoading] = useState(false);

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ];

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (age && (isNaN(Number(age)) || Number(age) < 13 || Number(age) > 120)) {
      Alert.alert('Error', 'Please enter a valid age between 13 and 120');
      return;
    }

    setLoading(true);
    try {
      const updates = {
        name: name.trim(),
        age: age ? Number(age) : null,
        gender,
        updated_at: new Date().toISOString(),
      };

      await updateProfile(updates);
      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedGradientBackground>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Updating your profile...</Text>
        </View>
      </ThemedGradientBackground>
    );
  }

  return (
    <ThemedGradientBackground style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.surface }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Update your personal information
          </Text>
        </View>

        {/* Profile Form */}
        <View style={[styles.formContainer, { backgroundColor: colors.cardBackground }]}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <User size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Email Input (Read-only) */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <Mail size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.textInput, { color: colors.textSecondary }]}
                placeholder="Email address"
                placeholderTextColor={colors.textSecondary}
                value={email}
                editable={false}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <Text style={[styles.inputNote, { color: colors.textSecondary }]}>
              Email cannot be changed from this screen
            </Text>
          </View>

          {/* Age Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Age (Optional)</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                placeholder="Enter your age"
                placeholderTextColor={colors.textSecondary}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>

          {/* Gender Selection */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Gender (Optional)</Text>
            <View style={styles.genderContainer}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.genderOption,
                    {
                      backgroundColor: gender === option.value ? colors.primary : colors.surface,
                      borderColor: gender === option.value ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setGender(option.value)}
                >
                  <Text
                    style={[
                      styles.genderOptionText,
                      {
                        color: gender === option.value ? 'white' : colors.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, { opacity: !name.trim() ? 0.6 : 1 }]}
            onPress={handleSaveProfile}
            disabled={!name.trim()}
          >
            <Save size={20} color="white" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginTop: 16,
    textAlign: 'center',
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
  },
  formContainer: {
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
      },
    }),
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginLeft: 12,
  },
  inputNote: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genderOption: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  genderOptionText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  saveButton: {
    backgroundColor: '#FF6B7A',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 12px rgba(255, 107, 122, 0.3)',
      },
      default: {
        shadowColor: '#FF6B7A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
      },
    }),
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginLeft: 8,
  },
});