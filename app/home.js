import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to Bucket List Traveler!</Text>

      <Button
        title="View Bucket List"
        onPress={() => router.push('/bucketlist')}
      />

      <View style={{ marginTop: 10 }}>
        <Button
          title="Get AI Travel Suggestions"
          onPress={() => router.push('/suggestions')}
        />
      </View>
    </View>
  );
}
