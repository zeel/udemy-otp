import URIMAP from "@/constants/uri";
import { Button, Card, Input } from "@rneui/themed";
import { router } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";

export default function SignupForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    try {
      setIsLoading(true);
      const createUserResponse = await fetch(URIMAP.CREATE_USER, {
        method: "POST",
        body: JSON.stringify({ phone: phoneNumber }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      await createUserResponse.json();
      const otpResponse = await fetch(URIMAP.REQUEST_OTP, {
        method: "POST",
        body: JSON.stringify({ phone: phoneNumber }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const otpData = await otpResponse.json();
      if (otpData.error) {
        setError(otpData.error);
        return;
      }
      router.push({
        pathname: "/otp-verification",
        params: { phone: phoneNumber },
      });
    } catch (error: unknown) {
      const err = error as { error?: string };
      console.error(err?.error);
      setError(err?.error || "Please check your internet connection");
    } finally {
      setIsLoading(false);
    }
  };
  const handleChangePhoneNumber = (text: string) => {
    setPhoneNumber(text);
    setError("");
  };
  return (
    <Card containerStyle={{ width: "100%" }}>
      <Card.Title>Enter your mobile number</Card.Title>
      <Input
        label="Mobile Number"
        placeholder="Enter your mobile number"
        value={phoneNumber}
        onChangeText={handleChangePhoneNumber}
        keyboardType="phone-pad"
        maxLength={10}
        errorMessage={error}
        leftIcon={<Text className="mr-1">+91</Text>}
      />
      <Button
        title="Proceed"
        onPress={handleSignup}
        loading={isLoading}
        disabled={isLoading}
      />
    </Card>
  );
}
