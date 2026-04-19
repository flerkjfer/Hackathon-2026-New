import { homeActions } from "../data/appData";

function HomePage({
  homeMessage,
  needsAccountSetup,
  onCompleteAccountSetup,
  onHomeAction,
  onLogout,
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
                  {needsAccountSetup ? (
                    <button type="button" className="menu-button" onClick={onCompleteAccountSetup}>
                      Finish setting up account
                    </button>
                  ) : null}
                  <button type="button" className="menu-button" onClick={() => onHomeAction("Settings")}>
                    Settings
                  </button>
                  <button type="button" className="menu-button" onClick={() => onHomeAction("Guest user")}>
                    Guest user
                  </button>
                  <button type="button" className="menu-button" onClick={() => onHomeAction("Random")}>
                    Random
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
                  onClick={() => onHomeAction(action.label)}
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
