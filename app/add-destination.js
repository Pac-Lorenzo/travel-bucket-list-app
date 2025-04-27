import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AddDestinationScreen() {
  const router = useRouter();

  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  const years = Array.from({ length: 2100 - 2024 + 1 }, (_, i) => (2024 + i).toString());

  const [destinationName, setDestinationName] = useState('');
  const [notes, setNotes] = useState('');
  const [season, setSeason] = useState('');
  const [year, setYear] = useState('');
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const [activityInput, setActivityInput] = useState('');
  const [activities, setActivities] = useState([]);

  const [linkInput, setLinkInput] = useState('');
  const [links, setLinks] = useState([]);

  const [saving, setSaving] = useState(false);

  // Add or update an activity
  const addOrUpdateActivity = (text, index = null) => {
    if (text.trim()) {
      if (index !== null) {
        const updated = [...activities];
        updated[index] = text.trim();
        setActivities(updated);
      } else {
        setActivities([...activities, text.trim()]);
      }
      setActivityInput('');
    }
  };

  // Add or update a link
  const addOrUpdateLink = (text, index = null) => {
    if (text.trim()) {
      if (index !== null) {
        const updated = [...links];
        updated[index] = text.trim();
        setLinks(updated);
      } else {
        setLinks([...links, text.trim()]);
      }
      setLinkInput('');
    }
  };

  const handleSave = async () => {
    if (!destinationName.trim()) {
      alert('Destination name is required');
      return;
    }

    setSaving(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert('You must be logged in.');
        return;
      }

      await addDoc(collection(db, 'users', user.uid, 'bucketlist'), {
        name: destinationName.trim(),
        notes: notes.trim(),
        season,
        year,
        activities,
        links,
        createdAt: serverTimestamp(),
        status: 'wishlist',
      });

      alert('Destination added to your bucket list!');
      router.back();
    } catch (err) {
      console.error('Error adding destination:', err);
      alert('Error, could not save destination.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Destination</Text>

      {/* Destination Name */}
      <TextInput
        style={styles.input}
        placeholder="Destination Name"
        value={destinationName}
        onChangeText={setDestinationName}
      />

      {/* Notes */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      {/* Travel Season Picker */}
      <TouchableOpacity style={styles.input} onPress={() => setShowSeasonDropdown(!showSeasonDropdown)}>
        <Text style={{ color: season ? '#000' : '#9ca3af' }}>
          {season || 'Select Travel Season'}
        </Text>
      </TouchableOpacity>

      {showSeasonDropdown && (
        <View style={styles.dropdown}>
          {seasons.map((item) => (
            <TouchableOpacity 
              key={item} 
              style={styles.dropdownItem}
              onPress={() => {
                setSeason(item);
                setShowSeasonDropdown(false);
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Travel Year Picker */}
      <TouchableOpacity style={styles.input} onPress={() => setShowYearDropdown(!showYearDropdown)}>
        <Text style={{ color: year ? '#000' : '#9ca3af' }}>
          {year || 'Select Travel Year'}
        </Text>
      </TouchableOpacity>

      {showYearDropdown && (
        <View style={styles.dropdown}>
          {years.map((item) => (
            <TouchableOpacity 
              key={item} 
              style={styles.dropdownItem}
              onPress={() => {
                setYear(item);
                setShowYearDropdown(false);
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Helpful Links */}
      <Text style={styles.subtitle}>Helpful Links</Text>

      <View style={styles.activityRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Add a link (e.g., hotel, tour)"
          value={linkInput}
          onChangeText={setLinkInput}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => addOrUpdateLink(linkInput)}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {links.length > 0 && (
        <View style={styles.activitiesList}>
          {links.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => {
              setLinkInput(item);
              setLinks(links.filter((_, i) => i !== index));
            }}>
              <Text style={styles.activityItem}>🔗 {item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Planned Activities Checklist */}
      <Text style={styles.subtitle}>Planned Activities</Text>

      <View style={styles.activityRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Add an activity (e.g., Eiffel Tower)"
          value={activityInput}
          onChangeText={setActivityInput}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => addOrUpdateActivity(activityInput)}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {activities.length > 0 && (
        <View style={styles.activitiesList}>
          {activities.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => {
              setActivityInput(item);
              setActivities(activities.filter((_, i) => i !== index));
            }}>
              <Text style={styles.activityItem}>✔️ {item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Save Button */}
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSave} 
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>
          {saving ? 'Saving...' : 'Save Destination'}
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0f172a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f1f5f9',
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  activitiesList: {
    marginBottom: 20,
  },
  activityItem: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 6,
  },
  saveButton: {
    backgroundColor: '#0284c7',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 16,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
});
