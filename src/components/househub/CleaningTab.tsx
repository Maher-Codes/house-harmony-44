import { useState } from "react";
import { Member, CleanRecord, RotationEntry, fmtDate } from "@/lib/househub";
import Avatar from "./Avatar";
import { Brush, Calendar, Home, CheckCircle2 } from "lucide-react";

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
      <p className="font-display font-bold italic text-xs text-muted-foreground uppercase tracking-widest animate-fade-up" style={{ animationDelay: ".03s" }}>My Cleaning Schedule</p>

      {/* My next / current card */}
      <div
        className={`rounded-3xl p-6 shadow-md border animate-fade-up transition-all ${done ? "bg-primary/10 border-primary/20" : isMyTurnClean ? "bg-primary/10 border-primary/30" : "bg-card border-border"}`}
        style={{ animationDelay: ".06s" }}
      >
        <div className="flex items-center gap-4 mb-4">
          {user && <Avatar name={user.name} size={60} radius={20} fontSize={25} />}
          <div className="flex-1">
            <p className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-1">
              {done ? "This Week ✅" : isMyTurnClean ? "⚡ This Saturday — Your Turn!" : "Your Next Cleaning Day"}
            </p>
            <h2 className="font-display font-black text-2xl text-primary leading-tight">
              {myNextClean ? fmtDate(myNextClean.date, { weekday: "long", day: "numeric", month: "long" }) : "—"}
            </h2>
            {myLastClean && <p className="text-muted-foreground text-sm mt-1.5">Last cleaned: {fmtDate(myLastClean.cleaning_date, { day: "numeric", month: "long" })}</p>}
          </div>
        </div>

        {isMyTurnClean && !done && (
          <div className="flex flex-col gap-2.5">
            <p className="text-muted-foreground text-sm leading-relaxed">Once you've finished cleaning the house, tap below to record it:</p>
            <button className="w-full py-4 rounded-xl bg-primary font-bold text-primary-foreground shadow-md hover:opacity-90 active:scale-[0.96] transition-all text-base flex items-center justify-center gap-2" onClick={handle}>
              <Home size={20} />
              I cleaned the house!
            </button>
            <button className="w-full py-3.5 rounded-xl bg-transparent text-muted-foreground border border-border font-bold hover:bg-muted/50 transition-all font-sans">Not yet – remind me later</button>
          </div>
        )}

        {done && (
          <div className="animate-pop text-center py-1.5 flex flex-col items-center gap-2">
            <CheckCircle2 size={32} className="text-primary" />
            <p className="font-display font-bold text-base text-primary">Amazing! The house is clean. Great job!</p>
          </div>
        )}

        {!isMyTurnClean && !done && myNextClean && (
          <div className="bg-primary/5 rounded-xl px-4 py-3 flex items-center gap-3">
             <Calendar size={18} className="text-primary" />
             <p className="text-primary font-bold text-sm">Mark your calendar — {fmtDate(myNextClean.date, { weekday: "long", day: "numeric", month: "long" })}</p>
          </div>
        )}
      </div>

      {/* Full rotation */}
      <p className="font-display font-bold italic text-xs text-muted-foreground uppercase tracking-widest animate-fade-up" style={{ animationDelay: ".12s" }}>Full Rotation (Saturdays)</p>
      <p className="text-muted-foreground text-sm px-0.5 animate-fade-up font-medium" style={{ animationDelay: ".14s" }}>Cleaning rotates every Saturday. Once everyone has had a turn, it repeats.</p>

      {rotation.map((r, i) => {
        const m = getMember(r.memberId);
        const isCurrent = i === 0;
        const isMe = r.memberId === user?.id;
        return (
          <div
            key={`${r.memberId}-${i}`}
            className={`flex items-center gap-3.5 p-4 rounded-3xl border mb-0 transition-all animate-fade-up ${isCurrent ? "border-primary bg-primary/10" : isMe ? "border-accent/30 bg-accent/5" : "border-border bg-card shadow-sm"}`}
            style={{ animationDelay: `${0.16 + i * 0.06}s`, opacity: i > 3 && !isCurrent && !isMe ? 0.65 : 1 }}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm shrink-0 shadow-sm ${isCurrent ? "bg-primary text-primary-foreground" : isMe ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
            >
              {i + 1}
            </div>
            {m && <Avatar name={m.name} size={40} radius={12} fontSize={16} />}
            <div className="flex-1">
              <p className="font-bold text-sm text-foreground">
                {m?.name}
                {isCurrent && <span className="ml-2 text-[10px] text-primary font-extrabold bg-primary/10 px-2 py-0.5 rounded-md">NOW</span>}
                {isMe && !isCurrent && <span className="ml-2 text-[10px] text-accent font-extrabold bg-accent/10 px-2 py-0.5 rounded-md">YOU</span>}
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">{fmtDate(r.date, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
            {isCurrent && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
              <Brush size={12} />
              This Sat
            </span>}
          </div>
        );
      })}
    </div>
  );
};

export default CleaningTab;
