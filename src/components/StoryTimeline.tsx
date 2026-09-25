import { motion } from "framer-motion";
import { Calendar, Camera, Heart, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAnniversaryData } from "../context/AnniversaryContext";
import type { StoryMemory } from "../types";
import { Field, Modal, Reveal, SectionHeading } from "./ui";

function StoryPhoto({ imageId, title }: { imageId?: string; title: string }) {
  const { getMediaUrl } = useAnniversaryData();
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    let active = true;
    void getMediaUrl(imageId).then((value) => active && setUrl(value));
    return () => { active = false; if (url) URL.revokeObjectURL(url); };
  }, [imageId]);
  return url ? <img src={url} alt={title} /> : <div className="story-placeholder"><Heart size={30} fill="currentColor" /></div>;
}

const empty = { id: "", date: new Date().toISOString().slice(0, 10), title: "", description: "" };

export function StoryTimeline() {
  const { data, editMode, addMemory, updateMemory, deleteMemory } = useAnniversaryData();
  const [editing, setEditing] = useState<StoryMemory | null>(null);
  const [file, setFile] = useState<File>();
  const [open, setOpen] = useState(false);
  const begin = (memory?: StoryMemory) => { setEditing(memory ?? { ...empty }); setFile(undefined); setOpen(true); };
  const save = async () => {
    if (!editing?.title || !editing.date) return;
    if (editing.id) await updateMemory(editing, file); else await addMemory(editing, file);
    setOpen(false);
  };
  return (
    <section id="story" className="section story-section">
      <div className="container">
        <Reveal><SectionHeading eyebrow="Written in little moments" title={<>Our story, <em>so far</em></>} copy="The dates may mark the moments, but it is how they felt that we never want to forget." /></Reveal>
        {editMode && <div className="section-action"><button className="button small" onClick={() => begin()}><Plus size={16} /> Add a memory</button></div>}
        <div className="timeline">
          {data.memories.slice().sort((a, b) => a.date.localeCompare(b.date)).map((memory, index) => (
            <motion.article className={`timeline-row ${index % 2 ? "reverse" : ""}`} key={memory.id} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
              <div className="timeline-photo">
                <StoryPhoto imageId={memory.imageId} title={memory.title} />
                {editMode && <label className="story-photo-upload"><Camera size={15} /> {memory.imageId ? "Change photo" : "Add photo"}<input hidden type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && void updateMemory(memory, event.target.files[0])} /></label>}
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="timeline-pin"><Heart size={15} fill="currentColor" /></div>
              <div className="timeline-copy">
                <p className="date-label"><Calendar size={14} /> {new Date(memory.date + "T00:00:00").toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</p>
                <h3>{memory.title}</h3><p>{memory.description}</p>
                {editMode && <div className="edit-actions"><button onClick={() => begin(memory)}><Pencil size={14} /> Edit</button><button className="danger" onClick={() => confirm("Delete this memory?") && void deleteMemory(memory.id)}><Trash2 size={14} /> Delete</button></div>}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={editing?.id ? "Edit this memory" : "Add a chapter"}>
        <div className="form-grid">
          <Field label="Date"><input type="date" value={editing?.date ?? ""} onChange={(event) => setEditing((item) => item ? { ...item, date: event.target.value } : item)} /></Field>
          <Field label="Title"><input value={editing?.title ?? ""} placeholder="The day we met" onChange={(event) => setEditing((item) => item ? { ...item, title: event.target.value } : item)} /></Field>
          <Field label="What happened?"><textarea rows={4} value={editing?.description ?? ""} placeholder="Write the feeling, not only the facts..." onChange={(event) => setEditing((item) => item ? { ...item, description: event.target.value } : item)} /></Field>
          <Field label="Photo (optional)"><input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0])} /></Field>
          <button className="button primary full" onClick={() => void save()}>Save memory</button>
        </div>
      </Modal>
    </section>
  );
}
