import {
  StyleSheet,
  Text,
  View,
  Switch,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "@/components/app-card";
import { theme } from "@/styles/theme";
import * as storage from "@/lib/storage";

const Settings = () => {
  const [notification, setNotification] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved notification preference on mount

  useEffect(() => {
    // Define an async function to load the value since useEffect can't be async
    const loadNotification = async () => {
      // Try to laod saved value from storage if it exists
      const saved = await storage.get<boolean>(
        storage.STORAGE_KEY.NOTIFICATIONS,
      );
      if (saved !== null) {
        // if we have a saved value, use it to set the state
        setNotification(saved);
      }
      setIsLoading(false); // turning off the spinner
    };
    loadNotification();
  }, []);

  const handleToggle = async (value: boolean) => {
    setNotification(value);
    await storage.set(storage.STORAGE_KEY.NOTIFICATIONS, value);
  };

  if(isLoading){
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.color.primary} />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Setting</Text>

      <AppCard
        title="Notifications"
        subtitle="Enable app notifications"
        right={<Switch value={notification} onValueChange={handleToggle} />}
      />
      <Pressable onPress={() => router.push("/(tabs)/settings/profile")}>
        <AppCard
          title="Account"
          subtitle="Update profile settings"
          right={
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.color.primary}
            />
          }
        />
      </Pressable>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.screen,
    backgroundColor: theme.color.bg,
  },
  h1: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
    color: theme.color.text,
  },
});
