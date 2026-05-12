import { useState } from "react";
import { Icon, XCircle } from "./icons/index.jsx";

/**
 * Add-and-remove chip input. Type a value, hit Enter (or click Add) — value is
 * appended as a chip. Click × on any chip to remove it. Preserves spaces and
 * commas inside an entry. Pasting a comma-separated string splits into chips.
 *
 * Props:
 *   value        string[]
 *   onChange     (next: string[]) => void
 *   placeholder  string
 *   label        string                   — optional label rendered above
 *   helper       string                   — small text below the input
 */
export default function ChipInput({
  value = [],
  onChange,
  placeholder = "Type and press Enter",
  label,
  helper,
}) {
  const [draft, setDraft] = useState("");

  const add = (raw) => {
    const cleaned = (raw ?? draft).trim();
    if (!cleaned) return;
    // Allow pasting a comma-separated batch; otherwise treat as one entry
    const parts = cleaned.includes(",")
      ? cleaned.split(",").map((s) => s.trim()).filter(Boolean)
      : [cleaned];
    const next = [...value];
    for (const p of parts) {
      if (!next.includes(p)) next.push(p);
    }
    onChange(next);
    setDraft("");
  };

  const remove = (idx) => onChange(value.filter((_, i) => i !== idx));

  const onKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div>
      {label && (
        <div className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-gray-600">
          {label}
        </div>
      )}

      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {value.map((v, i) => (
            <span
              key={`${v}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-pink-pale)] px-3 py-1 text-xs font-semibold text-[var(--color-pink)]"
            >
              {v}
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove ${v}`}
                className="text-[var(--color-pink)] hover:text-[var(--color-navy)]"
              >
                <Icon size={12}><XCircle /></Icon>
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-pink)]"
        />
        <button
          type="button"
          onClick={() => add()}
          disabled={!draft.trim()}
          className="rounded-full bg-[var(--color-navy)] px-4 py-2 text-xs font-bold text-white transition disabled:opacity-40 hover:bg-[var(--color-pink)]"
        >
          + Add
        </button>
      </div>

      {helper && (
        <div className="mt-1 text-[11px] text-gray-500">{helper}</div>
      )}
    </div>
  );
}
