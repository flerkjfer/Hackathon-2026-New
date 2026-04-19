import { useEffect, useMemo, useState } from "react";
import AccountSetupModal from "./components/AccountSetupModal";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import {
  accountsKey,
  demoCredentials,
  onboardingKeyPrefix,
  quoteOptions,
  sessionKey,
} from "./data/appData";

const emptySetupForm = {
  birthDate: "",
  location: "",
  gender: "",
  occupation: "",
};

function getAccounts() {
  const savedAccounts = window.localStorage.getItem(accountsKey);
  return savedAccounts ? JSON.parse(savedAccounts) : {};
}

function saveAccounts(accounts) {
  window.localStorage.setItem(accountsKey, JSON.stringify(accounts));
}

function getOnboardingKey(email) {
  return `${onboardingKeyPrefix}:${email.toLowerCase()}`;
}

function getOnboardingRecord(email) {
  const savedRecord = window.localStorage.getItem(getOnboardingKey(email));
  return savedRecord ? JSON.parse(savedRecord) : null;
}

function saveOnboardingRecord(email, record) {
  window.localStorage.setItem(getOnboardingKey(email), JSON.stringify(record));
}

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
  const [setupForm, setSetupForm] = useState(emptySetupForm);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [needsAccountSetup, setNeedsAccountSetup] = useState(false);

  const quote = useMemo(() => {
    const index = Math.floor(Math.random() * quoteOptions.length);
    return quoteOptions[index];
  }, []);

  useEffect(() => {
    const savedSession = window.localStorage.getItem(sessionKey);
    if (savedSession) {
      const sessionUser = JSON.parse(savedSession);
      setUser(sessionUser);
      const onboardingRecord = getOnboardingRecord(sessionUser.email);
      setNeedsAccountSetup(!onboardingRecord?.completed);
      setShowSetupModal(!onboardingRecord);
      setSetupForm(onboardingRecord?.profile ?? emptySetupForm);
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
    const onboardingRecord = getOnboardingRecord(sessionUser.email);
    setNeedsAccountSetup(!onboardingRecord?.completed);
    setShowSetupModal(!onboardingRecord);
    setSetupForm(onboardingRecord?.profile ?? emptySetupForm);
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

      const accounts = getAccounts();
      const normalizedEmail = form.email.trim().toLowerCase();

      if (accounts[normalizedEmail]) {
        setError("An account with that email already exists.");
        return;
      }

      const newUser = {
        name: form.name.trim(),
        email: normalizedEmail,
      };

      accounts[normalizedEmail] = {
        ...newUser,
        password: form.password,
      };
      saveAccounts(accounts);
      persistSession(newUser);
      return;
    }

    const normalizedEmail = form.email.trim().toLowerCase();
    const accounts = getAccounts();
    const savedAccount = accounts[normalizedEmail];
    const isDemoLogin =
      normalizedEmail === demoCredentials.email && form.password === demoCredentials.password;

    if (savedAccount && savedAccount.password === form.password) {
      persistSession({
        name: savedAccount.name,
        email: savedAccount.email,
      });
      return;
    }

    if (!isDemoLogin) {
      setError("Use the demo login shown below or sign up with a new account.");
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
    setShowSetupModal(false);
    setNeedsAccountSetup(false);
    setSetupForm(emptySetupForm);
    window.localStorage.removeItem(sessionKey);
  };

  const handleHomeAction = (label) => {
    setHomeMessage(`${label} works.`);
    setShowProfileMenu(false);
  };

  const handleSetupChange = (event) => {
    const { name, value } = event.target;
    setSetupForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSetupClose = () => {
    if (!user) {
      return;
    }

    const existingRecord = getOnboardingRecord(user.email);

    if (!existingRecord) {
      saveOnboardingRecord(user.email, {
        completed: false,
        skipped: true,
        profile: null,
      });
    } else if (!existingRecord.completed) {
      saveOnboardingRecord(user.email, {
        ...existingRecord,
        skipped: true,
      });
    }

    setNeedsAccountSetup(true);
    setShowSetupModal(false);
    setShowProfileMenu(false);
    setSetupForm(emptySetupForm);
    setHomeMessage("Account setup skipped for now. You can finish it later from the avatar menu.");
  };

  const handleSetupSubmit = (event) => {
    event.preventDefault();

    const isComplete = Object.values(setupForm).every((value) => value.trim() !== "");
    if (!isComplete || !user) {
      setHomeMessage("Please complete all account setup questions before saving.");
      return;
    }

    saveOnboardingRecord(user.email, {
      completed: true,
      skipped: false,
      profile: setupForm,
    });

    setNeedsAccountSetup(false);
    setShowSetupModal(false);
    setShowProfileMenu(false);
    setSetupForm(emptySetupForm);
    setHomeMessage("Account setup complete.");
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
    <>
      <HomePage
        homeMessage={homeMessage}
        needsAccountSetup={needsAccountSetup}
        onCompleteAccountSetup={() => {
          const onboardingRecord = getOnboardingRecord(user.email);
          setSetupForm(onboardingRecord?.profile ?? emptySetupForm);
          setShowSetupModal(true);
          setShowProfileMenu(false);
        }}
        onHomeAction={handleHomeAction}
        onLogout={handleLogout}
        onToggleProfileMenu={() => setShowProfileMenu((current) => !current)}
        quote={quote}
        showProfileMenu={showProfileMenu}
        user={user}
      />
      {showSetupModal ? (
        <AccountSetupModal
          form={setupForm}
          onChange={handleSetupChange}
          onClose={handleSetupClose}
          onSubmit={handleSetupSubmit}
        />
      ) : null}
    </>
  );
}

export default WellnessApp;
