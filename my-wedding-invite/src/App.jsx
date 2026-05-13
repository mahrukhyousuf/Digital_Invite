import { useState, useEffect, useRef } from "react";

const STYLES = `
  @font-face {
    font-family: 'AmoresaAged';
    src: url('/AmoresaAged.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'Symphony';
    src: url('/Symphony.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { background: #1a1008; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #1a1008; }
  ::-webkit-scrollbar-thumb { background: #b07a6e; border-radius: 2px; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes shimmer {
    0%, 100% { opacity: 0.6; }
    50%       { opacity: 1; }
  }
  @keyframes scrollBounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50%       { transform: translateX(-50%) translateY(8px); }
  }
  @keyframes pageTransition {
    from { opacity: 0; transform: scale(1.02); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes envelopeReveal {
    0%   { opacity: 0; transform: translateY(40px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(176,122,110,0.3); }
    50%       { box-shadow: 0 0 40px rgba(176,122,110,0.6); }
  }
  @keyframes petalFall {
    0%   { transform: translateY(-20px) rotate(0deg) translateX(0); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.5; }
    100% { transform: translateY(100vh) rotate(720deg) translateX(60px); opacity: 0; }
  }
  @keyframes flapOpen {
    from { transform: perspective(600px) rotateX(0deg); }
    to   { transform: perspective(600px) rotateX(-180deg); }
  }
`;

/* ─── FLOATING PETALS ─── */
const Petals = () => {
  const petals = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 12}s`,
    duration: `${8 + Math.random() * 10}s`,
    size: `${4 + Math.random() * 6}px`,
    opacity: 0.15 + Math.random() * 0.25,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 5, overflow: "hidden" }}>
      {petals.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: p.left, top: "-10px",
          width: p.size, height: p.size,
          borderRadius: "50% 0 50% 0",
          background: "rgba(196,148,130,1)",
          opacity: p.opacity,
          animation: `petalFall ${p.duration} ${p.delay} infinite linear`,
        }} />
      ))}
    </div>
  );
};

/* ─── MOROCCAN ARCH FRAME ─── */
const ArchFrame = ({ children }) => (
  <div style={{ position: "relative", display: "inline-block", padding: "50px 40px 40px", maxWidth: "min(520px, 88vw)", width: "100%" }}>
    <svg viewBox="0 0 400 80" style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", height: "auto" }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="archGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8f1e8" />
          <stop offset="100%" stopColor="#f0e6d4" />
        </linearGradient>
      </defs>
      <path d="M20,80 L20,45 Q20,5 200,5 Q380,5 380,45 L380,80 Z" fill="url(#archGrad)" stroke="#c4a882" strokeWidth="1" />
      {Array.from({ length: 9 }, (_, i) => {
        const angle = (Math.PI * i) / 8;
        const r = 175;
        const cx = 200 + r * Math.cos(Math.PI - angle);
        const cy = 45 - r * Math.sin(angle) + 45;
        return (
          <g key={i}>
            <circle cx={cx} cy={Math.max(5, cy)} r="6" fill="none" stroke="#c4a882" strokeWidth="1" />
            <circle cx={cx} cy={Math.max(5, cy)} r="3" fill="#c4a882" opacity="0.4" />
          </g>
        );
      })}
      <g transform="translate(200,8)">
        {[0,60,120,180,240,300].map((deg, i) => (
          <ellipse key={i}
            cx={Math.cos((deg * Math.PI) / 180) * 8}
            cy={Math.sin((deg * Math.PI) / 180) * 8}
            rx="4" ry="2.5"
            transform={`rotate(${deg})`}
            fill="#c4a882" opacity="0.6"
          />
        ))}
        <circle cx="0" cy="0" r="3" fill="#b07a6e" opacity="0.7" />
      </g>
    </svg>
    <div style={{
      background: "linear-gradient(160deg, rgba(248,241,232,0.92) 0%, rgba(240,230,212,0.88) 100%)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(196,168,130,0.5)",
      borderTop: "none",
      padding: "20px 36px 36px",
      marginTop: "38px",
      position: "relative",
    }}>
      {children}
    </div>
  </div>
);

/* ─── SCROLL REVEAL WRAPPER ─── */
const Section = ({ children, style = {} }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(40px)",
      transition: "opacity 1s ease, transform 1s ease",
      ...style,
    }}>
      {children}
    </div>
  );
};

/* ─── COUNTDOWN HOOK ─── */
const useCountdown = () => {
  const target = new Date("2026-05-31T21:00:00+05:00");
  const calc = () => {
    const diff = target - new Date();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc());
  useEffect(() => { const t = setInterval(() => setTime(calc()), 1000); return () => clearInterval(t); }, []);
  return time;
};

/* ─── COUNTDOWN BOX ─── */
const CDBox = ({ value, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
    <div style={{
      width: "clamp(70px,18vw,110px)", height: "clamp(80px,20vw,120px)",
      background: "linear-gradient(135deg, rgba(248,241,232,0.15) 0%, rgba(180,140,100,0.08) 100%)",
      border: "1px solid rgba(248,241,232,0.35)",
      backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative",
      boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
    }}>
      {[
        { top: 0, left: 0, borderTop: "1.5px solid #c4a882", borderLeft: "1.5px solid #c4a882" },
        { top: 0, right: 0, borderTop: "1.5px solid #c4a882", borderRight: "1.5px solid #c4a882" },
        { bottom: 0, left: 0, borderBottom: "1.5px solid #c4a882", borderLeft: "1.5px solid #c4a882" },
        { bottom: 0, right: 0, borderBottom: "1.5px solid #c4a882", borderRight: "1.5px solid #c4a882" },
      ].map((s, i) => <div key={i} style={{ position: "absolute", width: 14, height: 14, ...s }} />)}
      <span style={{
        fontFamily: "'IM Fell English', serif",
        fontSize: "clamp(34px,9vw,68px)",
        color: "#f8f1e8", fontWeight: 400, lineHeight: 1,
        textShadow: "0 2px 12px rgba(0,0,0,0.3)",
      }}>
        {String(value).padStart(2, "0")}
      </span>
    </div>
    <span style={{
      fontFamily: "'IM Fell English', serif",
      fontStyle: "italic",
      fontSize: "clamp(12px,2vw,14px)",
      letterSpacing: "0.2em",
      color: "#c4a882",
    }}>{label}</span>
  </div>
);

/* ─── TIMELINE ITEM ─── */
const TLItem = ({ item, isLeft, delay }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      display: "grid", gridTemplateColumns: "1fr 40px 1fr",
      gap: "0 20px", marginBottom: 44, alignItems: "center",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      <div style={{ textAlign: "right" }}>
        {isLeft
          ? <span style={{ fontFamily: "'IM Fell English', serif", fontSize: "clamp(12px,2vw,15px)", color: "#b07a6e", letterSpacing: "0.15em" }}>{item.time}</span>
          : <span style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "clamp(18px,3vw,26px)", color: "#5c3d2e" }}>{item.event}</span>
        }
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#b07a6e", boxShadow: "0 0 12px rgba(176,122,110,0.6)", position: "relative", zIndex: 1 }} />
      </div>
      <div style={{ textAlign: "left" }}>
        {isLeft
          ? <span style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "clamp(18px,3vw,26px)", color: "#5c3d2e" }}>{item.event}</span>
          : <span style={{ fontFamily: "'IM Fell English', serif", fontSize: "clamp(12px,2vw,15px)", color: "#b07a6e", letterSpacing: "0.15em" }}>{item.time}</span>
        }
      </div>
    </div>
  );
};

/* ─── RSVP SECTION ─── */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby32o3lkOpRjbsdbAMebOFB-0WyaU8bgCxO4AJNkRVQrCO4tx_-GnjudHxtIKbWepI/exec";

const RSVPSection = () => {
  const [name, setName]           = useState("");
  const [attending, setAttending] = useState(null);
  const [guests, setGuests]       = useState("1");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!attending)   { setError("Please select if you're attending."); return; }
    setError("");
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          attending,
          guests: attending === "Joyfully Accepts" ? guests : "0",
        }),
      });
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", position: "relative",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "80px 20px",
    }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/page3.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(20,12,5,0.55)" }} />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 560, width: "100%" }}>
        <svg viewBox="0 0 200 40" style={{ width: 160, opacity: 0.7, marginBottom: 8 }} xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="20" x2="70" y2="20" stroke="#c4a882" strokeWidth="0.8" />
          <circle cx="100" cy="20" r="12" fill="none" stroke="#c4a882" strokeWidth="0.8" />
          <text x="100" y="25" textAnchor="middle" style={{ fontFamily: "serif", fontSize: "14px", fill: "#c4a882" }}>✦</text>
          <line x1="130" y1="20" x2="200" y2="20" stroke="#c4a882" strokeWidth="0.8" />
        </svg>

        <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 14, letterSpacing: "0.4em", color: "#c4a882", textTransform: "uppercase", marginBottom: 12 }}>
          You Are Cordially Invited
        </p>
        <h2 style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "clamp(36px,8vw,64px)", color: "#f8f1e8", fontWeight: 400, lineHeight: 1.1, marginBottom: 6 }}>
          Will You Join Us?
        </h2>
        <p style={{ fontFamily: "'IM Fell English', serif", fontSize: 14, letterSpacing: "0.35em", color: "#c4a882", marginBottom: 40, textTransform: "uppercase" }}>
          31st May 2026 · Karachi
        </p>

        {!submitted ? (
          <div style={{
            background: "rgba(248,241,232,0.08)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(196,168,130,0.3)", padding: "40px 36px", position: "relative",
          }}>
            {[
              { top: -1, left: -1, borderTop: "1px solid #c4a882", borderLeft: "1px solid #c4a882" },
              { top: -1, right: -1, borderTop: "1px solid #c4a882", borderRight: "1px solid #c4a882" },
              { bottom: -1, left: -1, borderBottom: "1px solid #c4a882", borderLeft: "1px solid #c4a882" },
              { bottom: -1, right: -1, borderBottom: "1px solid #c4a882", borderRight: "1px solid #c4a882" },
            ].map((s, i) => <div key={i} style={{ position: "absolute", width: 20, height: 20, ...s }} />)}

            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your Name"
              style={{
                width: "100%", background: "transparent", border: "none",
                borderBottom: "1px solid rgba(196,168,130,0.5)", padding: "10px 0",
                fontFamily: "'IM Fell English', serif", fontStyle: "italic",
                fontSize: 18, color: "#f8f1e8", outline: "none",
                marginBottom: 28, textAlign: "center",
              }}
            />

            <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 14, letterSpacing: "0.4em", color: "#c4a882", marginBottom: 14, textTransform: "uppercase" }}>
              Will you attend?
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
              {["Joyfully Accepts", "Regretfully Declines"].map(opt => (
                <button key={opt} onClick={() => setAttending(opt)} style={{
                  padding: "10px 20px",
                  background: attending === opt ? "rgba(176,122,110,0.6)" : "transparent",
                  border: `1px solid ${attending === opt ? "#b07a6e" : "rgba(196,168,130,0.4)"}`,
                  color: attending === opt ? "#f8f1e8" : "#c4a882",
                  fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 15,
                  cursor: "pointer", transition: "all 0.3s ease",
                }}>
                  {opt}
                </button>
              ))}
            </div>

            {attending === "Joyfully Accepts" && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 14, letterSpacing: "0.4em", color: "#c4a882", marginBottom: 10, textTransform: "uppercase" }}>
                  Number of Guests
                </p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  {["1", "2", "3", "4+"].map(n => (
                    <button key={n} onClick={() => setGuests(n)} style={{
                      width: 44, height: 44,
                      background: guests === n ? "rgba(176,122,110,0.6)" : "transparent",
                      border: `1px solid ${guests === n ? "#b07a6e" : "rgba(196,168,130,0.35)"}`,
                      color: guests === n ? "#f8f1e8" : "#c4a882",
                      fontFamily: "'IM Fell English', serif", fontSize: 16, cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}>{n}</button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 14, color: "#d4908a", marginBottom: 12 }}>{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                marginTop: 8, padding: "14px 48px",
                background: "linear-gradient(135deg, #b07a6e, #8a5a50)",
                border: "none", color: "#f8f1e8",
                fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 17,
                letterSpacing: "0.2em", cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 20px rgba(120,70,60,0.4)",
                transition: "all 0.3s ease", opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Sending..." : "Send My Response"}
            </button>

            <p style={{ marginTop: 20, fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 14, color: "rgba(196,168,130,0.6)" }}>
              Or call: 0331-2623426
            </p>
          </div>
        ) : (
          <div style={{
            background: "rgba(248,241,232,0.08)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(196,168,130,0.3)", padding: "60px 36px",
            animation: "fadeIn 0.8s ease",
          }}>
            <div style={{ fontSize: 40, color: "#c4a882", marginBottom: 16 }}>✦</div>
            <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 30, color: "#f8f1e8", marginBottom: 10 }}>
              {attending === "Joyfully Accepts" ? "We cannot wait to see you!" : "You will be missed dearly."}
            </p>
            <p style={{ fontFamily: "'IM Fell English', serif", fontSize: 14, letterSpacing: "0.3em", color: "#c4a882", textTransform: "uppercase" }}>
              {attending === "Joyfully Accepts"
                ? `${name} · ${guests} guest${guests !== "1" ? "s" : ""} · 31 May 2026`
                : `${name} · We pray for your blessings`}
            </p>
          </div>
        )}

        <div style={{ marginTop: 60, borderTop: "1px solid rgba(196,168,130,0.2)", paddingTop: 30 }}>
          <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 14, letterSpacing: "0.25em", color: "rgba(196,168,130,0.5)" }}>
            Jannat &amp; Aqib · 31 May 2026 · Karachi
          </p>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN APP
════════════════════════════════════════ */
export default function App() {
  const [phase, setPhase]               = useState("cover");
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const { d, h, m, s } = useCountdown();

  const handleEnvelopeClick = () => {
    setEnvelopeOpen(true);
    setTimeout(() => setPhase("opening"), 700);
    setTimeout(() => setPhase("invite"),  1800);
  };

  const timeline = [
    { time: "09:00 PM", event: "Arrival of Baraat" },
    { time: "09:30 PM", event: "Nikkah" },
    { time: "10:00 PM", event: "Dinner" },
    { time: "11:00 PM", event: "Rukhsati" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Cinzel:wght@400;600&display=swap" rel="stylesheet" />

      <Petals />

      {/* ══════════════════════════════
          PAGE 1 — COVER
      ══════════════════════════════ */}
      {(phase === "cover" || phase === "opening") && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
          opacity: phase === "opening" ? 0 : 1,
          transition: phase === "opening" ? "opacity 0.9s ease" : "none",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('/page1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(20,12,5,0.18)" }} />

          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>

            {/* Bismillah */}
            <p style={{
              fontFamily: "'IM Fell English', serif",
              fontSize: "clamp(11px,1.8vw,13px)", letterSpacing: "0.2em",
              color: "#977E62", textTransform: "uppercase",
              animation: "fadeInUp 1s ease 0.3s both", marginBottom: 20,
            }}>
              In the Name of Allah (SWT) the Most Beneficent
            </p>

            {/* Jannat & Aqib */}
            <h1 style={{
              fontFamily: "'AmoresaAged', serif",
              fontSize: "clamp(42px,9vw,82px)",
              color: "#3d2a1e",
              lineHeight: 1.05,
              fontWeight: 400,
              textShadow: "0 2px 20px rgba(0,0,0,0.15)",
              animation: "fadeInUp 1.2s ease 0.6s both",
              marginBottom: 36,
            }}>
              Jannat &amp; Aqib
            </h1>

            {/* Envelope */}
            <div
              onClick={handleEnvelopeClick}
              style={{
                animation: "envelopeReveal 1s ease 1s both",
                marginBottom: 28,
                cursor: "pointer",
                width: "min(240px,60vw)",
                position: "relative",
                filter: "drop-shadow(0 16px 48px rgba(80,50,30,0.35))",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src="/envelope.png"
                alt="Vintage Envelope"
                style={{ width: "100%", display: "block" }}
              />
              <div style={{
                position: "absolute",
                top: "52%", left: "50%",
                transform: "translate(-50%, -50%)",
                fontFamily: "'Symphony', serif",
                fontSize: "clamp(22px,5vw,38px)",
                color: "#5c3d2e",
                opacity: envelopeOpen ? 0 : 0.85,
                transition: "opacity 0.4s ease",
                pointerEvents: "none",
                textAlign: "center",
                lineHeight: 1,
              }}>
                J &amp; A
              </div>
            </div>

            {/* Tap cue */}
            <p style={{
              fontFamily: "'IM Fell English', serif",
              fontStyle: "italic",
              fontSize: "clamp(13px,2.2vw,16px)", letterSpacing: "0.25em",
              color: "#FFFFFF", textTransform: "uppercase",
              animation: "fadeInUp 1s ease 1.8s both, shimmer 2.5s ease 2.8s infinite",
            }}>
              Tap Envelope to Open
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          SCROLLABLE PAGES
      ══════════════════════════════ */}
      {phase === "invite" && (
        <div style={{ animation: "pageTransition 1.2s ease forwards" }}>

          {/* ── PAGE 2: SAVE THE DATE ── */}
          <div style={{
            minHeight: "100vh", position: "relative",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "60px 20px",
          }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/page5.jpg')", backgroundSize: "cover", backgroundPosition: "center bottom" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(20,12,5,0.25)" }} />
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <ArchFrame>
                <div style={{ textAlign: "center" }}>
                  <h2 style={{
                    fontFamily: "'Symphony', serif",
                    fontSize: "clamp(44px,10vw,82px)",
                    color: "#5c3d2e", lineHeight: 1.05, marginBottom: 20,
                  }}>
                    Save our<br />Date
                  </h2>
                  <div style={{ height: "0.5px", background: "linear-gradient(90deg,transparent,#c4a882,transparent)", margin: "0 auto 20px", width: "70%" }} />
                  <p style={{
                    fontFamily: "'IM Fell English', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(18px,3.5vw,26px)", letterSpacing: "0.2em",
                    color: "#7a5a4a", marginBottom: 14,
                  }}>
                    Jannat &amp; Aqib
                  </p>
                  <p style={{
                    fontFamily: "'IM Fell English', serif",
                    fontSize: "clamp(24px,4.5vw,32px)",
                    color: "#5c3d2e", fontWeight: 400, letterSpacing: "0.1em",
                  }}>
                    31st May 2026
                  </p>
                </div>
              </ArchFrame>

              {/* Scroll cue */}
              <div style={{ marginTop: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 16, letterSpacing: "0.45em", color: "#c4a882", textTransform: "uppercase" }}>
                  Scroll
                </p>
                <div style={{ width: 1, height: 50, background: "linear-gradient(180deg, #c4a882, transparent)", animation: "scrollBounce 2s ease infinite" }} />
              </div>
            </div>
          </div>

          {/* ── PAGE 3: COUPLE DETAILS ── */}
          <div style={{
            minHeight: "100vh", position: "relative",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "80px 20px",
          }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/page3.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(248,241,232,0.65)" }} />
            <Section style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 600, width: "100%" }}>

              {/* J & A monogram */}
              <div style={{
                fontFamily: "'Symphony', serif",
                fontSize: "clamp(49px,12vw,88px)",
                color: "#b07a6e", lineHeight: 0.9, marginBottom: 28,
              }}>
                J &amp; A
              </div>

              <p style={{
                fontFamily: "'IM Fell English', serif", fontStyle: "italic",
                fontSize: "clamp(13px,2vw,15px)", lineHeight: 2,
                color: "#7a5a4a", maxWidth: 500, margin: "0 auto 40px",
              }}>
                May the Almighty grant this couple all the success in their marriage and bestow upon them good Health, Wealth, Imaan and Guidance to follow the straight path as shown. Ameen.
              </p>

              <div style={{ height: "0.5px", background: "linear-gradient(90deg,transparent,#c4a882,transparent)", marginBottom: 36 }} />

              <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "clamp(13px,2vw,15px)", letterSpacing: "0.3em", color: "#b07a6e", textTransform: "uppercase", marginBottom: 8 }}>
                The Family Members of
              </p>
              <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "clamp(15px,2.4vw,19px)", color: "#7a5a4a", marginBottom: 16 }}>
                (Late) Mr. &amp; Mrs. Sheikh Muhammad Ramzan
              </p>
              <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "clamp(14px,2.2vw,16px)", color: "#7a5a4a", lineHeight: 1.9, maxWidth: 480, margin: "0 auto 28px" }}>
                would like to enhance the beauty of the occasion by inviting you at the{" "}
                <span style={{ fontWeight: 700, fontStyle: "normal" }}>Wedding Ceremony</span>
                {" "}of their beloved daughter
              </p>

              {/* Jannat — Symphony */}
              <h3 style={{ fontFamily: "'Symphony', serif", fontSize: "clamp(40px,9vw,72px)", color: "#5c3d2e", lineHeight: 1.1, marginBottom: 6 }}>
                Jannat Ali
              </h3>
              <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "clamp(14px,2.2vw,16px)", color: "#8a6040", fontWeight: 500, marginBottom: 32 }}>
                D/o. Mr. &amp; Mrs. Muhammad Ali Sheikh
              </p>

              <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "clamp(14px,2vw,17px)", color: "#c4a882", marginBottom: 24, letterSpacing: "0.3em" }}>
                — with —
              </p>

              {/* Aqib — Symphony */}
              <h3 style={{ fontFamily: "'Symphony', serif", fontSize: "clamp(40px,9vw,72px)", color: "#5c3d2e", lineHeight: 1.1, marginBottom: 6 }}>
                Aqib Nawaz
              </h3>
              <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "clamp(14px,2.2vw,16px)", color: "#8a6040", fontWeight: 500 }}>
                S/o. Mr. &amp; Mrs. Nawaz Ahmed
              </p>
            </Section>
          </div>

          {/* ── PAGE 4: COUNTDOWN ── */}
          <div style={{
            minHeight: "100vh", position: "relative",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "80px 20px",
          }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/page4.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(15,8,3,0.6)" }} />
            <Section style={{ position: "relative", zIndex: 2, textAlign: "center", width: "100%" }}>
              <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "clamp(13px,2.2vw,15px)", letterSpacing: "0.45em", color: "#c4a882", textTransform: "uppercase", marginBottom: 14 }}>
                The Celebration Begins In
              </p>
              <h2 style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "clamp(32px,6.5vw,52px)", color: "#f8f1e8", marginBottom: 52, fontWeight: 400 }}>
                Counting Down to Forever
              </h2>

              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: "clamp(8px,3vw,28px)", flexWrap: "wrap" }}>
                <CDBox value={d} label="Days" />
                <div style={{ color: "#c4a882", fontSize: "clamp(28px,6vw,48px)", paddingBottom: 28, fontFamily: "'IM Fell English', serif", opacity: 0.5 }}>:</div>
                <CDBox value={h} label="Hours" />
                <div style={{ color: "#c4a882", fontSize: "clamp(28px,6vw,48px)", paddingBottom: 28, fontFamily: "'IM Fell English', serif", opacity: 0.5 }}>:</div>
                <CDBox value={m} label="Minutes" />
                <div style={{ color: "#c4a882", fontSize: "clamp(28px,6vw,48px)", paddingBottom: 28, fontFamily: "'IM Fell English', serif", opacity: 0.5 }}>:</div>
                <CDBox value={s} label="Seconds" />
              </div>

              <div style={{ marginTop: 60, display: "flex", alignItems: "center", gap: 16, justifyContent: "center" }}>
                <div style={{ height: "0.5px", width: 60, background: "linear-gradient(90deg, transparent, #c4a882)" }} />
                <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 15, letterSpacing: "0.3em", color: "#c4a882" }}>31 May 2026</p>
                <div style={{ height: "0.5px", width: 60, background: "linear-gradient(90deg, #c4a882, transparent)" }} />
              </div>
            </Section>
          </div>

          {/* ── PAGE 5: DATE CARD ── */}
          <div style={{
            minHeight: "100vh", position: "relative",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "80px 20px",
          }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/page4.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(248,241,232,0.72)" }} />
            <Section style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
              <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 14, letterSpacing: "0.5em", color: "#b07a6e", textTransform: "uppercase", marginBottom: 32 }}>
                Mark Your Calendar
              </p>
              <div style={{
                display: "inline-block", position: "relative",
                padding: "clamp(40px,8vw,60px) clamp(40px,10vw,80px)",
                background: "linear-gradient(145deg, rgba(253,248,245,0.96), rgba(245,235,222,0.92))",
                border: "1px solid rgba(176,122,110,0.25)",
                boxShadow: "0 16px 64px rgba(120,70,50,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
                animation: "glowPulse 3s ease infinite",
              }}>
                {[
                  { top: -1, left: -1, borderTop: "2px solid #b07a6e", borderLeft: "2px solid #b07a6e" },
                  { top: -1, right: -1, borderTop: "2px solid #b07a6e", borderRight: "2px solid #b07a6e" },
                  { bottom: -1, left: -1, borderBottom: "2px solid #b07a6e", borderLeft: "2px solid #b07a6e" },
                  { bottom: -1, right: -1, borderBottom: "2px solid #b07a6e", borderRight: "2px solid #b07a6e" },
                ].map((s, i) => <div key={i} style={{ position: "absolute", width: 24, height: 24, ...s }} />)}

                <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "clamp(11px,2vw,14px)", letterSpacing: "0.45em", color: "#b07a6e", textTransform: "uppercase", marginBottom: 8 }}>
                  Sunday
                </p>
                <div style={{
                  fontFamily: "'AmoresaAged', serif",
                  fontSize: "clamp(80px,20vw,160px)",
                  color: "#5c3d2e", lineHeight: 0.85,
                }}>
                  31
                </div>
                <p style={{ fontFamily: "'IM Fell English', serif", fontSize: "clamp(18px,3.5vw,28px)", letterSpacing: "0.4em", color: "#b07a6e", textTransform: "uppercase", marginTop: 12, marginBottom: 4 }}>
                  May
                </p>
                <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "clamp(14px,2vw,18px)", color: "#8a6040", opacity: 0.7, letterSpacing: "0.2em" }}>
                  2026
                </p>
              </div>
            </Section>
          </div>

          {/* ── PAGE 6: VENUE ── */}
          <div style={{
            minHeight: "100vh", position: "relative",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "80px 20px",
          }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/page5.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(15,8,3,0.55)" }} />
            <Section style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 560, width: "100%" }}>
              <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 16, letterSpacing: "0.5em", color: "#c4a882", textTransform: "uppercase", marginBottom: 16 }}>
                Location
              </p>
              <svg viewBox="0 0 40 50" style={{ width: 36, opacity: 0.7, marginBottom: 20 }} xmlns="http://www.w3.org/2000/svg">
                <path d="M20,2 C11,2 4,9 4,18 C4,30 20,48 20,48 C20,48 36,30 36,18 C36,9 29,2 20,2 Z" fill="none" stroke="#c4a882" strokeWidth="1.5" />
                <circle cx="20" cy="18" r="6" fill="none" stroke="#c4a882" strokeWidth="1.5" />
              </svg>
              <h2 style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "clamp(32px,7vw,58px)", color: "#f8f1e8", lineHeight: 1.2, marginBottom: 12 }}>
                Lawyer's Club<br />Banquet 'A'
              </h2>
              <div style={{ height: "0.5px", background: "linear-gradient(90deg,transparent,#c4a882,transparent)", margin: "16px auto", width: "60%" }} />
              <p style={{ fontFamily: "'IM Fell English', serif", fontSize: "clamp(13px,2.2vw,15px)", letterSpacing: "0.25em", color: "#c4a882", marginBottom: 36 }}>
                11-A, Block 2 Clifton, Karachi
              </p>
              <a
                href="https://maps.google.com/?q=Lawyers+Club+Banquet+Karachi+Clifton"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block", padding: "14px 40px",
                  border: "1px solid rgba(196,168,130,0.6)",
                  color: "#c4a882",
                  fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 16,
                  letterSpacing: "0.2em", textDecoration: "none",
                  background: "rgba(248,241,232,0.06)", backdropFilter: "blur(8px)",
                  transition: "all 0.4s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(176,122,110,0.3)"; e.currentTarget.style.color = "#f8f1e8"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(248,241,232,0.06)"; e.currentTarget.style.color = "#c4a882"; }}
              >
                View on Google Maps
              </a>
            </Section>
          </div>

          {/* ── PAGE 7: BARAAT + SCHEDULE ── */}
          <div style={{
            minHeight: "100vh", position: "relative",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "80px 20px",
          }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/page3.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(248,241,232,0.75)" }} />
            <Section style={{ position: "relative", zIndex: 2, maxWidth: 640, width: "100%", textAlign: "center" }}>
              <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 16, letterSpacing: "0.5em", color: "#b07a6e", textTransform: "uppercase" }}>
                The Celebration
              </p>
              <h2 style={{ fontFamily: "'Symphony', serif", fontSize: "clamp(40px,8vw,72px)", color: "#5c3d2e", margin: "10px 0 20px" }}>
                Baraat
              </h2>
              <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "clamp(15px,2.4vw,18px)", lineHeight: 2, color: "#7a5a4a", maxWidth: 500, margin: "0 auto 60px" }}>
                The Baraat will be welcomed with the solemnization of the Nikkah, binding two hearts in faith and love. The evening will draw to a close with the Rukhsati, as Jannat begins her new journey surrounded by the prayers of her loved ones.
              </p>

              <p style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 16, letterSpacing: "0.5em", color: "#b07a6e", textTransform: "uppercase", marginBottom: 8 }}>
                Programme
              </p>
              <h3 style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: "clamp(24px,4vw,36px)", color: "#5c3d2e", marginBottom: 44 }}>
                Evening Schedule
              </h3>

              <div style={{ position: "relative", maxWidth: 480, margin: "0 auto" }}>
                <div style={{
                  position: "absolute", left: "50%", top: 0, bottom: 0, width: 1,
                  background: "linear-gradient(180deg, transparent, #c4a882 15%, #c4a882 85%, transparent)",
                  transform: "translateX(-50%)",
                }} />
                {timeline.map((item, i) => (
                  <TLItem key={i} item={item} isLeft={i % 2 === 0} delay={i * 0.15} />
                ))}
              </div>
            </Section>
          </div>

          {/* ── PAGE 8: RSVP ── */}
          <RSVPSection />

        </div>
      )}
    </>
  );
}