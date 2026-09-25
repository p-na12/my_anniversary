import { Download, Heart, Settings, ToggleLeft, ToggleRight, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useAnniversaryData } from "../context/AnniversaryContext";
import { Field } from "./ui";

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data, editMode, setEditMode, updateData, exportData, importData } = useAnniversaryData();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  if (!open) return null;
  const importFile = async (file: File) => { try { await importData(file); setMessage("Your anniversary data was restored."); } catch (error) { setMessage(error instanceof Error ? error.message : "Could not import this file."); } };
  return <div className="settings-backdrop" onMouseDown={onClose}><aside className="settings-panel" onMouseDown={(event) => event.stopPropagation()}><div className="settings-head"><div className="settings-icon"><Settings size={20} /></div><div><p className="eyebrow">Owner controls</p><h2>Make it yours</h2></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div>
    <button className={`edit-toggle ${editMode ? "on" : ""}`} onClick={() => setEditMode(!editMode)}>{editMode ? <ToggleRight size={30} /> : <ToggleLeft size={30} />}<span><strong>Edit mode {editMode ? "on" : "off"}</strong><small>{editMode ? "Editing controls are visible" : "Visitors see the clean story"}</small></span></button>
    <div className="settings-form"><Field label="First name"><input value={data.nameOne} onChange={(event) => updateData({ nameOne: event.target.value })} /></Field><Field label="Partner name"><input value={data.nameTwo} onChange={(event) => updateData({ nameTwo: event.target.value })} /></Field><Field label="Anniversary / start date"><input type="date" value={data.anniversaryDate} onChange={(event) => updateData({ anniversaryDate: event.target.value })} /></Field><Field label="Hero message"><textarea rows={3} value={data.subtitle} onChange={(event) => updateData({ subtitle: event.target.value })} /></Field></div>
    <div className="data-box"><h3><Heart size={16} fill="currentColor" /> Keep your story safe</h3><p>Export the complete scrapbook—including uploaded photos and audio—as one private JSON backup.</p><div><button className="button small" onClick={() => void exportData()}><Download size={15} /> Export data</button><button className="button small secondary" onClick={() => inputRef.current?.click()}><Upload size={15} /> Import data</button><input ref={inputRef} hidden type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && void importFile(event.target.files[0])} /></div>{message && <small className="import-message">{message}</small>}</div>
  </aside></div>;
}