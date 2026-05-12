/**
 * Minimal port of animate-ui's <Icon> wrapper for plain JSX + framer-motion.
 * Each animated icon component is wrapped with this so it can be triggered on
 * hover / tap / view / programmatically.
 *
 * Usage:
 *   <Icon animateOnHover><Search /></Icon>
 *   <Icon animate><CheckIcon /></Icon>     (animate immediately)
 *   <Icon animateOnView animation="find"><Search /></Icon>
 */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAnimation, useInView } from "framer-motion";

const IconCtx = createContext({
  controls: undefined,
  animation: "default",
  loop: false,
  loopDelay: 0,
});

export const useAnimateIconContext = () => useContext(IconCtx);

export function getVariants(animations) {
  const { animation } = useAnimateIconContext();
  return animations[animation] || animations.default;
}

export function Icon({
  children,
  className,
  size = 20,
  color,
  animate,
  animateOnHover,
  animateOnTap,
  animateOnView,
  animateOnViewMargin = "0px",
  animateOnViewOnce = true,
  animation = "default",
  loop = false,
  loopDelay = 0,
  delay = 0,
  onClick,
  ...rest
}) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, {
    margin: animateOnViewMargin,
    once: animateOnViewOnce,
  });
  const [active, setActive] = useState(false);

  // Imperative `animate` prop (true => play once)
  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => controls.start("animate"), delay);
      return () => clearTimeout(t);
    }
  }, [animate, controls, delay]);

  // View-triggered
  useEffect(() => {
    if (animateOnView && inView) {
      controls.start("animate");
    }
  }, [animateOnView, inView, controls]);

  // Hover-trigger: bind to the nearest interactive ancestor (button/a/[data-icon-trigger])
  // so hovering the whole button animates the icon, not just hovering the icon itself.
  useEffect(() => {
    if (!animateOnHover) return;
    const el = ref.current;
    if (!el) return;
    const trigger =
      el.closest("button, a, [data-icon-trigger]") || el;
    const onEnter = () => {
      setActive(true);
      controls.start("animate");
    };
    const onLeave = () => {
      setActive(false);
      controls.start("initial");
    };
    trigger.addEventListener("mouseenter", onEnter);
    trigger.addEventListener("mouseleave", onLeave);
    return () => {
      trigger.removeEventListener("mouseenter", onEnter);
      trigger.removeEventListener("mouseleave", onLeave);
    };
  }, [animateOnHover, controls]);

  // Tap-trigger: same logic for pointerdown/up
  useEffect(() => {
    if (!animateOnTap) return;
    const el = ref.current;
    if (!el) return;
    const trigger =
      el.closest("button, a, [data-icon-trigger]") || el;
    const onDown = () => controls.start("animate");
    const onUp = () => controls.start("initial");
    trigger.addEventListener("pointerdown", onDown);
    trigger.addEventListener("pointerup", onUp);
    trigger.addEventListener("pointercancel", onUp);
    return () => {
      trigger.removeEventListener("pointerdown", onDown);
      trigger.removeEventListener("pointerup", onUp);
      trigger.removeEventListener("pointercancel", onUp);
    };
  }, [animateOnTap, controls]);

  // Loop
  useEffect(() => {
    let cancelled = false;
    if (!loop) return;
    const tick = async () => {
      while (!cancelled) {
        await controls.start("animate");
        await new Promise((r) => setTimeout(r, loopDelay * 1000));
        await controls.start("initial");
      }
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, [loop, loopDelay, controls]);

  const ctx = { controls, animation, loop, loopDelay, active };

  return (
    <IconCtx.Provider value={ctx}>
      <span
        ref={ref}
        onClick={onClick}
        className={`inline-flex items-center justify-center ${className || ""}`}
        style={{ width: size, height: size, color, lineHeight: 0 }}
        {...rest}
      >
        {children}
      </span>
    </IconCtx.Provider>
  );
}

/** Helper to forward `size` from the wrapper to the SVG without prop-drilling. */
export function IconWrapper({ icon: IconComp, size = 20, ...rest }) {
  return <IconComp size={size} {...rest} />;
}
