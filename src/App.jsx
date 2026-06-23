import { useState, useEffect, useRef, useCallback } from "react";

const CHARACTERS = [
  {
    id: "himiko",
    name: "Himiko",
    title: "Emanator of Reminiscence",
    path: "Remembrance",
    color: "#C084FC",
    glow: "#A855F7",
    accent: "#7C3AED",
    quote: "May your journey among the stars shine brighter than ever, Trailblazer.",
    desc: "The radiant Emanator whose memories bloom like cosmos flowers — gentle yet boundless.",
    symbol: "✦",
    gradient: "from-purple-900 via-violet-800 to-purple-950",
    cardBg: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.4)",
    particles: ["❋", "✿", "❀", "✾"],
    icon: "🌸",
  },
  {
    id: "acheron",
    name: "Acheron",
    title: "Nihility's Edge",
    path: "Nihility",
    color: "#F87171",
    glow: "#EF4444",
    accent: "#B91C1C",
    quote: "Even eternity pauses today to celebrate you, wanderer.",
    desc: "She who walks the river between endings — her blade carves silence through the void.",
    symbol: "⚡",
    gradient: "from-red-950 via-rose-900 to-red-950",
    cardBg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.4)",
    particles: ["⚡", "⚔", "✦", "⋆"],
    icon: "⚔️",
  },
  {
    id: "kafka",
    name: "Kafka",
    title: "Nihility's Weaver",
    path: "Nihility",
    color: "#FB923C",
    glow: "#F97316",
    accent: "#C2410C",
    quote: "The script says you'll have an unforgettable year ahead.",
    desc: "Architect of fate, she writes the story before it's lived — and your tale is extraordinary.",
    symbol: "◈",
    gradient: "from-orange-950 via-amber-900 to-orange-950",
    cardBg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.4)",
    particles: ["◈", "⬡", "⬢", "◆"],
    icon: "🎴",
  },
  {
    id: "blackswan",
    name: "Black Swan",
    title: "Remembrance's Seer",
    path: "Remembrance",
    color: "#818CF8",
    glow: "#6366F1",
    accent: "#4338CA",
    quote: "The memories of this day will become a beautiful destiny.",
    desc: "Keeper of forgotten truths — she sees not what is, but what will always have been.",
    symbol: "◉",
    gradient: "from-indigo-950 via-blue-900 to-indigo-950",
    cardBg: "rgba(99,102,241,0.08)",
    border: "rgba(99,102,241,0.4)",
    particles: ["◉", "○", "◎", "●"],
    icon: "🦢",
  },
];

const ACHIEVEMENTS = [
  { id: "first_click", title: "First Contact", desc: "You touched the cosmos", icon: "✦" },
  { id: "hero_scroll", title: "Starward Gaze", desc: "You looked beyond the veil", icon: "★" },
  { id: "cake_blow", title: "Wish Upon a Flame", desc: "Your wish reaches the stars", icon: "🕯" },
  { id: "all_chars", title: "SSR Collector", desc: "Met all four legends", icon: "◈" },
  { id: "confetti", title: "Celebration Protocol", desc: "Initiated party mode", icon: "🎊" },
  { id: "cake_slash", title: "Nihility's Blade", desc: "Slashed the cake with Acheron", icon: "⚔" },
  { id: "easter_egg", title: "Trailblazer Supreme", desc: "Found the hidden truth", icon: "🌌" },
];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);
  const [hoveredChar, setHoveredChar] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [confettiActive, setConfettiActive] = useState(false);
  const [cakeBlown, setCakeBlown] = useState(false);
  const [candleCount, setCandleCount] = useState(21);
  const [blownCandles, setBlownCandles] = useState([]);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [visibleCards, setVisibleCards] = useState({});
  const [particles, setParticles] = useState([]);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);
  const [titleGlitch, setTitleGlitch] = useState(false);
  const [slashActive, setSlashActive] = useState(false);
  const [slashParticles, setSlashParticles] = useState([]);
  const [cakeSlashed, setCakeSlashed] = useState(false);
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  const unlock = useCallback((id) => {
    if (!unlockedAchievements.includes(id)) {
      const ach = ACHIEVEMENTS.find((a) => a.id === id);
      if (ach) {
        setUnlockedAchievements((prev) => [...prev, id]);
        setShowAchievement(ach);
        setTimeout(() => setShowAchievement(null), 3500);
      }
    }
  }, [unlockedAchievements]);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) {
        p = 100;
        setLoadProgress(100);
        clearInterval(interval);
        setTimeout(() => setLoading(false), 600);
      } else {
        setLoadProgress(Math.floor(p));
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const spawnStar = () => {
      const id = Date.now() + Math.random();
      setShootingStars((prev) => [...prev, {
        id,
        top: Math.random() * 60 + "%",
        left: "-100px",
        duration: Math.random() * 2 + 1.5,
        delay: 0,
        size: Math.random() * 2 + 1,
      }]);
      setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== id));
      }, 4000);
    };
    const interval = setInterval(spawnStar, 2500);
    spawnStar();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const spawnParticle = () => {
      const id = Date.now() + Math.random();
      setParticles((prev) => [
        ...prev.slice(-30),
        {
          id,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.6 + 0.3,
          color: ["#C084FC", "#F87171", "#FB923C", "#818CF8", "#FCD34D", "#67E8F9"][Math.floor(Math.random() * 6)],
          duration: Math.random() * 8 + 6,
        },
      ]);
    };
    const interval = setInterval(spawnParticle, 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.cardId;
            if (id) {
              setVisibleCards((prev) => ({ ...prev, [id]: true }));
              if (id.startsWith("char-")) unlock("hero_scroll");
            }
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll("[data-card-id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, unlock]);

  const triggerConfetti = () => {
    unlock("confetti");
    setConfettiActive(true);
    const pieces = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ["#C084FC", "#F87171", "#FB923C", "#818CF8", "#FCD34D", "#67E8F9", "#34D399"][Math.floor(Math.random() * 7)],
      shape: ["rect", "circle", "star"][Math.floor(Math.random() * 3)],
      size: Math.random() * 10 + 6,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 1.5,
      rotation: Math.random() * 720,
    }));
    setConfettiPieces(pieces);
    setTimeout(() => { setConfettiActive(false); setConfettiPieces([]); }, 5000);
  };

  const triggerSlash = () => {
    if (cakeSlashed) return;
    
    setCakeSlashed(true);
    unlock("cake_slash");
    setSlashActive(true);
    
    // Create slash particles
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 25 + Math.random() * 50,
      y: 40 + Math.random() * 30,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -6 - 2,
      color: ["#F87171", "#EF4444", "#FCA5A5", "#FCD34D"][Math.floor(Math.random() * 4)],
      size: Math.random() * 4 + 2,
      life: 1,
    }));
    setSlashParticles(particles);
    
    // Animate particles
    const animateParticles = setInterval(() => {
      setSlashParticles((prev) => {
        const updated = prev.map((p) => ({
          ...p,
          y: p.y + p.vy,
          vy: p.vy + 0.3,
          life: p.life - 0.05,
        })).filter((p) => p.life > 0);
        if (updated.length === 0) clearInterval(animateParticles);
        return updated;
      });
    }, 30);
    
    setTimeout(() => setSlashActive(false), 600);
    triggerConfetti();
  };

  const blowCandle = (i) => {
    if (blownCandles.includes(i)) return;
    setBlownCandles((prev) => {
      const next = [...prev, i];
      if (next.length === candleCount) {
        setCakeBlown(true);
        unlock("cake_blow");
        triggerConfetti();
      }
      return next;
    });
  };

  const handleTitleClick = () => {
    setEasterEggClicks((c) => {
      const next = c + 1;
      if (next >= 7) {
        setShowEasterEgg(true);
        unlock("easter_egg");
        setTimeout(() => setShowEasterEgg(false), 5000);
        return 0;
      }
      return next;
    });
    setTitleGlitch(true);
    setTimeout(() => setTitleGlitch(false), 300);
    unlock("first_click");
  };

  const handleCharView = (id) => {
    const viewed = JSON.parse(localStorage.getItem("viewed_chars") || "[]");
    const newViewed = [...new Set([...viewed, id])];
    localStorage.setItem("viewed_chars", JSON.stringify(newViewed));
    if (newViewed.length >= 4) unlock("all_chars");
  };

  const toggleMusic = () => {
    setMusicPlaying((p) => !p);
  };

  const STARS = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.7 + 0.2,
    duration: Math.random() * 4 + 3,
  }));

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#050010",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Georgia', serif", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {STARS.slice(0, 60).map((s) => (
            <div key={s.id} style={{
              position: "absolute", left: s.x + "%", top: s.y + "%",
              width: s.size + "px", height: s.size + "px",
              borderRadius: "50%", background: "#fff",
              opacity: s.opacity,
              animation: `twinkle ${s.duration}s ease-in-out infinite alternate`,
            }} />
          ))}
        </div>
        <div style={{ textAlign: "center", zIndex: 10 }}>
          <div style={{
            fontSize: "clamp(48px, 8vw, 80px)", letterSpacing: "0.3em",
            color: "#C084FC", textShadow: "0 0 30px #A855F7, 0 0 60px #7C3AED",
            fontWeight: "bold", marginBottom: "8px",
            animation: "pulse 2s ease-in-out infinite",
          }}>✦ HSR ✦</div>
          <div style={{
            fontSize: "clamp(11px, 2vw, 14px)", letterSpacing: "0.6em",
            color: "#818CF8", textTransform: "uppercase", marginBottom: "48px",
            opacity: 0.8,
          }}>Birthday Protocol Initializing</div>
          <div style={{
            width: "min(320px, 80vw)", height: "2px",
            background: "rgba(168,85,247,0.2)", borderRadius: "2px",
            margin: "0 auto 16px", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", left: 0, top: 0, height: "100%",
              width: loadProgress + "%",
              background: "linear-gradient(90deg, #7C3AED, #C084FC, #F87171)",
              borderRadius: "2px",
              boxShadow: "0 0 12px #C084FC",
              transition: "width 0.15s ease",
            }} />
          </div>
          <div style={{ color: "#A78BFA", fontSize: "13px", letterSpacing: "0.3em" }}>
            {loadProgress}%
          </div>
          <div style={{ marginTop: "32px", color: "#6B7280", fontSize: "12px", letterSpacing: "0.2em" }}>
            {loadProgress < 30 ? "LOADING STELLAR DATA..." :
             loadProgress < 60 ? "SUMMONING LEGENDS..." :
             loadProgress < 85 ? "CALIBRATING STARLIGHT..." :
             "WELCOME, TRAILBLAZER"}
          </div>
        </div>
        <style>{`
          @keyframes twinkle { from { opacity: 0.1; } to { opacity: 0.9; } }
          @keyframes pulse { 0%,100% { opacity:0.8; } 50% { opacity:1; } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      background: "#050010", color: "#fff",
      fontFamily: "'Georgia', serif",
      minHeight: "100vh", overflowX: "hidden",
      position: "relative",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; scroll-behavior: smooth; }
        @keyframes twinkle { 0%,100%{opacity:0.15}50%{opacity:0.9} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes floatSlow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes glitch {
          0%{transform:translate(0)} 20%{transform:translate(-3px,2px)}
          40%{transform:translate(3px,-2px)} 60%{transform:translate(-1px,1px)}
          80%{transform:translate(1px,-1px)} 100%{transform:translate(0)}
        }
        @keyframes shootingStar {
          0%{transform:translateX(0) translateY(0);opacity:1}
          100%{transform:translateX(120vw) translateY(30px);opacity:0}
        }
        @keyframes confettiFall {
          0%{transform:translateY(-20px) rotate(0deg);opacity:1}
          100%{transform:translateY(110vh) rotate(var(--rot));opacity:0}
        }
        @keyframes particleFloat {
          0%{transform:translateY(0) scale(1);opacity:var(--op)}
          50%{transform:translateY(-40px) scale(1.2);opacity:calc(var(--op)*1.3)}
          100%{transform:translateY(-80px) scale(0.8);opacity:0}
        }
        @keyframes cardEnter {
          from{transform:translateY(40px);opacity:0}
          to{transform:translateY(0);opacity:1}
        }
        @keyframes auroraMove {
          0%{transform:translateX(-20%) rotate(0deg)}
          50%{transform:translateX(20%) rotate(5deg)}
          100%{transform:translateX(-20%) rotate(0deg)}
        }
        @keyframes auroraMove2 {
          0%{transform:translateX(20%) rotate(0deg)}
          50%{transform:translateX(-20%) rotate(-5deg)}
          100%{transform:translateX(20%) rotate(0deg)}
        }
        @keyframes glow {
          0%,100%{text-shadow:0 0 20px currentColor,0 0 40px currentColor}
          50%{text-shadow:0 0 40px currentColor,0 0 80px currentColor,0 0 120px currentColor}
        }
        @keyframes sparkle {
          0%,100%{transform:scale(1) rotate(0deg);opacity:0.7}
          50%{transform:scale(1.4) rotate(180deg);opacity:1}
        }
        @keyframes achievementSlide {
          0%{transform:translateX(120%);opacity:0}
          10%{transform:translateX(0);opacity:1}
          85%{transform:translateX(0);opacity:1}
          100%{transform:translateX(120%);opacity:0}
        }
        @keyframes candle {
          0%,100%{transform:scaleX(1) scaleY(1);filter:brightness(1)}
          50%{transform:scaleX(1.15) scaleY(0.9);filter:brightness(1.3)}
        }
        @keyframes easterPop {
          0%{transform:scale(0) rotate(-10deg);opacity:0}
          60%{transform:scale(1.1) rotate(3deg);opacity:1}
          100%{transform:scale(1) rotate(0deg);opacity:1}
        }
        @keyframes borderGlow {
          0%,100%{border-color:rgba(168,85,247,0.3)}
          50%{border-color:rgba(168,85,247,0.8)}
        }
        @keyframes counterPulse {
          0%,100%{transform:scale(1)} 50%{transform:scale(1.05)}
        }
        @keyframes slashAnimation {
          0%{
            transform:translateX(-100%) translateY(-20%) rotate(-45deg) scaleX(0);
            opacity:1;
          }
          50%{
            opacity:1;
          }
          100%{
            transform:translateX(100%) translateY(20%) rotate(-45deg) scaleX(1);
            opacity:0;
          }
        }
        @keyframes slash2Animation {
          0%{
            transform:translateX(100%) translateY(-20%) rotate(45deg) scaleX(0);
            opacity:1;
          }
          50%{
            opacity:1;
          }
          100%{
            transform:translateX(-100%) translateY(20%) rotate(45deg) scaleX(1);
            opacity:0;
          }
        }
        .char-card:hover .char-glow { opacity: 1 !important; }
        .char-card:hover .char-img { transform: scale(1.05) !important; }
        .char-card:hover { transform: translateY(-6px) !important; }
        .btn-cosmic {
          background: linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.2));
          border: 1px solid rgba(168,85,247,0.5);
          color: #C084FC; padding: 14px 32px;
          border-radius: 4px; cursor: pointer;
          font-family: Georgia, serif; font-size: 14px;
          letter-spacing: 0.2em; text-transform: uppercase;
          transition: all 0.3s; position: relative; overflow: hidden;
        }
        .btn-cosmic:hover {
          background: linear-gradient(135deg, rgba(124,58,237,0.5), rgba(168,85,247,0.4));
          box-shadow: 0 0 20px rgba(168,85,247,0.4);
          border-color: rgba(168,85,247,0.9);
        }
        .btn-crimson {
          background: linear-gradient(135deg, rgba(185,28,28,0.3), rgba(239,68,68,0.2));
          border: 1px solid rgba(239,68,68,0.5);
          color: #F87171; padding: 14px 32px;
          border-radius: 4px; cursor: pointer;
          font-family: Georgia, serif; font-size: 14px;
          letter-spacing: 0.2em; text-transform: uppercase;
          transition: all 0.3s;
        }
        .btn-crimson:hover {
          box-shadow: 0 0 20px rgba(239,68,68,0.4);
          border-color: rgba(239,68,68,0.9);
        }
        .btn-crimson:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0020; }
        ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.5); border-radius: 4px; }
      `}</style>

      {/* Mouse glow */}
      <div style={{
        position: "fixed", pointerEvents: "none", zIndex: 999,
        left: mousePos.x - 200, top: mousePos.y - 200,
        width: 400, height: 400,
        background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)",
        borderRadius: "50%", transition: "left 0.1s, top 0.1s",
      }} />

      {/* Achievement Toast */}
      {showAchievement && (
        <div style={{
          position: "fixed", top: "24px", right: "24px", zIndex: 9999,
          background: "rgba(10,0,30,0.95)", border: "1px solid rgba(168,85,247,0.6)",
          borderRadius: "8px", padding: "16px 20px", minWidth: "260px",
          animation: "achievementSlide 3.5s ease forwards",
          boxShadow: "0 0 30px rgba(168,85,247,0.3)",
        }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#A78BFA", marginBottom: "6px" }}>
            ✦ ACHIEVEMENT UNLOCKED
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>{showAchievement.icon}</span>
            <div>
              <div style={{ color: "#FCD34D", fontWeight: "bold", fontSize: "15px" }}>{showAchievement.title}</div>
              <div style={{ color: "#9CA3AF", fontSize: "12px", marginTop: "2px" }}>{showAchievement.desc}</div>
            </div>
          </div>
        </div>
      )}

      {/* Slash particles */}
      {slashParticles.map((p) => (
        <div key={p.id} style={{
          position: "fixed",
          left: "calc(50% + " + (p.x - 50) + "px)",
          top: "calc(50% + " + (p.y - 50) + "px)",
          width: p.size + "px",
          height: p.size + "px",
          borderRadius: "50%",
          background: p.color,
          pointerEvents: "none",
          zIndex: 9998,
          opacity: p.life,
          boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
        }} />
      ))}

      {/* Slash overlay */}
      {slashActive && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "300px",
          pointerEvents: "none",
          zIndex: 9997,
        }}>
          {/* First slash */}
          <div style={{
            position: "absolute",
            width: "100%",
            height: "4px",
            background: "linear-gradient(90deg, transparent, #F87171, #EF4444, #F87171, transparent)",
            top: "40%",
            left: 0,
            borderRadius: "2px",
            boxShadow: "0 0 20px #F87171, 0 0 40px #EF4444",
            animation: "slashAnimation 0.4s ease-out forwards",
          }} />
          {/* Second slash */}
          <div style={{
            position: "absolute",
            width: "100%",
            height: "4px",
            background: "linear-gradient(90deg, transparent, #EF4444, #F87171, #EF4444, transparent)",
            top: "55%",
            left: 0,
            borderRadius: "2px",
            boxShadow: "0 0 20px #EF4444, 0 0 40px #F87171",
            animation: "slash2Animation 0.4s ease-out forwards",
            animationDelay: "0.05s",
          }} />
        </div>
      )}

      {/* Confetti */}
      {confettiPieces.map((p) => (
        <div key={p.id} style={{
          position: "fixed", top: 0, left: p.x + "%", zIndex: 9998,
          pointerEvents: "none",
          "--rot": p.rotation + "deg",
          animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
        }}>
          {p.shape === "circle" ? (
            <div style={{ width: p.size, height: p.size, borderRadius: "50%", background: p.color }} />
          ) : p.shape === "star" ? (
            <div style={{ color: p.color, fontSize: p.size + "px", lineHeight: 1 }}>★</div>
          ) : (
            <div style={{ width: p.size * 0.6, height: p.size, background: p.color, borderRadius: "2px" }} />
          )}
        </div>
      ))}

      {/* Stars bg */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {STARS.map((s) => (
          <div key={s.id} style={{
            position: "absolute", left: s.x + "%", top: s.y + "%",
            width: s.size + "px", height: s.size + "px",
            borderRadius: "50%", background: "#fff", opacity: s.opacity,
            animation: `twinkle ${s.duration}s ease-in-out infinite alternate`,
            animationDelay: s.id * 0.03 + "s",
          }} />
        ))}
      </div>

      {/* Shooting stars */}
      {shootingStars.map((s) => (
        <div key={s.id} style={{
          position: "fixed", top: s.top, left: s.left, zIndex: 1, pointerEvents: "none",
          width: "150px", height: s.size + "px",
          background: "linear-gradient(90deg, transparent, #fff, #C084FC)",
          borderRadius: "2px", opacity: 0.8,
          animation: `shootingStar ${s.duration}s linear forwards`,
        }} />
      ))}

      {/* Aurora */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-20%", left: "-10%", width: "70%", height: "50%",
          background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)",
          animation: "auroraMove 20s ease-in-out infinite",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", top: "10%", right: "-20%", width: "60%", height: "40%",
          background: "radial-gradient(ellipse, rgba(239,68,68,0.08) 0%, transparent 70%)",
          animation: "auroraMove2 25s ease-in-out infinite",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", bottom: "5%", left: "20%", width: "60%", height: "35%",
          background: "radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)",
          animation: "auroraMove 30s ease-in-out infinite reverse",
          borderRadius: "50%",
        }} />
      </div>

      {/* Floating particles */}
      {particles.map((p) => (
        <div key={p.id} style={{
          position: "fixed", left: p.x + "%", top: p.y + "%",
          width: p.size + "px", height: p.size + "px",
          borderRadius: "50%", background: p.color,
          pointerEvents: "none", zIndex: 1,
          "--op": p.opacity,
          animation: `particleFloat ${p.duration}s ease-in forwards`,
          boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
        }} />
      ))}

      {/* Easter egg */}
      {showEasterEgg && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(5,0,16,0.85)", pointerEvents: "none",
        }}>
          <div style={{
            textAlign: "center", animation: "easterPop 0.5s ease forwards",
            padding: "40px", border: "1px solid rgba(252,211,77,0.5)",
            borderRadius: "12px", background: "rgba(10,0,30,0.95)",
            boxShadow: "0 0 60px rgba(252,211,77,0.2)",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🌌</div>
            <div style={{ fontSize: "clamp(18px,3vw,24px)", color: "#FCD34D", letterSpacing: "0.3em" }}>
              THE AEON SMILES UPON YOU
            </div>
            <div style={{ color: "#A78BFA", marginTop: "12px", fontSize: "14px", letterSpacing: "0.2em" }}>
              Khaled, you've found the Stellar Codex
            </div>
            <div style={{ color: "#6B7280", marginTop: "8px", fontSize: "12px" }}>
              "Every star was placed here for this moment."
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(5,0,16,0.8)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(168,85,247,0.15)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(16px, 4vw, 48px)", height: "60px",
      }}>
        <div style={{ color: "#C084FC", letterSpacing: "0.3em", fontSize: "13px", fontWeight: "bold" }}>
          ✦ HSR BIRTHDAY
        </div>
        <div style={{ display: "flex", gap: "clamp(12px,3vw,32px)", fontSize: "12px", letterSpacing: "0.15em" }}>
          {["HERO", "LEGENDS", "WISHES", "CAKE"].map((s) => (
            <a key={s} href={`#${s.toLowerCase()}`} style={{
              color: "#9CA3AF", textDecoration: "none", transition: "color 0.2s",
            }}
            onMouseEnter={(e) => e.target.style.color = "#C084FC"}
            onMouseLeave={(e) => e.target.style.color = "#9CA3AF"}
            >{s}</a>
          ))}
        </div>
        <button onClick={toggleMusic} style={{
          background: "none", border: "1px solid rgba(168,85,247,0.4)",
          color: musicPlaying ? "#C084FC" : "#6B7280",
          padding: "6px 14px", borderRadius: "4px", cursor: "pointer",
          fontSize: "12px", letterSpacing: "0.1em",
          transition: "all 0.2s",
        }}>
          {musicPlaying ? "♪ ON" : "♪ OFF"}
        </button>
      </nav>

      {/* HERO */}
      <section id="hero" ref={heroRef} style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", textAlign: "center",
        padding: "80px clamp(16px, 5vw, 60px) 60px",
        position: "relative", zIndex: 2,
      }}>
        {/* Constellation lines */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12, pointerEvents: "none" }} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          {[[100,200,350,150],[350,150,600,300],[600,300,850,180],[850,180,1100,250],[200,600,450,520],[450,520,700,650],[700,650,950,580],[150,400,300,350],[900,400,1050,450]].map(([x1,y1,x2,y2],i)=>(
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C084FC" strokeWidth="0.8"/>
          ))}
          {[[100,200],[350,150],[600,300],[850,180],[1100,250],[200,600],[450,520],[700,650],[950,580],[150,400],[300,350],[900,400],[1050,450]].map(([cx,cy],i)=>(
            <circle key={i} cx={cx} cy={cy} r="3" fill="#C084FC" opacity="0.8"/>
          ))}
        </svg>

        <div style={{
          fontSize: "clamp(10px,1.5vw,13px)", letterSpacing: "0.6em",
          color: "#A78BFA", textTransform: "uppercase", marginBottom: "24px",
          opacity: 0.8,
        }}>
          ✦ The Stellaron Hunters Present ✦
        </div>

        <h1
          onClick={handleTitleClick}
          style={{
            fontSize: "clamp(28px, 6vw, 72px)",
            fontWeight: "bold", lineHeight: 1.1,
            background: "linear-gradient(135deg, #FCD34D 0%, #C084FC 40%, #F87171 70%, #818CF8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: "24px", cursor: "pointer",
            letterSpacing: "-0.01em",
            animation: titleGlitch ? "glitch 0.3s ease" : "none",
            textShadow: "none",
            maxWidth: "900px",
          }}
        >
          Happy Birthday<br />Khaled 7 Juliet 2004
        </h1>

        <p style={{
          fontSize: "clamp(14px,2vw,20px)", color: "#A78BFA",
          letterSpacing: "0.1em", marginBottom: "48px",
          maxWidth: "600px", lineHeight: 1.6, opacity: 0.9,
        }}>
          Today the universe celebrates its most legendary Trailblazer.
        </p>

        {/* Character icons row */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "48px", flexWrap: "wrap", justifyContent: "center" }}>
          {CHARACTERS.map((c) => (
            <div key={c.id} style={{
              width: "52px", height: "52px",
              border: `1px solid ${c.border}`,
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px",
              background: c.cardBg,
              boxShadow: `0 0 20px ${c.glow}33`,
              animation: "floatSlow 4s ease-in-out infinite",
              animationDelay: CHARACTERS.indexOf(c) * 0.5 + "s",
              cursor: "default",
            }}>
              {c.icon}
            </div>
          ))}
        </div>

        {/* Birthday countdown / message */}
        <BirthdayCounter unlock={unlock} />

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginTop: "40px" }}>
          <button className="btn-cosmic" onClick={triggerConfetti}>
            ✦ Celebrate Now
          </button>
          <button className="btn-crimson" onClick={() => document.getElementById("legends").scrollIntoView({ behavior: "smooth" })}>
            ⚔ Meet the Legends
          </button>
        </div>
      </section>

      {/* CHARACTERS */}
      <section id="legends" style={{ padding: "80px clamp(16px, 5vw, 60px)", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.5em", color: "#A78BFA", marginBottom: "16px" }}>
            ✦ SSR CHARACTERS ✦
          </div>
          <h2 style={{
            fontSize: "clamp(28px,5vw,48px)", fontWeight: "bold",
            background: "linear-gradient(135deg, #C084FC, #F87171)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Legends of the Stars
          </h2>
          <p style={{ color: "#6B7280", marginTop: "12px", fontSize: "14px", letterSpacing: "0.1em" }}>
            Four legendary souls who walk between worlds
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: "24px", maxWidth: "1200px", margin: "0 auto",
        }}>
          {CHARACTERS.map((char, i) => (
            <CharacterCard
              key={char.id}
              char={char}
              index={i}
              visible={visibleCards["char-" + char.id]}
              onHover={(id) => { setHoveredChar(id); if (id) handleCharView(id); }}
              hoveredChar={hoveredChar}
            />
          ))}
        </div>
      </section>

      {/* WISHES */}
      <section id="wishes" style={{ padding: "80px clamp(16px, 5vw, 60px)", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.5em", color: "#F87171", marginBottom: "16px" }}>
            ✦ BIRTHDAY TRANSMISSIONS ✦
          </div>
          <h2 style={{
            fontSize: "clamp(28px,5vw,48px)", fontWeight: "bold",
            background: "linear-gradient(135deg, #F87171, #C084FC, #818CF8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Messages from the Stars
          </h2>
        </div>

        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          {CHARACTERS.map((char, i) => (
            <WishCard key={char.id} char={char} index={i} visible={visibleCards["wish-" + char.id]} />
          ))}
        </div>
      </section>

      {/* CAKE */}
      <section id="cake" style={{ padding: "80px clamp(16px, 5vw, 60px)", position: "relative", zIndex: 2, textAlign: "center" }}>
        <div style={{ marginBottom: "48px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.5em", color: "#FCD34D", marginBottom: "16px" }}>
            ✦ INTERACTIVE ✦
          </div>
          <h2 style={{
            fontSize: "clamp(28px,5vw,48px)", fontWeight: "bold",
            background: "linear-gradient(135deg, #FCD34D, #FB923C)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Make a Wish, Trailblazer
          </h2>
          <p style={{ color: "#9CA3AF", marginTop: "12px", fontSize: "14px" }}>
            Click the candles to blow them out, or slash the cake with Acheron's blade
          </p>
        </div>

        <BirthdayCake
          candleCount={candleCount}
          blownCandles={blownCandles}
          onBlowCandle={blowCandle}
          cakeBlown={cakeBlown}
          cakeSlashed={cakeSlashed}
        />

        {cakeBlown && !cakeSlashed && (
          <div style={{
            marginTop: "32px", animation: "easterPop 0.6s ease forwards",
          }}>
            <div style={{
              fontSize: "clamp(20px,3vw,32px)",
              background: "linear-gradient(135deg, #FCD34D, #C084FC)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontWeight: "bold", marginBottom: "8px",
            }}>
              ✦ Wish Granted! ✦
            </div>
            <p style={{ color: "#A78BFA", fontSize: "15px" }}>
              The stars have heard your wish, Khaled. May this year bring you everything you dream of.
            </p>
          </div>
        )}

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginTop: "32px" }}>
          <button 
            className="btn-crimson" 
            onClick={triggerSlash}
            disabled={cakeSlashed}
            style={{
              opacity: cakeSlashed ? 0.5 : 1,
              cursor: cakeSlashed ? "not-allowed" : "pointer",
            }}
          >
            ⚔ Acheron's Slash
          </button>
        </div>

        {cakeSlashed && (
          <div style={{
            marginTop: "24px", animation: "easterPop 0.6s ease forwards",
          }}>
            <div style={{
              fontSize: "clamp(18px,2.5vw,28px)",
              background: "linear-gradient(135deg, #F87171, #EF4444)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontWeight: "bold", marginBottom: "8px",
            }}>
              ⚡ The Blade Cuts Through ⚡
            </div>
            <p style={{ color: "#A78BFA", fontSize: "14px" }}>
              Acheron's resolve echoes through the void. Your birthday wish has transcended the boundaries of fate itself.
            </p>
          </div>
        )}
      </section>

      {/* ACHIEVEMENTS */}
      <section style={{ padding: "60px clamp(16px, 5vw, 60px) 40px", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.5em", color: "#FCD34D", marginBottom: "12px" }}>
              ✦ YOUR PROGRESS ✦
            </div>
            <h2 style={{
              fontSize: "clamp(22px,4vw,36px)", fontWeight: "bold", color: "#FCD34D",
            }}>
              Achievement Log
            </h2>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}>
            {ACHIEVEMENTS.map((ach) => {
              const unlocked = unlockedAchievements.includes(ach.id);
              return (
                <div key={ach.id} style={{
                  padding: "16px", borderRadius: "8px",
                  border: `1px solid ${unlocked ? "rgba(252,211,77,0.4)" : "rgba(75,85,99,0.3)"}`,
                  background: unlocked ? "rgba(252,211,77,0.06)" : "rgba(10,0,20,0.5)",
                  transition: "all 0.4s",
                  opacity: unlocked ? 1 : 0.4,
                }}>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>{ach.icon}</div>
                  <div style={{ color: unlocked ? "#FCD34D" : "#6B7280", fontWeight: "bold", fontSize: "14px" }}>
                    {ach.title}
                  </div>
                  <div style={{ color: "#6B7280", fontSize: "12px", marginTop: "4px" }}>{ach.desc}</div>
                  {unlocked && (
                    <div style={{ color: "#4ADE80", fontSize: "10px", marginTop: "8px", letterSpacing: "0.2em" }}>
                      ✓ UNLOCKED
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: "24px", color: "#6B7280", fontSize: "12px", letterSpacing: "0.2em" }}>
            {unlockedAchievements.length}/{ACHIEVEMENTS.length} Unlocked · Click around to discover more
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        textAlign: "center", padding: "40px clamp(16px, 5vw, 60px)",
        borderTop: "1px solid rgba(168,85,247,0.15)",
        position: "relative", zIndex: 2,
      }}>
        <div style={{
          fontSize: "clamp(18px,3vw,28px)", fontWeight: "bold",
          background: "linear-gradient(135deg, #FCD34D, #C084FC, #F87171)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: "12px",
        }}>
          Happy Birthday Khaled ✦
        </div>
        <p style={{ color: "#6B7280", fontSize: "13px", letterSpacing: "0.2em" }}>
          7 Juliet 2004 · Forever a Legend · Made with ✦
        </p>
        <div style={{ marginTop: "24px", color: "#374151", fontSize: "11px", letterSpacing: "0.3em" }}>
          HONKAI: STAR RAIL BIRTHDAY PORTAL · NOT AFFILIATED WITH HOYOVERSE
        </div>
      </footer>

      {/* Wish cards observer anchors */}
      {CHARACTERS.map((c) => (
        <div key={c.id} data-card-id={"wish-" + c.id} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
      ))}
      {CHARACTERS.map((c) => (
        <div key={c.id} data-card-id={"char-" + c.id} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
      ))}
    </div>
  );
}

function BirthdayCounter({ unlock }) {
  const birthday = new Date("2026-07-07T00:00:00");
  const [timeLeft, setTimeLeft] = useState({});
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const diff = birthday - now;
      if (diff <= 0) {
        setIsBirthday(true);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, []);

  if (isBirthday) {
    return (
      <div style={{
        padding: "32px 40px", borderRadius: "12px",
        border: "1px solid rgba(252,211,77,0.4)",
        background: "rgba(252,211,77,0.06)",
        boxShadow: "0 0 40px rgba(252,211,77,0.1)",
        animation: "glow 2s ease infinite",
        color: "#FCD34D",
      }}>
        <div style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: "bold", letterSpacing: "0.1em" }}>
          🎂 TODAY IS THE DAY! 🎂
        </div>
        <div style={{ fontSize: "14px", marginTop: "8px", color: "#A78BFA", letterSpacing: "0.2em" }}>
          Happy Birthday Khaled!
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: "28px 32px", borderRadius: "12px",
      border: "1px solid rgba(168,85,247,0.25)",
      background: "rgba(124,58,237,0.06)",
    }}>
      <div style={{ fontSize: "11px", letterSpacing: "0.4em", color: "#A78BFA", marginBottom: "20px" }}>
        DAYS UNTIL THE CELEBRATION
      </div>
      <div style={{ display: "flex", gap: "clamp(12px,3vw,32px)", justifyContent: "center", flexWrap: "wrap" }}>
        {[
          { val: timeLeft.days, label: "DAYS" },
          { val: timeLeft.hours, label: "HOURS" },
          { val: timeLeft.minutes, label: "MINS" },
          { val: timeLeft.seconds, label: "SECS" },
        ].map(({ val, label }) => (
          <div key={label} style={{ textAlign: "center", minWidth: "60px" }}>
            <div style={{
              fontSize: "clamp(28px,5vw,48px)", fontWeight: "bold",
              color: "#C084FC", lineHeight: 1,
              textShadow: "0 0 20px rgba(192,132,252,0.5)",
              animation: "counterPulse 1s ease-in-out infinite",
            }}>
              {String(val ?? 0).padStart(2, "0")}
            </div>
            <div style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#6B7280", marginTop: "6px" }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CharacterCard({ char, index, visible, onHover, hoveredChar }) {
  return (
    <div
      data-card-id={"char-" + char.id}
      className="char-card"
      onMouseEnter={() => onHover(char.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        position: "relative", borderRadius: "12px", overflow: "hidden",
        border: `1px solid ${char.border}`,
        background: `linear-gradient(160deg, ${char.cardBg}, rgba(5,0,16,0.9))`,
        backdropFilter: "blur(20px)",
        padding: "32px 24px 28px",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        cursor: "default",
        animation: visible ? `cardEnter 0.7s ${index * 0.12}s ease forwards` : "none",
        opacity: visible ? undefined : 0,
        transform: "translateY(0)",
        boxShadow: hoveredChar === char.id ? `0 20px 60px ${char.glow}22, 0 0 0 1px ${char.border}` : `0 4px 20px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Glow bg */}
      <div className="char-glow" style={{
        position: "absolute", inset: 0, opacity: 0,
        background: `radial-gradient(ellipse at 50% 0%, ${char.glow}18 0%, transparent 70%)`,
        transition: "opacity 0.4s",
        pointerEvents: "none",
      }} />

      {/* Corner decoration */}
      <div style={{
        position: "absolute", top: "12px", right: "16px",
        fontSize: "28px", opacity: 0.15, color: char.color,
        animation: "sparkle 3s ease-in-out infinite",
        animationDelay: index * 0.6 + "s",
      }}>
        {char.symbol}
      </div>

      {/* Header */}
      <div style={{ marginBottom: "20px", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "11px", letterSpacing: "0.5em", color: char.color, opacity: 0.7, marginBottom: "8px" }}>
          {char.path.toUpperCase()} PATH
        </div>
        <div style={{
          fontSize: "clamp(26px,3.5vw,36px)", fontWeight: "bold",
          color: char.color,
          textShadow: `0 0 20px ${char.glow}66`,
          letterSpacing: "0.05em",
        }}>
          {char.name}
        </div>
        <div style={{ color: "#9CA3AF", fontSize: "13px", marginTop: "4px", letterSpacing: "0.1em" }}>
          {char.title}
        </div>
      </div>

      {/* Visual */}
      <div className="char-img" style={{
        width: "100%", height: "140px",
        background: `radial-gradient(ellipse at 50% 80%, ${char.glow}30 0%, transparent 70%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "20px", position: "relative",
        transition: "transform 0.4s",
        fontSize: "80px",
        borderRadius: "8px",
        border: `1px solid ${char.border}`,
        overflow: "hidden",
      }}>
        <div style={{ filter: "drop-shadow(0 0 20px " + char.glow + ")" }}>
          {char.icon}
        </div>
        {/* Energy particles */}
        {[0,1,2,3,4].map(j => (
          <div key={j} style={{
            position: "absolute",
            left: (15 + j * 17) + "%",
            top: (20 + Math.sin(j) * 40) + "%",
            width: "4px", height: "4px",
            borderRadius: "50%", background: char.color,
            opacity: 0.6,
            animation: `float ${2 + j * 0.5}s ease-in-out infinite`,
            animationDelay: j * 0.3 + "s",
            boxShadow: `0 0 8px ${char.color}`,
          }} />
        ))}
      </div>

      {/* Desc */}
      <p style={{
        color: "#9CA3AF", fontSize: "13px", lineHeight: 1.7,
        marginBottom: "20px", fontStyle: "italic",
      }}>
        {char.desc}
      </p>

      {/* Quote */}
      <div style={{
        borderLeft: `2px solid ${char.color}`,
        paddingLeft: "14px",
        color: char.color, fontSize: "13px", lineHeight: 1.6,
        fontStyle: "italic", opacity: 0.85,
      }}>
        "{char.quote}"
      </div>

      {/* Bottom decoration */}
      <div style={{
        marginTop: "20px", display: "flex", gap: "6px", alignItems: "center",
      }}>
        {[0,1,2,3,4].map((s) => (
          <div key={s} style={{
            height: "2px", flex: s === 0 ? 3 : 1,
            background: s === 0 ? char.color : `${char.color}33`,
            borderRadius: "2px",
          }} />
        ))}
        <div style={{ fontSize: "10px", letterSpacing: "0.3em", color: char.color, opacity: 0.6, marginLeft: "6px" }}>
          SSR
        </div>
      </div>
    </div>
  );
}

function WishCard({ char, index, visible }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div
      data-card-id={"wish-" + char.id}
      onClick={() => setRevealed(true)}
      style={{
        display: "flex", gap: "20px", alignItems: "flex-start",
        padding: "28px 24px",
        borderRadius: "12px",
        border: `1px solid ${revealed ? char.border : "rgba(75,85,99,0.3)"}`,
        background: revealed
          ? `linear-gradient(135deg, ${char.cardBg}, rgba(5,0,16,0.8))`
          : "rgba(10,0,25,0.6)",
        transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
        cursor: revealed ? "default" : "pointer",
        animation: visible ? `cardEnter 0.7s ${index * 0.15}s ease forwards` : "none",
        opacity: visible ? undefined : 0,
        boxShadow: revealed ? `0 0 30px ${char.glow}18` : "none",
      }}
    >
      <div style={{
        width: "56px", height: "56px", flexShrink: 0,
        borderRadius: "50%",
        border: `1px solid ${char.border}`,
        background: char.cardBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "26px",
        boxShadow: revealed ? `0 0 20px ${char.glow}44` : "none",
        transition: "all 0.4s",
      }}>
        {char.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <span style={{ color: char.color, fontWeight: "bold", fontSize: "18px" }}>{char.name}</span>
          <span style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#6B7280" }}>{char.title}</span>
        </div>
        {revealed ? (
          <p style={{
            color: "#D1D5DB", fontSize: "clamp(14px,2vw,17px)", lineHeight: 1.7,
            fontStyle: "italic",
            textShadow: `0 0 20px ${char.glow}22`,
          }}>
            "{char.quote}"
          </p>
        ) : (
          <p style={{ color: "#4B5563", fontSize: "14px", fontStyle: "italic" }}>
            Click to reveal {char.name}'s birthday message...
          </p>
        )}
      </div>
    </div>
  );
}

function BirthdayCake({ candleCount, blownCandles, onBlowCandle, cakeBlown, cakeSlashed }) {
  const candles = Array.from({ length: candleCount }, (_, i) => i);
  const rows = [
    candles.slice(0, 7),
    candles.slice(7, 14),
    candles.slice(14, 21),
  ];

  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      {/* Candles */}
      <div style={{ marginBottom: "0px" }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "2px" }}>
            {row.map((i) => {
              const blown = blownCandles.includes(i);
              return (
                <div
                  key={i}
                  onClick={() => onBlowCandle(i)}
                  title="Click to blow!"
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    cursor: blown ? "default" : "pointer",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => { if (!blown) e.currentTarget.style.transform = "scale(1.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                  {/* Flame */}
                  <div style={{
                    width: "6px", height: blown ? "0px" : "14px",
                    background: "linear-gradient(to top, #FB923C, #FCD34D, #fff)",
                    borderRadius: "50% 50% 30% 30%",
                    boxShadow: blown ? "none" : "0 0 8px #FB923C, 0 0 16px #F97316",
                    transition: "all 0.3s",
                    animation: blown ? "none" : "candle 0.5s ease-in-out infinite",
                    opacity: blown ? 0 : 1,
                  }} />
                  {/* Wick */}
                  <div style={{
                    width: "1px", height: "4px",
                    background: blown ? "#4B5563" : "#92400E",
                  }} />
                  {/* Candle body */}
                  <div style={{
                    width: "8px", height: "30px",
                    background: blown ? "linear-gradient(to bottom, #374151, #1F2937)" :
                      `linear-gradient(to bottom, ${["#C084FC","#F87171","#FB923C","#818CF8","#FCD34D","#67E8F9"][i % 6]}, ${["#7C3AED","#B91C1C","#C2410C","#4338CA","#B45309","#0E7490"][i % 6]})`,
                    borderRadius: "2px",
                    boxShadow: blown ? "none" : `0 0 6px ${["#C084FC","#F87171","#FB923C","#818CF8","#FCD34D","#67E8F9"][i % 6]}55`,
                    transition: "all 0.4s",
                  }} />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Cake tiers */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {/* Top tier */}
        <div style={{
          width: "clamp(140px,30vw,200px)", height: "50px",
          background: cakeSlashed ? "linear-gradient(135deg, #4C1D95, #7C3AED)" : "linear-gradient(135deg, #4C1D95, #7C3AED)",
          borderRadius: "8px 8px 0 0",
          border: cakeSlashed ? "2px solid #F87171" : "2px solid rgba(168,85,247,0.5)",
          borderBottom: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: cakeSlashed ? "0 0 20px rgba(239,68,68,0.5)" : "0 0 20px rgba(124,58,237,0.3)",
          position: "relative", overflow: "hidden",
          transition: "all 0.3s",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.04) 10px, rgba(255,255,255,0.04) 20px)",
          }} />
          <span style={{ color: "#E9D5FF", fontSize: "12px", letterSpacing: "0.2em", zIndex: 1 }}>✦ HSR ✦</span>
        </div>
        {/* Middle tier */}
        <div style={{
          width: "clamp(180px,38vw,260px)", height: "60px",
          background: "linear-gradient(135deg, #1E1B4B, #312E81)",
          border: cakeSlashed ? "2px solid #F87171" : "2px solid rgba(99,102,241,0.5)",
          borderBottom: "none", borderTop: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: cakeSlashed ? "0 0 20px rgba(239,68,68,0.4)" : "0 0 20px rgba(99,102,241,0.2)",
          position: "relative", overflow: "hidden",
          transition: "all 0.3s",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,255,255,0.03) 8px, rgba(255,255,255,0.03) 16px)",
          }} />
          <span style={{ color: "#C7D2FE", fontSize: "13px", letterSpacing: "0.2em", zIndex: 1 }}>
            KHALED 🎂 2004
          </span>
        </div>
        {/* Bottom tier */}
        <div style={{
          width: "clamp(220px,46vw,320px)", height: "70px",
          background: "linear-gradient(135deg, #1F1135, #2D1B69)",
          borderRadius: "0 0 12px 12px",
          border: cakeSlashed ? "2px solid #F87171" : "2px solid rgba(139,92,246,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: cakeSlashed ? "0 8px 30px rgba(239,68,68,0.3)" : "0 8px 30px rgba(0,0,0,0.5)",
          position: "relative", overflow: "hidden",
          transition: "all 0.3s",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.02) 20px, rgba(255,255,255,0.02) 21px)",
          }} />
          <div style={{ zIndex: 1, textAlign: "center" }}>
            <div style={{ color: "#8B5CF6", fontSize: "11px", letterSpacing: "0.3em" }}>
              7 JULIET 2004
            </div>
            <div style={{ color: "#6B7280", fontSize: "10px", marginTop: "4px", letterSpacing: "0.1em" }}>
              {blownCandles.length}/{candleCount} candles blown
            </div>
          </div>
        </div>
        {/* Base plate */}
        <div style={{
          width: "clamp(240px,50vw,360px)", height: "12px",
          background: "linear-gradient(to right, #0F0A23, #1E1B4B, #0F0A23)",
          borderRadius: "0 0 8px 8px",
        }} />
      </div>
    </div>
  );
}