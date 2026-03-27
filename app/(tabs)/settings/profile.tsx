import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { theme } from "../../../styles/theme";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import * as storage from "@/lib/storage";

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
  const [isLoading, setIsLoading] = useState(true); // tracks loading state while we load saved data
  const [isEditing, setIsEditing] = useState(false); // tracks if we are in edit mode or not
  const [hasSavedData, setHasSavedData] = useState(false); // track if we have any saved data in the local storage
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset, // add reset function to reset form values when canceling edits
    watch, // add watch function to track form values, which will help us keeping the save button disabled/enbabled
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

  const watchedValues = watch();
  // it retuns an array of all form field values, and also we need to check that every values has length > 0
  // ["Jane", "Smith", "", "A12345678", "4034034032"] => it will returns false

  const isFormFilled = Object.values(watchedValues).every((v) => v.length > 0);

  // Load saved profile data on Mount

  useEffect(() => {
    const loadingProfile = async () => {
      const saved = await storage.get<ProfileForm>(storage.STORAGE_KEY.PROFILE);
      // if save is not null or it has data, pre fill the view mode with the user data
      if (saved !== null) {
        reset(saved);
        setHasSavedData(true);
      } else {
        setIsEditing(true); // first visit -- stare in edit mode
      }

      const savedPhoto = await storage.get<string>(
        storage.STORAGE_KEY.PROFILE_PHOTO,
      );
      if (savedPhoto !== null) {
        setPhotoUri(savedPhoto);
      }
      setIsLoading(false);
    };
    loadingProfile();
  }, []);

  const handlePhotoPress = () => {
    Alert.alert("Profile Photo", "Choose a source", [
      { text: "Take Photo", onPress: () => openPicker("camera") },
      { text: "Choose from Library", onPress: () => openPicker("library") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const openPicker = async (source: "camera" | "library") => {
    // step 1: Request the appropriate permissions
    if (source === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera Access is required to take a profile photo.  Enable in settings",
        );
        return;
      }
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Premission Denied",
          "Photo library access is required to choose a profile photo. Enable it in settings",
        );
        return;
      }
    }

    // Setp 2: Launch the Picker
    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            aspect: [1, 1],
            quality: 0.8,
          });

    // Step 3: Save the URI if user did not cancel

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      await storage.set(storage.STORAGE_KEY.PROFILE_PHOTO, uri);
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    await storage.set(storage.STORAGE_KEY.PROFILE, data);
    setHasSavedData(true);
    setIsEditing(false); // switch to view mode after this
  };
  const handleCancel = async () => {
    const saved = await storage.get<ProfileForm>(storage.STORAGE_KEY.PROFILE);
    if (saved !== null) {
      reset(saved);
    }
    setIsEditing(false);
  };

  const renderAvatar = () => {
    return (    <View style={styles.avatarSection}>
      <Pressable onPress={handlePhotoPress} style={styles.avatarContainer}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="camera" size={14} color={"#ffffff"} />
          </View>
        )}
        <Text style={styles.photoHint}>
          {photoUri ? "Tap to Change Photo" : "Add a Profile Photo"}
        </Text>
      </Pressable>
    </View>)

  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.color.primary} />
      </View>
    );
  }
  // View mode
  if (!isEditing) {
    const values = watch();
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.h1}>My Profile</Text>
        {renderAvatar()}

        {/* Week 11  */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>First Name</Text>
            <Text style={styles.profileValue}>{values.firstName}</Text>
          </View>
          <View style={styles.divider} />
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Last Name</Text>
            <Text style={styles.profileValue}>{values.lastName}</Text>
          </View>
          <View style={styles.divider} />
        </View>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Email</Text>
            <Text style={styles.profileValue}>{values.email}</Text>
          </View>
          <View style={styles.divider} />
        </View>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Student ID</Text>
            <Text style={styles.profileValue}>{values.studentId}</Text>
          </View>
          <View style={styles.divider} />
        </View>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Phone Number</Text>
            <Text style={styles.profileValue}>{values.phone}</Text>
          </View>
          <View style={styles.divider} />
        </View>
        <Pressable style={styles.button} onPress={() => setIsEditing(true)}>
          <Text style={styles.buttonText}> Edit Profile</Text>
        </Pressable>
      </ScrollView>
    );
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.h1}>Edit Profile</Text>
      {renderAvatar()}
      {/* Week 11 */}
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
      {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

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
      {/* Buttons for Edit Mode */}
      {hasSavedData ? (
        <View style={styles.buttonRow}>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.saveButton, !isFormFilled && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.buttonText}> Save Profile</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={[styles.button, !isFormFilled && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={!isFormFilled}
        >
          <Text style={styles.buttonText}>Save Profile</Text>
        </Pressable>
      )}
    </ScrollView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 28,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  // View Mode Styles
  profileCard: {
    backgroundColor: theme.color.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.color.border,
    overflow: "hidden",
  },
  profileRow: {
    padding: 16,
  },
  profileLabel: {
    fontSize: 13,
    color: theme.color.mute,
    marginBottom: 4,
  },
  profileValue: {
    fontSize: 16,
    color: theme.color.text,
    fontWeight: "500",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.color.border,
  },

  // Buttons Styles
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
  },
  cancelButton: {
    flex: 1,
    borderRadius: theme.radius.input,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.color.border,
    backgroundColor: theme.color.card,
  },
  cancelButtonText: {
    color: theme.color.text,
    fontSize: 16,
    fontWeight: "700",
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.color.primary,
    borderRadius: theme.radius.input,
    padding: 16,
    alignItems: "center",
  },

  // Avatar Style (Week 11)
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.color.border,
  },
  comeraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.color.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.color.bg,
  },
  photoHint: {
    marginTop: 8,
    fontSize: 13,
    color: theme.color.mute,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.color.border,
  },
});
