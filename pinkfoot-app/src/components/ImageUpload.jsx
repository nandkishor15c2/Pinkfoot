import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon, Camera, XCircle, Check } from "./icons/index.jsx";

const ACCEPT = "image/jpeg,image/jpg,image/png,image/webp,image/gif";
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

const sizeLabel = (b) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Branded image upload with drag-and-drop, previews, and removable thumbs.
 * - `multiple={false}` (default) — single image; new pick replaces the previous one.
 * - `multiple` — gallery mode; thumbnails grid with per-item remove.
 *
 * Props:
 *   existing       string | string[] | null   — already-uploaded URLs (server)
 *   files          File[]                     — newly-picked File objects (not yet uploaded)
 *   onFilesChange  (next: File[]) => void
 *   onRemoveExisting (i?: number) => void     — remove a server URL (idx for multi)
 *   accept         string                     — mime filter, defaults to common images
 *   maxBytes       number                     — per-file size cap, default 8 MB
 *   helper         string                     — small text below the zone
 */
export default function ImageUpload({
  multiple = false,
  existing,
  files = [],
  onFilesChange,
  onRemoveExisting,
  accept = ACCEPT,
  maxBytes = MAX_BYTES,
  helper,
}) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState("");

  const existingArr = Array.isArray(existing)
    ? existing
    : existing
    ? [existing]
    : [];
  const hasAny = existingArr.length > 0 || files.length > 0;

  const validate = (list) => {
    setErr("");
    const accepted = [];
    for (const f of list) {
      if (!f.type.startsWith("image/")) {
        setErr(`"${f.name}" is not an image.`);
        continue;
      }
      if (f.size > maxBytes) {
        setErr(`"${f.name}" is larger than ${sizeLabel(maxBytes)}.`);
        continue;
      }
      accepted.push(f);
    }
    return accepted;
  };

  const handleFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    const ok = validate(incoming);
    if (!ok.length) return;
    if (multiple) onFilesChange([...files, ...ok]);
    else onFilesChange([ok[0]]);
  };

  const onPick = (e) => {
    handleFiles(e.target.files);
    e.target.value = ""; // allow re-picking the same file
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files);
  };

  const removeFile = (idx) => {
    onFilesChange(files.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label
        htmlFor="image-upload-input"
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={`group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-[var(--color-off-white)] px-5 py-7 text-center transition ${
          drag
            ? "border-[var(--color-pink)] bg-[var(--color-pink-pale)] scale-[1.01]"
            : "border-gray-300 hover:border-[var(--color-pink)] hover:bg-[var(--color-pink-pale)]/40"
        }`}
      >
        <div className="inline-grid h-12 w-12 place-items-center rounded-full bg-white text-[var(--color-pink)] shadow-[0_4px_14px_rgba(232,84,120,0.18)]">
          <Icon size={22} animateOnHover><Camera /></Icon>
        </div>
        <div className="text-sm font-bold text-[var(--color-navy)]">
          {drag
            ? "Drop image here"
            : multiple
            ? "Drag & drop, or click to add images"
            : "Drag & drop, or click to upload"}
        </div>
        <div className="text-[11px] text-gray-500">
          {helper || `${accept.replace(/image\//g, "").replace(/,/g, " · ").toUpperCase()} — up to ${sizeLabel(maxBytes)}`}
        </div>
        <input
          ref={inputRef}
          id="image-upload-input"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onPick}
          className="sr-only"
        />
        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-pink)] px-4 py-1.5 text-xs font-bold text-white shadow-[0_4px_12px_rgba(232,84,120,0.35)] group-hover:scale-[1.03]">
          {hasAny && !multiple ? "Replace image" : "Browse files"}
        </span>
      </label>

      {err && (
        <div className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {err}
        </div>
      )}

      {hasAny && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              {multiple
                ? `${existingArr.length + files.length} image${existingArr.length + files.length === 1 ? "" : "s"}`
                : "Preview"}
            </div>
            {multiple && files.length > 0 && (
              <button
                type="button"
                onClick={() => onFilesChange([])}
                className="text-[11px] font-semibold text-gray-500 hover:text-[var(--color-pink)]"
              >
                Clear new
              </button>
            )}
          </div>

          <div className={`flex flex-wrap gap-2`}>
            <AnimatePresence initial={false}>
              {existingArr.map((url, i) => (
                <motion.div
                  key={`ex-${url}-${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.18 }}
                  className="group/thumb relative overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                  <img
                    src={url}
                    alt=""
                    className={multiple ? "h-20 w-28 object-cover" : "h-36 w-52 object-cover"}
                  />
                  <button
                    type="button"
                    onClick={() => (multiple ? onRemoveExisting?.(i) : onRemoveExisting?.())}
                    aria-label="Remove image"
                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover/thumb:opacity-100"
                  >
                    <Icon size={12}><XCircle /></Icon>
                  </button>
                  <span className="absolute left-1 bottom-1 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--color-navy)]">
                    Saved
                  </span>
                </motion.div>
              ))}
              {files.map((f, i) => (
                <motion.div
                  key={`new-${f.name}-${f.lastModified}-${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.18 }}
                  className="group/thumb relative overflow-hidden rounded-xl border-2 border-[var(--color-pink)] bg-white"
                >
                  <img
                    src={URL.createObjectURL(f)}
                    alt=""
                    className={multiple ? "h-20 w-28 object-cover" : "h-36 w-52 object-cover"}
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    aria-label="Remove image"
                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover/thumb:opacity-100"
                  >
                    <Icon size={12}><XCircle /></Icon>
                  </button>
                  <span className="absolute left-1 bottom-1 inline-flex items-center gap-1 rounded-full bg-[var(--color-pink)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    <Icon size={9}><Check /></Icon> New · {sizeLabel(f.size)}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
