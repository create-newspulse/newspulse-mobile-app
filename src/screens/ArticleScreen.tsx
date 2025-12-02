import type { RouteProp } from "@react-navigation/native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Button, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../api/client";
import { useAudioPlayer } from "../audio/AudioPlayerContext";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { addBookmark, getArticleFromCache, isBookmarked, removeBookmark, setArticleInCache, type NormalizedArticle } from "../storage/bookmarks";

type ArticleRouteProp = RouteProp<RootStackParamList, "Article">;

type Props = {
  route: ArticleRouteProp;
};

type Article = {
  _id: string;
  title: string;
  content?: string;
  description?: string;
  category?: string;
  language?: string;
  date?: string;
};

const ArticleScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const { id, initial } = route.params as { id: string; initial?: Partial<Article> };
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentArticle, isPlaying, playArticle, togglePlayPause } = useAudioPlayer();
  const [bookmarked, setBookmarked] = useState(false);

  const fetchArticle = async () => {
    try {
      // Fetch single article matching frontend-compatible backend
      const res = await api.get(`/api/articles/${id}`);
      const payload = res.data?.article ?? res.data;
      setArticle(payload);
      // write to cache for offline use
      const normalized: NormalizedArticle = {
        _id: String(payload._id || id),
        title: String(payload.title || "Untitled"),
        description: payload.description,
        imageUrl: payload.imageUrl || payload.imageURL || payload.image,
        content: payload.content,
        category: payload.category,
        language: payload.language,
        date: payload.date,
      };
      await setArticleInCache(normalized);
    } catch (err) {
      console.error("Error loading article", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prime from initial or cache for instant render
    let mounted = true;
    (async () => {
      if (initial && mounted) {
        setArticle((prev) => prev ?? (initial as Article));
        setLoading(true); // still fetch to refresh
      } else {
        const cached = await getArticleFromCache(id);
        if (cached && mounted) {
          setArticle(cached as Article);
          setLoading(true); // still fetch to refresh
        }
      }
      await fetchArticle();
      const b = await isBookmarked(id);
      if (mounted) setBookmarked(b);
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  useFocusEffect(React.useCallback(() => { return () => {}; }, []));

  useLayoutEffect(() => {
    navigation.setOptions?.({
      headerRight: () => (
        <Button
          title={bookmarked ? "★ Saved" : "☆ Save"}
          onPress={async () => {
            if (!article) return;
            if (bookmarked) {
              await removeBookmark(id);
              setBookmarked(false);
            } else {
              await addBookmark({
                _id: id,
                title: article.title,
                description: article.description,
                imageUrl: (article as any).imageUrl,
                content: article.content,
                category: article.category,
                language: article.language,
                date: article.date,
              });
              setBookmarked(true);
            }
          }}
        />
      ),
    });
  }, [navigation, bookmarked, article, id]);

  const handleListenPress = () => {
    if (!article) return;
    if (!currentArticle || currentArticle._id !== id) {
      playArticle({
        _id: id,
        title: article.title,
        description: article.description,
        content: article.content,
        category: article.category,
        language: article.language,
        date: article.date,
      });
    } else {
      togglePlayPause();
    }
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
          <Text>Failed to load article. Go back and try again.</Text>
        )}
      </View>
    );
  }

  const formattedDate = article.date ? new Date(article.date).toLocaleString() : undefined;
  const language = article.language || 'en';
  const category = article.category;

  const openOnWeb = () => {
    const url = `https://newspulse.co.in/article/${id}`; // TODO: replace with real slug route if available
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{article.title}</Text>
      <View style={styles.metaRow}>
        {category ? <Text style={styles.meta}>{category}</Text> : null}
        <Text style={styles.dot}>•</Text>
        <Text style={styles.meta}>{language.toUpperCase()}</Text>
        {formattedDate ? (
          <>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.meta}>{formattedDate}</Text>
          </>
        ) : null}
      </View>
      <View style={styles.actionsRow}>
        <Button
          title={currentArticle && currentArticle._id === id && isPlaying ? "Pause" : "Listen"}
          onPress={handleListenPress}
        />
        <View style={{ width: 12 }} />
        <Button title="Open on Web" onPress={openOnWeb} />
      </View>
      <Text style={styles.content}>{article.content || article.description || ""}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  meta: { color: '#666' },
  dot: { color: '#aaa', marginHorizontal: 6 },
  actionsRow: { flexDirection: 'row', marginBottom: 12 },
  content: { fontSize: 16, lineHeight: 24 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default ArticleScreen;
