const GoldLines = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Flowing gold accent lines */}
      <path
        d="M-100,200 Q400,100 600,300 T1000,250 T1400,350 T1920,200"
        fill="none"
        stroke="url(#goldGradient)"
        strokeWidth="1.5"
        className="animate-flow"
        style={{ strokeDasharray: 1000 }}
      />
      <path
        d="M-100,400 Q300,500 500,350 T900,450 T1300,300 T1700,400 T2020,350"
        fill="none"
        stroke="url(#goldGradient)"
        strokeWidth="1"
        className="animate-flow"
        style={{ strokeDasharray: 1000, animationDelay: "1s" }}
      />
      <path
        d="M-100,600 Q200,700 450,550 T850,650 T1250,500 T1650,600 T2020,550"
        fill="none"
        stroke="url(#goldGradient)"
        strokeWidth="2"
        className="animate-flow"
        style={{ strokeDasharray: 1000, animationDelay: "2s" }}
      />
      <path
        d="M-100,800 Q350,750 550,850 T950,750 T1350,850 T1750,750 T2020,800"
        fill="none"
        stroke="url(#goldGradient)"
        strokeWidth="1"
        className="animate-flow"
        style={{ strokeDasharray: 1000, animationDelay: "3s" }}
      />

      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(45 80% 55% / 0.2)" />
          <stop offset="50%" stopColor="hsl(45 80% 65% / 0.6)" />
          <stop offset="100%" stopColor="hsl(42 70% 50% / 0.2)" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default GoldLines;
