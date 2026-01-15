import SignupForm from "@/components/signup-form";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Index() {
  return (
    <SafeAreaView className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center items-center">
          <SignupForm />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
