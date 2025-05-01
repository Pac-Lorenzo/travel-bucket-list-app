import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export default function BucketListScreen() {
  const [list, setList] = useState([]);

  const fetchTrips = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('You must be logged in.');
        return;
      }

      const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'bucketlist'));
      const tripsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setList(tripsData);
    } catch (error) {
      console.error('Error fetching trips:', error);
      alert('Error fetching trips: ' + error.message);
    }
  };

  useFocusEffect(useCallback(() => {
    fetchTrips();
  }, []));

  const handleDelete = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    Alert.alert('Delete Destination', 'Are you sure you want to delete this destination?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'users', user.uid, 'bucketlist', id));
            fetchTrips(); // refresh list after delete
          } catch (error) {
            console.error('Error deleting document:', error);
            alert('Failed to delete destination: ' + error.message);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>📍 {item.name}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.delete}>🗑️</Text>
        </TouchableOpacity>
      </View>
      {item.notes ? <Text style={styles.notes}>📝 {item.notes}</Text> : null}
      <View style={styles.metaRow}>
        {item.season ? <Text style={styles.meta}>📅 {item.season}</Text> : null}
        {item.year ? <Text style={styles.meta}>({item.year})</Text> : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Travel Bucket List</Text>
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No destinations yet. Add one!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flex: 1
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1e3a8a',
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f8fafc'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155'
  },
  delete: {
    fontSize: 18,
    color: '#dc2626'
  },
  notes: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 10
  },
  meta: {
    fontSize: 13,
    color: '#64748b'
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    color: '#9ca3af',
  },
});
