import { useMemo } from "react";
import { Member, Purchase, ActivityLog, RotationEntry, SUPPLIES, fmtDate } from "@/lib/househub";
import Avatar from "./Avatar";
import { Brush, ShoppingCart } from "lucide-react";

interface HomeTabProps {
  lastCleanMbr: Member | undefined;
  lastCleanRec: { cleaning_date: string } | undefined;
  purchases: Purchase[];
  actLog: ActivityLog[];
  getMember: (id: string) => Member | undefined;
  thisCleanMbr: Member | undefined;
  thisRotation: RotationEntry | null;
  nextBuyer: Member | null;
  isMyTurnClean: boolean;
  user: Member | null;
  setTab: (tab: string) => void;
}

const HomeTab = ({ lastCleanMbr, lastCleanRec, purchases, getMember, thisCleanMbr, thisRotation, nextBuyer, isMyTurnClean, user, setTab }: HomeTabProps) => {
  const lastBuys = useMemo(() => {
    const seen = new Set<string>();
    return purchases.filter(p => { if (seen.has(p.item_id)) return false; seen.add(p.item_id); return true; }).slice(0, 4);
  }, [purchases]);

  return (
    <div className="flex flex-col gap-4">
      {/* This week cleaning card */}
      <div
        className={`rounded-3xl border shadow-sm p-6 transition-all hover:shadow-md animate-fade-up ${isMyTurnClean ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20" : "bg-card border-border"}`}
        style={{ animationDelay: ".06s" }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-3">Next Cleaning</p>
            <div className="flex items-center gap-4">
              {thisCleanMbr && <Avatar name={thisCleanMbr.name} size={60} radius={20} fontSize={24} />}
              <div>
                <h2 className="font-display font-black text-3xl leading-none text-foreground">{thisCleanMbr?.name || "—"}</h2>
                {thisRotation && (
                  <p className="text-primary font-bold text-sm mt-2">
                    {fmtDate(thisRotation.date, { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                )}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mt-2 ${isMyTurnClean ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"}`}>
                  {isMyTurnClean ? "⚡ Your turn" : "⏳ Waiting"}
                </span>
              </div>
            </div>
          </div>
        </div>
        {isMyTurnClean && (
          <button className="w-full py-4 rounded-2xl bg-primary font-bold text-primary-foreground shadow-sm hover:translate-y-[-2px] hover:shadow-md active:translate-y-0 active:scale-[0.98] transition-all" onClick={() => setTab("cleaning")}>Go to Cleaning →</button>
        )}
      </div>

      {/* Last cleaning */}
      {lastCleanRec && (
        <div className="rounded-3xl border border-border shadow-sm p-5 flex items-center gap-4 bg-card transition-all hover:shadow-md animate-fade-up" style={{ animationDelay: ".1s" }}>
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
            <Brush size={22} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-0.5">Last Cleaning</p>
            <p className="font-bold text-sm text-foreground">{lastCleanMbr?.name} cleaned the house</p>
            <p className="text-muted-foreground text-xs mt-0.5">{fmtDate(lastCleanRec.cleaning_date, { weekday: "long", day: "numeric", month: "long" })}</p>
          </div>
        </div>
      )}

      {/* Next buyer */}
      <div className="rounded-3xl border border-border shadow-md p-5 flex items-center gap-4 bg-card transition-all hover:shadow-lg animate-fade-up" style={{ animationDelay: ".13s" }}>
        <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
          <ShoppingCart size={22} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-1">Next to buy supplies</p>
          <p className="font-display font-black text-2xl text-foreground leading-none">{nextBuyer?.name || "—"}</p>
        </div>
        {nextBuyer?.id === user?.id && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-accent/15 text-accent uppercase tracking-wider">⚡ That's you!</span>}
        <button className="px-5 py-2.5 rounded-2xl bg-muted text-foreground font-bold text-sm border border-border hover:bg-muted/80 transition-all shadow-sm" onClick={() => setTab("supplies")}>Log →</button>
      </div>

      {/* Last supply purchases - no timestamps */}
      {lastBuys.length > 0 && (
        <div className="rounded-3xl border border-border bg-card shadow-md p-6 animate-fade-up" style={{ animationDelay: ".16s" }}>
          <p className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-4">Recent Supply Purchases</p>
          <div className="space-y-1">
            {lastBuys.map((p, i) => {
              const m = getMember(p.member_id);
              const s = SUPPLIES.find(x => x.id === p.item_id) || SUPPLIES[0];
              return (
                <div key={p.id} className="flex items-center gap-4 py-3.5 border-b border-border/50 last:border-b-0 animate-fade-up" style={{ animationDelay: `${0.18 + i * 0.05}s` }}>
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm" style={{ background: s.bg }}>{s.icon}</div>
                  <div className="flex-1">
                    <p className="font-bold text-base text-foreground leading-tight">{s.label}</p>
                    <p className="text-muted-foreground text-xs mt-1">Bought by {m?.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeTab;
