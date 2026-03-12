import { Home } from "lucide-react";

const SplashScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-primary via-primary to-primary-foreground/10">
    <div className="mb-5 animate-float text-white">
      <div className="relative">
        <Home size={80} strokeWidth={1.5} />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-4 border-b-2 border-white rounded-full opacity-60"></div>
      </div>
    </div>
    <h1 className="font-display font-black text-5xl text-white tracking-tight mb-3 animate-fade-up" style={{ animationDelay: ".1s" }}>
      HouseHub
    </h1>
    <p className="text-white/60 text-lg font-medium mb-1 animate-fade-up" style={{ animationDelay: ".2s" }}>
      Organized House → Happy People
    </p>
    <div className="flex gap-2 justify-center mt-7 animate-fade-in" style={{ animationDelay: ".7s" }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            background: i === 1 ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.2)",
            animation: `pulse-dot ${1 + i * 0.3}s infinite`,
          }}
        />
      ))}
    </div>
  </div>
);

export default SplashScreen;
