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
    image: "https://upload-os-bbs.hoyolab.com/upload/2024/05/16/153638533/2be3d940c7f334f57e3998ecaaa4f7ec_4137075711809743427.png",
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
    image: "https://upload-os-bbs.hoyolab.com/upload/2024/04/27/335280284/967431fc767140dd26818fca6e877664_6601279306635630814.png",
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
    image: "https://cdn2.cdnstep.com/OCTvaRhXxMvyrB0EuYXT/cover-1.png",
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
    image: "https://cdn2.cdnstep.com/h7Jp5L0bkDtB5Xvk7gNA/3-1.png",
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
  const [showMinigame, setShowMinigame] = useState(false);
  const [showFinisher, setShowFinisher] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [canSkipVideo, setCanSkipVideo] = useState(false);
  const [showGlassBreak, setShowGlassBreak] = useState(false);
  const [showPrize, setShowPrize] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [lockTimeLeft, setLockTimeLeft] = useState({});
  const BIRTHDAY_DATE = new Date("2026-07-07T00:00:00");
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
    const calc = () => {
      const now = new Date();
      const diff = BIRTHDAY_DATE - now;
      if (diff <= 0) {
        setIsLocked(false);
        return;
      }
      setIsLocked(true);
      setLockTimeLeft({
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
    setShowMinigame(true);
  };

  const completeMinigame = () => {
    setShowMinigame(false);
    setCakeSlashed(true);
    unlock("cake_slash");
    setShowFinisher(true);

    // Create slash particles (big AOE burst)
    const particles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: 25 + Math.random() * 50,
      y: 30 + Math.random() * 40,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * -8 - 2,
      color: ["#F87171", "#EF4444", "#FCA5A5", "#FCD34D", "#fff"][Math.floor(Math.random() * 5)],
      size: Math.random() * 5 + 2,
      life: 1,
    }));
    setSlashParticles(particles);

    const animateParticles = setInterval(() => {
      setSlashParticles((prev) => {
        const updated = prev.map((p) => ({
          ...p,
          y: p.y + p.vy,
          vy: p.vy + 0.3,
          life: p.life - 0.04,
        })).filter((p) => p.life > 0);
        if (updated.length === 0) clearInterval(animateParticles);
        return updated;
      });
    }, 30);

    setTimeout(() => setShowFinisher(false), 1400);
    setTimeout(() => triggerConfetti(), 700);
    setTimeout(() => { setShowVideo(true); setCanSkipVideo(false); }, 1500);
    setTimeout(() => setCanSkipVideo(true), 1500 + 6000);
    // Auto-end the cutscene after a single watch-through if never skipped
    setTimeout(() => endCutsceneRef.current && endCutsceneRef.current(), 1500 + 30000);
  };

  const endCutscene = useCallback(() => {
    setShowVideo(false);
    setShowGlassBreak(true);
    setTimeout(() => {
      setShowGlassBreak(false);
      setShowPrize(true);
    }, 900);
  }, []);

  const endCutsceneRef = useRef(null);
  useEffect(() => { endCutsceneRef.current = endCutscene; }, [endCutscene]);

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

  if (isLocked) {
    return (
      <div style={{
        minHeight: "100vh", background: "#050010",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Georgia', serif", position: "relative", overflow: "hidden",
        padding: "24px",
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
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, rgba(239,68,68,0.1) 0%, transparent 60%)",
        }} />
        <div style={{ textAlign: "center", zIndex: 10, maxWidth: "560px" }}>
          <div style={{ fontSize: "44px", marginBottom: "8px" }}>🔒</div>
          <div style={{
            fontSize: "11px", letterSpacing: "0.5em", color: "#F87171",
            textTransform: "uppercase", marginBottom: "20px",
          }}>
            ✦ Access Sealed ✦
          </div>
          <div style={{
            fontSize: "clamp(20px, 4vw, 32px)", fontWeight: "bold",
            color: "#FCA5A5", textShadow: "0 0 30px #EF4444, 0 0 60px #B91C1C",
            marginBottom: "16px", lineHeight: 1.4,
          }}>
            You can't access this site<br />until the cooldown reaches 0
          </div>
          <p style={{ color: "#9CA3AF", fontSize: "14px", marginBottom: "36px" }}>
            The stars are still aligning, Trailblazer. Return when the countdown ends.
          </p>

          <div style={{
            padding: "24px 28px", borderRadius: "12px",
            border: "1px solid rgba(239,68,68,0.3)",
            background: "rgba(124,0,0,0.08)",
          }}>
            <div style={{ display: "flex", gap: "clamp(10px,3vw,28px)", justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { val: lockTimeLeft.days, label: "DAYS" },
                { val: lockTimeLeft.hours, label: "HOURS" },
                { val: lockTimeLeft.minutes, label: "MINS" },
                { val: lockTimeLeft.seconds, label: "SECS" },
              ].map(({ val, label }) => (
                <div key={label} style={{ textAlign: "center", minWidth: "56px" }}>
                  <div style={{
                    fontSize: "clamp(26px,5vw,42px)", fontWeight: "bold",
                    color: "#F87171", lineHeight: 1,
                    textShadow: "0 0 20px rgba(239,68,68,0.6)",
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

          <div style={{ marginTop: "28px", color: "#4B5563", fontSize: "11px", letterSpacing: "0.2em" }}>
            THIS PAGE WILL UNLOCK AUTOMATICALLY
          </div>
        </div>
        <style>{`
          @keyframes twinkle { from { opacity: 0.1; } to { opacity: 0.9; } }
          @keyframes counterPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        `}</style>
      </div>
    );
  }

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
        @keyframes glassCrack {
          0%{opacity:0} 100%{opacity:1}
        }
        @keyframes shardFly {
          0%{ transform:translate(-50%,-50%) rotate(0deg); opacity:1; }
          100%{ transform:translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(var(--rot)); opacity:0; }
        }
        @keyframes prizePop {
          0%{transform:scale(0.6) rotate(-4deg);opacity:0}
          60%{transform:scale(1.05) rotate(1deg);opacity:1}
          100%{transform:scale(1) rotate(0deg);opacity:1}
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
        @keyframes aoeFlash {
          0%{opacity:0} 15%{opacity:1} 100%{opacity:0}
        }
        @keyframes aoeSlash1 {
          0%{clip-path:inset(0 100% 0 0);opacity:1}
          60%{clip-path:inset(0 0 0 0);opacity:1}
          100%{clip-path:inset(0 0 0 0);opacity:0}
        }
        @keyframes aoeSlash2 {
          0%{clip-path:inset(0 0 0 100%);opacity:1}
          60%{clip-path:inset(0 0 0 0);opacity:1}
          100%{clip-path:inset(0 0 0 0);opacity:0}
        }
        @keyframes aoeSlash3 {
          0%{clip-path:inset(0 100% 0 0);opacity:1;transform:rotate(-5deg) scale(0.8)}
          50%{clip-path:inset(0 0 0 0);opacity:1;transform:rotate(-5deg) scale(1.1)}
          100%{clip-path:inset(0 0 0 0);opacity:0;transform:rotate(-5deg) scale(1.3)}
        }
        @keyframes aoeText {
          0%{opacity:0;transform:scale(2)}
          25%{opacity:1;transform:scale(1)}
          80%{opacity:1;transform:scale(1)}
          100%{opacity:0;transform:scale(1.1)}
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

      {/* Slash Minigame */}
      {showMinigame && (
        <SlashMinigame onComplete={completeMinigame} onClose={() => setShowMinigame(false)} />
      )}

      {/* Big AOE finisher overlay */}
      {showFinisher && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9996, pointerEvents: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(circle, rgba(239,68,68,0.25) 0%, transparent 60%)",
            animation: "aoeFlash 1.4s ease forwards",
          }} />
          <div style={{
            position: "absolute", width: "140%", height: "10px",
            background: "linear-gradient(90deg, transparent, #fff, #F87171, #fff, transparent)",
            boxShadow: "0 0 40px #F87171, 0 0 80px #EF4444",
            transform: "rotate(-30deg)",
            animation: "aoeSlash1 0.5s ease-out forwards",
          }} />
          <div style={{
            position: "absolute", width: "140%", height: "10px",
            background: "linear-gradient(90deg, transparent, #fff, #F87171, #fff, transparent)",
            boxShadow: "0 0 40px #F87171, 0 0 80px #EF4444",
            transform: "rotate(15deg)",
            animation: "aoeSlash2 0.5s 0.1s ease-out forwards",
          }} />
          <div style={{
            position: "absolute", width: "140%", height: "14px",
            background: "linear-gradient(90deg, transparent, #FCD34D, #fff, #FCD34D, transparent)",
            boxShadow: "0 0 60px #FCD34D, 0 0 100px #F87171",
            transform: "rotate(-5deg)",
            animation: "aoeSlash3 0.6s 0.2s ease-out forwards",
          }} />
          <div style={{
            fontSize: "clamp(28px,6vw,64px)", fontWeight: "bold", color: "#F87171",
            textShadow: "0 0 30px #EF4444, 0 0 60px #F87171",
            letterSpacing: "0.15em",
            animation: "aoeText 1.4s ease forwards",
            opacity: 0,
          }}>
            SLASHED!
          </div>
        </div>
      )}


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

      {/* Post-slash video reveal */}
      {showVideo && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "#000",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "easterPop 0.4s ease forwards",
        }}>
          {/* Cinematic bars */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "8vh",
            background: "#000", zIndex: 3,
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "8vh",
            background: "#000", zIndex: 3,
          }} />

          {/* Fullscreen video, no native controls reachable */}
          <div style={{
            position: "absolute", inset: 0,
          }}>
            <iframe
              src="https://streamable.com/e/yzvnbh?autoplay=1&muted=0&nocontrols=1&loop=0"
              frameBorder="0"
              allow="autoplay; fullscreen"
              style={{
                position: "absolute", top: 0, left: 0,
                width: "100%", height: "100%",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Invisible click-blocker: prevents pausing/seeking/clicking the player */}
          <div style={{
            position: "fixed", inset: 0, zIndex: 2,
            background: "transparent",
            cursor: "default",
          }} />

          {/* Cutscene label */}
          <div style={{
            position: "absolute", top: "8vh", left: "24px", zIndex: 4,
            color: "rgba(255,255,255,0.6)", fontSize: "11px",
            letterSpacing: "0.3em", textTransform: "uppercase",
            animation: "mgFloatTitle 2.4s ease-in-out infinite",
          }}>
            ⚡ Cutscene — Acheron
          </div>

          {/* Skip button, only available after a few seconds */}
          {canSkipVideo && (
            <button
              onClick={endCutscene}
              style={{
                position: "absolute", bottom: "8vh", right: "24px", zIndex: 4,
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff", fontSize: "12px", letterSpacing: "0.15em",
                padding: "10px 20px", borderRadius: "4px", cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.4)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.5)"}
            >
              SKIP ▶▶
            </button>
          )}
        </div>
      )}

      {/* Glass shatter transition when cutscene ends */}
      {showGlassBreak && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          pointerEvents: "none", overflow: "hidden",
          background: "#000",
        }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            {Array.from({ length: 14 }).map((_, i) => {
              const cx = 50, cy = 50;
              const angle = (i / 14) * Math.PI * 2;
              const len = 60 + (i % 3) * 10;
              const x2 = cx + Math.cos(angle) * len;
              const y2 = cy + Math.sin(angle) * len;
              return (
                <line key={i} x1={cx} y1={cy} x2={x2} y2={y2}
                  stroke="rgba(255,255,255,0.5)" strokeWidth="0.3"
                  style={{ animation: `glassCrack 0.5s ${i * 0.02}s ease forwards`, opacity: 0 }} />
              );
            })}
          </svg>
          {/* shattering shards */}
          {Array.from({ length: 22 }).map((_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const dist = 40 + Math.random() * 60;
            return (
              <div key={i} style={{
                position: "absolute", top: "50%", left: "50%",
                width: 20 + Math.random() * 30 + "px",
                height: 20 + Math.random() * 30 + "px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.3)",
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                "--dx": Math.cos(angle) * dist + "vw",
                "--dy": Math.sin(angle) * dist + "vh",
                "--rot": (Math.random() * 720 - 360) + "deg",
                animation: `shardFly 0.7s ${0.1 + Math.random() * 0.15}s ease-out forwards`,
              }} />
            );
          })}
        </div>
      )}

      {/* Prize popup */}
      {showPrize && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(3,0,10,0.92)",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)",
        }}>
          <div style={{
            width: "min(480px, 90vw)",
            padding: "40px 32px",
            borderRadius: "16px",
            border: "1px solid rgba(252,211,77,0.5)",
            background: "linear-gradient(160deg, rgba(40,25,0,0.9), rgba(5,0,16,0.96))",
            boxShadow: "0 0 80px rgba(252,211,77,0.25)",
            textAlign: "center",
            position: "relative",
            animation: "prizePop 0.6s cubic-bezier(0.16,1.2,0.4,1) forwards",
          }}>
            <div style={{ fontSize: "56px", marginBottom: "12px", animation: "floatSlow 3s ease-in-out infinite" }}>
              🎁
            </div>
            <div style={{
              fontSize: "11px", letterSpacing: "0.4em", color: "#FCD34D", marginBottom: "10px",
            }}>
              ✦ A TRANSMISSION ARRIVES ✦
            </div>
            <div style={{
              fontSize: "clamp(20px,3vw,28px)", fontWeight: "bold",
              background: "linear-gradient(135deg, #FCD34D, #F87171)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: "18px",
            }}>
              A Gift From Shicmuon
            </div>
            <p style={{ color: "#D1D5DB", fontSize: "14.5px", lineHeight: 1.7, marginBottom: "10px" }}>
              Five years of friendship, written across timelines and trails — and still going.
            </p>
            <p style={{ color: "#A78BFA", fontSize: "14px", lineHeight: 1.7, fontStyle: "italic" }}>
              Happy Birthday, Khaled. This one's just for you.
            </p>
            <div style={{
              marginTop: "24px", display: "flex", gap: "6px", alignItems: "center", justifyContent: "center",
            }}>
              {[0,1,2,3,4].map((s) => (
                <span key={s} style={{ color: "#FCD34D", opacity: 0.7, fontSize: "14px" }}>✦</span>
              ))}
            </div>
            <button
              onClick={() => setShowPrize(false)}
              className="btn-cosmic"
              style={{ marginTop: "28px", fontSize: "13px", padding: "12px 32px" }}
            >
              Open With Gratitude
            </button>
          </div>
        </div>
      )}


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
              overflow: "hidden",
            }}>
              {c.image ? (
                <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
              ) : (
                c.icon
              )}
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
        width: "100%", height: "260px",
        background: `radial-gradient(ellipse at 50% 80%, ${char.glow}30 0%, transparent 70%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "20px", position: "relative",
        transition: "transform 0.4s",
        borderRadius: "8px",
        border: `1px solid ${char.border}`,
        overflow: "hidden",
      }}>
        {char.image ? (
          <img
            src={char.image}
            alt={char.name}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              filter: `drop-shadow(0 0 20px ${char.glow}55)`,
            }}
          />
        ) : (
          <div style={{ fontSize: "80px", filter: "drop-shadow(0 0 20px " + char.glow + ")" }}>
            {char.icon}
          </div>
        )}
        {/* bottom fade so the card border reads as one piece */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(180deg, transparent 60%, ${char.cardBg} 100%)`,
          pointerEvents: "none",
        }} />
        {/* Energy particles */}
        {[0,1,2,3,4].map(j => (
          <div key={j} style={{
            position: "absolute",
            left: (15 + j * 17) + "%",
            top: (10 + Math.sin(j) * 30) + "%",
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
        overflow: "hidden",
      }}>
        {char.image ? (
          <img src={char.image} alt={char.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
        ) : (
          char.icon
        )}
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

function SlashMinigame({ onComplete, onClose }) {
  // 3 timed strikes using a shrinking 3D reticle (closing ring), then auto-finish into AOE
  const [stage, setStage] = useState(1); // 1,2,3
  const [ringScale, setRingScale] = useState(2.6); // shrinks toward 1
  const [targetScale, setTargetScale] = useState(1);
  const [tolerance, setTolerance] = useState(0.22);
  const [feedback, setFeedback] = useState(null); // 'PERFECT' | 'HIT' | 'MISS'
  const [misses, setMisses] = useState(0);
  const [locked, setLocked] = useState(false);
  const [swingKey, setSwingKey] = useState(0); // remounts blade swing animation
  const [shake, setShake] = useState(false);
  const [impactFlash, setImpactFlash] = useState(false);
  const rafRef = useRef(null);
  const speedRef = useRef(0.018);

  useEffect(() => {
    // harder & faster each stage
    setTargetScale(1);
    setTolerance(stage === 1 ? 0.26 : stage === 2 ? 0.2 : 0.15);
    speedRef.current = 0.016 + stage * 0.006;
    setRingScale(2.6);
    setLocked(false);
  }, [stage]);

  useEffect(() => {
    let s = 2.6;
    const tick = () => {
      s -= speedRef.current;
      if (s <= 0.15) s = 2.6; // loop back out if missed window
      setRingScale(s);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stage]);

  const strike = () => {
    if (locked) return;
    setLocked(true);
    cancelAnimationFrame(rafRef.current);

    const dist = Math.abs(ringScale - targetScale);
    let result;
    if (dist <= tolerance * 0.4) result = "PERFECT";
    else if (dist <= tolerance) result = "HIT";
    else result = "MISS";

    setFeedback(result);
    if (result === "MISS") setMisses((m) => m + 1);

    // Trigger blade swing + camera shake + impact flash
    setSwingKey((k) => k + 1);
    if (result !== "MISS") {
      setShake(true);
      setImpactFlash(true);
      setTimeout(() => setShake(false), 280);
      setTimeout(() => setImpactFlash(false), 180);
    }

    setTimeout(() => {
      setFeedback(null);
      if (stage < 3) {
        setStage((s) => s + 1);
      } else {
        onComplete();
      }
    }, 650);
  };

  const ringColor = (() => {
    const dist = Math.abs(ringScale - targetScale);
    if (dist <= tolerance * 0.4) return "#FCD34D";
    if (dist <= tolerance) return "#F87171";
    return "#818CF8";
  })();

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#03000a",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes mgFeedbackPop { 0%{transform:scale(0.5);opacity:0} 30%{transform:scale(1.25);opacity:1} 100%{transform:scale(1);opacity:0} }
        @keyframes mgVoidDrift {
          0%{transform:translateZ(0) rotateX(78deg) translateY(0)}
          100%{transform:translateZ(0) rotateX(78deg) translateY(60px)}
        }
        @keyframes mgRingPulse { 0%,100%{opacity:0.5} 50%{opacity:0.9} }
        @keyframes mgBladeSwing {
          0%{ transform: translate3d(-60%, 10%, -250px) rotate3d(0.2,1,0.1,-70deg) scale(0.6); opacity:0; }
          12%{ opacity:1; }
          45%{ transform: translate3d(0%, -2%, 180px) rotate3d(0.2,1,0.1,10deg) scale(1.5); opacity:1; }
          70%{ transform: translate3d(40%, -8%, 280px) rotate3d(0.2,1,0.1,55deg) scale(1.7); opacity:1; }
          100%{ transform: translate3d(90%, -10%, 320px) rotate3d(0.2,1,0.1,80deg) scale(1.8); opacity:0; }
        }
        @keyframes mgBladeTrail {
          0%{opacity:0} 20%{opacity:0.5} 100%{opacity:0}
        }
        @keyframes mgImpactFlash {
          0%{opacity:0.9} 100%{opacity:0}
        }
        @keyframes mgShake {
          0%,100%{transform:translate(0,0)}
          20%{transform:translate(-6px,3px)}
          40%{transform:translate(5px,-4px)}
          60%{transform:translate(-4px,-2px)}
          80%{transform:translate(6px,2px)}
        }
        @keyframes mgLightning {
          0%,100%{opacity:0.15} 50%{opacity:0.55}
        }
        @keyframes mgFloatTitle {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)}
        }
      `}</style>

      {/* 3D void corridor floor */}
      <div style={{
        position: "absolute", inset: 0, perspective: "700px",
        overflow: "hidden", pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute", left: "-50%", right: "-50%", bottom: "-30%",
          height: "140%",
          backgroundImage: "repeating-linear-gradient(0deg, rgba(239,68,68,0.18) 0px, transparent 2px, transparent 46px, rgba(239,68,68,0.18) 48px), repeating-linear-gradient(90deg, rgba(239,68,68,0.1) 0px, transparent 2px, transparent 46px, rgba(239,68,68,0.1) 48px)",
          transformOrigin: "50% 100%",
          animation: "mgVoidDrift 1.4s linear infinite",
        }} />
        {/* ambient red glow from below */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 100%, rgba(239,68,68,0.25) 0%, transparent 60%)",
        }} />
        {/* lightning cracks */}
        {[
          "M10,90 L25,40 L18,42 L35,5",
          "M85,95 L70,55 L78,53 L60,10",
          "M50,98 L55,60 L48,58 L52,20",
        ].map((d, i) => (
          <svg key={i} viewBox="0 0 100 100" style={{
            position: "absolute", left: `${10 + i * 30}%`, top: 0,
            width: "120px", height: "100%", opacity: 0.3,
            animation: `mgLightning ${1.6 + i * 0.4}s ease-in-out infinite`,
            animationDelay: i * 0.3 + "s",
          }}>
            <path d={d} stroke="#F87171" strokeWidth="1" fill="none" />
          </svg>
        ))}
      </div>

      {/* Impact flash */}
      {impactFlash && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
          background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(239,68,68,0.25) 35%, transparent 70%)",
          animation: "mgImpactFlash 0.18s ease forwards",
        }} />
      )}

      {/* Camera-shake wrapper for main scene */}
      <div style={{
        position: "relative", zIndex: 2, width: "min(560px, 94vw)",
        animation: shake ? "mgShake 0.28s ease" : "none",
      }}>
        {/* Blade swing layer (3D), keyed to remount each strike */}
        <div key={swingKey} style={{
          position: "absolute", inset: "-160px -120px", zIndex: 4,
          perspective: "900px", pointerEvents: "none",
        }}>
          {feedback && (
            <>
              {/* trailing afterimages for motion blur */}
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{
                  position: "absolute", top: "50%", left: "50%",
                  width: "340px", height: "10px", marginTop: "-5px", marginLeft: "-170px",
                  background: "linear-gradient(90deg, transparent, rgba(248,113,113,0.5), rgba(255,255,255,0.9), rgba(248,113,113,0.5), transparent)",
                  borderRadius: "6px",
                  filter: `blur(${i * 1.5}px)`,
                  animation: "mgBladeSwing 0.5s cubic-bezier(0.2,0.9,0.3,1) forwards",
                  animationDelay: i * 0.02 + "s",
                  opacity: 0,
                  boxShadow: "0 0 30px #F87171, 0 0 60px #EF4444",
                }} />
              ))}
              {/* core blade */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                width: "360px", height: "14px", marginTop: "-7px", marginLeft: "-180px",
                background: "linear-gradient(90deg, transparent, #fff 30%, #FCA5A5 50%, #fff 70%, transparent)",
                borderRadius: "8px",
                animation: "mgBladeSwing 0.5s cubic-bezier(0.2,0.9,0.3,1) forwards",
                opacity: 0,
                boxShadow: "0 0 40px #fff, 0 0 80px #F87171",
              }} />
            </>
          )}
        </div>

        <div style={{
          padding: "32px 28px",
          border: `1px solid ${ringColor}66`,
          borderRadius: "16px",
          background: "linear-gradient(160deg, rgba(30,0,8,0.85), rgba(3,0,10,0.92))",
          textAlign: "center",
          boxShadow: `0 0 50px ${ringColor}33, inset 0 0 60px rgba(0,0,0,0.4)`,
          backdropFilter: "blur(4px)",
        }}>
          <button onClick={onClose} style={{
            position: "absolute", top: "12px", right: "14px",
            background: "none", border: "none", color: "#6B7280",
            fontSize: "18px", cursor: "pointer", zIndex: 10,
          }}>✕</button>

          <div style={{
            fontSize: "11px", letterSpacing: "0.4em", color: "#F87171", marginBottom: "6px",
            animation: "mgFloatTitle 2.4s ease-in-out infinite",
          }}>
            ⚡ NIHILITY SEQUENCE ⚡
          </div>
          <div style={{
            fontSize: "clamp(20px,3vw,30px)", fontWeight: "bold",
            color: "#FCA5A5", textShadow: "0 0 24px #EF4444, 0 0 50px #B91C1C", marginBottom: "4px",
            letterSpacing: "0.05em",
          }}>
            Acheron — Stellaron Annihilation
          </div>
          <div style={{ color: "#9CA3AF", fontSize: "13px", marginBottom: "28px" }}>
            Strike {stage} of 3 — SLASH when the ring locks onto the target
          </div>

          {/* 3D ground reticle */}
          <div style={{
            position: "relative", width: "100%", height: "180px",
            display: "flex", alignItems: "center", justifyContent: "center",
            perspective: "500px", marginBottom: "24px",
          }}>
            <div style={{
              position: "relative", width: "180px", height: "180px",
              transformStyle: "preserve-3d", transform: "rotateX(58deg)",
            }}>
              {/* fixed target ring (ground) */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                border: "2px solid rgba(252,211,77,0.8)",
                boxShadow: "0 0 20px rgba(252,211,77,0.5), inset 0 0 20px rgba(252,211,77,0.3)",
              }} />
              {/* tolerance band, subtle */}
              <div style={{
                position: "absolute",
                inset: `${-(tolerance) * 90}px`,
                borderRadius: "50%",
                border: "1px dashed rgba(252,211,77,0.25)",
              }} />
              {/* closing ring (the player times this) */}
              <div style={{
                position: "absolute",
                top: "50%", left: "50%",
                width: "180px", height: "180px",
                marginTop: "-90px", marginLeft: "-90px",
                borderRadius: "50%",
                border: `3px solid ${ringColor}`,
                boxShadow: `0 0 30px ${ringColor}99`,
                transform: `scale(${ringScale})`,
                animation: "mgRingPulse 0.6s ease-in-out infinite",
                opacity: locked ? 0.3 : 1,
              }} />
              {/* center mark */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                width: "8px", height: "8px", marginTop: "-4px", marginLeft: "-4px",
                borderRadius: "50%", background: "#fff",
                boxShadow: "0 0 10px #fff",
              }} />
            </div>
          </div>

          {/* Stage pips */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{
                width: "10px", height: "10px", borderRadius: "50%",
                background: n < stage ? "#F87171" : n === stage ? "#FCD34D" : "rgba(255,255,255,0.15)",
                boxShadow: n <= stage ? "0 0 8px currentColor" : "none",
                transition: "all 0.3s",
              }} />
            ))}
          </div>

          {/* Feedback */}
          <div style={{ height: "28px", marginBottom: "12px" }}>
            {feedback && (
              <div style={{
                fontSize: "20px", fontWeight: "bold",
                color: feedback === "PERFECT" ? "#FCD34D" : feedback === "HIT" ? "#F87171" : "#6B7280",
                letterSpacing: "0.2em",
                animation: "mgFeedbackPop 0.6s ease forwards",
              }}>
                {feedback === "PERFECT" ? "✦ PERFECT SLASH ✦" : feedback === "HIT" ? "⚔ CLEAN HIT" : "MISS"}
              </div>
            )}
          </div>

          <button
            onClick={strike}
            disabled={locked}
            className="btn-crimson"
            style={{
              fontSize: "16px", padding: "16px 48px",
              opacity: locked ? 0.5 : 1,
              cursor: locked ? "not-allowed" : "pointer",
            }}
          >
            ⚔ SLASH
          </button>

          <div style={{ marginTop: "16px", color: "#4B5563", fontSize: "11px", letterSpacing: "0.15em" }}>
            {misses > 0 ? `${misses} miss${misses > 1 ? "es" : ""} so far — every strike still counts` : "Time it well, Trailblazer"}
          </div>
        </div>
      </div>
    </div>
  );
}
