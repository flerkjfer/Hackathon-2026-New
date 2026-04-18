import { useEffect, useMemo, useState } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { demoCredentials, quoteOptions, sessionKey } from "./data/appData";

function WellnessApp() {
  const [authMode, setAuthMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [homeMessage, setHomeMessage] = useState("Welcome back. Click any button for a quick sanity check.");

  const quote = useMemo(() => {
    const index = Math.floor(Math.random() * quoteOptions.length);
    return quoteOptions[index];
  }, []);

  useEffect(() => {
    const savedSession = window.localStorage.getItem(sessionKey);
    if (savedSession) {
      setUser(JSON.parse(savedSession));
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const persistSession = (sessionUser) => {
    setUser(sessionUser);
    window.localStorage.setItem(sessionKey, JSON.stringify(sessionUser));
    setError("");
    setShowProfileMenu(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (authMode === "signup") {
      if (!form.name.trim()) {
        setError("Please enter your name.");
        return;
      }

      if (form.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      persistSession({
        name: form.name.trim(),
        email: form.email.trim(),
      });
      return;
    }

    if (
      form.email.trim().toLowerCase() !== demoCredentials.email ||
      form.password !== demoCredentials.password
    ) {
      setError("Use the demo login shown below to enter the app.");
      return;
    }

    persistSession({
      name: demoCredentials.name,
      email: demoCredentials.email,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setShowProfileMenu(false);
    window.localStorage.removeItem(sessionKey);
  };

  const handleHomeAction = (label) => {
    setHomeMessage(`${label} works.`);
    setShowProfileMenu(false);
  };

  if (!user) {
    return (
      <LoginPage
        authMode={authMode}
        form={form}
        error={error}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onSwitchMode={(mode) => {
          setAuthMode(mode);
          setError("");
        }}
      />
    );
  }

  return (
    <HomePage
      homeMessage={homeMessage}
      onHomeAction={handleHomeAction}
      onLogout={handleLogout}
      onToggleProfileMenu={() => setShowProfileMenu((current) => !current)}
      quote={quote}
      showProfileMenu={showProfileMenu}
      user={user}
    />
  );
}

export default WellnessApp;
