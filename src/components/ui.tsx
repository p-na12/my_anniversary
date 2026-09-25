import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { PropsWithChildren, ReactNode } from "react";

export function SectionHeading({ eyebrow, title, copy, align = "center" }: { eyebrow: string; title: ReactNode; copy?: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "section-heading text-center" : "section-heading text-left"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {copy && <p className="section-copy">{copy}</p>}
    </div>
  );
}

export function Reveal({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .65, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

export function Modal({ open, onClose, title, children }: PropsWithChildren<{ open: boolean; onClose: () => void; title: string }>) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div className="modal-card" role="dialog" aria-modal="true" aria-label={title} initial={{ opacity: 0, y: 30, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .98 }} transition={{ type: "spring", damping: 24 }} onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-head"><div><p className="eyebrow">A little edit</p><h3>{title}</h3></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const Field = ({ label, children }: PropsWithChildren<{ label: string }>) => <label className="field"><span>{label}</span>{children}</label>;
