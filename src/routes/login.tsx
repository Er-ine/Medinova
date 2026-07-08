import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FiMail, FiLock, FiArrowRight, FiCalendar, FiVideo, FiShield } from "react-icons/fi";
import { FaHeartbeat } from "react-icons/fa";
import { API_BASE_URL } from "../lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — MediCare" }, { name: "description", content: "Sign in to manage your appointments and health records." }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userRole", data.user.role);
      
      if (data.user.role === "admin") {
        navigate({ to: "/admin-dashboard" });
      } else if (data.user.role === "doctor") {
        navigate({ to: "/doctor-dashboard" });
      } else {
        navigate({ to: "/patient-dashboard" });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="mark"><FaHeartbeat /></span>
          <span>MediCare</span>
        </div>
        <div className="auth-hero">
          <h1>Welcome back to better, simpler healthcare.</h1>
          <p>Sign in to view your upcoming appointments, message your doctor, and stay on top of your health journey.</p>
        </div>
        <div className="auth-illus">
          <div className="tile"><div className="ic"><FiCalendar /></div><div><b>Instant booking</b><span>Live slots, one tap to confirm</span></div></div>
          <div className="tile"><div className="ic"><FiVideo /></div><div><b>Video consults</b><span>Secure care from your home</span></div></div>
          <div className="tile"><div className="ic"><FiShield /></div><div><b>Bank-grade security</b><span>Your records are encrypted</span></div></div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="sub">Please enter your details to sign in.</p>

          <form className="auth-form" onSubmit={submit} style={{ marginTop: 22 }}>
            <div className="med-field">
              <label>Email address</label>
              <div className="med-input-wrap">
                <FiMail />
                <input className="med-input" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="med-field">
              <label>Password</label>
              <div className="med-input-wrap">
                <FiLock />
                <input className="med-input" type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <div className="auth-row">
              <label><input type="checkbox" defaultChecked /> Remember me</label>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading} className="med-btn med-btn-primary med-btn-block med-btn-lg" style={{ opacity: loading ? 0.6 : 1 }}>
              {loading ? "Signing In..." : <>Sign In <FiArrowRight /></>}
            </button>
            {error && <div style={{ color: "var(--med-danger)", fontSize: 13, marginTop: 12, textAlign: "center" }}>{error}</div>}
          </form>

          <div className="auth-foot">
            New to MediCare? <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
