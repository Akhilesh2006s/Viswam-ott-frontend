import luxuryBg from "@/assets/luxury-bg.jpg";
import LoginForm from "@/components/LoginForm";
import GoldLines from "@/components/GoldLines";

const Login = () => {
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
        <div>
          <LoginForm />
          <div className="mt-4 text-center">
            <a
              href="/super-admin/login"
              className="text-primary hover:text-gold-light transition-colors font-medium text-sm drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
            >
              Super Admin Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

