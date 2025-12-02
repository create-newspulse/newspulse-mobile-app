import * as Speech from 'expo-speech';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type NormalizedArticle = {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  category?: string;
  language?: string;
  date?: string;
};

type AudioPlayerContextValue = {
  currentArticle: NormalizedArticle | null;
  isPlaying: boolean;
  playArticle: (article: NormalizedArticle) => void;
  togglePlayPause: () => void;
  stop: () => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextValue | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentArticle, setCurrentArticle] = useState<NormalizedArticle | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const speakText = (article: NormalizedArticle) => {
    const textBody = article.content || article.description || '';
    if (!textBody) return;
    Speech.speak(`${article.title}. ${textBody}`, {
      language: article.language || 'en-IN',
      onDone: () => setIsPlaying(false),
      onStopped: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
    setIsPlaying(true);
  };

  const playArticle = (article: NormalizedArticle) => {
    // stop any current
    Speech.stop();
    setIsPlaying(false);
    setCurrentArticle(article);
    speakText(article);
  };

  const togglePlayPause = () => {
    if (!currentArticle) return;
    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
    } else {
      speakText(currentArticle);
    }
  };

  const stop = () => {
    Speech.stop();
    setIsPlaying(false);
    // Keep currentArticle so UI can still show last played
  };

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const value = useMemo(
    () => ({ currentArticle, isPlaying, playArticle, togglePlayPause, stop }),
    [currentArticle, isPlaying]
  );

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  return ctx;
}
