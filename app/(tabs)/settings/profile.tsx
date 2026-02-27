import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import React from "react";

// Define a Zod schema for the profile data
const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, "First name must be at least 3 characters long"),
  lastName: z
    .string()
    .trim()
    .min(3, "Last name must be at least 3 characters long"),
  email: z.string().trim().email("Invalid email address"),
  studentId: z
    .string()
    .trim()
    .length(9, "Student ID must be exactly 9 characters long"),
  phone: z
    .string()
    .refine(
      (val) => val.replace(/\D/g, "").length >= 10,
      "Phone number must have at least 10 digits.",
    ),
});
const profile = () => {
  return (
    <View>
      <Text>profile</Text>
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({});
