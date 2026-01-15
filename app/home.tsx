import { auth } from "@/config/firebase";
import { Button, Text } from "@rneui/themed";
import { signOut } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text h3>Welcome!</Text>
      <Text style={{ marginTop: 10, color: "#6b7280" }}>
        You are logged in as{" "}
        {auth.currentUser?.phoneNumber || auth.currentUser?.uid}
      </Text>
      <Button
        title="Logout"
        onPress={handleLogout}
        containerStyle={{ marginTop: 20, width: 200 }}
      />
    </SafeAreaView>
  );
}
