import { Home, Sparkles, DoorOpen } from "lucide-react";

interface LandingScreenProps {
  onSetup: () => void;
  onJoin: () => void;
}

const LandingScreen = ({ onSetup, onJoin }: LandingScreenProps) => (
  <div className="min-h-screen flex flex-col">
    <div className="bg-gradient-to-br from-primary via-primary to-primary-foreground/10 px-6 py-16 pb-20 text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 100%, hsla(173, 58%, 60%, 0.1), transparent)" }} />
      <div className="relative">
        <div className="mb-5 animate-float text-white flex justify-center">
          <div className="relative">
            <Home size={64} strokeWidth={1.5} />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-3 border-b-2 border-white rounded-full opacity-60"></div>
          </div>
        </div>
        <h1 className="font-display font-black text-4xl text-white tracking-tight mb-3 animate-fade-up" style={{ animationDelay: ".08s" }}>
          HouseHub
        </h1>
        <p className="text-white/80 font-medium text-lg animate-fade-up" style={{ animationDelay: ".18s" }}>
          Organized House → Happy People
        </p>
      </div>
    </div>

    <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-md mx-auto w-full gap-4">
      <p className="font-display font-bold text-xl mb-1 animate-fade-up" style={{ animationDelay: ".35s" }}>
        What would you like to do?
      </p>

      <button
        className="w-full p-5 rounded-3xl border border-border bg-card text-left font-semibold flex items-center gap-4 transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:translate-x-1 hover:shadow-md animate-fade-up"
        style={{ animationDelay: ".42s" }}
        onClick={onSetup}
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Sparkles size={24} />
        </div>
        <div className="flex-1">
          <div className="text-base font-bold text-foreground mb-0.5">Set up a new house</div>
          <div className="font-normal text-sm text-muted-foreground">Create your house and invite housemates</div>
        </div>
        <span className="text-muted-foreground/50 text-lg">→</span>
      </button>

      <button
        className="w-full p-5 rounded-3xl border border-border bg-card text-left font-semibold flex items-center gap-4 transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:translate-x-1 hover:shadow-md animate-fade-up"
        style={{ animationDelay: ".5s" }}
        onClick={onJoin}
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <DoorOpen size={24} />
        </div>
        <div className="flex-1">
          <div className="text-base font-bold text-foreground mb-0.5">Join existing house</div>
          <div className="font-normal text-sm text-muted-foreground">Enter your 6-digit house code</div>
        </div>
        <span className="text-muted-foreground/50 text-lg">→</span>
      </button>
    </div>
  </div>
);

export default LandingScreen;
