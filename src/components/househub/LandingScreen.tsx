interface LandingScreenProps {
  onSetup: () => void;
  onJoin: () => void;
}

const LandingScreen = ({ onSetup, onJoin }: LandingScreenProps) => (
  <div className="min-h-screen flex flex-col">
    <div className="bg-gradient-to-br from-forest via-forest-2 to-forest-3 px-6 py-16 pb-20 text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 100%, rgba(196,154,46,.18), transparent)" }} />
      <div className="relative">
        <div className="text-6xl mb-5 animate-float">🏠</div>
        <h1 className="font-display font-black text-4xl text-cream tracking-tight mb-3 animate-fade-up" style={{ animationDelay: ".08s" }}>
          HouseHub
        </h1>
        <p className="text-cream/70 font-medium text-lg mb-1 animate-fade-up" style={{ animationDelay: ".18s" }}>
          Organized House 🏡 → Happy People 😊
        </p>
        <p className="text-cream/40 text-sm animate-fade-up" style={{ animationDelay: ".26s" }}>
          Hi there 👋
        </p>
      </div>
    </div>

    <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-md mx-auto w-full gap-4">
      <p className="font-display font-bold text-xl mb-1 animate-fade-up" style={{ animationDelay: ".35s" }}>
        What would you like to do?
      </p>

      <button
        className="w-full p-5 rounded-xl border-2 border-border bg-card text-left font-semibold flex items-center gap-4 transition-all duration-200 hover:border-forest hover:bg-forest/5 hover:translate-x-1 hover:shadow-warm animate-fade-up"
        style={{ animationDelay: ".42s" }}
        onClick={onSetup}
      >
        <span className="text-4xl">✨</span>
        <div className="flex-1">
          <div className="text-base mb-0.5">Set up a new house</div>
          <div className="font-normal text-sm text-ink-3">Create your house and invite housemates</div>
        </div>
        <span className="text-ink-4 text-lg">→</span>
      </button>

      <button
        className="w-full p-5 rounded-xl border-2 border-border bg-card text-left font-semibold flex items-center gap-4 transition-all duration-200 hover:border-forest hover:bg-forest/5 hover:translate-x-1 hover:shadow-warm animate-fade-up"
        style={{ animationDelay: ".5s" }}
        onClick={onJoin}
      >
        <span className="text-4xl">🚪</span>
        <div className="flex-1">
          <div className="text-base mb-0.5">Join existing house</div>
          <div className="font-normal text-sm text-ink-3">Enter your 6-digit house code</div>
        </div>
        <span className="text-ink-4 text-lg">→</span>
      </button>
    </div>
  </div>
);

export default LandingScreen;
