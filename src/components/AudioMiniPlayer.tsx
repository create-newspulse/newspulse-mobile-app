import { useAudioPlayer } from '@/src/audio/AudioPlayerContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AudioMiniPlayer = () => {
  const { currentArticle, isPlaying, togglePlayPause, stop } = useAudioPlayer();
  if (!currentArticle) return null;
  return (
    <View style={styles.container}>
      <Text numberOfLines={1} style={styles.title}>{currentArticle.title}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={togglePlayPause} style={styles.button}>
          <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={stop} style={[styles.button, styles.stop]}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: { flex: 1, marginRight: 12, fontWeight: '600' },
  actions: { flexDirection: 'row' },
  button: {
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  buttonText: { fontWeight: '600' },
  stop: { backgroundColor: '#ffd6d6' },
});

export default AudioMiniPlayer;
