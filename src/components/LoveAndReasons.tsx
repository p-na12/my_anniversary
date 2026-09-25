import { AnimatePresence, motion } from "framer-motion";
import { Heart, Pencil, Plus, Quote, Shuffle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAnniversaryData } from "../context/AnniversaryContext";
import type { LoveReason } from "../types";
import { Field, Modal, Reveal, SectionHeading } from "./ui";

export function LoveLetter() {
  const { data, editMode, updateData } = useAnniversaryData();
  const [open, setOpen] = useState(false);
  const [letter, setLetter] = useState(data.loveLetter);
  return (
    <section id="letter" className="section letter-section">
      <div className="container narrow">
        <Reveal><div className="letter-paper"><span className="paper-clip" /><Quote className="quote-mark" /><p className="eyebrow">A letter for you</p><h2>To my favorite person <span>💕</span></h2><div className="letter-body">{data.loveLetter}</div><div className="signature"><span>Always yours,</span><strong>{data.nameOne}</strong><motion.div animate={{ scale: [1, 1.18, 1] }} transition={{ repeat: Infinity, duration: 2.4 }}><Heart size={19} fill="currentColor" /></motion.div></div>{editMode && <button className="button small letter-edit" onClick={() => { setLetter(data.loveLetter); setOpen(true); }}><Pencil size={15} /> Edit letter</button>}</div></Reveal>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Write from the heart"><div className="form-grid"><Field label="Your love letter"><textarea rows={12} value={letter} onChange={(event) => setLetter(event.target.value)} /></Field><button className="button primary full" onClick={() => { updateData({ loveLetter: letter }); setOpen(false); }}>Save letter</button></div></Modal>
    </section>
  );
}

export function ReasonsILoveYou() {
  const { data, editMode, addReason, updateReason, deleteReason } = useAnniversaryData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LoveReason | null>(null);
  const [random, setRandom] = useState<LoveReason | null>(null);
  const begin = (reason?: LoveReason) => { setEditing(reason ?? { id: "", text: "" }); setOpen(true); };
  const save = () => { if (!editing?.text.trim()) return; editing.id ? updateReason(editing) : addReason(editing.text.trim()); setOpen(false); };
  const another = () => {
    if (!data.reasons.length) return;
    const choices = data.reasons.filter((item) => item.id !== random?.id);
    setRandom((choices.length ? choices : data.reasons)[Math.floor(Math.random() * (choices.length || data.reasons.length))]);
  };
  return (
    <section id="reasons" className="section reasons-section"><div className="container">
      <Reveal><SectionHeading eyebrow="In case you ever wonder" title={<>A few reasons I <em>love you</em></>} copy="There are infinitely more. These are just some I never want to forget to say out loud." /></Reveal>
      {editMode && <div className="section-action"><button className="button small" onClick={() => begin()}><Plus size={16} /> Add a reason</button></div>}
      <div className="reason-grid">{data.reasons.map((reason, index) => <motion.article className="reason-card" key={reason.id} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(index * .05, .3) }}><span>{String(index + 1).padStart(2, "0")}</span><Heart size={21} fill="currentColor" /><p>{reason.text}</p>{editMode && <div className="edit-actions"><button onClick={() => begin(reason)}><Pencil size={13} /> Edit</button><button className="danger" onClick={() => deleteReason(reason.id)}><Trash2 size={13} /></button></div>}</motion.article>)}</div>
      <div className="random-reason"><button className="button primary" onClick={another}><Shuffle size={17} /> Give me another reason <Heart size={15} fill="currentColor" /></button><AnimatePresence mode="wait">{random && <motion.p key={random.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>“{random.text}”</motion.p>}</AnimatePresence></div>
    </div><Modal open={open} onClose={() => setOpen(false)} title={editing?.id ? "Edit this reason" : "Add another reason"}><div className="form-grid"><Field label="Why do you love them?"><textarea rows={4} value={editing?.text ?? ""} onChange={(event) => setEditing((item) => item ? { ...item, text: event.target.value } : item)} placeholder="The way you..." /></Field><button className="button primary full" onClick={save}>Save reason</button></div></Modal></section>
  );
}
