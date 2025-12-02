import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  description: string;
  imageUrl?: string;
  onPress: () => void;
};

const NewsCard: React.FC<Props> = ({ title, description, imageUrl, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : null}
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>{title}</Text>
        <Text numberOfLines={3} style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    elevation: 2,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#555",
  },
});

export default NewsCard;
