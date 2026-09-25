import { CalendarHeart, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAnniversaryData } from "../context/AnniversaryContext";
import type { SpecialDate } from "../types";
import { Field, Modal, Reveal, SectionHeading } from "./ui";

function distance(item: SpecialDate) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const original = new Date(item.date + "T00:00:00");
  let target = new Date(original);
  if (item.repeatsYearly) {
    target = new Date(now.getFullYear(), original.getMonth(), original.getDate());
    if (target < now) target.setFullYear(now.getFullYear() + 1);
  }
  const days = Math.round((target.getTime() - now.getTime()) / 86400000);
  if (days === 0) return "Today ❤️";
  if (item.repeatsYearly) return `${days} day${days === 1 ? "" : "s"} to go`;
  if (days > 0) return `${days} day${days === 1 ? "" : "s"} to go`;
  const ago = Math.abs(days); return `${ago} day${ago === 1 ? "" : "s"} ago`;
}

const blank: SpecialDate = { id: "", label: "", date: new Date().toISOString().slice(0, 10), repeatsYearly: false };

export function SpecialDates() {
  const { data, editMode, addSpecialDate, updateSpecialDate, deleteSpecialDate } = useAnniversaryData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SpecialDate>(blank);
  const begin = (value?: SpecialDate) => { setEditing(value ?? blank); setOpen(true); };
  const save = () => { if (!editing.label || !editing.date) return; editing.id ? updateSpecialDate(editing) : addSpecialDate(editing); setOpen(false); };
  return (
    <section id="dates" className="section dates-section"><div className="container">
      <Reveal><SectionHeading eyebrow="Dates worth circling" title={<>Our special <em>days</em></>} copy="A small calendar of beginnings, celebrations, and adventures still ahead." /></Reveal>
      {editMode && <div className="section-action"><button className="button small" onClick={() => begin()}><Plus size={16} /> Add a date</button></div>}
      <div className="dates-grid">{data.specialDates.map((item) => <article className="date-card" key={item.id}><div className="date-icon"><CalendarHeart size={22} /></div><div><span>{new Date(item.date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span><h3>{item.label}</h3><p>{distance(item)}</p></div>{editMode && <div className="date-actions"><button onClick={() => begin(item)}><Pencil size={14} /></button><button onClick={() => deleteSpecialDate(item.id)}><Trash2 size={14} /></button></div>}</article>)}</div>
    </div><Modal open={open} onClose={() => setOpen(false)} title={editing.id ? "Edit special date" : "Add a special date"}><div className="form-grid"><Field label="What happened?"><input value={editing.label} onChange={(event) => setEditing({ ...editing, label: event.target.value })} placeholder="Our first trip" /></Field><Field label="Date"><input type="date" value={editing.date} onChange={(event) => setEditing({ ...editing, date: event.target.value })} /></Field><label className="check-field"><input type="checkbox" checked={editing.repeatsYearly} onChange={(event) => setEditing({ ...editing, repeatsYearly: event.target.checked })} /><span>Celebrate this every year</span></label><button className="button primary full" onClick={save}>Save date</button></div></Modal></section>
  );
}
