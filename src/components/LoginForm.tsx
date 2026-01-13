import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { API_ENDPOINTS } from "@/config/api";

const LoginForm = () => {
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
      const response = await fetch(API_ENDPOINTS.AUTH.SCHOOL_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token
        localStorage.setItem("schoolToken", data.token);
        localStorage.setItem("school", JSON.stringify(data.school));
        // Redirect to dashboard
        navigate("/dashboard");
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
    <div className="p-8 md:p-12 w-full max-w-md mx-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-2xl">
      {/* Logo / Brand */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <img src={logo} alt="Viswam OTT Logo" className="w-24 h-24 md:w-32 md:h-32 object-contain" />
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-[hsl(40,40%,90%)] tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            Viswam OTT
          </h1>
        </div>
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
            placeholder="Your Password"
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

      {/* Sign Up Link */}
      <div className="mt-8 text-center">
        <p className="text-[hsl(40,35%,85%)] text-sm drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          Not a Subscriber?{" "}
          <a
            href="#"
            className="text-primary hover:text-gold-light transition-colors font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
          >
            SignUp
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
