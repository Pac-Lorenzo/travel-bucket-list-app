import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';


const TRAVEL_PREFERENCES = [
  'Beaches', 'Mountains', 'Cities', 'History', 'Food',
  'Adventure', 'Culture', 'Relaxation', 'Nature', 'Nightlife'
];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [dreamDestination, setDreamDestination] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [saving, setSaving] = useState(false);

  // Preload name if available
  useEffect(() => {
    if (auth.currentUser?.displayName) {
      setName(auth.currentUser.displayName);
    }
  }, []);

  // Pick image from gallery
  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return Alert.alert('Permission needed', 'Enable photo library access.');
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets?.[0]?.uri || null);
    }
  };

    // Toggle preference selection
    const togglePreference = (pref) => {
        setSelectedPreferences((prev) =>
        prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
        );
    };

    // Upload profile image to Firebase Storage and return download URL
    const uploadImageToStorage = async (uri, userId) => {
        const blob = await (await fetch(uri)).blob();
        const storageRef = ref(storage, `profile-images/${userId}`);
        await uploadBytes(storageRef, blob);
        return await getDownloadURL(storageRef);
    };
  
    // Save profile data
    const saveProfile = async () => {
        if (!name.trim()) return Alert.alert('Name required', 'Please enter your name.');
        if (!auth.currentUser) return Alert.alert('Error', 'You must be logged in.');
      
        const userId = auth.currentUser.uid;
        const userEmail = auth.currentUser.email;
      
        setSaving(true);
      
        try {
          // Upload image 
          const photoURL = profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}`;

      
          // Save user data to Firestore
          const userData = {
            uid: userId,
            email: userEmail,
            name: name.trim(),
            bio: bio.trim(),
            dreamDestination: dreamDestination.trim(),
            travelPreferences: selectedPreferences,
            createdAt: new Date(),
          };
      
          await setDoc(doc(db, 'users', userId), userData);
      
          router.replace('/home');
        } catch (error) {
          console.error('Profile save error:', error);
          Alert.alert('Error', 'Could not save profile.');
        } finally {
          setSaving(false);
        }
      };      
    
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>📷</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Your Name"
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        value={bio}
        onChangeText={setBio}
        placeholder="Short Bio"
        multiline
      />

      <TextInput
        style={styles.input}
        value={dreamDestination}
        onChangeText={setDreamDestination}
        placeholder="Dream Destination"
      />

      <Text style={styles.label}>Travel Preferences</Text>
      <View style={styles.chipContainer}>
        {TRAVEL_PREFERENCES.map((pref) => (
          <TouchableOpacity
            key={pref}
            style={[
              styles.chip,
              selectedPreferences.includes(pref) && styles.chipSelected
            ]}
            onPress={() => togglePreference(pref)}
          >
            <Text style={[
              styles.chipText,
              selectedPreferences.includes(pref) && styles.chipTextSelected
            ]}>
              {pref}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveProfile} disabled={saving}>
        <Text style={styles.saveButtonText}>
          {saving ? 'Saving...' : 'Save & Continue'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  imageWrapper: {
    alignSelf: 'center', marginBottom: 16,
    borderRadius: 60, width: 120, height: 120, backgroundColor: '#e0f2fe',
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
  },
  image: { width: 120, height: 120, borderRadius: 60 },
  placeholder: { fontSize: 32 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, fontSize: 16, marginBottom: 12
  },
  label: { fontWeight: 'bold', marginBottom: 8 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: {
    backgroundColor: '#e2e8f0', paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, marginRight: 8, marginBottom: 8
  },
  chipSelected: { backgroundColor: '#0284c7' },
  chipText: { fontSize: 14 },
  chipTextSelected: { color: '#fff' },
  saveButton: {
    backgroundColor: '#0284c7', padding: 14,
    borderRadius: 8, alignItems: 'center'
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
