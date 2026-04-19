import { useEffect, useMemo, useState } from "react";
import AccountSetupModal from "./components/AccountSetupModal";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MindMapPage from "./pages/MindMapPage";
import TodoListPage from "./pages/TodoListPage";
import {
  accountsKey,
  demoCredentials,
  mentalMeterKeyPrefix,
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

const dailyLoginBoost = 1.1;
const homeActionBoost = 0.7;
const profileActionBoost = 0.4;
const setupCompleteBoost = 1.4;
const setupReturnBoost = 0.5;
const todoCompletionBoost = 1.8;
const inactivityPenalty = 5;

function createBaseMeter() {
  return {
    score: 18,
    streak: 1,
    activityCount: 0,
    lastVisitDate: "",
    lastAction: "Ready to begin",
  };
}

function clampMeterScore(value) {
  return Math.max(0, Math.min(100, Number(value.toFixed(1))));
}

function getTodayStamp() {
  return new Date().toISOString().slice(0, 10);
}

function getDayDifference(previousStamp, nextStamp) {
  if (!previousStamp || !nextStamp) {
    return null;
  }

  const previousDate = new Date(`${previousStamp}T00:00:00`);
  const nextDate = new Date(`${nextStamp}T00:00:00`);
  return Math.round((nextDate - previousDate) / 86400000);
}

function getMentalMeterKey(email) {
  return `${mentalMeterKeyPrefix}:${email.toLowerCase()}`;
}

function getMentalMeterRecord(email) {
  const savedRecord = window.localStorage.getItem(getMentalMeterKey(email));
  return savedRecord ? JSON.parse(savedRecord) : null;
}

function saveMentalMeterRecord(email, record) {
  window.localStorage.setItem(getMentalMeterKey(email), JSON.stringify(record));
}

function applyMeterActivity(currentRecord, amount, action, options = {}) {
  const today = getTodayStamp();
  const baseRecord = currentRecord ?? createBaseMeter();
  const updatedRecord = {
    ...baseRecord,
    score: clampMeterScore(baseRecord.score + amount),
    activityCount: baseRecord.activityCount + 1,
    lastAction: action,
    lastVisitDate: options.updateVisitDate ? today : baseRecord.lastVisitDate,
    streak: options.nextStreak ?? baseRecord.streak,
  };

  return updatedRecord;
}

function recordLoginActivity(email) {
  const savedRecord = getMentalMeterRecord(email);
  const today = getTodayStamp();

  if (!savedRecord) {
    const firstRecord = {
      ...createBaseMeter(),
      score: clampMeterScore(createBaseMeter().score + dailyLoginBoost),
      activityCount: 1,
      streak: 1,
      lastVisitDate: today,
      lastAction: "Daily login check-in",
    };

    saveMentalMeterRecord(email, firstRecord);
    return firstRecord;
  }

  const dayDifference = getDayDifference(savedRecord.lastVisitDate, today);

  if (!dayDifference || dayDifference <= 0) {
    return savedRecord;
  }

  const inactivityDrop = dayDifference > 7 ? inactivityPenalty : 0;
  const updatedRecord = applyMeterActivity(
    savedRecord,
    dailyLoginBoost - inactivityDrop,
    dayDifference > 7 ? "Returned after a long break" : "Daily login check-in",
    {
    updateVisitDate: true,
    nextStreak: dayDifference === 1 ? savedRecord.streak + 1 : 1,
    }
  );

  saveMentalMeterRecord(email, updatedRecord);
  return updatedRecord;
}

function getMentalMeterStage(score) {
  if (score >= 82) {
    return {
      label: "Calm focus",
      description: "You have a steady rhythm and a strong sense of momentum.",
      tone: "meter-stage-peak",
    };
  }

  if (score >= 60) {
    return {
      label: "Moving upward",
      description: "Your consistency is showing. Keep stacking small check-ins.",
      tone: "meter-stage-rising",
    };
  }

  if (score >= 35) {
    return {
      label: "Finding balance",
      description: "You are building a healthier pace one action at a time.",
      tone: "meter-stage-steady",
    };
  }

  return {
    label: "Getting started",
    description: "The meter rises slowly, so each login and activity still matters.",
    tone: "meter-stage-low",
  };
}

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
  const [currentScreen, setCurrentScreen] = useState("home");
  const [mentalMeter, setMentalMeter] = useState(() => {
    const baseMeter = createBaseMeter();
    return {
      ...baseMeter,
      stage: getMentalMeterStage(baseMeter.score),
    };
  });

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
      const meterRecord = recordLoginActivity(sessionUser.email);
      setMentalMeter({
        ...meterRecord,
        stage: getMentalMeterStage(meterRecord.score),
      });
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
    const meterRecord = recordLoginActivity(sessionUser.email);
    setMentalMeter({
      ...meterRecord,
      stage: getMentalMeterStage(meterRecord.score),
    });
  };

  const boostMentalMeter = (amount, action) => {
    if (!user) {
      return;
    }

    const currentRecord = getMentalMeterRecord(user.email) ?? createBaseMeter();
    const updatedRecord = applyMeterActivity(currentRecord, amount, action);
    saveMentalMeterRecord(user.email, updatedRecord);
    setMentalMeter({
      ...updatedRecord,
      stage: getMentalMeterStage(updatedRecord.score),
    });
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
    setCurrentScreen("home");
    setShowProfileMenu(false);
    setShowSetupModal(false);
    setNeedsAccountSetup(false);
    setSetupForm(emptySetupForm);
    setMentalMeter({
      ...createBaseMeter(),
      stage: getMentalMeterStage(createBaseMeter().score),
    });
    window.localStorage.removeItem(sessionKey);
  };

  const handleHomeAction = (actionIdOrLabel, actionLabel) => {
    if (actionIdOrLabel === "mind-maps") {
      boostMentalMeter(homeActionBoost, "Opened mind maps");
      setCurrentScreen("mindmaps");
      setShowProfileMenu(false);
      return;
    }

    if (actionIdOrLabel === "todo-list") {
      boostMentalMeter(homeActionBoost, "Opened to do list");
      setCurrentScreen("todo");
      setShowProfileMenu(false);
      return;
    }

    const label = actionLabel ?? actionIdOrLabel;
    setHomeMessage(`${label} works.`);
    setShowProfileMenu(false);
    boostMentalMeter(
      actionLabel ? homeActionBoost : profileActionBoost,
      `Used ${label}`
    );
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
    boostMentalMeter(setupReturnBoost, "Checked account setup");
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
    boostMentalMeter(setupCompleteBoost, "Completed account setup");
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
      {currentScreen === "home" ? (
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
          mentalMeter={mentalMeter}
        />
      ) : currentScreen === "mindmaps" ? (
        <MindMapPage
          onBackHome={() => setCurrentScreen("home")}
          onLogout={handleLogout}
          user={user}
        />
      ) : (
        <TodoListPage
          onBackHome={() => setCurrentScreen("home")}
          onLogout={handleLogout}
          onTaskCompleted={(taskTitle) => {
            boostMentalMeter(todoCompletionBoost, `Completed task: ${taskTitle}`);
          }}
          user={user}
        />
      )}
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
