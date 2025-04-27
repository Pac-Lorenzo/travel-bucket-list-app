import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function HomeScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.replace('/login');
          return;
        }

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          router.replace('/profile-setup');
        }
      } catch (err) {
        console.error('Failed to load user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header: Profile Image + Name */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: userData?.photoURL }}
          style={styles.profileImage}
        />
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.name}>{userData?.name}</Text>
      </View>

      {/* Navigation Cards */}
      <View style={styles.cardGroup}>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/bucketlist')}>
          <Text style={styles.cardEmoji}>🗺️</Text>
          <Text style={styles.cardTitle}>View Bucket List</Text>
          <Text style={styles.cardText}>See all your saved trips.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/suggestions')}>
          <Text style={styles.cardEmoji}>🤖</Text>
          <Text style={styles.cardTitle}>AI Suggestions</Text>
          <Text style={styles.cardText}>Chat with our AI and explore ideas.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/add-destination')}>
          <Text style={styles.cardEmoji}>➕</Text>
          <Text style={styles.cardTitle}>Add Destination</Text>
          <Text style={styles.cardText}>Manually add a new travel goal.</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    backgroundColor: '#e0f2fe',
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  cardGroup: {
    gap: 20,
  },
  card: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    borderColor: '#cbd5e1',
    borderWidth: 1,
  },
  cardEmoji: {
    fontSize: 26,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#0f172a',
  },
  cardText: {
    color: '#475569',
    fontSize: 14,
  },
});
