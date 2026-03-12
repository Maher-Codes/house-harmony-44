import { useState, useEffect, useCallback } from "react";
import { Member, House, CleanRecord, Purchase, ActivityLog, RotationEntry, Alert, fmtShort, nextSat } from "@/lib/househub";
import SplashScreen from "@/components/househub/SplashScreen";
import LandingScreen from "@/components/househub/LandingScreen";
import SetupWizard from "@/components/househub/SetupWizard";
import JoinScreen from "@/components/househub/JoinScreen";
import Dashboard from "@/components/househub/Dashboard";

type Screen = "splash" | "landing" | "setup" | "join" | "app";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("splash");
  const [appData, setAppData] = useState<{
    user: Member;
    house: House;
    members: Member[];
    cleanRecs: CleanRecord[];
    purchases: Purchase[];
    log: ActivityLog[];
    rotation: RotationEntry[];
    alerts: Alert[];
  } | null>(null);

  useEffect(() => {
    setTimeout(() => setScreen("landing"), 2200);
  }, []);

  const enterApp = useCallback((member: Member, houseData: House, membersData: Member[], initClean: CleanRecord[], initPurchases: Purchase[], initLog: ActivityLog[], initRotation: RotationEntry[]) => {
    const sat = nextSat();
    const alerts: Alert[] = [{ id: Date.now(), msg: `🧹 Next cleaning Saturday: ${fmtShort(sat)}`, icon: "🧹" }];
    setAppData({
      user: member,
      house: houseData,
      members: membersData,
      cleanRecs: initClean,
      purchases: initPurchases,
      log: initLog,
      rotation: initRotation,
      alerts,
    });
    setScreen("app");
  }, []);

  if (screen === "splash") return <SplashScreen />;
  if (screen === "landing") return <LandingScreen onSetup={() => setScreen("setup")} onJoin={() => setScreen("join")} />;
  if (screen === "setup") return <SetupWizard enterApp={enterApp} />;
  if (screen === "join") return <JoinScreen enterApp={enterApp} onBack={() => setScreen("landing")} />;

  if (screen === "app" && appData) {
    return (
      <Dashboard
        initialUser={appData.user}
        initialHouse={appData.house}
        initialMembers={appData.members}
        initialCleanRecs={appData.cleanRecs}
        initialPurchases={appData.purchases}
        initialLog={appData.log}
        initialRotation={appData.rotation}
        initialAlerts={appData.alerts}
      />
    );
  }

  return null;
};

export default Index;
