import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';

export default function BucketListScreen() {
  const [destination, setDestination] = useState('');
  const [list, setList] = useState([]);

  const addDestination = () => {
    if (destination.trim() !== '') {
      setList([...list, { id: Date.now().toString(), name: destination }]);
      setDestination('');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>My Travel Bucket List</Text>

      <TextInput
        placeholder="Enter destination"
        value={destination}
        onChangeText={setDestination}
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />
      <Button title="Add Destination" onPress={addDestination} />

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={{ marginTop: 10 }}>• {item.name}</Text>}
      />
    </View>
  );
}
