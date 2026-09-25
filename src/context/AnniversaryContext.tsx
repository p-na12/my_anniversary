import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import { mediaStorage } from "../utils/IndexedDb";
import type { LoveReason, MediaItem, MediaKind, MediaView, SiteData, SpecialDate, StoryMemory } from "../types";

const today = new Date();
const iso = (date: Date) => date.toISOString().slice(0, 10);
const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

const defaultData: SiteData = {
  nameOne: "Polina",
  nameTwo: "My Love",
  anniversaryDate: iso(yearAgo),
  subtitle: "Every day with you is another beautiful page in our story.",
  loveLetter: "If I could choose one place to be, it would always be beside you. Thank you for filling ordinary days with laughter, warmth, and the kind of love that feels like home. I would choose you in every lifetime — and I will keep choosing you in this one.",
  songTitle: "Our Song",
  songArtist: "Add the song that feels like us",
  memories: [
    { id: "met", date: iso(yearAgo), title: "The day we met", description: "One ordinary day quietly became the beginning of everything." },
    { id: "date", date: iso(new Date(yearAgo.getTime() + 21 * 86400000)), title: "Our first date", description: "Nervous smiles, endless conversation, and no desire for the evening to end." },
    { id: "trip", date: iso(new Date(yearAgo.getTime() + 110 * 86400000)), title: "Our first adventure", description: "We learned that anywhere can feel special when we are there together." },
  ],
  reasons: [
    { id: "smile", text: "Your smile makes every room feel warmer." },
    { id: "kindness", text: "You are kind, even when nobody is watching." },
    { id: "support", text: "You believe in me on the days I forget how." },
    { id: "adventure", text: "You turn the smallest plans into adventures." },
    { id: "ordinary", text: "You make ordinary days feel worth remembering." },
  ],
  specialDates: [
    { id: "first-met", label: "The day we met", date: iso(yearAgo), repeatsYearly: true },
    { id: "anniversary", label: "Our anniversary", date: iso(today), repeatsYearly: true },
  ],
};

type ContextValue = {
  data: SiteData;
  editMode: boolean;
  gallery: MediaView[];
  heroUrl?: string;
  audioUrl?: string;
  updateData: (patch: Partial<SiteData>) => void;
  setEditMode: (value: boolean) => void;
  addMemory: (memory: Omit<StoryMemory, "id">, image?: File) => Promise<void>;
  updateMemory: (memory: StoryMemory, image?: File) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  addReason: (text: string) => void;
  updateReason: (reason: LoveReason) => void;
  deleteReason: (id: string) => void;
  addSpecialDate: (value: Omit<SpecialDate, "id">) => void;
  updateSpecialDate: (value: SpecialDate) => void;
  deleteSpecialDate: (id: string) => void;
  addGallery: (files: File[], caption: string, date: string) => Promise<void>;
  deleteGallery: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  setHero: (file: File) => Promise<void>;
  setAudio: (file: File) => Promise<void>;
  getMediaUrl: (id?: string) => Promise<string | undefined>;
  exportData: () => Promise<void>;
  importData: (file: File) => Promise<void>;
};

const AnniversaryContext = createContext<ContextValue | null>(null);
const STORAGE_KEY = "everafter-site-data-v1";

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function loadData() {
  try {
    return { ...defaultData, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") } as SiteData;
  } catch {
    return defaultData;
  }
}

const toView = (item: MediaItem): MediaView => ({ ...item, blob: undefined, url: URL.createObjectURL(item.blob) } as MediaView);

export function AnniversaryProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<SiteData>(loadData);
  const [editMode, setEditMode] = useState(false);
  const [gallery, setGallery] = useState<MediaView[]>([]);
  const [heroUrl, setHeroUrl] = useState<string>();
  const [audioUrl, setAudioUrl] = useState<string>();

  const refreshMedia = useCallback(async () => {
    const [galleryItems, heroItems, audioItems] = await Promise.all([
      mediaStorage.list("gallery"), mediaStorage.list("hero"), mediaStorage.list("audio"),
    ]);
    setGallery((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.url));
      return galleryItems.sort((a, b) => b.createdAt - a.createdAt).map(toView);
    });
    setHeroUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return heroItems.sort((a, b) => b.createdAt - a.createdAt)[0]?.blob
        ? URL.createObjectURL(heroItems.sort((a, b) => b.createdAt - a.createdAt)[0].blob)
        : undefined;
    });
    setAudioUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return audioItems.sort((a, b) => b.createdAt - a.createdAt)[0]?.blob
        ? URL.createObjectURL(audioItems.sort((a, b) => b.createdAt - a.createdAt)[0].blob)
        : undefined;
    });
  }, []);

  useEffect(() => { void refreshMedia(); }, [refreshMedia]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);

  const updateData = (patch: Partial<SiteData>) => setData((current) => ({ ...current, ...patch }));
  const saveFile = async (kind: MediaKind, file: File, extra: Partial<MediaItem> = {}) => {
    const item: MediaItem = { id: crypto.randomUUID(), kind, blob: file, name: file.name, createdAt: Date.now(), ...extra };
    await mediaStorage.put(item);
    return item;
  };
  const replaceSingleton = async (kind: "hero" | "audio", file: File) => {
    const existing = await mediaStorage.list(kind);
    await Promise.all(existing.map((item) => mediaStorage.remove(item.id)));
    await saveFile(kind, file);
    await refreshMedia();
  };

  const value = useMemo<ContextValue>(() => ({
    data, editMode, gallery, heroUrl, audioUrl, updateData, setEditMode,
    addMemory: async (memory, image) => {
      const media = image ? await saveFile("story", image) : undefined;
      updateData({ memories: [...data.memories, { ...memory, id: crypto.randomUUID(), imageId: media?.id }] });
    },
    updateMemory: async (memory, image) => {
      let imageId = memory.imageId;
      if (image) imageId = (await saveFile("story", image)).id;
      updateData({ memories: data.memories.map((item) => item.id === memory.id ? { ...memory, imageId } : item) });
    },
    deleteMemory: async (id) => {
      const target = data.memories.find((item) => item.id === id);
      if (target?.imageId) await mediaStorage.remove(target.imageId);
      updateData({ memories: data.memories.filter((item) => item.id !== id) });
    },
    addReason: (text) => updateData({ reasons: [...data.reasons, { id: crypto.randomUUID(), text }] }),
    updateReason: (reason) => updateData({ reasons: data.reasons.map((item) => item.id === reason.id ? reason : item) }),
    deleteReason: (id) => updateData({ reasons: data.reasons.filter((item) => item.id !== id) }),
    addSpecialDate: (item) => updateData({ specialDates: [...data.specialDates, { ...item, id: crypto.randomUUID() }] }),
    updateSpecialDate: (value) => updateData({ specialDates: data.specialDates.map((item) => item.id === value.id ? value : item) }),
    deleteSpecialDate: (id) => updateData({ specialDates: data.specialDates.filter((item) => item.id !== id) }),
    addGallery: async (files, caption, date) => {
      await Promise.all(files.map((file) => saveFile("gallery", file, { caption, date, favorite: false })));
      await refreshMedia();
    },
    deleteGallery: async (id) => { await mediaStorage.remove(id); await refreshMedia(); },
    toggleFavorite: async (id) => {
      const item = await mediaStorage.get(id);
      if (item) await mediaStorage.put({ ...item, favorite: !item.favorite });
      await refreshMedia();
    },
    setHero: (file) => replaceSingleton("hero", file),
    setAudio: (file) => replaceSingleton("audio", file),
    getMediaUrl: async (id) => {
      if (!id) return undefined;
      const item = await mediaStorage.get(id);
      return item ? URL.createObjectURL(item.blob) : undefined;
    },
    exportData: async () => {
      const storedMedia = await mediaStorage.list();
      const media = await Promise.all(storedMedia.map(async ({ blob, ...item }) => ({ ...item, blob: await blobToDataUrl(blob) })));
      const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data, media }, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "our-anniversary-data.json";
      link.click();
      URL.revokeObjectURL(link.href);
    },
    importData: async (file) => {
      const parsed = JSON.parse(await file.text()) as { data?: SiteData; media?: Array<Omit<MediaItem, "blob"> & { blob: string }> };
      if (!parsed.data?.anniversaryDate || !Array.isArray(parsed.data.memories)) throw new Error("This is not a valid anniversary backup.");
      if (parsed.media) {
        await mediaStorage.clear();
        await Promise.all(parsed.media.map(async (item) => mediaStorage.put({ ...item, blob: await (await fetch(item.blob)).blob() })));
        await refreshMedia();
      }
      setData({ ...defaultData, ...parsed.data });
    },
  }), [data, editMode, gallery, heroUrl, audioUrl, refreshMedia]);

  return <AnniversaryContext.Provider value={value}>{children}</AnniversaryContext.Provider>;
}

export function useAnniversaryData() {
  const value = useContext(AnniversaryContext);
  if (!value) throw new Error("useAnniversaryData must be used inside AnniversaryProvider");
  return value;
}
