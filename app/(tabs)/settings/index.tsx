import { StyleSheet, Text, View, Switch, Pressable } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "@/components/app-card";
import { theme } from "@/styles/theme";

const Settings = () => {
  const [notification, setNotification] = useState(true);
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Setting</Text>

      <AppCard
        title="Notifications"
        subtitle="Enable app notifications"
        right={<Switch value={notification} onValueChange={setNotification} />}
      />
      <Pressable onPress={()=> router.push("/(tabs)/settings/profile")}>
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
