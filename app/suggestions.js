import { View, Text } from 'react-native';

export default function SuggestionsScreen() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>AI Travel Suggestions</Text>
      <Text style={{ marginTop: 10 }}>
        Michael will hook up OpenAI to give real suggestions here.
      </Text>
    </View>
  );
}
