import React from "react";
import { StyleSheet, Text, View } from "react-native";

const AudioScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Hub · News Pulse</Text>
      <Text>This will later become the Swipe-to-Listen and playlists area.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
});

export default AudioScreen;
