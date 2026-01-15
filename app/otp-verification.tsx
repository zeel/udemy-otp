import { auth } from "@/config/firebase";
import URIMAP from "@/constants/uri";
import { Button, Icon, Text } from "@rneui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { signInWithCustomToken } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OtpVerification() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const formattedPhone = phone
    ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
    : "";

  const handleOtpChange = (value: string, index: number) => {
    // Handle autofill (when full OTP is pasted)
    if (value.length >= 6) {
      const digits = value.slice(0, 6).split("");
      setOtp(digits);
      setError("");
      inputRefs.current[5]?.focus();
      return;
    }

    // Handle paste of multiple digits
    if (value.length > 1) {
      const digits = value.split("");
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      setError("");
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the complete OTP");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(URIMAP.VERIFY_OTP, {
        method: "POST",
        body: JSON.stringify({ phone, otp: otpValue }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }

      // Authenticate with Firebase using custom token
      if (data.token) {
        await signInWithCustomToken(auth, data.token);
        console.log("Firebase authenticated!");
        // Navigate to home or dashboard
        router.replace("/");
      }
    } catch (error: unknown) {
      const err = error as { error?: string };
      setError(err?.error || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendSMS = async () => {
    if (resendTimer > 0) return;
    try {
      await fetch(URIMAP.REQUEST_OTP, {
        method: "POST",
        body: JSON.stringify({ phone }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setResendTimer(30);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 px-6">
          {/* Header */}
          <View className="flex-row items-center py-4">
            <Icon
              name="arrow-back"
              type="ionicon"
              size={24}
              onPress={() => router.back()}
            />
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                color: "#2089dc",
                fontSize: 20,
                fontWeight: "bold",
                marginRight: 24,
              }}
            >
              OTP Verify
            </Text>
          </View>

          {/* Content */}
          <View className="flex-1 items-center pt-12">
            {/* Lock Icon */}
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-6">
              <Icon
                name="lock-closed"
                type="ionicon"
                size={36}
                color="#2089dc"
              />
            </View>

            <Text h4 style={{ marginBottom: 8 }}>
              Enter OTP
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <Text style={{ color: "#6b7280" }}>Sent to {formattedPhone}</Text>
              <Icon
                name="pencil"
                type="ionicon"
                size={18}
                color="#2089dc"
                onPress={() => router.back()}
                containerStyle={{ marginLeft: 8 }}
              />
            </View>

            {/* OTP Input Boxes */}
            <View className="flex-row gap-2 mb-4">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref: TextInput | null) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={{
                    width: 48,
                    height: 48,
                    borderWidth: 2,
                    borderRadius: 8,
                    textAlign: "center",
                    fontSize: 18,
                    borderColor:
                      index === otp.findIndex((d) => d === "")
                        ? "#2089dc"
                        : "#e5e7eb",
                  }}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  secureTextEntry
                  textContentType="oneTimeCode"
                  autoComplete="sms-otp"
                  autoFocus={index === 0}
                />
              ))}
            </View>

            {error ? (
              <Text
                style={{ color: "#ef4444", fontSize: 14, marginBottom: 16 }}
              >
                {error}
              </Text>
            ) : null}

            {/* Resend Options */}
            <Text style={{ color: "#9ca3af", marginBottom: 12 }}>
              {resendTimer > 0
                ? `Resend OTP in ${resendTimer}s`
                : "Resend OTP via"}
            </Text>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <Button
                type="outline"
                onPress={handleResendSMS}
                disabled={resendTimer > 0}
                buttonStyle={{ borderRadius: 20, paddingHorizontal: 16 }}
                icon={
                  <Icon
                    name="chatbubble"
                    type="ionicon"
                    size={16}
                    style={{ marginRight: 8 }}
                  />
                }
                title="SMS"
              />
            </View>

            {/* Verify Button */}
            <Button
              title="Verify"
              onPress={handleVerify}
              loading={isLoading}
              disabled={isLoading}
              containerStyle={{ width: "100%", marginTop: 32 }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
