import type { RouteProp } from "@react-navigation/native";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../api/client";
import type { RootStackParamList } from "../navigation/RootNavigator";

type ArticleRouteProp = RouteProp<RootStackParamList, "Article">;

type Props = {
  route: ArticleRouteProp;
};

type Article = {
  _id: string;
  title: string;
  content?: string;
  description?: string;
};

const ArticleScreen: React.FC<Props> = ({ route }) => {
  const { id } = route.params;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  const fetchArticle = async () => {
    try {
      // Fetch single article matching frontend-compatible backend
      const res = await api.get(`/api/articles/${id}`);
      const payload = res.data?.article ?? res.data;
      setArticle(payload);
    } catch (err) {
      console.error("Error loading article", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
    return () => {
      Speech.stop();
    };
  }, [id]);

  const handleSpeak = () => {
    if (!article) return;

    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }

    const textBody = article.content || article.description || "";
    const textToSpeak = `${article.title}. ${textBody}`;
    setSpeaking(true);
    Speech.speak(textToSpeak, {
      language: "en-IN",
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  if (loading || !article) {
    return (
      <View style={styles.center}>
        {loading ? (
          <>
            <ActivityIndicator />
            <Text style={{ marginTop: 8 }}>Loading article…</Text>
          </>
        ) : (
          <Text>Article not found.</Text>
        )}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{article.title}</Text>
      <View style={{ marginVertical: 10 }}>
        <Button
          title={speaking ? "Stop Listening" : "Listen to this article"}
          onPress={handleSpeak}
        />
      </View>
      <Text style={styles.content}>{article.content || article.description || ""}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  content: { fontSize: 15, lineHeight: 22 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default ArticleScreen;
