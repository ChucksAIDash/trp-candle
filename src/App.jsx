import { useState, useCallback } from "react";

const C = {
  bg: "#0c0b09",
  surface: "#131210",
  border: "#2a2520",
  accent: "#e85d04",
  accentDim: "#7a3002",
  text: "#c8bfb0",
  dim: "#6b6258",
  green: "#7fba00",
  blue: "#4a9eff",
  red: "#ff4444",
};

const SCENT_NOTES = {
  base: [
    { id: "bourbon", name: "Bourbon", desc: "Warm, sweet, smoky depth" },
    { id: "vanilla", name: "Vanilla", desc: "Sweet, creamy, universal anchor" },
    { id: "sandalwood", name: "Sandalwood", desc: "Smooth, woody, long-lasting" },
    { id: "amber", name: "Amber", desc: "Rich, resinous, sensual" },
    { id: "musk", name: "Musk", desc: "Soft, clean, lingering" },
    { id: "vetiver", name: "Vetiver", desc: "Earthy, smoky, masculine" },
    { id: "patchouli", name: "Patchouli", desc: "Deep, earthy, complex" },
  ],
  middle: [
    { id: "clove", name: "Clove", desc: "Spicy punch, fall signature" },
    { id: "cinnamon", name: "Cinnamon", desc: "Warm spice, familiar comfort" },
    { id: "cedarwood", name: "Cedarwood", desc: "Clean wood, masculine heart" },
    { id: "leather", name: "Leather", desc: "Rich, rugged, distinctive" },
    { id: "tobacco", name: "Tobacco", desc: "Warm, dry, sophisticated" },
    { id: "oak", name: "Oak", desc: "Woody, sturdy, aged" },
    { id: "lavender", name: "Lavender", desc: "Herbal, calming, versatile" },
  ],
  top: [
    { id: "apple", name: "Apple", desc: "Fresh, bright, harvest feel" },
    { id: "orange_peel", name: "Orange Peel", desc: "Citrus burst, lifts blends" },
    { id: "pine", name: "Pine", desc: "Sharp, clean, forest fresh" },
    { id: "black_pepper", name: "Black Pepper", desc: "Spicy, sharp, modern edge" },
    { id: "eucalyptus", name: "Eucalyptus", desc: "Cool, clean, opens sinuses" },
    { id: "bergamot", name: "Bergamot", desc: "Floral citrus, tea-like" },
    { id: "sea_salt", name: "Sea Salt", desc: "Clean, airy, open spaces" },
  ],
};

const TRP_BLENDS = [
  {
    id: "what_remains",
    name: "What Remains",
    tagline: "Bourbon. Oak. Clove.",
    season: "FALL",
    color: "#8B3A1A",
    colorName: "Burnt Orange / Rust",
    notes: { bourbon: 40, cedarwood: 40, clove: 20 },
    card: "Everything's gone. The hustle quiets. What's left is what was real.",
  },
  {
    id: "first_shift",
    name: "First Shift",
    tagline: "Coffee. Cedar. Black Pepper.",
    season: "YEAR-ROUND",
    color: "#2c1a0e",
    colorName: "Espresso Brown",
    notes: { cedarwood: 40, black_pepper: 30, vetiver: 30 },
    card: "For the ones who start before the world wakes up.",
  },
  {
    id: "controlled_burn",
    name: "Controlled Burn",
    tagline: "Sandalwood. Tobacco. Citrus.",
    season: "FALL / WINTER",
    color: "#1a0a0a",
    colorName: "Deep Black",
    notes: { sandalwood: 40, tobacco: 40, orange_peel: 20 },
    card: "No half-measures.",
  },
  {
    id: "dark_before_dawn",
    name: "Dark Before Dawn",
    tagline: "Pine. Vetiver. Black Pepper.",
    season: "WINTER",
    color: "#0d1a0d",
    colorName: "Forest / Deep Green",
    notes: { pine: 40, vetiver: 30, black_pepper: 30 },
    card: "The work that nobody sees is the work that matters most.",
  },
  {
    id: "the_reckoning",
    name: "The Reckoning",
    tagline: "Apple. Oak. Clove.",
    season: "FALL",
    color: "#4a1a2a",
    colorName: "Burgundy",
    notes: { apple: 30, oak: 40, clove: 30 },
    card: "Did you do what you said you would?",
  },
];

const POUR_STEPS = [
  { step: 1, title: "Weigh Your Wax", icon: "⚖️", detail: "Always measure by weight, not volume. Solid wax = same weight melted." },
  { step: 2, title: "Melt to 185°F", icon: "🌡️", detail: "Use a double boiler or crockpot. Don't exceed 200°F — soy scorches." },
  { step: 3, title: "Add Dye Blocks", icon: "🎨", detail: "Drop dye in at 185°F. Stir until fully dissolved. Test color on white paper — it dries lighter." },
  { step: 4, title: "Add Fragrance at 185°F", icon: "🫙", detail: "Pour your measured fragrance oil in. Stir slowly for 2 full minutes. Don't rush this." },
  { step: 5, title: "Cool to Pour Temp", icon: "❄️", detail: "Let wax cool to 135–150°F before pouring. Too hot = sinkholes. Too cool = uneven surface." },
  { step: 6, title: "Pour Slowly", icon: "🕯️", detail: "Pour in a slow, steady stream down the center. Leave ¼ inch from the top." },
  { step: 7, title: "Cure 1–2 Weeks", icon: "📅", detail: "Don't burn yet. Fragrance bonds with wax over time. Patience = stronger scent throw." },
];

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none",
      borderBottom: `2px solid ${active ? C.accent : "transparent"}`,
      color: active ? C.accent : C.dim,
      padding: "10px 16px", fontSize: 10, letterSpacing: "0.18em",
      textTransform: "uppercase", cursor: "pointer",
      fontFamily: "'Courier New', monospace", transition: "all 0.2s",
    }}>{label}</button>
  );
}

function Label({ children, color }) {
  return (
    <div style={{ fontSize: 9, letterSpacing: "0.2em", color: color || C.dim, textTransform: "uppercase", marginBottom: 8 }}>
      {children}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "20px", ...style }}>
      {children}
    </div>
  );
}

// ── CALCULATOR TAB ──────────────────────────────────────────────────────────
function Calculator() {
  const [candles, setCandles] = useState(4);
  const [ozPerCandle, setOzPerCandle] = useState(10);
  const [load, setLoad] = useState(8);

  const totalOz = candles * ozPerCandle;
  const totalLbs = (totalOz / 16).toFixed(2);
  const fragOz = ((totalOz * load) / 100).toFixed(1);
  const waxOz = (totalOz - fragOz).toFixed(1);

  const blendFragOz = (pct) => ((fragOz * pct) / 100).toFixed(1);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <Label color={C.accent}>Batch Size</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { label: "# of Candles", val: candles, set: setCandles, min: 1, max: 50 },
            { label: "Oz per Candle", val: ozPerCandle, set: setOzPerCandle, min: 2, max: 32 },
            { label: "Fragrance Load %", val: load, set: setLoad, min: 6, max: 10 },
          ].map(({ label, val, set, min, max }) => (
            <div key={label}>
              <Label>{label}</Label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => set(Math.max(min, val - 1))} style={btnStyle}>−</button>
                <span style={{ color: C.accent, fontSize: 22, fontFamily: "'Courier New', monospace", minWidth: 36, textAlign: "center" }}>{val}</span>
                <button onClick={() => set(Math.min(max, val + 1))} style={btnStyle}>+</button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
        {[
          { label: "Total Volume", val: `${totalOz} oz`, sub: `${totalLbs} lbs` },
          { label: "Wax Needed", val: `${waxOz} oz`, sub: "by weight" },
          { label: "Fragrance Oil", val: `${fragOz} oz`, sub: `at ${load}% load` },
          { label: "Dye Needed", val: "~trace", sub: "0.02–0.06 oz/lb" },
        ].map(({ label, val, sub }) => (
          <Card key={label} style={{ textAlign: "center" }}>
            <Label>{label}</Label>
            <div style={{ fontSize: 24, color: C.accent, fontFamily: "'Courier New', monospace" }}>{val}</div>
            <div style={{ fontSize: 10, color: C.dim, marginTop: 4 }}>{sub}</div>
          </Card>
        ))}
      </div>

      <Card>
        <Label color={C.blue}>If Blending Two Scents (What Remains style)</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "Base Note (40%)", pct: 40 },
            { label: "Middle Note (40%)", pct: 40 },
            { label: "Top Note (20%)", pct: 20 },
          ].map(({ label, pct }) => (
            <div key={label} style={{ background: C.bg, padding: 12, border: `1px solid ${C.border}` }}>
              <Label>{label}</Label>
              <div style={{ fontSize: 20, color: C.text, fontFamily: "'Courier New', monospace" }}>{blendFragOz(pct)} oz</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 10, color: C.dim, lineHeight: 1.7 }}>
          Standard starting ratio: 40% base / 40% middle / 20% top. Adjust after first test burn.
        </div>
      </Card>
    </div>
  );
}

const btnStyle = {
  background: "#1a1714", border: `1px solid #333`, color: "#888",
  width: 28, height: 28, cursor: "pointer", fontSize: 14,
  fontFamily: "'Courier New', monospace",
};

// ── SCENT BUILDER TAB ───────────────────────────────────────────────────────
function ScentBuilder() {
  const [selected, setSelected] = useState({ base: null, middle: null, top: null });
  const [ratios, setRatios] = useState({ base: 40, middle: 40, top: 20 });
  const [activeBlend, setActiveBlend] = useState(null);

  const toggle = (tier, id) => {
    setSelected(prev => ({ ...prev, [tier]: prev[tier] === id ? null : id }));
    setActiveBlend(null);
  };

  const loadBlend = (blend) => {
    setActiveBlend(blend.id);
    const entries = Object.entries(blend.notes);
    const tiers = { base: null, middle: null, top: null };
    const r = { base: 0, middle: 0, top: 0 };
    entries.forEach(([noteId, pct]) => {
      if (SCENT_NOTES.base.find(n => n.id === noteId)) { tiers.base = noteId; r.base = pct; }
      else if (SCENT_NOTES.middle.find(n => n.id === noteId)) { tiers.middle = noteId; r.middle = pct; }
      else if (SCENT_NOTES.top.find(n => n.id === noteId)) { tiers.top = noteId; r.top = pct; }
    });
    setSelected(tiers);
    setRatios(r);
  };

  const tierColors = { base: "#e85d04", middle: "#4a9eff", top: "#7fba00" };
  const tierLabels = { base: "Base Note — Anchor (lingers longest)", middle: "Middle Note — Body (main character)", top: "Top Note — First impression (fades first)" };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <Label color={C.accent}>TRP Signature Blends</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {TRP_BLENDS.map(blend => (
            <button key={blend.id} onClick={() => loadBlend(blend)} style={{
              background: activeBlend === blend.id ? C.accentDim : C.bg,
              border: `1px solid ${activeBlend === blend.id ? C.accent : C.border}`,
              color: C.text, padding: "12px", cursor: "pointer", textAlign: "left",
              fontFamily: "'Courier New', monospace", transition: "all 0.2s",
            }}>
              <div style={{ fontSize: 11, color: C.accent, marginBottom: 4 }}>{blend.name}</div>
              <div style={{ fontSize: 9, color: C.dim, marginBottom: 6 }}>{blend.tagline}</div>
              <div style={{ fontSize: 8, color: "#555", letterSpacing: "0.1em" }}>{blend.season}</div>
            </button>
          ))}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {["base", "middle", "top"].map(tier => (
          <Card key={tier}>
            <Label color={tierColors[tier]}>{tierLabels[tier]}</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {SCENT_NOTES[tier].map(note => (
                <button key={note.id} onClick={() => toggle(tier, note.id)} style={{
                  background: selected[tier] === note.id ? tierColors[tier] + "22" : "transparent",
                  border: `1px solid ${selected[tier] === note.id ? tierColors[tier] : "#222"}`,
                  color: selected[tier] === note.id ? C.text : C.dim,
                  padding: "8px 10px", cursor: "pointer", textAlign: "left",
                  fontFamily: "'Courier New', monospace", transition: "all 0.15s",
                }}>
                  <div style={{ fontSize: 11 }}>{note.name}</div>
                  <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>{note.desc}</div>
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {(selected.base || selected.middle || selected.top) && (
        <Card style={{ borderColor: C.accentDim }}>
          <Label color={C.accent}>Your Blend</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {["base", "middle", "top"].map(tier => {
              const note = selected[tier] ? SCENT_NOTES[tier].find(n => n.id === selected[tier]) : null;
              return (
                <div key={tier} style={{ background: C.bg, padding: 12, border: `1px solid ${note ? tierColors[tier] + "44" : "#1a1a1a"}` }}>
                  <Label color={tierColors[tier]}>{tier} — {ratios[tier]}%</Label>
                  {note ? (
                    <>
                      <div style={{ fontSize: 14, color: C.text }}>{note.name}</div>
                      <div style={{ fontSize: 10, color: C.dim, marginTop: 4 }}>{note.desc}</div>
                    </>
                  ) : (
                    <div style={{ fontSize: 10, color: "#333", fontStyle: "italic" }}>not selected</div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16 }}>
            <Label color={C.dim}>Adjust Ratios (must total 100%)</Label>
            <div style={{ display: "flex", gap: 16 }}>
              {["base", "middle", "top"].map(tier => (
                <div key={tier} style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, color: tierColors[tier], marginBottom: 4, textTransform: "uppercase" }}>{tier}</div>
                  <input type="range" min={0} max={100} value={ratios[tier]}
                    onChange={e => setRatios(prev => ({ ...prev, [tier]: parseInt(e.target.value) }))}
                    style={{ width: "100%", accentColor: tierColors[tier] }}
                  />
                  <div style={{ fontSize: 12, color: C.text, textAlign: "center" }}>{ratios[tier]}%</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 10, color: ratios.base + ratios.middle + ratios.top === 100 ? C.green : C.red, marginTop: 8 }}>
              Total: {ratios.base + ratios.middle + ratios.top}% {ratios.base + ratios.middle + ratios.top === 100 ? "✓ balanced" : "— must equal 100%"}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ── POUR GUIDE TAB ──────────────────────────────────────────────────────────
function PourGuide() {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card>
        <Label color={C.accent}>Temperature Quick Reference</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {[
            { label: "Melt & Dye", temp: "185°F", color: C.red },
            { label: "Add Fragrance", temp: "185°F", color: C.accent },
            { label: "Pour Temp", temp: "135–150°F", color: C.blue },
            { label: "Cure Time", temp: "1–2 weeks", color: C.green },
          ].map(({ label, temp, color }) => (
            <div key={label} style={{ background: C.bg, padding: 14, border: `1px solid ${C.border}`, textAlign: "center" }}>
              <Label>{label}</Label>
              <div style={{ fontSize: 18, color, fontFamily: "'Courier New', monospace" }}>{temp}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: "grid", gap: 8 }}>
        {POUR_STEPS.map(s => (
          <button key={s.step} onClick={() => setActiveStep(activeStep === s.step ? null : s.step)}
            style={{
              background: activeStep === s.step ? C.surface : C.bg,
              border: `1px solid ${activeStep === s.step ? C.accent : C.border}`,
              color: C.text, padding: "14px 18px", cursor: "pointer", textAlign: "left",
              fontFamily: "'Courier New', monospace", transition: "all 0.2s", width: "100%",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: C.accent, fontFamily: "'Courier New', monospace", fontSize: 10, minWidth: 20 }}>
                {String(s.step).padStart(2, "0")}
              </span>
              <span style={{ fontSize: 14 }}>{s.icon} {s.title}</span>
            </div>
            {activeStep === s.step && (
              <div style={{ marginTop: 10, fontSize: 12, color: C.dim, lineHeight: 1.7, paddingLeft: 32 }}>
                {s.detail}
              </div>
            )}
          </button>
        ))}
      </div>

      <Card>
        <Label color={C.blue}>Q-Tip Scent Test Method</Label>
        <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.8 }}>
          Before committing to a pour — dip one Q-tip per fragrance oil into separate bottles.
          Seal all Q-tips in a mason jar together. Wait 1 hour. Open and smell.
          Want one stronger? Add a second Q-tip of that scent. Note the count — that ratio IS your blend formula.
          Zero wax wasted.
        </div>
      </Card>

      <Card>
        <Label color={C.accent}>Dye Color Reference</Label>
        <div style={{ display: "grid", gap: 8 }}>
          {TRP_BLENDS.map(blend => (
            <div key={blend.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 20, height: 20, background: blend.color, border: "1px solid #333", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 11, color: C.text }}>{blend.name}</span>
                <span style={{ fontSize: 10, color: C.dim, marginLeft: 10 }}>{blend.colorName}</span>
              </div>
              <span style={{ fontSize: 9, color: C.dim, letterSpacing: "0.1em" }}>{blend.season}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── ADVISOR TAB (Claude-powered) ─────────────────────────────────────────────
function ScentAdvisor() {
  const [mood, setMood] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const ask = useCallback(async () => {
    if (!mood.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a candle scent blending expert for TRP (The Relentless Pursuer), a blue collar philosopher brand. 
You help create candle scent blends that feel intentional, masculine, and meaningful — not trendy or generic.
Always respond in JSON only. No markdown, no preamble. Structure:
{
  "name": "candle name",
  "tagline": "3 word ingredient list like: Bourbon. Oak. Clove.",
  "base": { "scent": "name", "percent": 40, "why": "one sentence" },
  "middle": { "scent": "name", "percent": 40, "why": "one sentence" },
  "top": { "scent": "name", "percent": 20, "why": "one sentence" },
  "card_copy": "2 sentence card copy in TRP voice — direct, reflective, no fluff",
  "season": "FALL or WINTER or YEAR-ROUND",
  "color_suggestion": "wax color that fits"
}`,
          messages: [{ role: "user", content: `Create a TRP candle blend for this feeling or moment: "${mood}"` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch (e) {
      setResult({ error: "Couldn't generate — check connection." });
    }
    setLoading(false);
  }, [mood]);

  const tierColors = { base: C.accent, middle: C.blue, top: C.green };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <Label color={C.accent}>Describe a feeling, moment, or season</Label>
        <div style={{ fontSize: 11, color: C.dim, marginBottom: 12, lineHeight: 1.7 }}>
          Examples: "3am, can't sleep, something's shifting" · "first cold morning of fall" · "shop floor after a long week"
        </div>
        <textarea
          value={mood}
          onChange={e => setMood(e.target.value)}
          placeholder="describe the moment..."
          rows={3}
          style={{
            width: "100%", background: C.bg, border: `1px solid ${C.border}`,
            color: C.text, padding: "10px 12px", fontSize: 12,
            fontFamily: "'Courier New', monospace", lineHeight: 1.7,
            resize: "vertical", outline: "none", boxSizing: "border-box",
          }}
        />
        <button onClick={ask} disabled={loading || !mood.trim()} style={{
          marginTop: 12, background: loading ? C.accentDim : C.accent,
          border: "none", color: "#fff", padding: "10px 24px",
          fontSize: 10, letterSpacing: "0.15em", cursor: loading ? "wait" : "pointer",
          fontFamily: "'Courier New', monospace", textTransform: "uppercase",
        }}>
          {loading ? "BUILDING BLEND..." : "BUILD MY BLEND →"}
        </button>
      </Card>

      {result && !result.error && (
        <Card style={{ borderColor: C.accentDim }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 20, color: C.accent, fontFamily: "'Courier New', monospace" }}>{result.name}</div>
              <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{result.tagline}</div>
            </div>
            <div style={{ fontSize: 9, color: C.dim, letterSpacing: "0.1em" }}>{result.season}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
            {["base", "middle", "top"].map(tier => result[tier] && (
              <div key={tier} style={{ background: C.bg, padding: 12, border: `1px solid ${tierColors[tier]}33` }}>
                <Label color={tierColors[tier]}>{tier} — {result[tier].percent}%</Label>
                <div style={{ fontSize: 14, color: C.text, marginBottom: 6 }}>{result[tier].scent}</div>
                <div style={{ fontSize: 10, color: C.dim, lineHeight: 1.6 }}>{result[tier].why}</div>
              </div>
            ))}
          </div>

          <div style={{ background: C.bg, padding: 14, border: `1px solid ${C.border}`, marginBottom: 12 }}>
            <Label color={C.dim}>Card Copy</Label>
            <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8, fontStyle: "italic" }}>
              "{result.card_copy}"
            </div>
            <div style={{ marginTop: 8, fontSize: 10, color: C.dim }}>— The Relentless Pursuer</div>
          </div>

          {result.color_suggestion && (
            <div style={{ fontSize: 10, color: C.dim }}>
              <span style={{ color: C.accent }}>Wax color: </span>{result.color_suggestion}
            </div>
          )}
        </Card>
      )}

      {result?.error && (
        <div style={{ color: C.red, fontSize: 12, padding: 12 }}>{result.error}</div>
      )}
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function TRPCandleDashboard() {
  const [tab, setTab] = useState("calc");
  const tabs = [
    { id: "calc", label: "Batch Calculator" },
    { id: "scent", label: "Scent Builder" },
    { id: "pour", label: "Pour Guide" },
    { id: "advisor", label: "Scent Advisor" },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Courier New', monospace", color: C.text }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "20px 24px 0", position: "sticky", top: 0, background: C.bg, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.2em", color: C.accent, textTransform: "uppercase", fontWeight: 700 }}>TRP</span>
          <span style={{ fontSize: 11, letterSpacing: "0.15em", color: C.dim, textTransform: "uppercase" }}>Candle Workshop</span>
        </div>
        <div style={{ display: "flex", gap: 0 }}>
          {tabs.map(t => <Tab key={t.id} label={t.label} active={tab === t.id} onClick={() => setTab(t.id)} />)}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px" }}>
        {tab === "calc" && <Calculator />}
        {tab === "scent" && <ScentBuilder />}
        {tab === "pour" && <PourGuide />}
        {tab === "advisor" && <ScentAdvisor />}
      </div>
    </div>
  );
}
