import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import NewsCard from "../components/NewsCard";
import { getBookmarks, type Bookmark } from "../storage/bookmarks";

const SavedScreen = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBookmarks();
      setItems(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
      return () => {};
    }, [load])
  );

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading saved articles…</Text>
      </View>
    );
  }

  if (!items.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>No saved articles yet</Text>
        <Text style={{ color: '#666', marginTop: 4 }}>Bookmark articles to read them later, even offline.</Text>
      </View>
    );
  }

  return (
    <View style={styles.containerList}>
      <FlatList
        data={items}
        keyExtractor={(it) => it._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <NewsCard
            title={item.title}
            description={item.description || ''}
            imageUrl={item.imageUrl}
            onPress={() => (navigation as any).navigate('Article', { id: item._id, initial: item })}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerList: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
});

export default SavedScreen;
