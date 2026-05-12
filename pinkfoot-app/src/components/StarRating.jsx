export default function StarRating({ rating, reviewCount, showValue = true, size = "sm" }) {
  const sizes = { xs: "text-[12px]", sm: "text-[14px]", md: "text-[16px]", lg: "text-[18px]" };
  const filled = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - filled - (half ? 1 : 0);
  return (
    <span className={`inline-flex items-center gap-1.5 ${sizes[size]}`}>
      <span className="text-[var(--color-gold)] leading-none">
        {"★".repeat(filled)}
        {half && "½"}
        <span className="text-gray-300">{"★".repeat(empty)}</span>
      </span>
      {showValue && (
        <span className="text-gray-700 text-[12px] font-semibold">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount != null && (
        <span className="text-gray-400 text-[11px]">({reviewCount.toLocaleString()})</span>
      )}
    </span>
  );
}
