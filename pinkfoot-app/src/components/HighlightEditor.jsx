import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../lib/api.js";
import { Icon, Camera, XCircle, ChevronDown } from "./icons/index.jsx";

/** Accepts either ["Amber Fort", ...] (legacy) or [{ name, image }, ...]. */
export const normalizeHighlight = (h) =>
  typeof h === "string" ? { name: h, image: "" } : { name: h?.name || "", image: h?.image || "" };

/**
 * Row-based editor for destination highlights, where each row pairs a name
 * with an optional image. Uploads happen inline against /api/uploads/image
 * so the URL is captured before the form is submitted.
 */
export default function HighlightEditor({ value = [], onChange }) {
  const rows = value.map(normalizeHighlight);

  const update = (idx, patch) => {
    const next = [...rows];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };
  const add = () => onChange([...rows, { name: "", image: "" }]);
  const remove = (idx) => onChange(rows.filter((_, i) => i !== idx));
  const move = (idx, dir) => {
    const next = [...rows];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    onChange(next);
  };

  return (
    <div>
      <AnimatePresence initial={false}>
        {rows.map((row, i) => (
          <HighlightRow
            key={i}
            index={i}
            row={row}
            onChange={(patch) => update(i, patch)}
            onRemove={() => remove(i)}
            onMoveUp={i > 0 ? () => move(i, -1) : null}
            onMoveDown={i < rows.length - 1 ? () => move(i, 1) : null}
          />
        ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-dashed border-[var(--color-pink)] px-4 py-2 text-xs font-bold text-[var(--color-pink)] transition hover:bg-[var(--color-pink-pale)]"
      >
        + Add highlight
      </button>
      <div className="mt-2 text-[11px] text-gray-500">
        Each highlight becomes a card in the destination's "Top Experiences" section. Images are optional — if you skip one we'll fall back to a gallery photo.
      </div>
    </div>
  );
}

function HighlightRow({ index, row, onChange, onRemove, onMoveUp, onMoveDown }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErr("Pick an image file.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const { url } = await api.adminUploadImage(file);
      onChange({ image: url });
    } catch (e) {
      setErr(e.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.18 }}
      className="mb-2 flex items-stretch gap-2 rounded-xl border border-gray-200 bg-white p-2"
    >
      {/* Order chip */}
      <span className="grid w-7 flex-shrink-0 place-items-center rounded-lg bg-[var(--color-pink-pale)] text-xs font-bold text-[var(--color-pink)]">
        {index + 1}
      </span>

      {/* Thumb / picker */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="group relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-dashed border-gray-300 bg-[var(--color-off-white)] transition hover:border-[var(--color-pink)]"
        aria-label="Upload highlight image"
      >
        {row.image ? (
          <>
            <img src={row.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 grid place-items-center bg-black/55 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 transition group-hover:opacity-100">
              Replace
            </div>
          </>
        ) : (
          <div className="grid h-full place-items-center text-[var(--color-pink)]">
            {busy ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-pink)] border-t-transparent" />
            ) : (
              <Icon size={18}><Camera /></Icon>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onPick}
          className="sr-only"
        />
      </button>

      {/* Name + meta */}
      <div className="flex flex-1 flex-col gap-1">
        <input
          value={row.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder={`Highlight #${index + 1} (e.g., Amber Fort)`}
          className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-pink)]"
        />
        <div className="flex items-center justify-between gap-2 text-[10px] text-gray-500">
          {row.image ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 font-semibold text-green-700">
              ✓ image saved
            </span>
          ) : (
            <span>No image yet</span>
          )}
          {err && <span className="truncate font-semibold text-red-600">{err}</span>}
          {row.image && (
            <button
              type="button"
              onClick={() => onChange({ image: "" })}
              className="font-semibold text-gray-500 hover:text-[var(--color-pink)]"
            >
              Remove image
            </button>
          )}
        </div>
      </div>

      {/* Re-order + remove */}
      <div className="flex flex-shrink-0 flex-col items-center justify-center gap-0.5">
        <button
          type="button"
          onClick={onMoveUp || undefined}
          disabled={!onMoveUp}
          aria-label="Move up"
          className="grid h-5 w-5 place-items-center rounded text-gray-400 hover:bg-gray-100 hover:text-[var(--color-navy)] disabled:opacity-30"
        >
          <Icon size={11}><span style={{ display: "inline-block", transform: "rotate(180deg)" }}><ChevronDown /></span></Icon>
        </button>
        <button
          type="button"
          onClick={onMoveDown || undefined}
          disabled={!onMoveDown}
          aria-label="Move down"
          className="grid h-5 w-5 place-items-center rounded text-gray-400 hover:bg-gray-100 hover:text-[var(--color-navy)] disabled:opacity-30"
        >
          <Icon size={11}><ChevronDown /></Icon>
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove highlight"
          className="mt-0.5 grid h-5 w-5 place-items-center rounded text-red-500 hover:bg-red-50"
        >
          <Icon size={12}><XCircle /></Icon>
        </button>
      </div>
    </motion.div>
  );
}
