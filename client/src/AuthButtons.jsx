import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import './AuthButtons.css';

  // super-light “modal” with inline styles to keep this self-contained
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="overlayStyle">
      <div className="cardStyle">
        <button onClick={onClose} className="closeBtnStyle">✕</button>
        {children}
      </div>
    </div>
  );
}

export default function AuthButtons({ apiBase = "http://localhost:8080", onAuth }) {
    // mode ~ "login" | "signup" | null
  const [mode, setMode] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // login fields
  // email or username
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");

  // signup fields
  const [suEmail, setSuEmail] = useState("");
  const [suUsername, setSuUsername] = useState("");
  const [suPassword, setSuPassword] = useState("");

  // scoped axios instance for this component
  const api = useMemo(() => axios.create({ baseURL: apiBase }), [apiBase]);

  // hydrate axios global default header if a token already exists
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
  }, []);

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // decide if user typed an email or username
      const isEmail = /.+@.+\..+/.test(identifier);
      const payload = isEmail
        ? { email: identifier, password }
        : { username: identifier, password };

      const { data } = await api.post("/auth/login", payload);
      const { token, user } = data;

      if (!token) throw new Error("No token in response");
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setMode(null);
      setIdentifier("");
      setPassword("");
      onAuth && onAuth(user, token);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignupSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/signup", {
        email: suEmail,
        username: suUsername,
        password: suPassword,
      });
      const { token, user } = data;

      if (token) {
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      setMode(null);
      setSuEmail("");
      setSuUsername("");
      setSuPassword("");
      onAuth && onAuth(user, token);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <button onClick={() => setMode("login")} className="primaryBtn">Login</button>
      <button onClick={() => setMode("signup")} className="darkBtn">Sign up</button>

      <Modal open={!!mode} onClose={() => setMode(null)}>
        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="formStyle">
            {/* inputs unchanged */}
            <input
              className="inputStyle"
              placeholder="Email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <input
              className="inputStyle"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className="errorStyle">{error}</div>}
            <button type="submit" disabled={loading} className="primaryBtn">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="formStyle">
            {/* inputs unchanged */}
            <input
              className="inputStyle"
              placeholder="Email"
              type="email"
              value={suEmail}
              onChange={(e) => setSuEmail(e.target.value)}
              required
            />
            <input
              className="inputStyle"
              placeholder="Username"
              value={suUsername}
              onChange={(e) => setSuUsername(e.target.value)}
              required
            />
            <input
              className="inputStyle"
              placeholder="Password"
              type="password"
              value={suPassword}
              onChange={(e) => setSuPassword(e.target.value)}
              required
            />
            {error && <div className="errorStyle">{error}</div>}
            <button type="submit" disabled={loading} className="darkBtn">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
