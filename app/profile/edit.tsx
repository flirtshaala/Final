import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ThemedGradientBackground } from '@/components/ThemedGradientBackground';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ArrowLeft, User, Save } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function EditProfileScreen() {
  const { userProfile, updateProfile } = useAuth();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        gender: userProfile.gender || '',
        age: userProfile.age?.toString() || '',
      });
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    if (formData.age && (parseInt(formData.age) < 13 || parseInt(formData.age) > 120)) {
      Alert.alert('Error', 'Please enter a valid age (13-120)');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name: formData.name.trim(),
        gender: formData.gender as any,
        age: formData.age ? parseInt(formData.age) : undefined,
      });
      
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <ThemedGradientBackground style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Updating profile...
          </Text>
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
          
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Update your personal information
            </Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Full name *"
              placeholderTextColor={colors.textSecondary}
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              autoComplete="name"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Age"
              placeholderTextColor={colors.textSecondary}
              value={formData.age}
              onChangeText={(value) => updateFormData('age', value)}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          {/* Gender Selection */}
          <View style={styles.genderContainer}>
            <Text style={[styles.genderLabel, { color: colors.text }]}>Gender</Text>
            <View style={styles.genderButtons}>
              {['male', 'female', 'other', 'prefer_not_to_say'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    formData.gender === gender && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => updateFormData('gender', gender)}
                >
                  <Text style={[
                    styles.genderButtonText,
                    { color: colors.text },
                    formData.gender === gender && { color: 'white' }
                  ]}>
                    {gender === 'prefer_not_to_say' ? 'Prefer not to say' : gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
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
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginTop: 16,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    paddingVertical: 16,
  },
  genderContainer: {
    marginBottom: 32,
  },
  genderLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  genderButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genderButton: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  genderButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  saveButton: {
    backgroundColor: '#FF6B7A',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B7A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
});