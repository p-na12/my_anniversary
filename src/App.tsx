import { useState } from "react";
import { AnniversaryProvider } from "./context/AnniversaryContext";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { LoveLetter, ReasonsILoveYou } from "./components/LoveAndReasons";
import { MemoryGallery } from "./components/MemoryGallery";
import { MusicPlayer, Surprise } from "./components/MusicSurprise";
import { Navbar } from "./components/Navbar";
import { SettingsPanel } from "./components/SettingsPanel";
import { SpecialDates } from "./components/SpecialDates";
import { StoryTimeline } from "./components/StoryTimeline";

function Experience() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  return <><Navbar onSettings={() => setSettingsOpen(true)} /><main><Hero /><StoryTimeline /><MemoryGallery /><LoveLetter /><MusicPlayer /><ReasonsILoveYou /><SpecialDates /><Surprise /></main><Footer /><SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} /></>;
}

export function App() {
  return <AnniversaryProvider><Experience /></AnniversaryProvider>;
}