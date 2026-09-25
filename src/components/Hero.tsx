import { motion } from "framer-motion";
import { ArrowDown, CalendarDays, Camera, Heart, Images, Sparkles } from "lucide-react";
import { useRef } from "react";
import { useAnniversaryData } from "../context/AnniversaryContext";
import { useAnniversary } from "../hooks/useAnniversary";

const units: Array<[keyof ReturnType<typeof useAnniversary>, string]> = [["years", "Years"], ["months", "Months"], ["days", "Days"], ["hours", "Hours"], ["minutes", "Minutes"], ["seconds", "Seconds"]];

export function Hero() {
  const { data, heroUrl, editMode, setHero } = useAnniversaryData();
  const elapsed = useAnniversary(data.anniversaryDate);
  const inputRef = useRef<HTMLInputElement>(null);
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section id="home" className="hero">
      <div className="hero-grain" />
      {[12, 25, 44, 67, 82].map((left, index) => <motion.span key={left} className="floating-heart" style={{ left: `${left}%`, top: `${18 + (index % 3) * 24}%` }} animate={{ y: [0, -18, 0], rotate: [-8, 8, -8], opacity: [.25, .7, .25] }} transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}><Heart size={12 + index * 2} fill="currentColor" /></motion.span>)}
      <div className="container hero-grid">
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
          <p className="eyebrow"><Sparkles size={14} /> {new Date(data.anniversaryDate + "T00:00:00").toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</p>
          <h1><span>Happy</span><em>Anniversary</em></h1>
          <div className="couple-name">{data.nameOne} <Heart size={20} fill="currentColor" /> {data.nameTwo}</div>
          <p className="hero-subtitle">{data.subtitle}</p>
          <div className="hero-actions">
            <button className="button primary" onClick={() => go("story")}>Our story <ArrowDown size={16} /></button>
            <button className="button secondary" onClick={() => go("memories")}><Images size={16} /> View memories</button>
          </div>
          <div className="together-note"><span className="pulse-dot" /> We have been together for <strong>{elapsed.totalDays.toLocaleString()} days</strong> <Heart size={14} fill="currentColor" /></div>
        </motion.div>
        <motion.div className="hero-visual" initial={{ opacity: 0, scale: .94, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: .9, delay: .15 }}>
          <div className="photo-frame">
            {heroUrl ? <img src={heroUrl} alt={`${data.nameOne} and ${data.nameTwo}`} /> : <div className="photo-placeholder"><div className="placeholder-orbit"><Heart size={56} fill="currentColor" /></div><p>Your favorite photo</p><span>Place one beautiful moment here</span></div>}
            <div className="photo-caption"><CalendarDays size={15} /> Our favorite chapter</div>
            {editMode && <><input ref={inputRef} hidden type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && void setHero(event.target.files[0])} /><button className="photo-edit" onClick={() => inputRef.current?.click()}><Camera size={16} /> Change photo</button></>}
          </div>
          <div className="tape tape-one" /><div className="tape tape-two" />
        </motion.div>
      </div>
      <div className="counter-wrap container">
        <div className="counter-card">{units.map(([key, label]) => <div className="counter-unit" key={label}><strong>{String(elapsed[key]).padStart(2, "0")}</strong><span>{label}</span></div>)}</div>
      </div>
      <motion.button className="scroll-cue" aria-label="Scroll to story" onClick={() => go("story")} animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}><span>Keep scrolling</span><ArrowDown size={17} /></motion.button>
    </section>
  );
}
