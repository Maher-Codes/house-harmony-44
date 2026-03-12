import { useState } from "react";
import { Member, Purchase, Supply, SUPPLIES } from "@/lib/househub";
import { PackageOpen, ShoppingCart, Clock, User, CheckCircle2, ChevronRight, Plus } from "lucide-react";

interface SuppliesTabProps {
  user: Member | null;
  doBuy: (supply: Supply) => void;
  purchases: Purchase[];
  getMember: (id: string) => Member | undefined;
  nextBuyer: Member | null;
  lastBoughtMap: Record<string, Purchase>;
}

const SuppliesTab = ({ user, doBuy, purchases, getMember, nextBuyer, lastBoughtMap }: SuppliesTabProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const isMyTurn = nextBuyer?.id === user?.id;

  const handle = (s: Supply | null) => {
    if (!s) { setConfirmed(true); return; }
    setSelected(s.id);
    setTimeout(() => { doBuy(s); setConfirmed(true); }, 500);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="font-display font-bold italic text-xs text-muted-foreground uppercase tracking-widest animate-fade-up" style={{ animationDelay: ".03s" }}>My Responsibility</p>

      {isMyTurn ? (
        <div className="rounded-3xl border p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 animate-fade-up shadow-sm" style={{ animationDelay: ".06s" }}>
          <p className="text-xs font-black tracking-widest uppercase mb-3 text-accent flex items-center gap-2">
            <ShoppingCart size={14} />
            It's your turn to buy
          </p>
          <h2 className="font-display font-black text-2xl mb-2 text-foreground">What did you buy?</h2>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed">Tap what you bought below — we'll save it instantly.</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card p-5 flex items-center gap-4 animate-fade-up shadow-sm transition-all hover:shadow-md" style={{ animationDelay: ".06s" }}>
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
            <Clock size={24} />
          </div>
          <div>
            <p className="font-bold text-sm text-foreground">Not your turn yet</p>
            <p className="text-muted-foreground text-sm mt-0.5"><b>{nextBuyer?.name}</b> is next to buy supplies.</p>
          </div>
        </div>
      )}

      {!confirmed ? (
        <>
          <p className="font-display font-black text-2xl px-0.5 animate-fade-up text-foreground mt-4 mb-1" style={{ animationDelay: ".1s" }}>Household Supplies</p>
          <div className="flex flex-col gap-3">
            {SUPPLIES.map((s, i) => {
              const lb = lastBoughtMap[s.id];
              const lbM = lb ? getMember(lb.member_id) : null;
              return (
                <button
                  key={s.id}
                  className={`w-full p-5 rounded-3xl border-2 bg-card flex items-center gap-4 font-bold text-base transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:translate-x-1 animate-fade-up shadow-sm hover:shadow-md ${selected === s.id ? "border-primary bg-primary/5" : "border-border"}`}
                  style={{ animationDelay: `${0.14 + i * 0.07}s` }}
                  onClick={() => handle(s)}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm" style={{ background: s.bg }}>{s.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="text-lg text-foreground mb-0.5">{s.label}</div>
                    {lb ? (
                      <div className="font-medium text-xs text-muted-foreground flex items-center gap-1">
                        <User size={10} />
                        Last bought by {lbM?.name}
                      </div>
                    ) : (
                      <div className="font-black text-[10px] text-accent uppercase tracking-wider">Never recorded</div>
                    )}
                  </div>
                  {selected === s.id ? <CheckCircle2 className="text-primary" /> : <ChevronRight className="text-muted-foreground/30" size={18} />}
                </button>
              );
            })}
            <button
              className="w-full p-5 rounded-3xl border-2 border-dashed border-border bg-card flex items-center gap-4 font-bold text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:translate-x-1 animate-fade-up shadow-sm"
              style={{ animationDelay: ".42s" }}
              onClick={() => handle(null)}
            >
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-xl">✨</div>
              <div className="flex-1 text-left">Nothing today</div>
               <ChevronRight className="text-muted-foreground/30" size={18} />
            </button>
          </div>
        </>
      ) : (
        <div className="rounded-3xl border border-border bg-card shadow-lg text-center p-12 animate-pop my-6">
          <div className="mb-6 flex justify-center">
            {selected ? (
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-md" style={{ background: SUPPLIES.find(s => s.id === selected)?.bg }}>
                {SUPPLIES.find(s => s.id === selected)?.icon}
              </div>
            ) : (
              <CheckCircle2 size={72} className="text-primary" />
            )}
          </div>
          <h2 className="font-display font-black text-4xl mb-3 text-primary">{selected ? "Logged!" : "No problem!"}</h2>
          <p className="text-muted-foreground font-medium text-sm mb-10 leading-relaxed px-4">
            {selected ? `${SUPPLIES.find(s => s.id === selected)?.label} has been recorded for ${user?.name}.` : "Come back whenever you have something to log."}
          </p>
          <button className="w-full py-4.5 rounded-2xl bg-primary text-primary-foreground font-bold shadow-md hover:translate-y-[-2px] hover:shadow-lg transition-all flex items-center justify-center gap-2" onClick={() => { setSelected(null); setConfirmed(false); }}>
            Log something else
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {!confirmed && (
        <>
          <p className="font-display font-bold italic text-xs text-muted-foreground uppercase tracking-widest mt-8 animate-fade-up" style={{ animationDelay: ".4s" }}>Supply Status</p>
          <div className="grid grid-cols-2 gap-4">
            {SUPPLIES.map((s, i) => {
              const lb = lastBoughtMap[s.id];
              const lbM = lb ? getMember(lb.member_id) : null;
              return (
                <div
                  key={s.id}
                  className="rounded-3xl border border-border bg-card shadow-sm p-5 transition-all hover:shadow-md animate-fade-up"
                  style={{ animationDelay: `${0.42 + i * 0.05}s` }}
                >
                  <div className="text-4xl mb-4">{s.icon}</div>
                  <p className="font-bold text-base mb-1 text-foreground">{s.label}</p>
                  {lb ? (
                    <p className="text-muted-foreground text-[11px] font-medium italic">Bought by {lbM?.name}</p>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-accent/10 text-accent uppercase tracking-tighter">Empty</span>
                  )}
                </div>
              );
            })}
          </div>

          {purchases.length > 0 && (
            <>
              <p className="font-display font-bold italic text-xs text-muted-foreground uppercase tracking-widest mt-8 animate-fade-up" style={{ animationDelay: ".56s" }}>Purchase History</p>
              <div className="rounded-3xl border border-border bg-card shadow-sm p-3 animate-fade-up mt-3" style={{ animationDelay: ".58s" }}>
                {purchases.slice(0, 6).map((p, i) => {
                  const m = getMember(p.member_id);
                  const s = SUPPLIES.find(x => x.id === p.item_id) || SUPPLIES[0];
                  return (
                    <div key={p.id} className="flex items-center gap-4 py-4 px-5 border-b border-border/50 last:border-b-0 animate-fade-up" style={{ animationDelay: `${0.6 + i * 0.04}s` }}>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm" style={{ background: s.bg }}>{s.icon}</div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-foreground">{s.label}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">Bought by {m?.name}</p>
                      </div>
                      <PackageOpen size={16} className="text-muted-foreground/20" />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SuppliesTab;
