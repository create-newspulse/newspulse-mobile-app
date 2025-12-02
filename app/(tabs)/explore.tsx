import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { api } from '@/src/api/client';
import NewsCard from '@/src/components/NewsCard';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type BreakingItem = {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  category?: string;
  date?: string;
  imageUrl?: string;
};

export default function BreakingScreen() {
  const [items, setItems] = useState<BreakingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBreaking = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get('/api/news');
      const raw = Array.isArray(res.data) ? res.data : res.data?.items || res.data?.news || [];
      const mapped: BreakingItem[] = (raw || []).map((it: any) => ({
        _id: String(it._id || it.id || ''),
        title: String(it.title || 'Untitled'),
        description: it.description || it.summary || (it.content ? String(it.content).slice(0, 140) : ''),
        content: it.content,
        category: it.category,
        date: it.date,
        imageUrl: it.imageUrl || it.imageURL || it.image || undefined,
      }));
      setItems(mapped);
    } catch (e) {
      console.error('Error loading breaking news', e);
      setError('Could not load breaking news. Tap to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBreaking();
  }, [fetchBreaking]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBreaking();
  };

  if (loading) {
    return (
      <View style={styles.center}> 
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading breaking news…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <TouchableOpacity style={styles.center} onPress={fetchBreaking} activeOpacity={0.7}>
        <Text>{error}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.header}>Breaking · News Pulse</ThemedText>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <NewsCard
            title={item.title}
            description={item.description || ''}
            imageUrl={item.imageUrl}
            onPress={() => {}}
          />
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 8,
  },
  header: {
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
