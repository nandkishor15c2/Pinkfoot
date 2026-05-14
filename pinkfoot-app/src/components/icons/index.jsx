/**
 * Animated SVG icon set, ported from animate-ui
 * (https://github.com/imskyleen/animate-ui — `registry/icons/<name>`).
 *
 * Each icon is a <motion.svg> with internal variants. Wrap any icon in <Icon>
 * (from ./_Icon.jsx) to control when the animation plays. Without the wrapper
 * the icon is rendered static (no controls = falls back to `initial` variant).
 *
 * Import as:
 *   import { Icon, Search, ChevronDown, Phone } from "@/components/icons";
 *   <Icon size={20} animateOnHover><Search /></Icon>
 */
import { motion } from "framer-motion";
import { Icon, useAnimateIconContext, getVariants } from "./_Icon.jsx";

export { Icon };

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function useCtrl() {
  const { controls } = useAnimateIconContext();
  return controls;
}

/* ── Search ── */
export function Search({ size = 20 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { rotate: 0 },
        animate: {
          transformOrigin: "bottom right",
          rotate: [0, 17, -10, 5, -1, 0],
          transition: { duration: 0.8, ease: "easeInOut" },
        },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="m21 21-4.34-4.34" variants={v.path} initial="initial" animate={controls} />
      <motion.circle cx={11} cy={11} r={8} variants={v.circle} initial="initial" animate={controls} />
    </motion.svg>
  );
}

/* ── Menu (hamburger) ── */
export function Menu({ size = 20 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { rotate: 0 },
        animate: { rotate: [0, 90], transition: { duration: 0.4 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M4 7h16" />
      <motion.path d="M4 12h16" />
      <motion.path d="M4 17h16" />
    </motion.svg>
  );
}

/* ── X / Close ── */
export function X({ size = 20 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { rotate: 0 },
        animate: { rotate: [0, 90, 180], transition: { duration: 0.5 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M18 6 6 18" />
      <motion.path d="m6 6 12 12" />
    </motion.svg>
  );
}

/* ── ChevronDown ── */
export function ChevronDown({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { y: 0 },
        animate: { y: [0, 3, 0], transition: { duration: 0.5 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="m6 9 6 6 6-6" />
    </motion.svg>
  );
}

export function ChevronLeft({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { x: 0 },
        animate: { x: [0, -3, 0], transition: { duration: 0.5 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="m15 6-6 6 6 6" />
    </motion.svg>
  );
}

export function ChevronRight({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { x: 0 },
        animate: { x: [0, 3, 0], transition: { duration: 0.5 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="m9 6 6 6-6 6" />
    </motion.svg>
  );
}

/* ── ArrowRight ── */
export function ArrowRight({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { x: 0 },
        animate: { x: [0, 4, 0], transition: { duration: 0.5 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M5 12h14" />
      <motion.path d="m12 5 7 7-7 7" />
    </motion.svg>
  );
}

/* ── MapPin ── */
export function MapPin({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { y: 0 },
        animate: {
          y: [0, -4, 0, -2, 0],
          transition: { duration: 0.7 },
        },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z" />
      <motion.circle cx={12} cy={10} r={3} />
    </motion.svg>
  );
}

/* ── Calendar ── */
export function Calendar({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { y: 0 },
        animate: { y: [0, -2, 0], transition: { duration: 0.5 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M8 2v4" />
      <motion.path d="M16 2v4" />
      <motion.rect width={18} height={18} x={3} y={4} rx={2} />
      <motion.path d="M3 10h18" />
    </motion.svg>
  );
}

/* ── Users ── */
export function Users({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { scale: 1 },
        animate: { scale: [1, 1.1, 1], transition: { duration: 0.5 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <motion.circle cx={9} cy={7} r={4} />
      <motion.path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <motion.path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </motion.svg>
  );
}

/* ── Phone ── */
export function Phone({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { rotate: 0 },
        animate: {
          rotate: [0, -12, 12, -6, 6, 0],
          transition: { duration: 0.7 },
        },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </motion.svg>
  );
}

/* ── Mail ── */
export function Mail({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { y: 0 },
        animate: { y: [0, -3, 0], transition: { duration: 0.5 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="m4 7 8 6 8-6" />
      <motion.rect width={20} height={16} x={2} y={4} rx={2} />
    </motion.svg>
  );
}

/* ── Star ── */
export function Star({ size = 18, filled = false }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { rotate: 0, scale: 1 },
        animate: { rotate: [0, 15, -10, 0], scale: [1, 1.15, 1], transition: { duration: 0.6 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} fill={filled ? "currentColor" : "none"} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </motion.svg>
  );
}

/* ── Sparkles ── */
export function Sparkles({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { scale: 1, rotate: 0 },
        animate: { scale: [1, 1.15, 1], rotate: [0, 20, 0], transition: { duration: 0.6 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <motion.path d="M20 3v4" />
      <motion.path d="M22 5h-4" />
      <motion.path d="M4 17v2" />
      <motion.path d="M5 18H3" />
    </motion.svg>
  );
}

/* ── Check ── */
export function Check({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { scale: 1 },
        animate: { scale: [1, 1.25, 1], transition: { duration: 0.4 } },
      },
      path: {
        // Default state is fully drawn (visible). Animation re-draws the stroke.
        initial: { pathLength: 1 },
        animate: { pathLength: [0.05, 1], transition: { duration: 0.5, ease: "easeOut" } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M20 6 9 17l-5-5" variants={v.path} initial="initial" animate={controls} />
    </motion.svg>
  );
}

/* ── Heart ── */
export function Heart({ size = 18, filled = false }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { scale: 1 },
        animate: { scale: [1, 1.25, 1], transition: { duration: 0.4 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} fill={filled ? "currentColor" : "none"} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
    </motion.svg>
  );
}

/* ── Plane (paper plane) ── */
export function Plane({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { x: 0, y: 0 },
        animate: { x: [0, 4, 0], y: [0, -4, 0], transition: { duration: 0.7 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </motion.svg>
  );
}

/* ── Shield ── */
export function Shield({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { scale: 1 },
        animate: { scale: [1, 1.1, 1], transition: { duration: 0.5 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </motion.svg>
  );
}

/* ── Wallet ── */
export function Wallet({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { y: 0 },
        animate: { y: [0, -2, 0], transition: { duration: 0.4 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4" />
      <motion.path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
      <motion.path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </motion.svg>
  );
}

/* ── Grid (view mode) ── */
export function Grid({ size = 18 }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE}>
      <motion.rect x={3} y={3} width={7} height={7} rx={1} />
      <motion.rect x={14} y={3} width={7} height={7} rx={1} />
      <motion.rect x={3} y={14} width={7} height={7} rx={1} />
      <motion.rect x={14} y={14} width={7} height={7} rx={1} />
    </motion.svg>
  );
}

/* ── List (view mode) ── */
export function List({ size = 18 }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE}>
      <motion.line x1={8} y1={6} x2={21} y2={6} />
      <motion.line x1={8} y1={12} x2={21} y2={12} />
      <motion.line x1={8} y1={18} x2={21} y2={18} />
      <motion.line x1={3} y1={6} x2={3.01} y2={6} />
      <motion.line x1={3} y1={12} x2={3.01} y2={12} />
      <motion.line x1={3} y1={18} x2={3.01} y2={18} />
    </motion.svg>
  );
}

/* ── Bus (for transfers) ── */
export function Bus({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { x: 0 },
        animate: { x: [0, 4, 0], transition: { duration: 0.6 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M8 6v6" />
      <motion.path d="M15 6v6" />
      <motion.path d="M2 12h19.6" />
      <motion.path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
      <motion.circle cx={7} cy={18} r={2} />
      <motion.path d="M9 18h5" />
      <motion.circle cx={16} cy={18} r={2} />
    </motion.svg>
  );
}

/* ── Bed (hotel night) ── */
export function Bed({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { scale: 1 },
        animate: { scale: [1, 1.08, 1], transition: { duration: 0.5 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M2 4v16" />
      <motion.path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <motion.path d="M2 17h20" />
      <motion.path d="M6 8v9" />
    </motion.svg>
  );
}

/* ── Utensils (meal plan) ── */
export function Utensils({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { rotate: 0 },
        animate: { rotate: [0, -6, 6, 0], transition: { duration: 0.5 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <motion.path d="M7 2v20" />
      <motion.path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </motion.svg>
  );
}

/* ── Send (paper plane) ── */
export function Send({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { x: 0, y: 0 },
        animate: { x: [0, 6, 0], y: [0, -6, 0], transition: { duration: 0.6 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
      <motion.path d="m21.854 2.147-10.94 10.939" />
    </motion.svg>
  );
}

/* ── PartyPopper ── */
export function PartyPopper({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { rotate: 0, scale: 1 },
        animate: { rotate: [0, 10, -10, 0], scale: [1, 1.15, 1], transition: { duration: 0.6 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M5.8 11.3 2 22l10.7-3.79" />
      <motion.path d="M4 3h.01" />
      <motion.path d="M22 8h.01" />
      <motion.path d="M15 2h.01" />
      <motion.path d="M22 20h.01" />
      <motion.path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
      <motion.path d="m22 13-1.43-.27c-.86-.06-1.65.42-2.05 1.19l-.06.03c-.49.97-.61 2.07-.34 3.18l.31 1.27" />
      <motion.path d="m11 13.5.41-.65a2.07 2.07 0 0 1 3.18.34v0a2.18 2.18 0 0 0 .54 1.78l.74.66" />
      <motion.path d="M21.71 21.41 18 17.5l-2.5 1.5" />
      <motion.path d="m6 16 2 3" />
    </motion.svg>
  );
}

/* ── MessageCircle (chat) ── */
export function MessageCircle({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { scale: 1 },
        animate: { scale: [1, 1.1, 1], transition: { duration: 0.4 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </motion.svg>
  );
}

/* ── Award ── */
export function Award({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { rotate: 0 },
        animate: { rotate: [0, 10, -8, 0], transition: { duration: 0.5 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <motion.circle cx={12} cy={8} r={6} />
    </motion.svg>
  );
}

/* ── XCircle (exclusion) ── */
export function XCircle({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { rotate: 0 },
        animate: { rotate: [0, 90, 0], transition: { duration: 0.5 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.circle cx={12} cy={12} r={10} />
      <motion.path d="m15 9-6 6" />
      <motion.path d="m9 9 6 6" />
    </motion.svg>
  );
}

/* ── Globe ── */
export function Globe({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { rotate: 0 },
        animate: { rotate: [0, 360], transition: { duration: 1, ease: "easeInOut" } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.circle cx={12} cy={12} r={10} />
      <motion.path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20" />
      <motion.path d="M2 12h20" />
    </motion.svg>
  );
}

/* ── Inbox ── */
export function Inbox({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { y: 0 },
        animate: { y: [0, -3, 0], transition: { duration: 0.5 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <motion.path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </motion.svg>
  );
}

/* ── Package (box) ── */
export function PackageBox({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { rotate: 0 },
        animate: { rotate: [0, -5, 5, 0], transition: { duration: 0.5 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M16.5 9.4 7.55 4.24" />
      <motion.path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <motion.polyline points="3.29 7 12 12 20.71 7" />
      <motion.line x1={12} y1={22} x2={12} y2={12} />
    </motion.svg>
  );
}

/* ── Map ── */
export function Map({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { rotate: 0 },
        animate: { rotate: [0, -3, 3, 0], transition: { duration: 0.5 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
      <motion.path d="M15 5.764v15" />
      <motion.path d="M9 3.236v15" />
    </motion.svg>
  );
}

/* ── Target (goal/personalised) ── */
export function Target({ size = 18 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { scale: 1 },
        animate: { scale: [1, 1.1, 1], transition: { duration: 0.5 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.circle cx={12} cy={12} r={10} />
      <motion.circle cx={12} cy={12} r={6} />
      <motion.circle cx={12} cy={12} r={2} />
    </motion.svg>
  );
}

/* ── Camera (image) ── */
export function Camera({ size = 18 }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE}>
      <motion.path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <motion.circle cx={12} cy={13} r={3} />
    </motion.svg>
  );
}

/* ── Brand icons (static, no animation — these don't pair well with motion) ── */
export function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}
export function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
export function TwitterIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
export function YoutubeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

/* ── Luggage (empty state) ── */
export function Luggage({ size = 36 }) {
  const controls = useCtrl();
  const v = getVariants({
    default: {
      group: {
        initial: { y: 0 },
        animate: { y: [0, -4, 0], transition: { duration: 0.6 } },
      },
    },
  });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} variants={v.group} initial="initial" animate={controls}>
      <motion.path d="M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2" />
      <motion.path d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14" />
      <motion.path d="M10 20h4" />
      <motion.circle cx={16} cy={20} r={2} />
      <motion.circle cx={8} cy={20} r={2} />
    </motion.svg>
  );
}
