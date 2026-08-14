import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useOnboarding } from "@/context/onboarding-context";

export default function Index() {
  const { ready, completed } = useOnboarding();

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator accessibilityLabel="Loading PowerChain" />
      </View>
    );
  }

  return <Redirect href={completed ? "/(tabs)" : "/onboarding"} />;
}
