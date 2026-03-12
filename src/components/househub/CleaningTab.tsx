import { useState } from "react";
import { Member, CleanRecord, RotationEntry, fmtDate, avatarColor } from "@/lib/househub";
import Avatar from "./Avatar";

interface CleaningTabProps {
  rotation: RotationEntry[];
  myNextClean: RotationEntry | undefined;
  user: Member | null;
  getMember: (id: string) => Member | undefined;
  isMyTurnClean: boolean;
  doClean: () => void;
  cleanRecs: CleanRecord[];
}

const CleaningTab = ({ rotation, myNextClean, user, getMember, isMyTurnClean, doClean, cleanRecs }: CleaningTabProps) => {
  const [justDone, setJustDone] = useState(false);
  const done = justDone || (isMyTurnClean && cleanRecs.some(r => r.member_id === user?.id && Date.now() - new Date(r.cleaning_date).getTime() < 7 * 86400000));
  const handle = () => { setJustDone(true); doClean(); };
  const myLastClean = cleanRecs.filter(r => r.member_id === user?.id).sort((a, b) => new Date(b.cleaning_date).getTime() - new Date(a.cleaning_date).getTime())[0];

  return (
    <div className="flex flex-col gap-4">
      <p className="font-display font-bold italic text-xs text-ink-3 uppercase tracking-widest animate-fade-up" style={{ animationDelay: ".03s" }}>🗓 My Cleaning Schedule</p>

      {/* My next / current card */}
      <div
        className={`rounded-2xl p-6 animate-fade-up ${done ? "bg-gradient-to-br from-forest/10 to-forest/5 border-2 border-sage/35" : isMyTurnClean ? "bg-gradient-to-br from-forest/10 to-forest/5 border-2 border-forest/25" : "bg-card border border-border"}`}
        style={{ animationDelay: ".06s" }}
      >
        <div className="flex items-center gap-4 mb-4">
          {user && <Avatar name={user.name} size={60} radius={20} fontSize={25} />}
          <div>
            <p className="text-xs font-bold text-ink-4 tracking-wider uppercase mb-1">
              {done ? "This Week ✅" : isMyTurnClean ? "⚡ This Saturday — Your Turn!" : "Your Next Cleaning Day"}
            </p>
            <h2 className="font-display font-black text-2xl text-forest leading-tight">
              {myNextClean ? fmtDate(myNextClean.date, { weekday: "long", day: "numeric", month: "long" }) : "—"}
            </h2>
            {myLastClean && <p className="text-ink-3 text-sm mt-1.5">Last cleaned: {fmtDate(myLastClean.cleaning_date, { day: "numeric", month: "long" })}</p>}
          </div>
        </div>

        {isMyTurnClean && !done && (
          <div className="flex flex-col gap-2.5">
            <p className="text-ink-3 text-sm leading-relaxed">Once you've finished cleaning the house, tap below to record it:</p>
            <button className="w-full py-4 rounded-xl bg-sage font-bold text-card shadow-[0_4px_20px_rgba(93,143,106,.35)] hover:bg-sage/90 active:scale-[0.96] transition-all text-base" onClick={handle}>🏠 I cleaned the house!</button>
            <button className="w-full py-3.5 rounded-xl bg-transparent text-ink-3 border-2 border-border font-bold hover:border-ink-3 hover:text-foreground transition-all">Not yet – remind me later</button>
          </div>
        )}

        {done && (
          <div className="animate-pop text-center py-1.5">
            <p className="font-display font-bold text-base text-forest">🎉 Amazing! The house is clean. Great job!</p>
          </div>
        )}

        {!isMyTurnClean && !done && myNextClean && (
          <div className="bg-forest/5 rounded-xl px-3.5 py-3">
            <p className="text-forest font-bold text-sm">🧹 Mark your calendar — {fmtDate(myNextClean.date, { weekday: "long", day: "numeric", month: "long" })}</p>
          </div>
        )}
      </div>

      {/* Full rotation */}
      <p className="font-display font-bold italic text-xs text-ink-3 uppercase tracking-widest animate-fade-up" style={{ animationDelay: ".12s" }}>🔄 Full Rotation (Saturdays)</p>
      <p className="text-ink-3 text-sm px-0.5 animate-fade-up" style={{ animationDelay: ".14s" }}>Cleaning rotates every Saturday. Once everyone has had a turn, it repeats.</p>

      {rotation.map((r, i) => {
        const m = getMember(r.memberId);
        const isCurrent = i === 0;
        const isMe = r.memberId === user?.id;
        return (
          <div
            key={`${r.memberId}-${i}`}
            className={`flex items-center gap-3.5 p-4 rounded-xl border mb-0 transition-all animate-fade-up ${isCurrent ? "border-forest bg-forest/5" : isMe ? "border-gold/35 bg-gold/5" : "border-border bg-card"}`}
            style={{ animationDelay: `${0.16 + i * 0.06}s`, opacity: i > 3 && !isCurrent && !isMe ? 0.65 : 1 }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm shrink-0"
              style={{
                background: isCurrent ? "hsl(var(--forest))" : isMe ? "hsl(var(--gold))" : "hsl(var(--cream-2))",
                color: isCurrent || isMe ? "#fff" : "hsl(var(--ink-3))",
              }}
            >
              {i + 1}
            </div>
            {m && <Avatar name={m.name} size={40} radius={12} fontSize={16} />}
            <div className="flex-1">
              <p className="font-bold text-sm">
                {m?.name}
                {isCurrent && <span className="ml-2 text-xs text-forest font-extrabold bg-forest/10 px-2 py-0.5 rounded-md">NOW</span>}
                {isMe && !isCurrent && <span className="ml-2 text-xs font-extrabold bg-gold/12 px-2 py-0.5 rounded-md" style={{ color: "#8a6a10" }}>YOU</span>}
              </p>
              <p className="text-ink-3 text-xs mt-0.5">{fmtDate(r.date, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
            {isCurrent && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-forest/10 text-forest">🧹 This Sat</span>}
            {isMe && !isCurrent && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gold/12" style={{ color: "#8a6a10" }}>📅 Upcoming</span>}
          </div>
        );
      })}
    </div>
  );
};

export default CleaningTab;
