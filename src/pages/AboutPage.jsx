function AboutPage({ onBackHome, onLogout }) {
  return (
    <main className="app-shell">
      <section className="about-viewport">
        <div className="home-overlay" />
        <section className="about-surface">
          <div className="home-topbar">
            <div>
              <p className="eyebrow">About Us</p>
              <h1>We want support to feel easier to reach.</h1>
            </div>

            <div className="button-row">
              <button type="button" className="secondary-button" onClick={onBackHome}>
                Back home
              </button>
              <button type="button" onClick={onLogout}>
                Log out
              </button>
            </div>
          </div>

          <section className="about-layout">
            <article className="about-main glass-card">
              <p className="feature-label">Our mission</p>
              <h2>Helping every person find a path to care, reflection, and support.</h2>
              <p>
                This website is built to make mental-health support feel more approachable. Our goal is to give each
                user a place where they can check in honestly, learn what kind of support they may need, and take a
                real next step instead of feeling stuck or alone.
              </p>
              <p>
                We want every person who uses this site to feel that help is possible. Whether someone needs a quiet
                moment to reflect, a practical tool for tracking how they feel, or guidance toward in-person care, the
                goal is the same: make it easier to reach support and easier to keep going.
              </p>
            </article>

            <aside className="about-side glass-card">
              <p className="feature-label">What we aim to do</p>
              <div className="about-goal-list">
                <div className="about-goal-card">
                  <strong>Encourage honest check-ins</strong>
                  <span>Give users a safe place to notice how they are actually feeling.</span>
                </div>
                <div className="about-goal-card">
                  <strong>Make help easier to find</strong>
                  <span>Point users toward supportive tools and local therapy resources when they need them.</span>
                </div>
                <div className="about-goal-card">
                  <strong>Keep support within reach</strong>
                  <span>Help each person feel that they can and will get help using this website.</span>
                </div>
              </div>
            </aside>
          </section>
        </section>
      </section>
    </main>
  );
}

export default AboutPage;
