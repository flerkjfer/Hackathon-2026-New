import { homeActions } from "../data/appData";

function HomePage({
  homeMessage,
  mentalMeter,
  needsAccountSetup,
  onCompleteAccountSetup,
  onEditAccount,
  onHomeAction,
  onLogout,
  onOpenSettings,
  onToggleProfileMenu,
  quote,
  showProfileMenu,
  user,
}) {
  return (
    <main className="app-shell">
      <section className="home-viewport">
        <div className="home-overlay" />
        <section className="home-surface">
          <div className="home-topbar">
            <div>
              <p className="eyebrow">Signed In</p>
              <h1>Welcome, {user.name}.</h1>
            </div>

            <div className="profile-menu-wrap">
              <button
                type="button"
                className="profile-button"
                aria-label="Profile"
                onClick={onToggleProfileMenu}
              >
                <span className="profile-head" />
                <span className="profile-body" />
              </button>

              {showProfileMenu ? (
                <div className="profile-menu">
                  <button
                    type="button"
                    className="menu-button"
                    onClick={needsAccountSetup ? onCompleteAccountSetup : onEditAccount}
                  >
                    {needsAccountSetup ? "Finish setting up account" : "View / edit account"}
                  </button>
                  <button type="button" className="menu-button" onClick={onOpenSettings}>
                    Settings
                  </button>
                  <button type="button" className="menu-button" onClick={onLogout}>
                    Log out
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="home-main-grid">
            <aside className="home-rail">
              {homeActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className="rail-button"
                  onClick={() => onHomeAction(action.id, action.label)}
                >
                  <span className="rail-button-inner">{action.label}</span>
                </button>
              ))}
            </aside>

            <section className="home-center">
              <div className="quote-card">
                <p className="quote-label">Positive quote</p>
                <blockquote>"{quote}"</blockquote>
              </div>

              <div className={`mental-meter-card glass-card ${mentalMeter.stage.tone}`}>
                <div className="mental-meter-topline">
                  <div>
                    <p className="mental-meter-label">Mental meter</p>
                    <h2>{mentalMeter.stage.label}</h2>
                  </div>
                  <p className="mental-meter-score">{Math.round(mentalMeter.score)}%</p>
                </div>

                <div
                  className="mental-meter-track"
                  role="progressbar"
                  aria-label="Mental meter progress"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={Math.round(mentalMeter.score)}
                >
                  <div className="mental-meter-fill" style={{ width: `${mentalMeter.score}%` }} />
                </div>

                <p className="mental-meter-copy">{mentalMeter.stage.description}</p>

                <div className="mental-meter-stats">
                  <div className="mental-stat-card">
                    <span>Last boost</span>
                    <strong>{mentalMeter.lastAction}</strong>
                  </div>
                  <div className="mental-stat-card">
                    <span>Current streak</span>
                    <strong>{mentalMeter.streak} day{mentalMeter.streak === 1 ? "" : "s"}</strong>
                  </div>
                  <div className="mental-stat-card">
                    <span>Activity count</span>
                    <strong>{mentalMeter.activityCount} check-ins</strong>
                  </div>
                </div>
              </div>

              <div className="home-content">
                <div className="home-copy glass-card">
                  <h2>Your homepage</h2>
                  <p>
                    This is the clean signed-in destination for now. The login page comes first, and this homepage is
                    the next screen after the user gets in.
                  </p>
                  <p className="small-note">{homeMessage}</p>
                </div>

                <div className="feature-card glass-card">
                  <p className="feature-label">Sanity check</p>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <p className="small-note">
                    Use the side buttons or the profile menu and you should see a quick "{`x works`}" message appear.
                  </p>
                  <button type="button" onClick={onLogout}>
                    Log out
                  </button>
                </div>
              </div>
            </section>
          </div>
        </section>
      </section>
    </main>
  );
}

export default HomePage;
