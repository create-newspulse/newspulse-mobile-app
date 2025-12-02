import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "../api/client";
import { useAudioPlayer } from "../audio/AudioPlayerContext";
import NewsCard from "../components/NewsCard";

type Article = {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  category?: string;
  language?: string;
  date?: string;
  imageUrl?: string;
};

const AudioScreen = () => {
  const navigation = useNavigation();
  const { currentArticle, isPlaying, playArticle, togglePlayPause } = useAudioPlayer();
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setError(null);
      const res = await api.get("/api/articles", { params: { status: "published", limit: 20 } });
      const raw = Array.isArray(res.data) ? res.data : res.data?.items || res.data?.articles || [];
      const mapped: Article[] = (raw || []).map((it: any) => ({
        _id: String(it._id || it.id || ""),
        title: String(it.title || "Untitled"),
        description: it.description || it.summary || it.excerpt || "",
        content: it.content,
        category: it.category,
        language: it.language,
        date: it.date,
        imageUrl: it.imageUrl || it.imageURL || it.image || undefined,
      }));
      setItems(mapped);
    } catch (e) {
      console.error("Audio tab: error fetching articles", e);
      setError("Could not load audio stories. Tap to retry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const estimateDuration = (text?: string) => {
    if (!text) return "~2–3 min";
    const words = text.split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 180)); // ~180 wpm
    return `~${minutes} min`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading audio stories…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <TouchableOpacity style={styles.center} onPress={fetchArticles}>
        <Text>{error}</Text>
      </TouchableOpacity>
    );
  }

  if (!items.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>No audio stories available yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.containerList}>
      <Text style={styles.header}>Audio · News Pulse</Text>
      <FlatList
        data={items}
        keyExtractor={(it) => it._id}
        renderItem={({ item }) => {
          const isCurrent = currentArticle?.
            _id === item._id;
          const label = isCurrent && isPlaying ? 'Pause' : 'Play';
          const duration = estimateDuration(item.content || item.description);
          return (
            <View>
              <NewsCard
                title={item.title}
                description={[item.category, duration].filter(Boolean).join(' · ')}
                imageUrl={item.imageUrl}
                onPress={() => (navigation as any).navigate('Article', { id: item._id })}
              />
              <View style={styles.rowActions}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => {
                    if (!isCurrent) {
                      playArticle(item);
                    } else {
                      togglePlayPause();
                    }
                  }}
                >
                  <Text style={styles.playText}>{label}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerList: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 8 },
  header: { fontSize: 18, fontWeight: '700', paddingHorizontal: 12, paddingVertical: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 18, fontWeight: '600' },
  rowActions: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, marginBottom: 8 },
  playButton: { backgroundColor: '#eee', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  playText: { fontWeight: '600' },
});

export default AudioScreen;
