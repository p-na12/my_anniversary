import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Settings, X } from "lucide-react";
import { useState } from "react";
import { useAnniversaryData } from "../context/AnniversaryContext";

const links = [
  ["Home", "home"], ["Our story", "story"], ["Memories", "memories"], ["Love letter", "letter"], ["Reasons", "reasons"], ["Special dates", "dates"],
];

export function Navbar({ onSettings }: { onSettings: () => void }) {
  const [open, setOpen] = useState(false);
  const { editMode } = useAnniversaryData();
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setOpen(false); };
  return (
    <header className="nav-wrap">
      <nav className="nav-shell" aria-label="Primary navigation">
        <button className="brand" onClick={() => go("home")}><span className="brand-heart"><Heart size={16} fill="currentColor" /></span><span>Our Anniversary</span></button>
        <div className="nav-links">{links.map(([label, id]) => <button key={id} onClick={() => go(id)}>{label}</button>)}</div>
        <div className="nav-actions">
          {editMode && <span className="edit-pill">Editing</span>}
          <button className="icon-button" onClick={onSettings} aria-label="Open settings"><Settings size={18} /></button>
          <button className="icon-button mobile-menu" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">{open ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </nav>
      <AnimatePresence>{open && <motion.div className="mobile-links" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{links.map(([label, id]) => <button key={id} onClick={() => go(id)}>{label}</button>)}</motion.div>}</AnimatePresence>
    </header>
  );
}
