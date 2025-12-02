import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SavedTab() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.center}> 
        <ThemedText type="subtitle">No saved articles yet</ThemedText>
        <Text style={styles.subtext}>When bookmarks are enabled, they’ll appear here.</Text>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  subtext: { marginTop: 6, color: '#666' },
});
