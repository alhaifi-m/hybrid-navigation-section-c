import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import AppCard from "@/components/app-card";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/styles/theme";
import * as api from "@/lib/api";

const home = () => {
  const [data, setData] = useState<api.DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard() {
    try {
      setError(null);
      setIsLoading(true);
      const result = await api.getDashboardData();
      setData(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something Went Wrong.  Please try again",
      );
    } finally {
      setIsLoading(false);
    }
  }
  // Fetch on Mount
  useEffect(() => {
    loadDashboard();
  }, []);

  if(isLoading){
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.color.primary}/>
      </View>
    )
  }

  if(error){
    return (
      <View style={styles.centered}>
        <Ionicons
        name="cloud-offline-outline"
        size={48}
        color={theme.color.mute}
        />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadDashboard}>
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>

      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Campus Hub</Text>
      <Text style={styles.p}> {data?.greeting} - Quick overview for today</Text>

      <AppCard
        title="Upcoming Deadline"
        subtitle={`${data?.nextDeadline.course} ${data?.nextDeadline.title} - due ${data?.nextDeadline.dueDate}`}
        right={
          <Ionicons
            name="alert-circle-outline"
            size={22}
            color={theme.color.primary}
          />
        }
      />

      <AppCard
        title="Attendance"
        subtitle={`${data?.attendance.attended}/${data?.attendance.total} classes ${data?.attendance.percentage}`}
        right={
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color={theme.color.primary}
          />
        }
      />
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.screen,
    backgroundColor: theme.color.bg,
  },
  centered: {
    flex: 1,
    padding: theme.spacing.screen,
    justifyContent:"center",
    alignItems:"center"
  },

  h1: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.color.text,
  },
  p: {
    marginTop: 6,
    marginBottom: 16,
    color: theme.color.mute,
  },

  errorText:{
    marginTop: 12,
    fontSize: 16,
    color: theme.color.mute,
    textAlign:"center"
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.radius.input,
    backgroundColor: theme.color.primary
  },
  retryText: {
    color: "#ffffff",
    fontSize:16,
    fontWeight:"700"
  }
});
