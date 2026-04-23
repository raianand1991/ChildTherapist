import { useState, useEffect, useRef } from "react";
import ScreeningForm from "./ScreeningForm";

const COLORS = {
  sage: "#22b5a8",        // logo teal
  sageDark: "#1a8f85",    // dark teal
  sageLight: "#e0f6f4",   // light teal bg
  coral: "#e8437e",       // logo hot pink
  coralLight: "#fde8f1",  // light pink bg
  cream: "#f4f7fb",       // card background
  warmWhite: "#f8fafc",   // section alternate bg
  charcoal: "#1e3d6e",    // navy dark text
  textMuted: "#5a6e8a",   // muted text
  textLight: "#8a9bb5",   // light text
  gold: "#f5a623",        // amber accent
  goldLight: "#fef3e2",   // light amber
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

const Nav = ({ onOpenScreening }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const navBg = scrolled || menuOpen ? "rgba(255,255,255,0.97)" : "transparent";
  const navBorder = scrolled || menuOpen ? `1px solid ${COLORS.sage}20` : "none";
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navBg, backdropFilter: scrolled || menuOpen ? "blur(16px)" : "none", borderBottom: navBorder, transition: "all 0.35s ease", padding: scrolled ? "10px 0" : "18px 0" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {!logoError ? (
            <img src="/logo.png" alt="childtherapist.in" height={48} style={{ objectFit: "contain", display: "block" }} onError={() => setLogoError(true)} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.sage}, ${COLORS.coral})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌱</div>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: COLORS.charcoal }}>childtherapist<span style={{ color: COLORS.coral }}>.in</span></span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28, marginRight: 8 }}>
            {["How It Works", "Services", "Pricing", "About"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "")}`} style={{ textDecoration: "none", color: COLORS.charcoal, fontSize: 14, fontWeight: 500, fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: 0.8, transition: "opacity 0.2s" }}
                onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.8}>{item}</a>
            ))}
          </div>
          <button onClick={onOpenScreening} style={{ background: COLORS.sage, color: "#fff", padding: "10px 22px", borderRadius: 99, fontSize: 14, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.2s", boxShadow: `0 2px 12px ${COLORS.sage}40`, whiteSpace: "nowrap", border: "none", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.background = COLORS.sageDark; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = COLORS.sage; e.currentTarget.style.transform = "translateY(0)"; }}>
            Free Screening
          </button>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: COLORS.charcoal }}>
            <span style={{ display: "block", width: 22, height: 2, background: COLORS.charcoal, borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 2, background: COLORS.charcoal, borderRadius: 2, margin: "5px 0", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 2, background: COLORS.charcoal, borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div style={{ padding: "8px 24px 24px", maxWidth: 1120, margin: "0 auto" }}>
          {["How It Works", "Services", "Pricing", "About"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "")}`} onClick={() => setMenuOpen(false)}
              style={{ display: "block", textDecoration: "none", color: COLORS.charcoal, fontSize: 16, fontWeight: 500, fontFamily: "'Plus Jakarta Sans', sans-serif", padding: "14px 0", borderBottom: `1px solid ${COLORS.sage}10` }}>{item}</a>
          ))}
          <button onClick={() => { setMenuOpen(false); onOpenScreening(); }}
            style={{ display: "block", width: "100%", background: COLORS.sage, color: "#fff", padding: "14px 24px", borderRadius: 99, fontSize: 15, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: "center", marginTop: 16, border: "none", cursor: "pointer" }}>
            Free Screening
          </button>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ onOpenScreening }) => (
  <section className="hero-section" style={{ background: "linear-gradient(160deg, #ffffff 0%, #f0fffe 45%, #fff2f8 100%)", paddingTop: 130, paddingBottom: 80, position: "relative", overflow: "hidden" }}>
    {/* Decorative shapes */}
    <div style={{ position: "absolute", top: 60, right: -60, width: 280, height: 280, borderRadius: "50%", background: `${COLORS.coral}08`, filter: "blur(40px)" }} />
    <div style={{ position: "absolute", bottom: -40, left: -80, width: 320, height: 320, borderRadius: "50%", background: `${COLORS.sage}08`, filter: "blur(50px)" }} />
    <div style={{ position: "absolute", top: 180, left: "10%", width: 8, height: 8, borderRadius: "50%", background: COLORS.coral, opacity: 0.3 }} />
    <div style={{ position: "absolute", top: 240, right: "15%", width: 12, height: 12, borderRadius: "50%", background: COLORS.sage, opacity: 0.2 }} />
    <div style={{ position: "absolute", bottom: 120, left: "60%", width: 6, height: 6, borderRadius: "50%", background: COLORS.gold, opacity: 0.4 }} />

    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", position: "relative" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <FadeIn>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", padding: "8px 18px", borderRadius: 99, marginBottom: 28, boxShadow: "0 2px 16px rgba(0,0,0,0.04)", border: `1px solid ${COLORS.sage}20` }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e80" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.sage, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>India's First AI-Powered Child Therapy Platform</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(36px, 5.5vw, 58px)", fontWeight: 800, color: COLORS.charcoal, lineHeight: 1.15, margin: "0 0 24px", letterSpacing: "-0.02em" }}>
            Every child deserves to be<br />
            <span style={{ color: COLORS.coral, position: "relative", display: "inline-block" }}>
              heard & healed
              <svg style={{ position: "absolute", bottom: -6, left: 0, width: "100%", height: 12 }} viewBox="0 0 200 12" fill="none">
                <path d="M2 8 C 50 2, 150 2, 198 8" stroke={COLORS.coral} strokeWidth="3" strokeLinecap="round" opacity="0.3" />
              </svg>
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, color: COLORS.textMuted, lineHeight: 1.7, margin: "0 0 36px", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            Connect your child with RCI-registered therapists through AI-matched sessions. From ADHD to anxiety, from autism to academic stress — compassionate, expert care from home.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="cta-buttons" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <button onClick={onOpenScreening} style={{ background: `linear-gradient(135deg, ${COLORS.sage}, ${COLORS.sageDark})`, color: "#fff", padding: "16px 36px", borderRadius: 99, fontSize: 16, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: `0 4px 20px ${COLORS.sage}40, 0 1px 3px rgba(0,0,0,0.1)`, transition: "all 0.25s", display: "inline-flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${COLORS.sage}50`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px ${COLORS.sage}40`; }}>
              Take Free Screening →
            </button>
            <a href="#howitworks" style={{ textDecoration: "none", background: "#fff", color: COLORS.sageDark, padding: "16px 32px", borderRadius: 99, fontSize: 16, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", border: `2px solid ${COLORS.sage}30`, transition: "all 0.25s" }}
              onMouseEnter={e => { e.target.style.borderColor = COLORS.sage; e.target.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.target.style.borderColor = `${COLORS.sage}30`; e.target.style.transform = "translateY(0)"; }}>
              How It Works
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.45}>
          <div className="trust-badges" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, marginTop: 48, flexWrap: "wrap" }}>
            {[
              { icon: "🛡️", text: "All Therapists RCI-Registered" },
              { icon: "🤖", text: "AI-Powered Matching" },
              { icon: "🔒", text: "DPDP Act Compliant" },
            ].map((badge, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>{badge.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{badge.text}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

const Stats = () => (
  <section style={{ background: "#fff", borderTop: `1px solid ${COLORS.sage}10`, borderBottom: `1px solid ${COLORS.sage}10` }}>
    <div className="stats-grid" style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, textAlign: "center" }}>
      {[
        { num: "50+", label: "RCI-Registered Therapists", icon: "👩‍⚕️" },
        { num: "15+", label: "Languages Supported", icon: "🗣️" },
        { num: "₹999", label: "Starting Per Session", icon: "💚" },
        { num: "4.9★", label: "Parent Rating", icon: "⭐" },
      ].map((s, i) => (
        <FadeIn key={i} delay={i * 0.1}>
          <div>
            <div style={{ fontSize: 13, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 800, color: COLORS.sageDark }}>{s.num}</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: COLORS.textLight, fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

const HowItWorks = () => (
  <section id="howitworks" style={{ background: COLORS.warmWhite, padding: "80px 0" }}>
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.coral, textTransform: "uppercase", letterSpacing: 2 }}>Simple Process</span>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 700, color: COLORS.charcoal, margin: "12px 0 0" }}>How It Works</h2>
        </div>
      </FadeIn>

      <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
        {[
          {
            step: "01",
            title: "AI Screening",
            desc: "Take our free 5-minute assessment. Our AI analyses your child's needs and recommends the right type of therapy and therapist specialization.",
            icon: "🧠",
            color: COLORS.sage,
            bg: COLORS.sageLight,
          },
          {
            step: "02",
            title: "Match & Book",
            desc: "Get matched with RCI-registered therapists who specialize in your child's specific needs. Choose your preferred language, time, and therapist.",
            icon: "🤝",
            color: COLORS.coral,
            bg: COLORS.coralLight,
          },
          {
            step: "03",
            title: "Heal & Grow",
            desc: "Attend sessions from home via secure video. Track progress through AI-powered reports. Watch your child thrive with consistent, expert support.",
            icon: "🌻",
            color: COLORS.gold,
            bg: COLORS.goldLight,
          },
        ].map((item, i) => (
          <FadeIn key={i} delay={i * 0.15}>
            <div style={{ background: "#fff", borderRadius: 20, padding: 32, position: "relative", border: "1px solid #f0eeeb", boxShadow: "0 4px 24px rgba(0,0,0,0.03)", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.03)"; }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 20 }}>{item.icon}</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 13, color: item.color, fontWeight: 700, marginBottom: 8 }}>Step {item.step}</div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: COLORS.charcoal, margin: "0 0 12px", fontWeight: 700 }}>{item.title}</h3>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, color: COLORS.textMuted, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const Services = () => (
  <section id="services" style={{ background: "#fff", padding: "80px 0" }}>
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.coral, textTransform: "uppercase", letterSpacing: 2 }}>Specializations</span>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 700, color: COLORS.charcoal, margin: "12px 0 0" }}>Expert Care For Every Need</h2>
        </div>
      </FadeIn>

      <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { icon: "🎯", title: "ADHD", desc: "Focus, impulse control & executive function support" },
          { icon: "🧩", title: "Autism Spectrum", desc: "Social skills, communication & sensory processing" },
          { icon: "😰", title: "Anxiety & Fears", desc: "Separation anxiety, phobias & worry management" },
          { icon: "📚", title: "Learning Disabilities", desc: "Dyslexia, dysgraphia & academic challenges" },
          { icon: "💔", title: "Trauma & Grief", desc: "Loss, abuse recovery & emotional healing" },
          { icon: "😤", title: "Behavioral Issues", desc: "Tantrums, ODD, aggression & defiance" },
          { icon: "👨‍👩‍👧", title: "Family Counselling", desc: "Divorce impact, sibling rivalry & parenting" },
          { icon: "🌙", title: "Sleep & Eating", desc: "Sleep disorders, eating concerns & routines" },
        ].map((s, i) => (
          <FadeIn key={i} delay={i * 0.07}>
            <div style={{ background: COLORS.cream, borderRadius: 16, padding: "24px 20px", border: `1px solid ${COLORS.sage}10`, transition: "all 0.25s", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.background = COLORS.sageLight; e.currentTarget.style.borderColor = `${COLORS.sage}30`; }}
              onMouseLeave={e => { e.currentTarget.style.background = COLORS.cream; e.currentTarget.style.borderColor = `${COLORS.sage}10`; }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
              <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: COLORS.charcoal, margin: "0 0 6px", fontWeight: 700 }}>{s.title}</h4>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, color: COLORS.textMuted, lineHeight: 1.55, margin: 0 }}>{s.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const AIScreening = ({ onOpenScreening }) => (
  <section id="screening" style={{ background: `linear-gradient(135deg, ${COLORS.sageDark} 0%, ${COLORS.sage} 50%, #1aada5 100%)`, padding: "80px 0", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)" }} />
    <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)" }} />
    <div style={{ position: "absolute", top: "50%", right: "10%", width: 6, height: 6, borderRadius: "50%", background: COLORS.coral, opacity: 0.6 }} />

    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative" }}>
      <FadeIn>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", padding: "8px 18px", borderRadius: 99, marginBottom: 24, backdropFilter: "blur(8px)" }}>
          <span style={{ fontSize: 14 }}>🤖</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI-Powered Assessment</span>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 800, color: "#fff", margin: "0 0 16px", lineHeight: 1.2 }}>
          "Is my child okay?"
        </h2>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: "0 auto 36px", maxWidth: 580 }}>
          Take our free 5-minute AI screening. Answer simple questions about your child's behaviour, emotions, and daily life. Get an instant, confidential report with personalized recommendations.
        </p>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="screening-features" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, marginBottom: 40, flexWrap: "wrap" }}>
          {["✓ 100% Free", "✓ 5 Minutes", "✓ Instant Report", "✓ Confidential"].map((t, i) => (
            <span key={i} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        <button onClick={onOpenScreening} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", color: COLORS.sageDark, padding: "18px 44px", borderRadius: 99, fontSize: 17, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: "0 4px 24px rgba(0,0,0,0.15)", transition: "all 0.25s", border: "none", cursor: "pointer" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 36px rgba(0,0,0,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.15)"; }}>
          Start Free Screening Now
        </button>
      </FadeIn>
    </div>
  </section>
);

const WhyUs = () => (
  <section id="about" style={{ background: COLORS.warmWhite, padding: "80px 0" }}>
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <FadeIn>
          <div>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.coral, textTransform: "uppercase", letterSpacing: 2 }}>Why Choose Us</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 34, fontWeight: 700, color: COLORS.charcoal, margin: "12px 0 20px", lineHeight: 1.25 }}>
              Built by someone who understands both AI and children
            </h2>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: COLORS.textMuted, lineHeight: 1.75, margin: "0 0 28px" }}>
              Our founder holds a PhD from IIT Kharagpur in AI/Speech Technology and a Post Graduate Diploma in Child Counselling. This rare combination means every AI feature on our platform is clinically informed, and every clinical decision is enhanced by cutting-edge technology.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: "🎓", title: "PhD in AI from IIT Kharagpur", desc: "Research in speech recognition and NLP ensures our AI tools are world-class" },
                { icon: "📋", title: "PG Diploma in Child Counselling", desc: "Clinical training ensures every tool is designed with therapeutic validity" },
                { icon: "🛡️", title: "Only RCI-Registered Therapists", desc: "Every therapist is verified with the Rehabilitation Council of India" },
                { icon: "🌐", title: "Multilingual AI Support", desc: "Therapy in Hindi, English, Tamil, Bengali, Telugu & 10+ more languages" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, border: "1px solid #f0eeeb", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, fontWeight: 700, color: COLORS.charcoal }}>{item.title}</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: COLORS.textMuted, marginTop: 2, lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{ background: `linear-gradient(145deg, ${COLORS.sageLight}, ${COLORS.coralLight})`, borderRadius: 24, padding: 36, position: "relative" }}>
            <div style={{ background: "#fff", borderRadius: 18, padding: 28, boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: COLORS.charcoal, marginBottom: 20 }}>What Parents Say</div>
              {[
                { text: "The AI screening identified exactly what my daughter was struggling with. The matched therapist has been life-changing for our family.", name: "Priya M.", city: "Delhi", rating: "⭐⭐⭐⭐⭐" },
                { text: "My son has ADHD and we struggled for months to find the right support. ChildTherapist matched us with a specialist within minutes.", name: "Rahul K.", city: "Mumbai", rating: "⭐⭐⭐⭐⭐" },
                { text: "Being able to do sessions in Hindi made such a difference for my 7-year-old. She finally opened up. Thank you!", name: "Sneha T.", city: "Jaipur", rating: "⭐⭐⭐⭐⭐" },
              ].map((t, i) => (
                <div key={i} style={{ padding: "16px 0", borderBottom: i < 2 ? "1px solid #f0eeeb" : "none" }}>
                  <div style={{ fontSize: 12, marginBottom: 6 }}>{t.rating}</div>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.65, margin: "0 0 8px", fontStyle: "italic" }}>"{t.text}"</p>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, fontWeight: 700, color: COLORS.sageDark }}>{t.name} <span style={{ fontWeight: 400, color: COLORS.textLight }}>— {t.city}</span></div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

const Pricing = () => {
  const [annual, setAnnual] = useState(false);
  return (
    <section id="pricing" style={{ background: "#fff", padding: "80px 0" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.coral, textTransform: "uppercase", letterSpacing: 2 }}>Pricing</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 700, color: COLORS.charcoal, margin: "12px 0 0" }}>Affordable Plans for Every Family</h2>
          </div>
        </FadeIn>

        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 960, margin: "0 auto" }}>
          {[
            {
              name: "Single Session",
              price: "₹999",
              period: "per session",
              desc: "Try us out — no commitment",
              features: ["50-minute video session", "RCI-registered therapist", "Post-session summary", "Basic progress notes"],
              cta: "Book a Session",
              featured: false,
            },
            {
              name: "Growth Plan",
              price: "₹3,499",
              period: "4 sessions/month",
              desc: "Most popular for lasting change",
              features: ["4 × 50-min sessions", "AI-matched therapist", "Weekly progress reports", "Chat support between sessions", "AI self-help tools", "Parent guidance sessions"],
              cta: "Start Growing",
              featured: true,
            },
            {
              name: "Family Plan",
              price: "₹5,999",
              period: "8 sessions/month",
              desc: "Complete family support",
              features: ["8 × 50-min sessions", "Multiple children covered", "Family counselling included", "Priority scheduling", "Detailed AI analytics", "School coordination reports"],
              cta: "Get Full Support",
              featured: false,
            },
          ].map((plan, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <div className={plan.featured ? "pricing-featured" : ""} style={{
                background: plan.featured ? `linear-gradient(145deg, ${COLORS.sageDark}, ${COLORS.sage})` : "#fff",
                borderRadius: 22, padding: 32, position: "relative",
                border: plan.featured ? "none" : "1px solid #f0eeeb",
                boxShadow: plan.featured ? `0 12px 48px ${COLORS.sage}30` : "0 4px 16px rgba(0,0,0,0.03)",
                transform: plan.featured ? "scale(1.04)" : "scale(1)",
                transition: "all 0.3s"
              }}>
                {plan.featured && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: COLORS.coral, color: "#fff", padding: "5px 16px", borderRadius: 99, fontSize: 12, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Most Popular</div>
                )}
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, color: plan.featured ? "rgba(255,255,255,0.8)" : COLORS.textLight, marginBottom: 4 }}>{plan.name}</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 800, color: plan.featured ? "#fff" : COLORS.charcoal, margin: "0 0 2px" }}>{plan.price}</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: plan.featured ? "rgba(255,255,255,0.6)" : COLORS.textLight, marginBottom: 8 }}>{plan.period}</div>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, color: plan.featured ? "rgba(255,255,255,0.75)" : COLORS.textMuted, margin: "0 0 24px", lineHeight: 1.5 }}>{plan.desc}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, fontFamily: "'Plus Jakarta Sans', sans-serif", color: plan.featured ? "rgba(255,255,255,0.9)" : COLORS.textMuted }}>
                      <span style={{ color: plan.featured ? "#86efac" : COLORS.sage, fontSize: 14 }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>

                <a href="#" style={{
                  textDecoration: "none", display: "block", textAlign: "center", padding: "14px 24px", borderRadius: 99,
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, transition: "all 0.2s",
                  background: plan.featured ? "#fff" : COLORS.sage,
                  color: plan.featured ? COLORS.sageDark : "#fff",
                  boxShadow: plan.featured ? "0 4px 16px rgba(0,0,0,0.1)" : `0 4px 16px ${COLORS.sage}30`,
                }}>{plan.cta}</a>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "How do I know if my child needs therapy?", a: "Signs include persistent sadness, sudden behavioral changes, academic decline, social withdrawal, excessive worry, sleep problems, or difficulty managing emotions. Our free AI screening can help you assess your child's needs in just 5 minutes." },
    { q: "Are all your therapists really RCI-registered?", a: "Yes, 100%. Every therapist on our platform has been verified against the RCI (Rehabilitation Council of India) registry. We check credentials before onboarding and periodically re-verify. You can view each therapist's RCI registration number on their profile." },
    { q: "How does the AI matching work?", a: "Our AI analyses your child's needs from the screening assessment — including concerns, age, personality indicators, and preferences (language, gender, timing) — and matches them with the most suitable therapist from our panel. It considers the therapist's specialization, experience, and patient outcomes." },
    { q: "Is online therapy effective for children?", a: "Research shows online therapy is as effective as in-person therapy for most childhood concerns. Children often feel more comfortable in their home environment, leading to better engagement. Our platform adds AI-powered progress tracking to ensure measurable outcomes." },
    { q: "Is my child's data safe?", a: "Absolutely. We are fully compliant with India's DPDP Act 2023. All session data is encrypted, we require explicit parental consent for minors, and we never share personal data with third parties. Video sessions are not recorded unless you explicitly consent for quality improvement." },
    { q: "What age group do you serve?", a: "We work with children and adolescents aged 3 to 17. Our therapists specialize in age-appropriate approaches — play therapy for younger children, CBT and talk therapy for older children and teens." },
  ];
  return (
    <section style={{ background: COLORS.cream, padding: "80px 0" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.coral, textTransform: "uppercase", letterSpacing: 2 }}>FAQ</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 700, color: COLORS.charcoal, margin: "12px 0 0" }}>Common Questions</h2>
          </div>
        </FadeIn>

        {faqs.map((faq, i) => (
          <FadeIn key={i} delay={i * 0.06}>
            <div style={{ marginBottom: 12 }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: "100%", textAlign: "left", padding: "20px 24px", background: "#fff", border: `1px solid ${open === i ? COLORS.sage + "40" : "#f0eeeb"}`, borderRadius: open === i ? "16px 16px 0 0" : 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s" }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 600, color: COLORS.charcoal }}>{faq.q}</span>
                <span style={{ fontSize: 18, color: COLORS.sage, transform: open === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.25s", flexShrink: 0, marginLeft: 12 }}>+</span>
              </button>
              {open === i && (
                <div style={{ background: "#fff", padding: "0 24px 20px", borderRadius: "0 0 16px 16px", border: `1px solid ${COLORS.sage}40`, borderTop: "none" }}>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

const CTA = ({ onOpenScreening }) => (
  <section style={{ background: `linear-gradient(135deg, ${COLORS.charcoal} 0%, #0f1d35 100%)`, padding: "80px 0", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, height: 500, borderRadius: "50%", background: `${COLORS.sage}08`, filter: "blur(80px)" }} />
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative" }}>
      <FadeIn>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 800, color: "#fff", margin: "0 0 16px", lineHeight: 1.25 }}>
          Your child's wellbeing<br />can't wait
        </h2>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 36px" }}>
          Take the first step today. Our free AI screening takes just 5 minutes and can change everything.
        </p>
        <button onClick={onOpenScreening} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: `linear-gradient(135deg, ${COLORS.coral}, #d46a4f)`, color: "#fff", padding: "18px 44px", borderRadius: 99, fontSize: 17, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: `0 4px 24px ${COLORS.coral}40`, transition: "all 0.25s", border: "none", cursor: "pointer" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}>
          Take Free Screening →
        </button>
        <div style={{ marginTop: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Or call us: </span>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>+91 98XX XXX XXX</span>
        </div>
      </FadeIn>
    </div>
  </section>
);

const Footer = () => (
  <footer style={{ background: COLORS.charcoal, padding: "48px 0 28px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
      <div className="grid-footer" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${COLORS.sage}, ${COLORS.coral})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌱</div>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "#fff" }}>childtherapist.in</span>
          </div>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 280 }}>
            India's first AI-powered child therapy platform. Connecting families with RCI-registered therapists for compassionate, expert mental health care.
          </p>
        </div>
        {[
          { title: "Platform", links: ["How It Works", "Our Therapists", "AI Screening", "Pricing", "For Schools"] },
          { title: "Support", links: ["Help Center", "Contact Us", "Book a Session", "Therapist Sign-up", "Careers"] },
          { title: "Legal", links: ["Privacy Policy", "Terms of Service", "DPDP Compliance", "Refund Policy", "Cookie Policy"] },
        ].map((col, i) => (
          <div key={i}>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>{col.title}</div>
            {col.links.map((link, j) => (
              <a key={j} href="#" style={{ display: "block", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none", marginBottom: 10, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.8)"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}>{link}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-bottom" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>© 2026 ChildTherapist.in. All rights reserved. Startup India Recognized.</span>
        <div style={{ display: "flex", gap: 16 }}>
          {["Instagram", "LinkedIn", "YouTube", "WhatsApp"].map((s, i) => (
            <a key={i} href="#" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.8)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}>{s}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  const [screeningOpen, setScreeningOpen] = useState(false);
  const openScreening = () => setScreeningOpen(true);
  const closeScreening = () => setScreeningOpen(false);

  return (
    <div>
      <Nav onOpenScreening={openScreening} />
      <Hero onOpenScreening={openScreening} />
      <Stats />
      <HowItWorks />
      <Services />
      <AIScreening onOpenScreening={openScreening} />
      <WhyUs />
      <Pricing />
      <FAQ />
      <CTA onOpenScreening={openScreening} />
      <Footer />
      {screeningOpen && <ScreeningForm onClose={closeScreening} />}
    </div>
  );
}
