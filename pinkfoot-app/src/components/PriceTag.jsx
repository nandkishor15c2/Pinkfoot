export default function PriceTag({ price, original, discount, suffix = "/person" }) {
  return (
    <div className="min-w-0">
      {discount > 0 && (
        <div className="mb-0.5 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400 line-through tabular-nums">
            ₹{original?.toLocaleString("en-IN")}
          </span>
          <span className="badge-green !px-2 !py-0.5 !text-[10px]">{discount}% OFF</span>
        </div>
      )}
      <div className="flex flex-wrap items-baseline gap-1">
        <span className="text-2xl font-extrabold text-[var(--color-navy)] tabular-nums">
          ₹{price?.toLocaleString("en-IN")}
        </span>
        <span className="text-xs font-medium text-gray-500">{suffix}</span>
      </div>
    </div>
  );
}
