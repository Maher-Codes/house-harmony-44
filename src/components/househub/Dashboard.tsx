import { useState, useCallback, useMemo } from "react";
import { Member, House, CleanRecord, Purchase, ActivityLog, RotationEntry, Alert, Supply, SUPPLIES, uid, now, nextSat, greet, todayFull } from "@/lib/househub";
import HomeTab from "./HomeTab";
import CleaningTab from "./CleaningTab";
import SuppliesTab from "./SuppliesTab";
import { Home, Brush, ShoppingCart } from "lucide-react";

interface DashboardProps {
  initialUser: Member;
  initialHouse: House;
  initialMembers: Member[];
  initialCleanRecs: CleanRecord[];
  initialPurchases: Purchase[];
  initialLog: ActivityLog[];
  initialRotation: RotationEntry[];
  initialAlerts: Alert[];
}

const Dashboard = ({ initialUser, initialHouse, initialMembers, initialCleanRecs, initialPurchases, initialLog, initialRotation, initialAlerts }: DashboardProps) => {
  const [tab, setTab] = useState("home");
  const [members] = useState(initialMembers);
  const [rotation, setRotation] = useState(initialRotation);
  const [cleanRecs, setCleanRecs] = useState(initialCleanRecs);
  const [purchases, setPurchases] = useState(initialPurchases);
  const [actLog, setActLog] = useState(initialLog);
  const [user] = useState(initialUser);
  const [house] = useState(initialHouse);
  const [toast, setToast] = useState<{ msg: string; id: number } | null>(null);
  const [alerts, setAlerts] = useState(initialAlerts);

  const showToast = useCallback((msg: string) => {
    setToast({ msg, id: Date.now() });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const addAlert = useCallback((msg: string, icon = "🔔") => {
    setAlerts(p => [{ id: Date.now(), msg, icon }, ...p].slice(0, 5));
  }, []);

  const getMember = useCallback((id: string) => members.find(m => m.id === id), [members]);

  const thisRotation = rotation[0] || null;
  const thisCleanMbr = getMember(thisRotation?.memberId || "");
  const isMyTurnClean = thisRotation?.memberId === user?.id;
  const myNextClean = rotation.find(r => r.memberId === user?.id);
  const lastCleanRec = cleanRecs[0];
  const lastCleanMbr = getMember(lastCleanRec?.member_id || "");

  const nextBuyer = useMemo(() => {
    if (!members.length) return null;
    const recentIds = purchases.slice(0, members.length).map(p => p.member_id);
    return members.find(m => !recentIds.includes(m.id)) || members[0];
  }, [members, purchases]);

  const lastBoughtMap = useMemo(() => {
    const m: Record<string, Purchase> = {};
    SUPPLIES.forEach(s => { const p = purchases.find(x => x.item_id === s.id); if (p) m[s.id] = p; });
    return m;
  }, [purchases]);

  const doClean = useCallback(() => {
    if (!user) return;
    const rec: CleanRecord = { id: uid(), member_id: user.id, house_id: house?.id || "", cleaning_date: now(), completed: true };
    setCleanRecs(p => [rec, ...p]);
    setRotation(p => {
      const n = [...p.slice(1)];
      const last = p[p.length - 1];
      const next: RotationEntry = { memberId: p[0].memberId, date: nextSat(last ? new Date(last.date.getTime() + 86400000) : undefined) };
      return [...n, next];
    });
    const l: ActivityLog = { id: uid(), member_id: user.id, action: `${user.name} cleaned the house`, icon: "🧹", created_at: now() };
    setActLog(p => [l, ...p]);
    addAlert("Cleaning recorded! Great job.", "🧹");
    showToast("Cleaning marked as done!");
  }, [user, house, addAlert, showToast]);

  const doBuy = useCallback((supply: Supply) => {
    if (!user) return;
    const p: Purchase = { id: uid(), member_id: user.id, item_id: supply.id, item_name: supply.label, purchase_date: now() };
    const l: ActivityLog = { id: uid(), member_id: user.id, action: `${user.name} bought ${supply.label}`, icon: supply.icon, created_at: now() };
    setPurchases(prev => [p, ...prev]);
    setActLog(prev => [l, ...prev]);
    addAlert(`${supply.label} logged!`, supply.icon);
    showToast(`${supply.label} purchase saved!`);
  }, [user, addAlert, showToast]);

  const tabs = [
    { id: "home", ico: <Home size={18} />, l: "Home" },
    { id: "cleaning", ico: <Brush size={18} />, l: "Cleaning" },
    { id: "supplies", ico: <ShoppingCart size={18} />, l: "Supplies" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground">
      {/* Header */}
      <div className="relative overflow-hidden px-5 pt-8 pb-20 bg-background">
        <div className="max-w-xl mx-auto relative">
          <div className="flex items-center justify-between mb-8 animate-fade-down uppercase">
            <div className="flex items-center gap-2.5">
              <div className="relative text-primary flex items-center justify-center">
                <Home size={28} strokeWidth={2.5} />
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-1.5 border-b-2 border-primary rounded-full opacity-40"></div>
              </div>
              <h1 className="font-display font-black text-xl text-foreground tracking-tight">
                HouseHub
              </h1>
            </div>
            <p className="text-[10px] font-black text-muted-foreground/50 tracking-[0.2em]">
              {todayFull()}
            </p>
          </div>

          <div className="flex justify-between items-start gap-3 mb-4">
            <div className="flex-1">
              <h2 className="font-display font-black text-4xl text-foreground leading-tight mb-2 animate-fade-up" style={{ animationDelay: ".06s" }}>
                Welcome home, {user?.name.split(' ')[0]}
              </h2>
              <p className="text-muted-foreground text-sm font-medium animate-fade-up opacity-80" style={{ animationDelay: ".14s" }}>
                Everything is organized and ready for you today.
              </p>
            </div>
          </div>

          {/* Alerts under greeting */}
          {alerts.length > 0 && (
            <div className="flex flex-col gap-2 mt-3 animate-fade-up" style={{ animationDelay: ".2s" }}>
              {alerts.slice(0, 3).map((a, i) => (
                <div
                  key={a.id}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-primary/8 border border-primary/15 text-primary animate-notif-in"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <span className="text-base">{a.icon}</span>
                  <span>{a.msg}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="max-w-xl mx-auto -mt-10 px-4 relative z-10">
        <div className="flex gap-1 bg-muted/30 rounded-2xl p-1.5 border border-border shadow-sm">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`flex-1 py-3 px-2 rounded-xl border-none cursor-pointer font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${tab === t.id ? "bg-card text-primary shadow-md" : "bg-transparent text-muted-foreground hover:text-foreground"}`}
              onClick={() => setTab(t.id)}
            >
              <span className="">{t.ico}</span>
              <span>{t.l}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto mt-5 px-4">
        {tab === "home" && <HomeTab lastCleanMbr={lastCleanMbr} lastCleanRec={lastCleanRec} purchases={purchases} actLog={actLog} getMember={getMember} thisCleanMbr={thisCleanMbr} thisRotation={thisRotation} nextBuyer={nextBuyer} isMyTurnClean={isMyTurnClean} user={user} setTab={setTab} />}
        {tab === "cleaning" && <CleaningTab rotation={rotation} myNextClean={myNextClean} user={user} getMember={getMember} isMyTurnClean={isMyTurnClean} doClean={doClean} cleanRecs={cleanRecs} />}
        {tab === "supplies" && <SuppliesTab user={user} doBuy={doBuy} purchases={purchases} getMember={getMember} nextBuyer={nextBuyer} lastBoughtMap={lastBoughtMap} />}
      </div>

      {/* Toast */}
      {toast && (
        <div key={toast.id} className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-bold text-sm shadow-lg z-50 whitespace-nowrap animate-pop">
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
