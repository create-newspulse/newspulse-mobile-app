import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { api } from "../api/client";
import NewsCard from "../components/NewsCard";

type Props = {
  navigation: any;
};

type Article = {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setError(null);
      // Use public articles list used by frontend-compatible backend
      const res = await api.get("/api/articles", { params: { status: "published", limit: 20 } });

      // Support both shapes: { items: [...] } and { articles: [...] } or raw array
      const raw = Array.isArray(res.data)
        ? res.data
        : res.data?.items || res.data?.articles || [];

      // Normalize to mobile Article shape
      const mapped: Article[] = (raw || []).map((it: any) => ({
        _id: String(it._id || it.id || ""),
        title: String(it.title || "Untitled"),
        description: it.description || it.summary || it.excerpt || "",
        imageUrl: it.imageUrl || it.imageURL || it.image || undefined,
      }));

      setArticles(mapped);
    } catch (err) {
      console.error("Error loading articles", err);
      setError("Could not load stories. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchArticles();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading News Pulse stories…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 8 }}>{error}</Text>
        <Text onPress={fetchArticles} style={styles.link}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Top Stories · News Pulse</Text>
      <FlatList
        data={articles}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <NewsCard
            title={item.title}
            description={item.description || ""}
            imageUrl={item.imageUrl}
            onPress={() => navigation.navigate("Article", { id: item._id })}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  link: {
    color: "#0070f3",
    fontWeight: "600",
  },
});

export default HomeScreen;
