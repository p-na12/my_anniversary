import { AnimatePresence, motion } from "framer-motion";
import { Gift, Heart, Music2, Pause, Play, Upload, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAnniversaryData } from "../context/AnniversaryContext";
import { Reveal } from "./ui";

export function MusicPlayer() {
  const { data, audioUrl, editMode, setAudio, updateData } = useAnniversaryData();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  useEffect(() => setPlaying(false), [audioUrl]);
  const toggle = () => { const audio = audioRef.current; if (!audioUrl || !audio) return; if (audio.paused) void audio.play(); else audio.pause(); setPlaying(!audio.paused); };
  const format = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
  return (
    <section className="section music-section"><div className="container"><Reveal><div className="music-card">
      <div className="record-cover"><div className="record"><div><Heart size={24} fill="currentColor" /></div></div><span className="music-note"><Music2 size={20} /></span></div>
      <div className="music-content"><p className="eyebrow">The soundtrack to us</p>{editMode ? <div className="song-edit"><input value={data.songTitle} onChange={(event) => updateData({ songTitle: event.target.value })} aria-label="Song title" /><input value={data.songArtist} onChange={(event) => updateData({ songArtist: event.target.value })} aria-label="Song artist" /></div> : <><h2>{data.songTitle}</h2><p>{data.songArtist}</p></>}
        <audio ref={audioRef} src={audioUrl} onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onEnded={() => setPlaying(false)} />
        <div className="player"><button className="play-button" onClick={toggle} disabled={!audioUrl}>{playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button><div className="track"><input type="range" min="0" max={duration || 1} value={progress} onChange={(event) => { const value = Number(event.target.value); if (audioRef.current) audioRef.current.currentTime = value; setProgress(value); }} /><div><span>{format(progress)}</span><span>{audioUrl ? format(duration) : "Add our song"}</span></div></div><Volume2 size={18} /><input className="volume" type="range" min="0" max="1" step=".05" defaultValue=".8" onChange={(event) => { if (audioRef.current) audioRef.current.volume = Number(event.target.value); }} /></div>
        {editMode && <label className="button small audio-upload"><Upload size={15} /> Upload audio<input hidden type="file" accept="audio/*" onChange={(event) => event.target.files?.[0] && void setAudio(event.target.files[0])} /></label>}
      </div>
    </div></Reveal></div></section>
  );
}

export function Surprise() {
  const [open, setOpen] = useState(false);
  const hearts = Array.from({ length: 28 }, (_, index) => ({ id: index, left: `${(index * 37) % 100}%`, delay: (index % 8) * .08 }));
  return (
    <section className="section surprise-section"><div className="container narrow"><Reveal><div className="surprise-card"><p className="eyebrow">One more little thing</p><h2>A surprise, just for you</h2><p>Some feelings deserve more than a sentence.</p><button className="button primary gift-button" onClick={() => setOpen(true)}><Gift size={19} /> I have something for you 💝</button></div></Reveal></div>
      <AnimatePresence>{open && <motion.div className="surprise-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>{hearts.map((heart) => <motion.span key={heart.id} style={{ left: heart.left }} initial={{ y: "70vh", opacity: 0, rotate: 0 }} animate={{ y: "-30vh", opacity: [0, 1, 1, 0], rotate: 180 }} transition={{ duration: 2.8, delay: heart.delay }}><Heart fill="currentColor" /></motion.span>)}<motion.div className="surprise-message" initial={{ scale: .5, opacity: 0, rotate: -4 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: "spring", delay: .25 }} onClick={(event) => event.stopPropagation()}><motion.div className="gift-box" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Gift size={58} /></motion.div><p>No matter how many years pass,</p><h2>I will always choose you.</h2><Heart size={35} fill="currentColor" /><button onClick={() => setOpen(false)}>Keep this feeling close</button></motion.div></motion.div>}</AnimatePresence>
    </section>
  );
}
