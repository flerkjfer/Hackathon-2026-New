import { demoCredentials } from "../data/appData";

function LoginPage({ authMode, error, form, onChange, onSubmit, onSwitchMode }) {
  return (
    <main className="app-shell auth-shell">
      <section className="auth-overlay" />
      <section className="auth-layout">
        <div className="auth-copy">
          <p className="eyebrow">Welcome</p>
          <h1>Your calm place to reset and refocus.</h1>
          <p className="hero-copy">Log in to see your home, journals, mind maps, and to-do list.</p>
          <div className="demo-card">
            <p className="feature-label">Demo login</p>
            <p>Email: {demoCredentials.email}</p>
            <p>Password: {demoCredentials.password}</p>
          </div>
        </div>

        <section className="auth-card">
          <div className="auth-toggle">
            <button
              type="button"
              className={`auth-toggle-button ${authMode === "login" ? "auth-toggle-button-active" : ""}`}
              onClick={() => onSwitchMode("login")}
            >
              Log in
            </button>
            <button
              type="button"
              className={`auth-toggle-button ${authMode === "signup" ? "auth-toggle-button-active" : ""}`}
              onClick={() => onSwitchMode("signup")}
            >
              Sign up
            </button>
          </div>

          <div className="panel-heading">
            <h2>{authMode === "login" ? "Welcome back" : "Create your account"}</h2>
            <p>{authMode === "login" ? "Sign in to continue to your homepage." : "Create a simple account and continue."}</p>
          </div>

          <form className="crud-form" onSubmit={onSubmit}>
            {authMode === "signup" ? (
              <label>
                Full name
                <input name="name" value={form.name} onChange={onChange} placeholder="Your name" />
              </label>
            ) : null}

            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
              />
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="Enter your password"
              />
            </label>

            {authMode === "signup" ? (
              <label>
                Confirm password
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={onChange}
                  placeholder="Confirm password"
                />
              </label>
            ) : null}

            {error ? <p className="error-text">{error}</p> : null}

            <button type="submit">{authMode === "login" ? "Enter homepage" : "Create account"}</button>
          </form>
        </section>
      </section>
    </main>
  );
}

export default LoginPage;
