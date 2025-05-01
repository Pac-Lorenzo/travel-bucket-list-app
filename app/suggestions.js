import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';


export default function SuggestionsScreen() {
  const [interests, setInterests] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);


  const getSuggestions = async () => {
    if (!interests.trim()) {
      alert('Please enter your travel interests!');
      return;
    }


    setLoading(true);
    setSuggestions([]);


    try {
      const response = await fetch('http://10.135.14.128:5000/generate', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests }),
      });


      const data = await response.json();
      const parsed = typeof data.suggestions === 'string'
        ? data.suggestions.split('\n').filter(line => line.trim())
        : data.suggestions;


      setSuggestions(parsed);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions(['❌ Error fetching suggestions. Please try again.']);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Travel Suggestions</Text>


      <TextInput
        style={styles.input}
        placeholder="E.g., beaches, museums, food"
        value={interests}
        onChangeText={setInterests}
      />


      <Button title="Get Suggestions" onPress={getSuggestions} />


      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0284c7" />
      ) : (
        suggestions.map((item, index) => (
          <Text key={index} style={styles.suggestionItem}>• {item}</Text>
        ))
      )}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1e3a8a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f1f5f9',
  },
  suggestionItem: {
    fontSize: 16,
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: '#e2e8f0',
  },
  loader: {
    marginTop: 20,
  },
});
