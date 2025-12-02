import React from "react";
import { StyleSheet, Text, View } from "react-native";

const BreakingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Breaking News · News Pulse</Text>
      <Text>We will connect this to the real breaking feed soon.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
});

export default BreakingScreen;
