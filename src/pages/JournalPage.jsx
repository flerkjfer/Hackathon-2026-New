function JournalPage({
  activeJournalId,
  journalSavedAt,
  journalText,
  journalTitle,
  journals,
  onBackHome,
  onJournalChange,
  onJournalNew,
  onJournalSave,
  onJournalSelect,
  onJournalTitleChange,
  onLogout,
  user,
}) {
  return (
    <main className="app-shell">
      <section className="journal-viewport">
        <div className="home-overlay" />
        <section className="journal-surface">
          <div className="home-topbar">
            <div>
              <p className="eyebrow">Journal</p>
              <h1>Write your thoughts out in one place.</h1>
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

          <section className="journal-layout">
            <article className="journal-editor glass-card">
              <div className="journal-page-header">
                <div>
                  <p className="feature-label">Journal</p>
                  <h2>{user.name}'s journal</h2>
                </div>
                {journalSavedAt ? (
                  <p className="journal-day-badge">Saved {new Date(journalSavedAt).toLocaleString()}</p>
                ) : null}
              </div>

              <p className="small-note">
                These journals are just saved notes for the demo. Give each one a title, write whatever you want, and
                hit Save.
              </p>

              <label className="journal-title-field top-gap">
                Title
                <input
                  type="text"
                  value={journalTitle}
                  onChange={onJournalTitleChange}
                  placeholder="Name this journal"
                />
              </label>

              <textarea
                className="journal-page-textarea"
                name="journalText"
                value={journalText}
                onChange={onJournalChange}
                placeholder="Type your note here"
                rows="14"
              />

              <div className="button-row journal-actions">
                <button type="button" className="secondary-button" onClick={onJournalNew}>
                  New journal
                </button>
                <button type="button" onClick={onJournalSave}>
                  Save journal
                </button>
              </div>
            </article>

            <aside className="journal-sidecard glass-card">
              <p className="feature-label">Journals</p>
              <h3>Your saved notes.</h3>
              <p className="small-note">Create multiple journals and swap between them.</p>

              <div className="journal-entry-list top-gap">
                {journals.length === 0 ? (
                  <div className="journal-tip-card">
                    <strong>No journals yet</strong>
                    <span>Create one with “New journal”.</span>
                  </div>
                ) : (
                  journals.map((journal) => (
                    <button
                      key={journal.id}
                      type="button"
                      className={`journal-entry-button ${
                        journal.id === activeJournalId ? "journal-entry-button-active" : ""
                      }`}
                      onClick={() => onJournalSelect(journal.id)}
                    >
                      <strong>{journal.title || "Journal"}</strong>
                      <span>{(journal.text ?? "").slice(0, 72)}</span>
                    </button>
                  ))
                )}
              </div>
            </aside>
          </section>
        </section>
      </section>
    </main>
  );
}

export default JournalPage;
