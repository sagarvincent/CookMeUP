import { useState } from 'react';

// ─────────────────────── AuthScreen ─────────────── START ──────────────────
// calls:     login, register (passed from L2/useAuth via L1/App)
// called by: L1/App (when appData is loaded but user is null)
//
// Two-mode form: Sign in ↔ Create account.  On success the parent's useAuth
// state updates, causing re-render without needing an explicit onAuth callback.
// ─────────────────────── AuthScreen ─────────────── END ────────────────────
export default function AuthScreen({ login, register, error, clearError }) {
  const [mode, setMode]  = useState('login');        // 'login' | 'register'
  const [form, setForm]  = useState({ email: '', password: '', name: '' });
  const [busy, setBusy]  = useState(false);

  const set = (k, v) => { clearError(); setForm(f => ({ ...f, [k]: v })); };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      mode === 'login'
        ? await login(form.email, form.password)
        : await register(form.email, form.password, form.name);
      // useAuth in App.jsx now has user set — App re-renders and unmounts AuthScreen
    } catch {
      // error is already set in useAuth via App.jsx's instance
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      background: "var(--paper)",
    }}>

      {/* Left panel — brand */}
      <div style={{
        background: "var(--brick)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px 64px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorative circles */}
        <div style={{ position: "absolute", bottom: -120, left: -120, width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(255,255,255,.12)", pointerEvents: "none" }}/>
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", border: "1px solid rgba(255,255,255,.08)", pointerEvents: "none" }}/>
        <div style={{ position: "absolute", top: 40, right: -80, width: 280, height: 280, borderRadius: "50%", border: "1px solid rgba(255,255,255,.08)", pointerEvents: "none" }}/>

        <div style={{ fontFamily: "var(--f-display)", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", marginBottom: 16 }}>
          Mise &amp; Plate
        </div>
        <h1 style={{ fontFamily: "var(--f-serif)", fontSize: 56, lineHeight: 1.05, color: "#fff", marginBottom: 20 }}>
          The house is<br/>
          <span style={{ fontStyle: "italic" }}>open.</span>
        </h1>
        <p style={{ fontFamily: "var(--f-serif)", fontSize: 17, lineHeight: 1.6, color: "rgba(255,255,255,.72)", maxWidth: 360 }}>
          Your pantry, your plan, your recipes — all in one kitchen.
          Cook with confidence. Shop with precision.
        </p>
        <div style={{ marginTop: 48, fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".12em", color: "rgba(255,255,255,.4)", textTransform: "uppercase" }}>
          Vol. I · Est. 2025
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 64px" }}>

        {/* Tab toggle */}
        <div className="row gap-0" style={{ background: "var(--paper-2)", borderRadius: 8, padding: 3, marginBottom: 36, width: "fit-content" }}>
          {[['login','Sign in'],['register','Create account']].map(([m, label]) => (
            <button
              key={m}
              onClick={() => { setMode(m); clearError(); }}
              style={{
                padding: "9px 20px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--f-mono)",
                fontSize: 12,
                letterSpacing: ".08em",
                background: mode === m ? "var(--paper)" : "transparent",
                color: mode === m ? "var(--ink)" : "var(--ink-3)",
                boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,.1)" : "none",
                transition: "all .15s",
              }}
            >{label}</button>
          ))}
        </div>

        <h2 style={{ fontFamily: "var(--f-serif)", fontSize: 32, marginBottom: 6 }}>
          {mode === 'login' ? 'Welcome back.' : 'Join the kitchen.'}
        </h2>
        <p style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", color: "var(--ink-3)", fontSize: 15, marginBottom: 32 }}>
          {mode === 'login'
            ? 'Enter your email and password to continue.'
            : 'Create your account to start cooking.'}
        </p>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>

          {mode === 'register' && (
            <Field label="Name" type="text" value={form.name} onChange={v => set('name', v)} placeholder="Your name" required/>
          )}
          <Field label="Email" type="email" value={form.email} onChange={v => set('email', v)} placeholder="you@example.com" required/>
          <Field label="Password" type="password" value={form.password} onChange={v => set('password', v)} placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'} required/>

          {error && (
            <div style={{ padding: "10px 14px", background: "hsl(0 60% 96%)", border: "1px solid hsl(0 60% 88%)", borderRadius: 6, fontFamily: "var(--f-sans, sans-serif)", fontSize: 13, color: "hsl(0 60% 40%)" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn btn-brick btn-lg"
            style={{ marginTop: 8, justifyContent: "center", opacity: busy ? .6 : 1 }}
          >
            {busy ? 'Just a moment…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>

          {mode === 'login' && (
            <div style={{ textAlign: "center", fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>
              Demo: <span style={{ fontStyle: "normal", fontFamily: "var(--f-mono)", fontSize: 11 }}>demo@mise-and-plate.com / password123</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// ─────────────────────── Field ─────────────── START ──────────────────
// calls:     (none)
// called by: AuthScreen
function Field({ label, type, value, onChange, placeholder, required }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: "var(--f-display)", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-2)" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{
          padding: "11px 14px",
          border: "1px solid var(--line)",
          borderRadius: 6,
          background: "var(--paper)",
          fontFamily: "var(--f-serif)",
          fontSize: 15,
          color: "var(--ink)",
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
        }}
        onFocus={e => e.target.style.borderColor = 'var(--brick)'}
        onBlur={e  => e.target.style.borderColor = 'var(--line)'}
      />
    </div>
  );
}
// ─────────────────────── Field ─────────────── END ────────────────────
