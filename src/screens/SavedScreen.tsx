import React from "react";
import { StyleSheet, Text, View } from "react-native";

const SavedScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Articles · News Pulse</Text>
      <Text>Later this will show bookmarks synced with MongoDB.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
});

export default SavedScreen;
