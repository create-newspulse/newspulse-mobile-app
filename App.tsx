import React from "react";
import { AudioPlayerProvider } from "./src/audio/AudioPlayerContext";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <AudioPlayerProvider>
      <RootNavigator />
    </AudioPlayerProvider>
  );
}
