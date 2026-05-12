export default function Logo({ size = 38, dark = false }) {
  const pink = "#E85478";
  const navy = "#1B2A4A";
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size * 1.1}
        viewBox="0 0 80 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Pinkfoot logo"
      >
        <ellipse cx="40" cy="58" rx="26" ry="30" fill={pink} />
        <ellipse cx="22" cy="22" rx="8" ry="10" fill={pink} />
        <ellipse cx="34" cy="15" rx="7" ry="9" fill={pink} />
        <ellipse cx="46" cy="13" rx="6.5" ry="8.5" fill={pink} />
        <ellipse cx="56" cy="17" rx="6" ry="8" fill={pink} />
        <path d="M30 58 L50 48 L52 52 L42 56 L46 68 L42 67 L38 58 L32 60 Z" fill="white" />
      </svg>
      <div className="leading-none">
        <div
          className="font-display text-[18px] font-bold leading-none"
          style={{ color: pink }}
        >
          PINKFOOT
        </div>
        <div
          className="font-body mt-0.5 text-[12px] font-bold tracking-[2px] leading-none"
          style={{ color: dark ? "#fff" : navy }}
        >
          TRAVEL
        </div>
      </div>
    </div>
  );
}
