export type StoryMemory = {
  id: string;
  date: string;
  title: string;
  description: string;
  imageId?: string;
};

export type LoveReason = { id: string; text: string };
export type SpecialDate = { id: string; label: string; date: string; repeatsYearly: boolean };

export type SiteData = {
  nameOne: string;
  nameTwo: string;
  anniversaryDate: string;
  subtitle: string;
  loveLetter: string;
  memories: StoryMemory[];
  reasons: LoveReason[];
  specialDates: SpecialDate[];
  songTitle: string;
  songArtist: string;
};

export type MediaKind = "gallery" | "hero" | "story" | "audio";

export type MediaItem = {
  id: string;
  kind: MediaKind;
  blob: Blob;
  name: string;
  caption?: string;
  date?: string;
  favorite?: boolean;
  createdAt: number;
};

export type MediaView = Omit<MediaItem, "blob"> & { url: string };
