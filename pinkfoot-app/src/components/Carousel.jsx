import { useEffect, useRef, useState } from "react";
import { Icon, ChevronLeft, ChevronRight } from "./icons/index.jsx";

/**
 * Horizontal scroll-snap carousel.
 *
 * Wrap each card you pass as children in a fixed-width container — the easiest is to
 * use the `itemClassName` prop to set responsive widths (e.g. "w-[280px] sm:w-[320px] lg:w-[360px]").
 * The Carousel renders prev/next chevrons (hidden on small screens — users swipe instead)
 * and a row of dots that reflect scroll position.
 */
export default function Carousel({
  children,
  itemClassName = "w-[260px] sm:w-[300px] lg:w-[340px]",
  gap = 20,
  className = "",
  showDots = true,
  showArrows = true,
}) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeDot, setActiveDot] = useState(0);
  const items = Array.isArray(children) ? children : [children];

  const update = () => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 8);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 8);
    const firstChild = el.children?.[0];
    if (firstChild) {
      const cardWidth = firstChild.getBoundingClientRect().width + gap;
      setActiveDot(Math.round(scrollLeft / cardWidth));
    }
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [items.length]);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.children?.[0];
    const step = first ? first.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={trackRef}
        className="-mx-4 flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          gap: `${gap}px`,
          scrollPaddingLeft: "16px",
          touchAction: "pan-x",
          overscrollBehaviorY: "auto",
        }}
      >
        {items.map((child, i) => (
          <div key={i} className={`shrink-0 snap-start ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>

      {showArrows && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollBy(-1)}
            disabled={!canPrev}
            className={`absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white text-[var(--color-navy)] shadow-[0_10px_30px_rgba(27,42,74,0.18)] transition md:flex ${
              canPrev ? "hover:scale-110" : "cursor-not-allowed opacity-0"
            }`}
          >
            <Icon size={18} animateOnHover><ChevronLeft /></Icon>
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollBy(1)}
            disabled={!canNext}
            className={`absolute right-0 top-1/2 hidden translate-x-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white text-[var(--color-navy)] shadow-[0_10px_30px_rgba(27,42,74,0.18)] transition md:flex ${
              canNext ? "hover:scale-110" : "cursor-not-allowed opacity-0"
            }`}
          >
            <Icon size={18} animateOnHover><ChevronRight /></Icon>
          </button>
        </>
      )}

      {showDots && items.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to item ${i + 1}`}
              onClick={() => {
                const el = trackRef.current;
                const first = el?.children?.[i];
                if (first) {
                  el.scrollTo({ left: first.offsetLeft - 16, behavior: "smooth" });
                }
              }}
              className={`h-1.5 rounded-full transition-all ${
                i === activeDot
                  ? "w-6 bg-[var(--color-pink)]"
                  : "w-1.5 bg-[var(--color-pink)]/30 hover:bg-[var(--color-pink)]/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
