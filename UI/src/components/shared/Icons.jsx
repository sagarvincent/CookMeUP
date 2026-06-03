const Ic = ({ children, size = 18, stroke = "currentColor", className = "ic" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const IcHome     = (p) => <Ic {...p}><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></Ic>;
export const IcBook     = (p) => <Ic {...p}><path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M4 17a3 3 0 0 1 3-3h12"/></Ic>;
export const IcLeaf     = (p) => <Ic {...p}><path d="M4 20s-1-8 4-13 12-3 12-3 0 7-5 12-11 4-11 4z"/><path d="M4 20l9-9"/></Ic>;
export const IcBag      = (p) => <Ic {...p}><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></Ic>;
export const IcCal      = (p) => <Ic {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></Ic>;
export const IcFlame    = (p) => <Ic {...p}><path d="M12 3s4 4 4 9a4 4 0 1 1-8 0c0-2 1-3 1-3 0 1 1 2 2 2 0-3-2-5 1-8z"/></Ic>;
export const IcStar     = (p) => <Ic {...p}><path d="M12 3l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.1L6.6 19.4l1.3-6L3.3 9.2l6.1-.6z"/></Ic>;
export const IcHeart    = (p) => <Ic {...p}><path d="M12 20s-7-4.3-9-9a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c-2 4.7-9 9-9 9z"/></Ic>;
export const IcClock    = (p) => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Ic>;
export const IcUsers    = (p) => <Ic {...p}><circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.2 3-5 6-5s5.4 1.8 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c2.5 0 4.5 1.3 5 4"/></Ic>;
export const IcSearch   = (p) => <Ic {...p}><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/></Ic>;
export const IcSliders  = (p) => <Ic {...p}><path d="M4 6h12M4 12h4M4 18h10"/><circle cx="19" cy="6" r="2"/><circle cx="11" cy="12" r="2"/><circle cx="17" cy="18" r="2"/></Ic>;
export const IcChef     = (p) => <Ic {...p}><path d="M7 14a4 4 0 1 1 2-7.5 4 4 0 0 1 6 0 4 4 0 1 1 2 7.5z"/><path d="M7 14h10v6H7z"/></Ic>;
export const IcMic      = (p) => <Ic {...p}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></Ic>;
export const IcCamera   = (p) => <Ic {...p}><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></Ic>;
export const IcMessage  = (p) => <Ic {...p}><path d="M4 5h16v11H8l-4 4z"/></Ic>;
export const IcPlus     = (p) => <Ic {...p}><path d="M12 5v14M5 12h14"/></Ic>;
export const IcMinus    = (p) => <Ic {...p}><path d="M5 12h14"/></Ic>;
export const IcCheck    = (p) => <Ic {...p}><path d="m5 12 5 5 9-11"/></Ic>;
export const IcX        = (p) => <Ic {...p}><path d="m6 6 12 12M18 6 6 18"/></Ic>;
export const IcArrow    = (p) => <Ic {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Ic>;
export const IcPlay     = (p) => <Ic {...p}><path d="M7 5v14l12-7z"/></Ic>;
export const IcPause    = (p) => <Ic {...p}><path d="M7 5v14M17 5v14"/></Ic>;
export const IcEdit     = (p) => <Ic {...p}><path d="M4 20l4-1L20 7l-3-3L5 16zM14 7l3 3"/></Ic>;
export const IcTrash    = (p) => <Ic {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></Ic>;
export const IcWand     = (p) => <Ic {...p}><path d="M5 19 17 7l3 3L8 22zM13 5l1 2 2 1-2 1-1 2-1-2-2-1 2-1zM20 2l.6 1.4L22 4l-1.4.6L20 6l-.6-1.4L18 4l1.4-.6z"/></Ic>;
export const IcSparkle  = (p) => <Ic {...p}><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6zM19 14l.8 2L22 17l-2.2.9L19 20l-.8-2.1L16 17l2.2-1z"/></Ic>;
export const IcVideo    = (p) => <Ic {...p}><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/></Ic>;
export const IcWaveform = (p) => <Ic {...p}><path d="M4 12v0M7 9v6M10 6v12M13 8v8M16 10v4M19 11v2"/></Ic>;
export const IcDots     = (p) => <Ic {...p}><circle cx="6" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18" cy="12" r="1.3"/></Ic>;
export const IcFilter   = (p) => <Ic {...p}><path d="M4 5h16l-6 8v6l-4-2v-4z"/></Ic>;
export const IcGrid     = (p) => <Ic {...p}><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></Ic>;
export const IcList     = (p) => <Ic {...p}><path d="M4 6h16M4 12h16M4 18h16"/></Ic>;
export const IcLightbulb= (p) => <Ic {...p}><path d="M9 18h6M10 21h4M8 14a5 5 0 1 1 8 0c-1 .8-1.5 2-1.5 3h-5c0-1-.5-2.2-1.5-3z"/></Ic>;

export const StarRow = ({ value = 4.5, size = 12 }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="stars" style={{ display: "inline-flex", gap: 1, color: "var(--saffron-acc)" }}>
      {[0,1,2,3,4].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24">
          <defs>
            <linearGradient id={`g${i}_${Math.round(value*10)}`}>
              <stop offset={i < full ? "100%" : (i === full && half ? "50%" : "0%")} stopColor="currentColor"/>
              <stop offset={i < full ? "100%" : (i === full && half ? "50%" : "0%")} stopColor="rgba(0,0,0,0.12)"/>
            </linearGradient>
          </defs>
          <path d="M12 3l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.1L6.6 19.4l1.3-6L3.3 9.2l6.1-.6z"
                fill={`url(#g${i}_${Math.round(value*10)})`} />
        </svg>
      ))}
    </span>
  );
};
