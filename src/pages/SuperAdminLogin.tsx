import { useState } from "react";
import { useNavigate } from "react-router-dom";
import luxuryBg from "@/assets/luxury-bg.jpg";
import logo from "@/assets/logo.png";
import GoldLines from "@/components/GoldLines";
import { Button } from "@/components/ui/button";

const SuperAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://viswam-ott-backend-production.up.railway.app/api/auth/super-admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token
        localStorage.setItem("superAdminToken", data.token);
        localStorage.setItem("superAdmin", JSON.stringify(data.superAdmin));
        // Redirect to super admin dashboard
        navigate("/super-admin");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

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

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="p-8 md:p-12 w-full max-w-md mx-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-2xl">
          {/* Logo / Brand */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img src={logo} alt="Viswam OTT Logo" className="w-24 h-24 md:w-32 md:h-32 object-contain" />
              <h1 className="font-display text-4xl md:text-5xl font-semibold text-[hsl(40,40%,90%)] tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                Viswam OTT
              </h1>
            </div>
            <p className="text-sm text-[hsl(40,35%,85%)] mt-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              Super Admin Login
            </p>
          </div>

          {/* Login Title */}
          <div className="mb-8">
            <p className="text-[hsl(40,40%,90%)] text-sm tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Log in now
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md">
              <p className="text-red-300 text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="luxury-input"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="luxury-input"
                required
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="gold-button w-full"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          {/* Back to School Login */}
          <div className="mt-8 text-center">
            <a
              href="/login"
              className="text-primary hover:text-gold-light transition-colors font-medium text-sm drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
            >
              School Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;

