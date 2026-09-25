import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Heart, ImagePlus, Maximize2, Plus, Trash2, Upload, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useAnniversaryData } from "../context/AnniversaryContext";
import type { MediaView } from "../types";
import { Field, Modal, Reveal, SectionHeading } from "./ui";

export function MemoryGallery() {
  const { gallery, editMode, addGallery, deleteGallery, toggleFavorite } = useAnniversaryData();
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [lightbox, setLightbox] = useState<MediaView | null>(null);
  const visible = gallery.filter((item) => filter === "all" || item.favorite);
  const previews = useMemo(() => files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })), [files]);
  const upload = async () => { if (!files.length) return; await addGallery(files, caption, date); setFiles([]); setCaption(""); setUploadOpen(false); };
  return (
    <section id="memories" className="section gallery-section">
      <div className="container">
        <Reveal><SectionHeading eyebrow="Our favorite frames" title={<>A gallery of <em>us</em></>} copy="The blurry ones, the beautiful ones, and every little moment in between." /></Reveal>
        <div className="gallery-toolbar">
          <div className="segmented"><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All <span>{gallery.length}</span></button><button className={filter === "favorites" ? "active" : ""} onClick={() => setFilter("favorites")}><Heart size={14} /> Favorites</button></div>
          {editMode && <button className="button small" onClick={() => setUploadOpen(true)}><ImagePlus size={16} /> Add photos</button>}
        </div>
        {visible.length ? <div className="masonry-grid">{visible.map((item, index) => <motion.figure className="gallery-card" key={item.id} initial={{ opacity: 0, scale: .96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: Math.min(index * .05, .3) }}>
          <img src={item.url} alt={item.caption || "A shared memory"} />
          <div className="gallery-overlay"><button onClick={() => void toggleFavorite(item.id)} className={`heart-button ${item.favorite ? "liked" : ""}`} aria-label="Favorite photo"><Heart size={20} fill={item.favorite ? "currentColor" : "none"} /></button><button className="expand-button" onClick={() => setLightbox(item)}><Maximize2 size={18} /></button><figcaption><span>{item.date && <><Calendar size={12} /> {new Date(item.date + "T00:00:00").toLocaleDateString(undefined, { month: "short", year: "numeric" })}</>}</span><strong>{item.caption || "One of our moments"}</strong></figcaption></div>
          {editMode && <button className="delete-photo" onClick={() => confirm("Delete this photo?") && void deleteGallery(item.id)}><Trash2 size={15} /></button>}
        </motion.figure>)}</div> : <div className="gallery-empty"><div><Heart size={34} fill="currentColor" /></div><h3>{filter === "favorites" ? "No favorites yet" : "Your memories belong here"}</h3><p>{filter === "favorites" ? "Tap a heart on any photo to keep it close." : "Turn on edit mode and add the photos that tell your story."}</p>{editMode && filter === "all" && <button className="button primary" onClick={() => setUploadOpen(true)}><Plus size={16} /> Add your first photos</button>}</div>}
      </div>
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Add your favorite moments">
        <div className="form-grid">
          <label className="upload-drop"><Upload size={22} /><strong>Choose one or more photos</strong><span>JPG, PNG, WEBP or HEIC from your device</span><input type="file" accept="image/*" multiple onChange={(event) => setFiles(Array.from(event.target.files ?? []))} /></label>
          {!!previews.length && <div className="preview-strip">{previews.map((preview) => <img key={preview.url} src={preview.url} alt={preview.name} />)}</div>}
          <Field label="Caption"><input value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Sunset walks and your hand in mine" /></Field>
          <Field label="Date"><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></Field>
          <button className="button primary full" disabled={!files.length} onClick={() => void upload()}>Add {files.length || ""} photo{files.length === 1 ? "" : "s"}</button>
        </div>
      </Modal>
      <AnimatePresence>{lightbox && <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}><button aria-label="Close preview"><X /></button><motion.img initial={{ scale: .94 }} animate={{ scale: 1 }} src={lightbox.url} alt={lightbox.caption || "Memory preview"} /><div><strong>{lightbox.caption}</strong><span>{lightbox.date}</span></div></motion.div>}</AnimatePresence>
    </section>
  );
}
