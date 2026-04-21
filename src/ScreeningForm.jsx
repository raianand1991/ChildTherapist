import { useState } from "react";
import emailjs from "@emailjs/browser";

// ─── EmailJS Config ───────────────────────────────────────────────────────────
// 1. Sign up free at https://www.emailjs.com
// 2. Create an Email Service (Gmail, Outlook, etc.)
// 3. Create an Email Template with these variables:
//    {{to_name}}, {{child_name}}, {{concern_level}}, {{score}}, {{max_score}},
//    {{heading}}, {{description}}, {{recommendations}}, {{answer_summary}}
// 4. Copy your Service ID, Template ID and Public Key below
export const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
export const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
export const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

const COLORS = {
  sage: "#5a7d6a",
  sageDark: "#3d5a4a",
  sageLight: "#e8f0eb",
  coral: "#e07a5f",
  coralLight: "#fdf0ec",
  cream: "#faf8f5",
  warmWhite: "#fffdfb",
  charcoal: "#2d3436",
  textMuted: "#6b7b7d",
  textLight: "#8a9a9c",
  gold: "#d4a853",
  goldLight: "#fdf6e8",
};

const QUESTIONS = [
  {
    id: 1,
    icon: "👶",
    question: "How old is your child?",
    subtext: "This helps us tailor the assessment to your child's developmental stage.",
    options: [
      { label: "2–4 years", sub: "Toddler / Early preschool", value: "2-4", score: 0 },
      { label: "5–8 years", sub: "Early childhood / Primary school", value: "5-8", score: 0 },
      { label: "9–12 years", sub: "Pre-teen / Middle school", value: "9-12", score: 0 },
      { label: "13–17 years", sub: "Teenager / Secondary school", value: "13-17", score: 0 },
    ],
  },
  {
    id: 2,
    icon: "💭",
    question: "What is your primary concern about your child?",
    subtext: "Choose the one that worries you most. We'll explore it further.",
    options: [
      { label: "ADHD / Attention & Focus", sub: "Hyperactivity, distractibility, impulsivity", value: "adhd", score: 2 },
      { label: "Anxiety or excessive worry", sub: "Nervousness, panic, separation anxiety", value: "anxiety", score: 2 },
      { label: "Autism Spectrum / Social difficulties", sub: "Communication, sensory, social skills", value: "autism", score: 2 },
      { label: "Behavioural issues / Aggression", sub: "Defiance, tantrums, anger outbursts", value: "behavioral", score: 2 },
      { label: "Learning disabilities / Academic struggles", sub: "Dyslexia, reading, writing, maths", value: "learning", score: 1 },
      { label: "Sadness / Depression", sub: "Low mood, loss of interest, hopelessness", value: "depression", score: 3 },
      { label: "Trauma or grief", sub: "Loss, abuse, major life changes", value: "trauma", score: 3 },
      { label: "Other / Not sure yet", sub: "General wellbeing or unclear concerns", value: "other", score: 1 },
    ],
  },
  {
    id: 3,
    icon: "🕐",
    question: "How long have you been noticing these concerns?",
    subtext: "Duration helps us understand whether this is emerging or established.",
    options: [
      { label: "Less than 1 month", sub: "Recently noticed, possibly situational", value: "lt1m", score: 1 },
      { label: "1 to 6 months", sub: "Ongoing for a few months", value: "1-6m", score: 2 },
      { label: "6 to 12 months", sub: "Present for most of this year", value: "6-12m", score: 3 },
      { label: "More than 1 year", sub: "A long-standing pattern", value: "gt1y", score: 4 },
    ],
  },
  {
    id: 4,
    icon: "📚",
    question: "How is your child performing academically?",
    subtext: "Academic performance often reflects a child's overall wellbeing.",
    options: [
      { label: "Excellent", sub: "Thriving, consistently high performance", value: "excellent", score: 0 },
      { label: "Good", sub: "Meeting expectations most of the time", value: "good", score: 1 },
      { label: "Average", sub: "Some inconsistencies or occasional dips", value: "average", score: 2 },
      { label: "Below average", sub: "Frequently struggling to keep up", value: "below", score: 3 },
      { label: "Very poor", sub: "Significant ongoing academic challenges", value: "poor", score: 4 },
    ],
  },
  {
    id: 5,
    icon: "👫",
    question: "How does your child interact with peers and friends?",
    subtext: "Social functioning is a key indicator of emotional health.",
    options: [
      { label: "Very well", sub: "Has many friends, socially confident", value: "verywell", score: 0 },
      { label: "Mostly well", sub: "A few close friends, generally comfortable", value: "mostly", score: 1 },
      { label: "Some difficulties", sub: "Occasional conflicts or social anxiety", value: "some", score: 2 },
      { label: "Significant difficulties", sub: "Often isolated, few or no friends", value: "significant", score: 4 },
    ],
  },
  {
    id: 6,
    icon: "🌙",
    question: "Does your child experience sleep disturbances?",
    subtext: "Sleep issues are strongly linked to emotional and mental health.",
    options: [
      { label: "Never", sub: "Sleeps soundly and consistently", value: "never", score: 0 },
      { label: "Rarely", sub: "Occasional restless nights", value: "rarely", score: 1 },
      { label: "Sometimes", sub: "Trouble sleeping a few times a week", value: "sometimes", score: 2 },
      { label: "Often", sub: "Sleep issues most nights", value: "often", score: 3 },
      { label: "Always", sub: "Sleep is a persistent major problem", value: "always", score: 4 },
    ],
  },
  {
    id: 7,
    icon: "😤",
    question: "How often does your child have emotional outbursts or meltdowns?",
    subtext: "Emotional regulation difficulties are a core therapeutic concern.",
    options: [
      { label: "Never or very rarely", sub: "Generally emotionally regulated", value: "never", score: 0 },
      { label: "About once a week", sub: "Manageable but noticeable", value: "weekly", score: 1 },
      { label: "A few times a week", sub: "Becoming a regular pattern", value: "few_week", score: 2 },
      { label: "Daily", sub: "Outbursts are part of most days", value: "daily", score: 3 },
      { label: "Multiple times a day", sub: "Severely impacting daily life", value: "multiple", score: 4 },
    ],
  },
  {
    id: 8,
    icon: "🎨",
    question: "Has your child withdrawn from activities they previously enjoyed?",
    subtext: "Loss of interest is an important indicator of emotional distress.",
    options: [
      { label: "Not at all", sub: "Still engaged and enthusiastic", value: "no", score: 0 },
      { label: "Occasionally", sub: "Some reduction in enthusiasm", value: "occasionally", score: 1 },
      { label: "Frequently", sub: "Noticeably less engaged in hobbies", value: "frequently", score: 3 },
      { label: "Almost completely", sub: "Largely withdrawn from all interests", value: "withdrawn", score: 4 },
    ],
  },
  {
    id: 9,
    icon: "🩺",
    question: "Has your child received any therapy or professional support before?",
    subtext: "This helps us understand your starting point and history.",
    options: [
      { label: "Yes – currently in therapy", sub: "Ongoing professional support in place", value: "current", score: 0 },
      { label: "Yes – in the past, not now", sub: "Previously had therapy or counselling", value: "past", score: 1 },
      { label: "No – this is our first step", sub: "Exploring options for the first time", value: "never", score: 2 },
    ],
  },
  {
    id: 10,
    icon: "⏰",
    question: "How urgently do you feel your child needs professional support?",
    subtext: "Your gut feeling matters. We want to understand your sense of urgency.",
    options: [
      { label: "Immediately", sub: "This is urgent – we need help now", value: "immediately", score: 4 },
      { label: "Within the next month", sub: "Fairly soon – things are building up", value: "month", score: 3 },
      { label: "Within the next 3 months", sub: "Moderately urgent – planning ahead", value: "quarter", score: 2 },
      { label: "Just exploring for now", sub: "No immediate urgency, gathering information", value: "exploring", score: 1 },
    ],
  },
];

const MAX_SCORE = 29;

function getResult(score) {
  if (score <= 10) {
    return {
      level: "Low Concern",
      color: "#16a34a",
      bgColor: "#f0fdf4",
      borderColor: "#bbf7d0",
      icon: "🌱",
      heading: "Your child appears to be coping well",
      description:
        "Based on your responses, your child shows minimal signs of significant distress. While no immediate intervention appears necessary, remaining attentive to their emotional health is always a good idea.",
      recommendations: [
        "Keep communication open and check in regularly",
        "Monitor for any changes in mood or behaviour over time",
        "Explore our free AI self-help tools for daily emotional support",
        "A single consultation session can provide useful peace of mind",
      ],
      cta: "Explore Self-Help Tools",
      ctaLink: "#services",
    };
  } else if (score <= 20) {
    return {
      level: "Moderate Concern",
      color: "#d97706",
      bgColor: "#fffbeb",
      borderColor: "#fde68a",
      icon: "🌻",
      heading: "Your child may benefit from professional support",
      description:
        "Your responses indicate some areas of concern that would benefit from professional attention. Early intervention significantly improves outcomes — you are doing the right thing by taking this step.",
      recommendations: [
        "A course of therapy is recommended for your child",
        "Our AI will match you with the right specialist",
        "Growth Plan (4 sessions/month) is well suited to this level",
        "Parent guidance sessions can complement your child's therapy",
      ],
      cta: "Get Matched with a Therapist",
      ctaLink: "#pricing",
    };
  } else {
    return {
      level: "High Concern",
      color: "#e07a5f",
      bgColor: "#fdf0ec",
      borderColor: "#f9c4b6",
      icon: "🤝",
      heading: "Professional support is strongly recommended",
      description:
        "Your responses suggest significant concerns that need prompt professional attention. Please know that seeking help is a sign of strength — and it can make a life-changing difference for your child.",
      recommendations: [
        "We strongly recommend beginning therapy as soon as possible",
        "Our therapists specialise in exactly the concerns you've described",
        "Family Plan provides the comprehensive, ongoing support needed",
        "Your therapist will guide every next step in your first session",
      ],
      cta: "Start Therapy This Week",
      ctaLink: "#pricing",
    };
  }
}

function ProgressBar({ current, total }) {
  const pct = Math.round(((current + 1) / (total + 2)) * 100);
  return (
    <div style={{ width: "100%", marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 600, color: COLORS.textLight }}>
          Question {Math.min(current + 1, total)} of {total}
        </span>
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 600, color: COLORS.sage }}>
          {pct}% complete
        </span>
      </div>
      <div style={{ height: 6, background: COLORS.sageLight, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${COLORS.sage}, ${COLORS.sageDark})`, borderRadius: 99, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

function OptionButton({ option, selected, onClick }) {
  return (
    <button
      onClick={() => onClick(option)}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "14px 18px",
        borderRadius: 12,
        border: `2px solid ${selected ? COLORS.sage : "#e8e8e8"}`,
        background: selected ? COLORS.sageLight : "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 14,
        transition: "all 0.18s",
        marginBottom: 10,
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = `${COLORS.sage}60`; e.currentTarget.style.background = `${COLORS.sageLight}80`; } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.background = "#fff"; } }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selected ? COLORS.sage : "#ccc"}`,
        background: selected ? COLORS.sage : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.18s"
      }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
      </div>
      <div>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, fontWeight: 600, color: selected ? COLORS.sageDark : COLORS.charcoal }}>
          {option.label}
        </div>
        {option.sub && (
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, color: COLORS.textLight, marginTop: 2 }}>
            {option.sub}
          </div>
        )}
      </div>
    </button>
  );
}

export default function ScreeningForm({ onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [contact, setContact] = useState({ parentName: "", childName: "", email: "" });
  const [emailError, setEmailError] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const totalQuestions = QUESTIONS.length;
  const isContactStep = step === totalQuestions;
  const isResultStep = step === totalQuestions + 1;

  function goNext() {
    const saved = { ...answers, [step]: selectedOption };
    setAnswers(saved);
    setStep(s => s + 1);
    setSelectedOption(answers[step + 1] || null);
  }

  function goBack() {
    setStep(s => s - 1);
    setSelectedOption(answers[step - 1] || null);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubmit() {
    if (!contact.parentName.trim()) { setEmailError("Please enter your name."); return; }
    if (!validateEmail(contact.email)) { setEmailError("Please enter a valid email address."); return; }
    setEmailError("");
    setSending(true);

    const allAnswers = { ...answers };
    const totalScore = Object.values(allAnswers).reduce((sum, ans) => sum + (ans?.score || 0), 0);
    const res = getResult(totalScore);
    setResult(res);

    const answerSummary = QUESTIONS.map((q, i) =>
      `Q${i + 1}: ${q.question}\n→ ${allAnswers[i]?.label || "Not answered"}`
    ).join("\n\n");

    const templateParams = {
      to_name: contact.parentName.trim(),
      to_email: contact.email.trim(),
      child_name: contact.childName.trim() || "your child",
      concern_level: res.level,
      score: totalScore,
      max_score: MAX_SCORE,
      heading: res.heading,
      description: res.description,
      recommendations: res.recommendations.map(r => `• ${r}`).join("\n"),
      answer_summary: answerSummary,
      reply_to: contact.email.trim(),
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
    } catch (err) {
      console.error("EmailJS send error:", err);
    } finally {
      setSending(false);
      setStep(totalQuestions + 1);
    }
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 600, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.18)", position: "relative", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ padding: "24px 28px 0", borderBottom: isResultStep ? "none" : `1px solid #f0eeeb`, paddingBottom: isResultStep ? 0 : 20, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isResultStep ? 0 : 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.sage}, ${COLORS.coral})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌱</div>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 700, color: COLORS.sageDark }}>
                childtherapist<span style={{ color: COLORS.coral }}>.in</span>
              </span>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: COLORS.textLight, lineHeight: 1, padding: 4 }}>×</button>
          </div>
          {!isResultStep && (
            <ProgressBar current={isContactStep ? totalQuestions : step} total={totalQuestions} />
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "28px 28px 24px", flex: 1 }}>

          {/* ── Question Step ── */}
          {!isContactStep && !isResultStep && (() => {
            const q = QUESTIONS[step];
            return (
              <div key={step}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{q.icon}</div>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: COLORS.charcoal, margin: "0 0 6px", lineHeight: 1.3 }}>
                  {q.question}
                </h2>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, color: COLORS.textMuted, margin: "0 0 24px", lineHeight: 1.6 }}>
                  {q.subtext}
                </p>
                <div>
                  {q.options.map((opt) => (
                    <OptionButton
                      key={opt.value}
                      option={opt}
                      selected={selectedOption?.value === opt.value}
                      onClick={setSelectedOption}
                    />
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ── Contact/Email Step ── */}
          {isContactStep && !isResultStep && (
            <div>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📧</div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: COLORS.charcoal, margin: "0 0 6px" }}>
                Where should we send your report?
              </h2>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, color: COLORS.textMuted, margin: "0 0 24px", lineHeight: 1.6 }}>
                Your personalised screening report will be emailed to you instantly. All information is strictly confidential.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { key: "parentName", label: "Your name (parent / guardian)", placeholder: "e.g. Priya Sharma", required: true },
                  { key: "childName", label: "Child's first name (optional)", placeholder: "e.g. Arjun" },
                  { key: "email", label: "Email address", placeholder: "e.g. priya@example.com", type: "email", required: true },
                ].map(({ key, label, placeholder, type, required }) => (
                  <div key={key}>
                    <label style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600, color: COLORS.charcoal, display: "block", marginBottom: 6 }}>
                      {label} {required && <span style={{ color: COLORS.coral }}>*</span>}
                    </label>
                    <input
                      type={type || "text"}
                      value={contact[key]}
                      placeholder={placeholder}
                      onChange={e => { setContact(c => ({ ...c, [key]: e.target.value })); setEmailError(""); }}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${emailError && (key === "parentName" || key === "email") ? COLORS.coral : "#e0e0e0"}`, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: COLORS.charcoal, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                      onFocus={e => e.target.style.borderColor = COLORS.sage}
                      onBlur={e => e.target.style.borderColor = "#e0e0e0"}
                    />
                  </div>
                ))}
                {emailError && (
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: COLORS.coral, margin: 0 }}>
                    ⚠ {emailError}
                  </p>
                )}
              </div>

              <div style={{ marginTop: 20, padding: "14px 16px", background: COLORS.sageLight, borderRadius: 12, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>🔒</span>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, color: COLORS.sage, margin: 0, lineHeight: 1.6 }}>
                  Your data is protected under India's DPDP Act. We will never share your information with third parties or use it for marketing without consent.
                </p>
              </div>
            </div>
          )}

          {/* ── Result Step ── */}
          {isResultStep && result && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: result.bgColor, border: `2px solid ${result.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto 20px" }}>
                {result.icon}
              </div>

              <div style={{ display: "inline-block", background: result.bgColor, border: `1px solid ${result.borderColor}`, borderRadius: 99, padding: "5px 16px", marginBottom: 14 }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, fontWeight: 700, color: result.color }}>
                  {result.level}
                </span>
              </div>

              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: COLORS.charcoal, margin: "0 0 12px", lineHeight: 1.3 }}>
                {result.heading}
              </h2>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7, margin: "0 0 24px" }}>
                {result.description}
              </p>

              <div style={{ background: COLORS.cream, borderRadius: 14, padding: "20px 22px", textAlign: "left", marginBottom: 24 }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.sageDark, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>
                  Our Recommendations
                </div>
                {result.recommendations.map((rec, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                    <span style={{ color: COLORS.sage, fontSize: 14, marginTop: 1, flexShrink: 0 }}>✓</span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, color: COLORS.charcoal, lineHeight: 1.55 }}>{rec}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: COLORS.textLight, margin: "0 0 20px" }}>
                📩 A detailed report has been sent to your email.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a
                  href={result.ctaLink}
                  onClick={onClose}
                  style={{ textDecoration: "none", background: `linear-gradient(135deg, ${COLORS.sage}, ${COLORS.sageDark})`, color: "#fff", padding: "15px 24px", borderRadius: 99, fontSize: 15, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: "center", boxShadow: `0 4px 20px ${COLORS.sage}40` }}
                >
                  {result.cta} →
                </a>
                <button
                  onClick={onClose}
                  style={{ background: "none", border: `1.5px solid #e0e0e0`, color: COLORS.textMuted, padding: "13px 24px", borderRadius: 99, fontSize: 14, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: "pointer" }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Nav */}
        {!isResultStep && (
          <div style={{ padding: "0 28px 24px", display: "flex", gap: 12, flexShrink: 0 }}>
            {(step > 0) && (
              <button
                onClick={goBack}
                style={{ flex: 1, padding: "14px", borderRadius: 99, border: `1.5px solid #e0e0e0`, background: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 600, color: COLORS.textMuted, cursor: "pointer", transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.sage; e.currentTarget.style.color = COLORS.sage; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.color = COLORS.textMuted; }}
              >
                ← Back
              </button>
            )}
            {!isContactStep && (
              <button
                onClick={goNext}
                disabled={!selectedOption}
                style={{ flex: 2, padding: "14px", borderRadius: 99, border: "none", background: selectedOption ? `linear-gradient(135deg, ${COLORS.sage}, ${COLORS.sageDark})` : "#e8e8e8", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: selectedOption ? "#fff" : COLORS.textLight, cursor: selectedOption ? "pointer" : "not-allowed", transition: "all 0.18s", boxShadow: selectedOption ? `0 4px 16px ${COLORS.sage}40` : "none" }}
              >
                {step === totalQuestions - 1 ? "Continue →" : "Next →"}
              </button>
            )}
            {isContactStep && (
              <button
                onClick={handleSubmit}
                disabled={sending}
                style={{ flex: 2, padding: "14px", borderRadius: 99, border: "none", background: `linear-gradient(135deg, ${COLORS.sage}, ${COLORS.sageDark})`, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", cursor: sending ? "wait" : "pointer", boxShadow: `0 4px 16px ${COLORS.sage}40` }}
              >
                {sending ? "Sending report…" : "Get My Report →"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
