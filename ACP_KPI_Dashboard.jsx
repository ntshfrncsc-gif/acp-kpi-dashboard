import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ─── PASSWORD ────────────────────────────────────────────────────────────────
const DASHBOARD_PASSWORD = "Achieve2026";

// ─── DATA ────────────────────────────────────────────────────────────────────
const KPI_CARDS = [
  { label: "Loans Funded", value: "45", target: "50", unit: "", icon: "🏦", category: "Active Loans", pct: 90 },
  { label: "Total Loan Value", value: "$6.86M", target: "$8M", unit: "", icon: "💰", category: "Active Loans", pct: 86 },
  { label: "Capital Deployed", value: "$6.86M", target: "$7M", unit: "", icon: "🏗️", category: "Capital", pct: 98 },
  { label: "Pipeline Value", value: "$1.64M", target: "$2.5M", unit: "", icon: "📊", category: "Pipeline", pct: 66 },
  { label: "Loans in Pipeline", value: "12", target: "20", unit: "", icon: "🔄", category: "Pipeline", pct: 60 },
  { label: "# of Draws", value: "11", target: "8", unit: "", icon: "📤", category: "Draws", pct: 100, over: true },
  { label: "Draw Amount", value: "$76,080", target: "$75,000", unit: "", icon: "💵", category: "Draws", pct: 100, over: true },
  { label: "Interest Collected", value: "$491", target: "—", unit: "", icon: "📈", category: "Revenue", pct: null },
  { label: "Fees Collected", value: "$2,600", target: "$7,500", unit: "", icon: "🧾", category: "Revenue", pct: 35 },
  { label: "Loans Closed MTD", value: "1", target: "10", unit: "", icon: "✅", category: "Closings", pct: 10 },
  { label: "Closed Loan Amt", value: "$80,000", target: "$1M", unit: "", icon: "🔒", category: "Closings", pct: 8 },
  { label: "Returned Payments", value: "1", target: "0", unit: "", icon: "⚠️", category: "Risk", pct: null, alert: true },
];

const TREND_DATA = [
  { week: "May 1–3",  loans: 45, pipeline: 1640500, draws: 2,  drawAmt: 17900,  interest: 56604, capital: 6126005 },
  { week: "May 4–10", loans: 45, pipeline: 1759500, draws: 5,  drawAmt: 30550,  interest: 303,   capital: 6170625 },
  { week: "May 11–17",loans: 45, pipeline: 1640500, draws: 11, drawAmt: 76080,  interest: 491,   capital: 6862500 },
];

const MATURITY_DATA = [
  { borrower: "CRGD Holdings, LLC",                  maturity: "Apr 01, 2025", days: -416, note: 0,       risk: "PAST DUE" },
  { borrower: "Country Meadows Grandview LLC",        maturity: "Dec 31, 2025", days: -142, note: 82680,   risk: "PAST DUE" },
  { borrower: "Rice Pegher Capital LLC",              maturity: "Mar 16, 2026", days: -67,  note: 200000,  risk: "PAST DUE" },
  { borrower: "Scotlands War Chest, LLC",             maturity: "May 28, 2026", days: 6,    note: 290000,  risk: "CRITICAL" },
  { borrower: "MOR Properties LLC",                  maturity: "Jun 10, 2026", days: 19,   note: 175000,  risk: "CRITICAL" },
  { borrower: "RIC Eagle Management, LLC",           maturity: "Jun 12, 2026", days: 21,   note: 187000,  risk: "CRITICAL" },
  { borrower: "Build 412, LLC",                      maturity: "Jun 18, 2026", days: 27,   note: 415000,  risk: "CRITICAL" },
  { borrower: "Empire Real Homes II, LLC",           maturity: "Jun 20, 2026", days: 29,   note: 110000,  risk: "CRITICAL" },
  { borrower: "Empire Real Homes III, LLC",          maturity: "Jun 25, 2026", days: 34,   note: 121500,  risk: "WARNING" },
  { borrower: "Empire Real Homes III, LLC",          maturity: "Jun 25, 2026", days: 34,   note: 110500,  risk: "WARNING" },
  { borrower: "ADT Two LLC",                         maturity: "Jul 02, 2026", days: 41,   note: 245000,  risk: "WARNING" },
  { borrower: "Empire Real Homes III, LLC",          maturity: "Jul 03, 2026", days: 42,   note: 96000,   risk: "WARNING" },
  { borrower: "Empire Real Homes III, LLC",          maturity: "Jul 03, 2026", days: 42,   note: 155000,  risk: "WARNING" },
  { borrower: "RIC Eagle Management, LLC",           maturity: "Jul 24, 2026", days: 63,   note: 270000,  risk: "OK" },
  { borrower: "RIC Eagle Management, LLC",           maturity: "Jul 31, 2026", days: 70,   note: 97000,   risk: "OK" },
  { borrower: "5th St Capital Partners LLC",         maturity: "Aug 01, 2026", days: 71,   note: 400000,  risk: "OK" },
  { borrower: "The Merriano Group LLC",              maturity: "Sep 22, 2026", days: 123,  note: 147500,  risk: "OK" },
  { borrower: "Open Door Realty LLC",                maturity: "Sep 30, 2026", days: 131,  note: 112000,  risk: "OK" },
  { borrower: "Industrial Marketing Solutions, LLC", maturity: "Oct 05, 2026", days: 136,  note: 105000,  risk: "OK" },
  { borrower: "Valley Revival LLC",                  maturity: "Oct 08, 2026", days: 139,  note: 105000,  risk: "OK" },
];

const fmtDollar = (n) => n >= 1000000 ? `$${(n/1000000).toFixed(2)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}K` : `$${n.toLocaleString()}`;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);

  const attempt = () => {
    if (pw === DASHBOARD_PASSWORD) {
      onLogin();
    } else {
      setErr(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0a1628 0%, #0d2144 50%, #0a1628 100%)",
      fontFamily: "'DM Sans', sans-serif", padding: 24
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .login-box { animation: fadeIn 0.6s ease forwards; }
        .shake { animation: shake 0.4s ease; }
        .pw-input:focus { outline: none; border-color: #c9a84c !important; box-shadow: 0 0 0 3px rgba(201,168,76,0.15); }
        .login-btn:hover { background: #b8973e !important; transform: translateY(-1px); }
        .login-btn:active { transform: translateY(0); }
      `}</style>
      <div className="login-box" style={{
        background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20,
        padding: "48px 40px", maxWidth: 400, width: "100%",
        boxShadow: "0 40px 80px rgba(0,0,0,0.5)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏦</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#c9a84c", fontWeight: 700, letterSpacing: "0.02em" }}>
            Achieve Capital Partners
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            KPI Dashboard
          </div>
        </div>

        <div className={shake ? "shake" : ""}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>Password</div>
            <input
              className="pw-input"
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setErr(false); }}
              onKeyDown={e => e.key === "Enter" && attempt()}
              placeholder="Enter password"
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 10,
                background: "rgba(255,255,255,0.06)", border: err ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                color: "#fff", fontSize: 15, transition: "all 0.2s", boxSizing: "border-box"
              }}
            />
            {err && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>Incorrect password. Try again.</div>}
          </div>
          <button
            className="login-btn"
            onClick={attempt}
            style={{
              width: "100%", padding: "14px", background: "#c9a84c", border: "none",
              borderRadius: 10, color: "#0a1628", fontWeight: 600, fontSize: 15,
              cursor: "pointer", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.03em"
            }}
          >
            Access Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ card, idx }) {
  const barColor = card.alert ? "#ef4444" : card.over ? "#22c55e" : card.pct < 30 ? "#ef4444" : card.pct < 70 ? "#f59e0b" : "#22c55e";
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14, padding: "18px 20px",
      animation: `fadeUp 0.4s ease ${idx * 0.05}s both`
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{card.label}</div>
        <div style={{ fontSize: 20 }}>{card.icon}</div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: card.alert ? "#ef4444" : "#fff", marginBottom: 4, fontFamily: "'Playfair Display', serif" }}>
        {card.value}
      </div>
      {card.target !== "—" && card.pct !== null && (
        <>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
            Target: {card.target} · {card.pct}%{card.over ? " ✓" : ""}
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(card.pct, 100)}%`, background: barColor, borderRadius: 2, transition: "width 1s ease" }} />
          </div>
        </>
      )}
      {card.target === "—" && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>MTD</div>}
    </div>
  );
}

function RiskBadge({ risk }) {
  const cfg = {
    "PAST DUE": { bg: "rgba(239,68,68,0.15)", color: "#ef4444", border: "rgba(239,68,68,0.3)" },
    "CRITICAL": { bg: "rgba(249,115,22,0.15)", color: "#f97316", border: "rgba(249,115,22,0.3)" },
    "WARNING":  { bg: "rgba(234,179,8,0.15)",  color: "#eab308", border: "rgba(234,179,8,0.3)" },
    "OK":       { bg: "rgba(34,197,94,0.1)",   color: "#22c55e", border: "rgba(34,197,94,0.2)" },
  }[risk] || {};
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      letterSpacing: "0.05em", whiteSpace: "nowrap"
    }}>{risk}</span>
  );
}

export default function Dashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [maturityFilter, setMaturityFilter] = useState("ALL");

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "trends",   label: "📈 Trends" },
    { id: "maturity", label: "⏰ Maturity" },
  ];

  const filteredMat = maturityFilter === "ALL" ? MATURITY_DATA : MATURITY_DATA.filter(l => l.risk === maturityFilter);
  const pastDue = MATURITY_DATA.filter(l => l.risk === "PAST DUE").length;
  const critical = MATURITY_DATA.filter(l => l.risk === "CRITICAL").length;

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(160deg, #0a1628 0%, #0d1f3c 100%)",
      fontFamily: "'DM Sans', sans-serif", color: "#fff"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 2px; }
        .tab-btn:hover { background: rgba(201,168,76,0.08) !important; }
        .mat-row:hover { background: rgba(255,255,255,0.04) !important; }
        .filter-chip:hover { border-color: rgba(201,168,76,0.5) !important; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "rgba(0,0,0,0.3)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "16px 20px",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#c9a84c", fontWeight: 700 }}>
                Achieve Capital Partners
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                KPI Dashboard · Week of May 11–17
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              {pastDue > 0 && (
                <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>⚠ {pastDue} Past Due</div>
              )}
              {critical > 0 && (
                <div style={{ fontSize: 11, color: "#f97316", fontWeight: 600 }}>🔴 {critical} Critical</div>
              )}
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            {tabs.map(t => (
              <button key={t.id} className="tab-btn" onClick={() => setActiveTab(t.id)} style={{
                padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                background: activeTab === t.id ? "rgba(201,168,76,0.15)" : "transparent",
                color: activeTab === t.id ? "#c9a84c" : "rgba(255,255,255,0.5)",
                fontSize: 13, fontWeight: activeTab === t.id ? 600 : 400,
                borderBottom: activeTab === t.id ? "2px solid #c9a84c" : "2px solid transparent",
                transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif"
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px 40px" }}>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Weekly KPI Summary
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
              {KPI_CARDS.map((card, i) => <KpiCard key={i} card={card} idx={i} />)}
            </div>

            {/* Alert banner */}
            <div style={{
              marginTop: 20, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 12, padding: "14px 18px", display: "flex", gap: 12, alignItems: "center"
            }}>
              <span style={{ fontSize: 22 }}>⚠️</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#ef4444", marginBottom: 2 }}>
                  3 loans are past maturity — action required
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                  CRGD Holdings (416 days), Country Meadows Grandview (142 days), Rice Pegher Capital (67 days) · See Maturity tab
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TRENDS TAB */}
        {activeTab === "trends" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Weekly Trends — May 2026
            </div>

            {[
              { key: "draws", label: "# of Draws", color: "#c9a84c", fmt: v => v },
              { key: "drawAmt", label: "Draw Amount ($)", color: "#60a5fa", fmt: fmtDollar },
              { key: "pipeline", label: "Pipeline Value ($)", color: "#a78bfa", fmt: fmtDollar },
              { key: "capital", label: "Capital Deployed ($)", color: "#34d399", fmt: fmtDollar },
            ].map(chart => (
              <div key={chart.key} style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14, padding: "18px 16px"
              }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {chart.label}
                </div>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={TREND_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="week" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ background: "#0d1f3c", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: "#c9a84c" }}
                      formatter={(v) => [chart.fmt(v), chart.label]}
                    />
                    <Bar dataKey={chart.key} fill={chart.color} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        )}

        {/* MATURITY TAB */}
        {activeTab === "maturity" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Loans Nearing / Past Maturity
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["ALL", "PAST DUE", "CRITICAL", "WARNING", "OK"].map(f => (
                  <button key={f} className="filter-chip" onClick={() => setMaturityFilter(f)} style={{
                    padding: "4px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer",
                    background: maturityFilter === f ? "rgba(201,168,76,0.15)" : "transparent",
                    color: maturityFilter === f ? "#c9a84c" : "rgba(255,255,255,0.4)",
                    border: `1px solid ${maturityFilter === f ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.1)"}`,
                    transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif"
                  }}>{f}</button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredMat.map((loan, i) => (
                <div key={i} className="mat-row" style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                  borderLeft: `3px solid ${{ "PAST DUE": "#ef4444", "CRITICAL": "#f97316", "WARNING": "#eab308", "OK": "#22c55e" }[loan.risk]}`,
                  borderRadius: "0 12px 12px 0", padding: "14px 16px",
                  animation: `fadeUp 0.3s ease ${i * 0.04}s both`, transition: "background 0.15s"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {loan.borrower}
                      </div>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>📅 {loan.maturity}</span>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                          {loan.days < 0 ? `${Math.abs(loan.days)}d overdue` : `${loan.days}d remaining`}
                        </span>
                        {loan.note > 0 && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>💰 {fmtDollar(loan.note)}</span>}
                      </div>
                    </div>
                    <RiskBadge risk={loan.risk} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
