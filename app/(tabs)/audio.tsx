import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function AudioTab() {
  const data = [
    {
      id: 'demo-1',
      title: 'Swipe-to-Listen is coming soon',
      subtitle: 'This will be your playlist hub for News Pulse audio.',
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.centerHeader}>
        <ThemedText type="subtitle">Audio · Coming Soon</ThemedText>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 8 },
  centerHeader: { alignItems: 'center', paddingVertical: 8 },
  item: {
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#555' },
});
