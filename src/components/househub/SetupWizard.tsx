import { useState, useMemo } from "react";
import { Member, House, CleanRecord, Purchase, ActivityLog, RotationEntry, SUPPLIES, uid, now, genCode, buildRotation, fmtDate } from "@/lib/househub";
import Avatar from "./Avatar";

interface SetupWizardProps {
  enterApp: (member: Member, house: House, members: Member[], cleanRecs: CleanRecord[], purchases: Purchase[], log: ActivityLog[], rotation: RotationEntry[]) => void;
}

const STEPS = 6;

const SetupWizard = ({ enterApp }: SetupWizardProps) => {
  const [step, setStep] = useState(0);
  const [houseName, setHN] = useState("");
  const [count, setCount] = useState("");
  const [names, setNames] = useState<string[]>([]);
  const [history, setHistory] = useState<Record<string, string>>({ gas: "", water: "", soap: "", cleaner: "" });
  const [code] = useState(genCode);
  const [copied, setCopied] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);

  const memberObjs = useMemo<Member[]>(() => names.map((n, i) => ({ id: `m${i + 1}`, name: n.trim(), joined_at: now() })), [names]);

  const goNext = () => setStep(s => Math.min(s + 1, STEPS - 1));
  const goBack = () => setStep(s => Math.max(s - 1, 0));

  const handleCount = () => {
    const n = parseInt(count);
    if (isNaN(n) || n < 2 || n > 20) return;
    setNames(Array(n).fill(""));
    goNext();
  };

  const handleFinish = () => setStep(4);

  const buildAndEnter = (member: Member) => {
    const houseData: House = { id: uid(), name: houseName.trim(), code, created_at: now() };
    const initPurchases: Purchase[] = [];
    const initLog: ActivityLog[] = [];

    [{ k: "gas", s: SUPPLIES[0] }, { k: "water", s: SUPPLIES[1] }, { k: "soap", s: SUPPLIES[2] }].forEach(({ k, s }) => {
      const mName = history[k];
      if (!mName) return;
      const m = memberObjs.find(x => x.name === mName);
      if (!m) return;
      initPurchases.push({ id: uid(), member_id: m.id, item_id: s.id, item_name: s.label, purchase_date: now() });
      initLog.push({ id: uid(), member_id: m.id, action: `${m.name} bought ${s.label}`, icon: s.icon, created_at: now() });
    });

    const cleanerMbr = memberObjs.find(x => x.name === history.cleaner);
    const initClean: CleanRecord[] = cleanerMbr ? [{ id: uid(), member_id: cleanerMbr.id, house_id: houseData.id, cleaning_date: now(), completed: true }] : [];
    if (cleanerMbr) initLog.push({ id: uid(), member_id: cleanerMbr.id, action: `${cleanerMbr.name} cleaned the house`, icon: "🧹", created_at: now() });

    const lastCleanerIdx = cleanerMbr ? memberObjs.indexOf(cleanerMbr) : -1;
    const rot = buildRotation(memberObjs, lastCleanerIdx);
    enterApp(member, houseData, memberObjs, initClean, initPurchases, initLog, rot);
  };

  const chooseMember = (m: Member) => {
    setChosen(m.id);
    setTimeout(() => buildAndEnter(m), 450);
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const v0 = houseName.trim().length > 1;
  const v1 = parseInt(count) >= 2 && parseInt(count) <= 20;
  const v2 = names.length > 0 && names.every(n => n.trim().length > 0);
  const v3 = history.gas && history.water && history.soap && history.cleaner;

  const stepTitles = ["House name", "Number of people", "Enter all names", "Previous activity", "Your house code 🎉", "Select your name"];

  const inputClass = "w-full px-5 py-3.5 rounded-xl border-2 border-border bg-background font-sans text-base outline-none transition-all focus:border-primary focus:shadow-[0_0_0_4px_rgba(42,157,143,0.1)] focus:bg-card placeholder:text-muted-foreground/60";
  const selectClass = "w-full px-5 py-3.5 rounded-xl border-2 border-border bg-background font-sans text-base outline-none transition-all focus:border-primary focus:shadow-[0_0_0_4px_rgba(42,157,143,0.1)] cursor-pointer appearance-none pr-11";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border/40 px-6 py-10 pb-8">
        <div className="max-w-lg mx-auto">
          <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase mb-2">Step {step + 1} of {STEPS}</p>
          <h2 className="font-display font-extrabold text-2xl text-foreground mb-4">{stepTitles[step]}</h2>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-secondary transition-all duration-500" style={{ width: `${((step + 1) / STEPS) * 100}%` }} />
          </div>
          <div className="flex gap-1.5 mt-3">
            {Array.from({ length: STEPS }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full transition-all duration-300" style={{
                background: i < step ? "hsl(var(--primary) / 0.4)" : i === step ? "hsl(var(--primary))" : "hsl(var(--muted))",
                transform: i === step ? "scale(1.4)" : "scale(1)",
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-7 max-w-lg mx-auto w-full">
        {step === 0 && (
          <div className="flex flex-col gap-4 animate-fade-up">
            <p className="text-muted-foreground text-sm">Give your house a memorable name.</p>
            <input type="text" className={inputClass} placeholder='"Student House A"' value={houseName} onChange={e => setHN(e.target.value)} onKeyDown={e => e.key === "Enter" && v0 && goNext()} autoFocus />
            <button className="w-full py-4 rounded-xl bg-primary font-bold text-primary-foreground shadow-md hover:translate-y-[-2px] active:scale-[0.98] transition-all disabled:opacity-40" onClick={goNext} disabled={!v0}>Next →</button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4 animate-fade-up">
            <button className="w-fit text-sm font-bold text-muted-foreground hover:text-foreground transition-colors" onClick={goBack}>← Back</button>
            <p className="text-muted-foreground text-sm">How many people live in <b>{houseName}</b>?</p>
            <input type="number" className={inputClass} placeholder="e.g. 4" min={2} max={20} value={count} onChange={e => setCount(e.target.value)} onKeyDown={e => e.key === "Enter" && v1 && handleCount()} autoFocus />
            <div className="flex gap-2 flex-wrap">
              {[2, 3, 4, 5, 6, 7, 8].map(n => (
                <button key={n} className={`px-5 py-2.5 rounded-xl font-bold transition-all ${String(n) === count ? "bg-primary text-primary-foreground shadow-sm" : "bg-card text-foreground border border-border hover:bg-muted/30"}`} onClick={() => setCount(String(n))}>{n}</button>
              ))}
            </div>
            <button className="w-full py-4 rounded-xl bg-primary font-bold text-primary-foreground shadow-md hover:translate-y-[-2px] active:scale-[0.98] transition-all disabled:opacity-40" onClick={handleCount} disabled={!v1}>Next →</button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3 animate-fade-up">
            <button className="w-fit text-sm font-bold text-muted-foreground hover:text-foreground transition-colors" onClick={goBack}>← Back</button>
            <p className="text-muted-foreground text-sm">Enter the name of each housemate:</p>
            {names.map((n, i) => (
              <div key={i} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase block mb-1.5">Person {i + 1}</label>
                <input type="text" className={inputClass} placeholder={`Name of person ${i + 1}`} value={n} onChange={e => setNames(p => p.map((v, j) => j === i ? e.target.value : v))} />
              </div>
            ))}
            <button className="w-full py-4 rounded-xl bg-primary font-bold text-primary-foreground shadow-md hover:translate-y-[-2px] active:scale-[0.98] transition-all mt-1 disabled:opacity-40" onClick={goNext} disabled={!v2}>Next →</button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-3.5 animate-fade-up">
            <button className="w-fit text-sm font-bold text-muted-foreground hover:text-foreground transition-colors" onClick={goBack}>← Back</button>
            <p className="text-muted-foreground text-sm leading-relaxed">To start accurately, tell us who did things last:</p>
            {[
              { key: "gas", label: "Who bought Gas last time?", icon: "🔥" },
              { key: "water", label: "Who brought Water last time?", icon: "💧" },
              { key: "soap", label: "Who bought Soap & Sponge last time?", icon: "🫧" },
              { key: "cleaner", label: "Who cleaned the house last time?", icon: "🧹" },
            ].map(({ key, label, icon }, i) => (
              <div key={key} className="animate-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase block mb-2">{icon} {label}</label>
                <select className={selectClass} value={history[key]} onChange={e => setHistory(p => ({ ...p, [key]: e.target.value }))}>
                  <option value="">— Select a person —</option>
                  {names.filter(n => n.trim()).map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            ))}
            <button className="w-full py-4 rounded-xl bg-primary font-bold text-primary-foreground shadow-md hover:translate-y-[-2px] active:scale-[0.98] transition-all mt-1 disabled:opacity-40" onClick={handleFinish} disabled={!v3}>Generate House Code →</button>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-4 text-center animate-fade-up">
            <div className="text-6xl animate-float">🎉</div>
            <h2 className="font-display font-black text-2xl">Your house is ready!</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">Share this code with your housemates so they can join <b>{houseName}</b>:</p>
            <div className="rounded-3xl p-7 bg-primary shadow-lg border-none">
              <p className="text-primary-foreground/60 text-xs font-bold tracking-widest uppercase mb-3">House Code</p>
              <p className="font-display font-black text-5xl text-primary-foreground tracking-[0.22em] mb-2">{code}</p>
              <p className="text-primary-foreground/40 text-xs">{houseName}</p>
            </div>
            <button className="w-full py-3.5 rounded-xl bg-card text-foreground font-bold border border-border shadow-sm hover:bg-muted/30 transition-all" onClick={copyCode}>{copied ? "✅ Copied!" : "📋 Copy code"}</button>
            <button className="w-full py-4 rounded-xl bg-primary font-bold text-primary-foreground shadow-md hover:translate-y-[-2px] active:scale-[0.98] transition-all" onClick={() => setStep(5)}>Continue →</button>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-3 animate-fade-up">
            <p className="text-ink-3 text-sm mb-1">Select your name to enter the dashboard:</p>
            {memberObjs.map((m, i) => (
              <button
                key={m.id}
                className={`w-full p-5 rounded-3xl border-2 bg-card text-left font-semibold flex items-center gap-4 transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:translate-x-1 animate-fade-up shadow-sm ${chosen === m.id ? "border-primary bg-primary/5" : "border-border"}`}
                style={{ animationDelay: `${i * 0.07}s` }}
                onClick={() => chooseMember(m)}
              >
                <Avatar name={m.name} size={50} radius={16} fontSize={20} />
                <div className="flex-1">
                  <div className="text-lg text-foreground">{m.name}</div>
                  <div className="font-normal text-xs text-muted-foreground mt-0.5">Joined {fmtDate(m.joined_at, { month: "short", day: "numeric" })}</div>
                </div>
                {chosen === m.id && <span className="text-primary text-xl">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupWizard;
