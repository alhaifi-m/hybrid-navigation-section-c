import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { theme } from "../../../styles/theme";
import React from "react";
import { router } from "expo-router";

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
  email: z.email("Invalid email address"),
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

type ProfileForm = z.infer<typeof profileSchema>;

const profile = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      studentId: "",
      phone: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data: ProfileForm) => {
    Alert.alert("Profile Saved", "Your profile has been updated", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.h1}>Edit Profile</Text>
      {/* First Name */}
      <Text style={styles.label}>First Name</Text>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            placeholder="e.g Jane"
            placeholderTextColor={theme.color.mute}
            value={value}
            onChange={onChange}
            autoCapitalize="words"
          />
        )}
      />
      {errors.firstName && (
        <Text style={styles.error}>{errors.firstName.message}</Text>
      )}

      {/* Last Name */}
      <Text style={styles.label}>Last Name</Text>
      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.lastName && styles.inputError]}
            placeholder="e.g Smith"
            placeholderTextColor={theme.color.mute}
            value={value}
            onChange={onChange}
            autoCapitalize="words"
          />
        )}
      />
      {errors.lastName && (
        <Text style={styles.error}>{errors.lastName.message}</Text>
      )}

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="e.g example@example.com"
            placeholderTextColor={theme.color.mute}
            value={value}
            onChange={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
      {/* Phone Number */}
      <Text style={styles.label}>Phone Number</Text>
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="e.g (403) 555-0123"
            placeholderTextColor={theme.color.mute}
            value={value}
            onChange={onChange}
            keyboardType="phone-pad"
          />
        )}
      />
      {errors.phone && (
        <Text style={styles.error}>{errors.phone.message}</Text>
      )}

      {/* Student ID */}
      <Text style={styles.label}>Student ID</Text>
      <Controller
        control={control}
        name="studentId"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.studentId && styles.inputError]}
            placeholder="e.g A001234567"
            placeholderTextColor={theme.color.mute}
            value={value}
            onChange={onChange}
            autoCapitalize="characters"
            maxLength={9}
          />
        )}
      />
      {errors.studentId && (
        <Text style={styles.error}>{errors.studentId.message}</Text>
      )}

      <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </Pressable>
    </ScrollView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bg,
  },
  content: {
    padding: theme.spacing.screen,
  },
  h1: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
    color: theme.color.text,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.color.text,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: theme.color.card,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.input,
    padding: 14,
    fontSize: 16,
    color: theme.color.text,
  },
  inputError: {
    borderColor: theme.color.error,
  },
  error: {
    color: theme.color.error,
    fontSize: 13,
    marginTop: 4,
  },
  button: {
    backgroundColor: theme.color.primary,
    borderRadius: theme.radius.input,
    padding: 16,
    alignItems: "center",
    marginTop: 28
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700"
  }
});
