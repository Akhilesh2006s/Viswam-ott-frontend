import luxuryBg from "@/assets/luxury-bg.jpg";
import logo from "@/assets/logo.png";
import GoldLines from "@/components/GoldLines";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Shield, Tv, Users, Lock, Zap, BookOpen } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image - Fixed */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${luxuryBg})` }}
      />

      {/* Gradient Overlay - Fixed */}
      <div className="fixed inset-0 bg-gradient-to-br from-brown-dark/30 via-background/20 to-brown-medium/25" />

      {/* Animated Gold Lines - Fixed */}
      <div className="fixed inset-0 pointer-events-none">
        <GoldLines />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 px-6 py-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Viswam OTT Logo" className="w-24 h-24 md:w-32 md:h-32 object-contain" />
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Viswam OTT
            </h2>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-[hsl(40,40%,90%)] border-[hsl(40,40%,90%)]/30 hover:bg-[hsl(40,40%,90%)]/10" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button className="gold-button" asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="min-h-[90vh] flex items-center justify-center px-4 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img src={logo} alt="Viswam OTT Logo" className="w-32 h-32 md:w-40 md:h-40 object-contain" />
              <h1 className="font-display text-5xl md:text-7xl font-bold text-[hsl(40,40%,90%)] tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                Viswam OTT
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-[hsl(40,40%,90%)] mb-4 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              A Centralized Digital Learning Platform for Schools
            </p>
            <p className="text-lg md:text-xl text-[hsl(40,35%,85%)] mb-8 max-w-3xl mx-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              Trusted, curriculum-aligned learning content delivered securely to schools.
              Designed for classroom and guided learning — without distractions.
            </p>
            <p className="text-2xl md:text-3xl font-display text-primary mb-10 font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              One School. One Login. One Learning Platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gold-button text-lg px-8 py-6" asChild>
                <Link to="/login">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary/10" asChild>
                <a href="#contact">Request Demo</a>
              </Button>
            </div>
          </div>
        </section>

        {/* TRUST / VALUE STRIP */}
        <section className="py-12 bg-card/50 backdrop-blur-md border-y border-border/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <Shield className="w-8 h-8 text-primary mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <p className="text-sm font-medium text-[hsl(40,40%,90%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Trusted content by Viswam</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Tv className="w-8 h-8 text-primary mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <p className="text-sm font-medium text-[hsl(40,40%,90%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Works on Smart TVs & Android Boxes</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Lock className="w-8 h-8 text-primary mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <p className="text-sm font-medium text-[hsl(40,40%,90%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">No ads. No external links.</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <BookOpen className="w-8 h-8 text-primary mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <p className="text-sm font-medium text-[hsl(40,40%,90%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Designed exclusively for schools</p>
              </div>
            </div>
          </div>
        </section>

        {/* THE PROBLEM */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(40,40%,90%)] mb-6 text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              Digital Learning Should Be Structured, Not Chaotic
            </h2>
            <p className="text-lg text-[hsl(40,35%,85%)] mb-8 text-center max-w-2xl mx-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              Schools today rely on multiple platforms that introduce:
            </p>
            <div className="glass-card p-8 md:p-12 space-y-4 bg-card/60 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-[hsl(40,40%,90%)] text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Uncontrolled content</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-[hsl(40,40%,90%)] text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Advertisements and distractions</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-[hsl(40,40%,90%)] text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Inconsistent learning quality</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-[hsl(40,40%,90%)] text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Lack of ownership and control</p>
              </div>
            </div>
            <p className="text-xl text-center mt-8 text-primary font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Education deserves a <span className="font-bold">safe and focused digital environment</span>.
            </p>
          </div>
        </section>

        {/* THE SOLUTION */}
        <section className="py-20 px-4 bg-card/40 backdrop-blur-md">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img src={logo} alt="Viswam OTT Logo" className="w-20 h-20 md:w-24 md:h-24 object-contain" />
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(40,40%,90%)] text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                Viswam OTT Brings Clarity to Digital Learning
              </h2>
            </div>
            <p className="text-lg text-[hsl(40,35%,85%)] mb-8 text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              Viswam OTT is a centralized platform where:
            </p>
            <div className="glass-card p-8 md:p-12 space-y-4 mb-8 bg-card/60 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <p className="text-[hsl(40,40%,90%)] text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">All content is curated and managed by Viswam</p>
              </div>
              <div className="flex items-start gap-4">
                <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <p className="text-[hsl(40,40%,90%)] text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Schools access verified, structured learning videos</p>
              </div>
              <div className="flex items-start gap-4">
                <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <p className="text-[hsl(40,40%,90%)] text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Learning happens inside classrooms and school environments</p>
              </div>
              <div className="flex items-start gap-4">
                <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <p className="text-[hsl(40,40%,90%)] text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">No dependence on public video platforms</p>
              </div>
            </div>
            <p className="text-xl text-center text-primary font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Viswam manages the content. Schools focus on learning.
            </p>
          </div>
        </section>

        {/* HOW VISWAM OTT WORKS */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-12">
              <img src={logo} alt="Viswam OTT Logo" className="w-20 h-20 md:w-24 md:h-24 object-contain" />
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(40,40%,90%)] text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                How Viswam OTT Works
              </h2>
            </div>
            <div className="space-y-6">
              <div className="glass-card p-6 flex items-start gap-4 bg-card/60 backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <p className="text-[hsl(40,40%,90%)] text-lg pt-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">School receives a secure login</p>
              </div>
              <div className="glass-card p-6 flex items-start gap-4 bg-card/60 backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <p className="text-[hsl(40,40%,90%)] text-lg pt-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Viswam publishes learning content</p>
              </div>
              <div className="glass-card p-6 flex items-start gap-4 bg-card/60 backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <p className="text-[hsl(40,40%,90%)] text-lg pt-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Schools play content in classrooms using Smart TVs</p>
              </div>
              <div className="glass-card p-6 flex items-start gap-4 bg-card/60 backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-lg">4</span>
                </div>
                <p className="text-[hsl(40,40%,90%)] text-lg pt-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Lessons can be paused, replayed, and revised</p>
              </div>
              <div className="glass-card p-6 flex items-start gap-4 bg-card/60 backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-lg">5</span>
                </div>
                <p className="text-[hsl(40,40%,90%)] text-lg pt-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Learning remains consistent across all classes</p>
              </div>
            </div>
            <p className="text-center mt-10 text-xl text-primary font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Simple. Reliable. School-friendly.
            </p>
          </div>
        </section>

        {/* LEARNING EXPERIENCE */}
        <section className="py-20 px-4 bg-card/40 backdrop-blur-md">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(40,40%,90%)] mb-6 text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              Built for Classrooms
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="glass-card p-6 bg-card/60 backdrop-blur-md">
                <Tv className="w-10 h-10 text-primary mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <h3 className="text-xl font-semibold text-[hsl(40,40%,90%)] mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Optimized for Smart TVs</h3>
                <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Works seamlessly on Smart TVs and Android Boxes</p>
              </div>
              <div className="glass-card p-6 bg-card/60 backdrop-blur-md">
                <Zap className="w-10 h-10 text-primary mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <h3 className="text-xl font-semibold text-[hsl(40,40%,90%)] mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">High Quality</h3>
                <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Clear audio and high-quality visuals for better learning</p>
              </div>
              <div className="glass-card p-6 bg-card/60 backdrop-blur-md">
                <BookOpen className="w-10 h-10 text-primary mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <h3 className="text-xl font-semibold text-[hsl(40,40%,90%)] mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Easy Navigation</h3>
                <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Simple interface designed for classroom use</p>
              </div>
              <div className="glass-card p-6 bg-card/60 backdrop-blur-md">
                <Users className="w-10 h-10 text-primary mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <h3 className="text-xl font-semibold text-[hsl(40,40%,90%)] mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Guided Teaching</h3>
                <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Ideal for guided teaching and revision</p>
              </div>
            </div>
            <p className="text-center mt-10 text-lg text-[hsl(40,35%,85%)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              A consistent experience for every classroom.
            </p>
          </div>
        </section>

        {/* SECURITY & CONTROL */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(40,40%,90%)] mb-6 text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              A Platform Schools Can Trust
            </h2>
            <div className="glass-card p-8 md:p-12 mt-12 space-y-4 bg-card/60 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <div>
                  <p className="text-[hsl(40,40%,90%)] text-lg font-semibold mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">One secure school login</p>
                  <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Single authentication for all school access</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Lock className="w-6 h-6 text-primary mt-1 flex-shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <div>
                  <p className="text-[hsl(40,40%,90%)] text-lg font-semibold mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">No public sharing</p>
                  <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">No open access or public sharing of content</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <div>
                  <p className="text-[hsl(40,40%,90%)] text-lg font-semibold mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Controlled content availability</p>
                  <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Content access managed and controlled</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <div>
                  <p className="text-[hsl(40,40%,90%)] text-lg font-semibold mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">OTP-based password recovery</p>
                  <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Secure account recovery system</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Lock className="w-6 h-6 text-primary mt-1 flex-shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <div>
                  <p className="text-[hsl(40,40%,90%)] text-lg font-semibold mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">School data remains private</p>
                  <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Complete privacy and data protection</p>
                </div>
              </div>
            </div>
            <p className="text-center mt-8 text-xl text-primary font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Safe digital learning — by design.
            </p>
          </div>
        </section>

        {/* SCALE & RELIABILITY */}
        <section className="py-20 px-4 bg-card/40 backdrop-blur-md">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(40,40%,90%)] mb-12 text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              Scale & Reliability
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-8 text-center bg-card/60 backdrop-blur-md">
                <Users className="w-12 h-12 text-primary mx-auto mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <h3 className="text-2xl font-semibold text-[hsl(40,40%,90%)] mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Thousands of Schools</h3>
                <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Supports thousands of schools simultaneously</p>
              </div>
              <div className="glass-card p-8 text-center bg-card/60 backdrop-blur-md">
                <Zap className="w-12 h-12 text-primary mx-auto mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <h3 className="text-2xl font-semibold text-[hsl(40,40%,90%)] mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Large Student Strength</h3>
                <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Handles large student strength per school</p>
              </div>
              <div className="glass-card p-8 text-center bg-card/60 backdrop-blur-md">
                <Tv className="w-12 h-12 text-primary mx-auto mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <h3 className="text-2xl font-semibold text-[hsl(40,40%,90%)] mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Smooth Playback</h3>
                <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Smooth video playback even during peak hours</p>
              </div>
              <div className="glass-card p-8 text-center bg-card/60 backdrop-blur-md">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <h3 className="text-2xl font-semibold text-[hsl(40,40%,90%)] mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">District-Wide Ready</h3>
                <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Ready for district-wide adoption</p>
              </div>
            </div>
            <p className="text-center mt-10 text-lg text-[hsl(40,35%,85%)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              Built to grow with the education system.
            </p>
          </div>
        </section>

        {/* PRICING */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(40,40%,90%)] mb-6 text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              Simple, Transparent Pricing
            </h2>
            <div className="glass-card p-8 md:p-12 mt-12 bg-card/60 backdrop-blur-md">
              <div className="text-center mb-8">
                <p className="text-5xl font-bold text-primary mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">₹1,500</p>
                <p className="text-xl text-[hsl(40,35%,85%)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">per person per year</p>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                  <div className="flex items-center gap-2">
                    <img src={logo} alt="Viswam OTT Logo" className="w-8 h-8 object-contain" />
                    <p className="text-[hsl(40,40%,90%)] text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Access to Viswam OTT</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                  <p className="text-[hsl(40,40%,90%)] text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">All Viswam-provided learning content</p>
                </div>
                <div className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                  <p className="text-[hsl(40,40%,90%)] text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Classroom usage on Smart TVs</p>
                </div>
                <div className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                  <p className="text-[hsl(40,40%,90%)] text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Hosting, security, and support</p>
                </div>
              </div>
              <p className="text-center text-xl text-primary font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                No hidden costs. No surprises.
              </p>
            </div>
          </div>
        </section>

        {/* WHY VISWAM OTT */}
        <section className="py-20 px-4 bg-card/40 backdrop-blur-md">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-12">
              <img src={logo} alt="Viswam OTT Logo" className="w-20 h-20 md:w-24 md:h-24 object-contain" />
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(40,40%,90%)] text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                Why Viswam OTT
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-6 bg-card/60 backdrop-blur-md">
                <p className="text-[hsl(40,40%,90%)] text-lg font-semibold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Education-first platform</p>
                <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Built specifically for educational needs</p>
              </div>
              <div className="glass-card p-6 bg-card/60 backdrop-blur-md">
                <p className="text-[hsl(40,40%,90%)] text-lg font-semibold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Trusted content from Viswam</p>
                <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Curated and verified learning materials</p>
              </div>
              <div className="glass-card p-6 bg-card/60 backdrop-blur-md">
                <p className="text-[hsl(40,40%,90%)] text-lg font-semibold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">No ads or distractions</p>
                <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Focused learning environment</p>
              </div>
              <div className="glass-card p-6 bg-card/60 backdrop-blur-md">
                <p className="text-[hsl(40,40%,90%)] text-lg font-semibold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Simple for schools to adopt</p>
                <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Easy setup and implementation</p>
              </div>
              <div className="glass-card p-6 md:col-span-2 bg-card/60 backdrop-blur-md">
                <p className="text-[hsl(40,40%,90%)] text-lg font-semibold mb-2 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Long-term academic value</p>
                <p className="text-[hsl(40,35%,85%)] text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Sustained learning outcomes</p>
              </div>
            </div>
            <p className="text-center mt-10 text-xl text-primary font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Built for learning. Not entertainment.
            </p>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section id="contact" className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(40,40%,90%)] mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              Bring Structured Digital Learning to Your School
            </h2>
            <p className="text-xl text-[hsl(40,35%,85%)] mb-10 max-w-2xl mx-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              Empower classrooms with trusted digital content — securely and simply.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gold-button text-lg px-8 py-6" asChild>
                <a href="#contact">Request a Demo</a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary/10" asChild>
                <a href="#contact">Contact Us</a>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-3 mt-12">
              <img src={logo} alt="Viswam OTT Logo" className="w-12 h-12 object-contain" />
              <p className="text-2xl font-display text-primary font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                Viswam OTT — Where Learning Stays Focused.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border/30 bg-card/40 backdrop-blur-md">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2">
              <img src={logo} alt="Viswam OTT Logo" className="w-10 h-10 object-contain" />
              <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                © 2024 Viswam OTT. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;

