function JournalPage({
  journalEntry,
  journalRecord,
  selectedJournalDate,
  onBackHome,
  onJournalChange,
  onJournalDateSelect,
  onJournalSave,
  onLogout,
  user,
}) {
  const savedEntryDates = Object.keys(journalRecord.entries).sort((left, right) =>
    left < right ? 1 : -1
  );
  const selectedEntryPreview = selectedJournalDate ? journalRecord.entries[selectedJournalDate] ?? "" : "";

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
                  <p className="feature-label">Daily check-in</p>
                  <h2>{user.name}'s journal</h2>
                </div>
                <div className="journal-header-controls">
                  <label className="journal-date-picker">
                    Entry date
                    <input
                      type="date"
                      value={selectedJournalDate}
                      onChange={(event) => onJournalDateSelect(event.target.value)}
                    />
                  </label>
                  <p className="journal-day-badge">
                    {journalRecord.lastEntryDate
                      ? `Last saved: ${journalRecord.lastEntryDate}`
                      : "No entries yet"}
                  </p>
                </div>
              </div>

              <p className="small-note">
                Aim for one honest entry a day. If a full week goes by without writing, the mental meter eases down
                slowly until you check in again.
              </p>

              <textarea
                className="journal-page-textarea"
                name="journalEntry"
                value={journalEntry}
                onChange={onJournalChange}
                placeholder="What are you feeling today? What happened, what felt heavy, and what helped?"
                rows="14"
              />

              <div className="button-row journal-actions">
                <button type="button" onClick={onJournalSave}>
                  Save entry
                </button>
              </div>
            </article>

            <aside className="journal-sidecard glass-card">
              <p className="feature-label">Saved entries</p>
              <h3>Browse your collection.</h3>
              <p className="small-note">
                Every saved entry stays in your journal history so you can reopen it, reflect on it, and update it
                later.
              </p>
              <div className="journal-collection-summary">
                <div className="journal-collection-card">
                  <span>Total saved</span>
                  <strong>{savedEntryDates.length}</strong>
                </div>
                <div className="journal-collection-card">
                  <span>Selected date</span>
                  <strong>{selectedJournalDate || "None"}</strong>
                </div>
              </div>
              <div className="journal-entry-list">
                {savedEntryDates.length === 0 ? (
                  <div className="journal-tip-card">
                    <strong>No saved entries yet</strong>
                    <span>Your first saved entry will show up here.</span>
                  </div>
                ) : (
                  savedEntryDates.map((entryDate) => (
                    <button
                      key={entryDate}
                      type="button"
                      className={`journal-entry-button ${
                        entryDate === selectedJournalDate ? "journal-entry-button-active" : ""
                      }`}
                      onClick={() => onJournalDateSelect(entryDate)}
                    >
                      <strong>{entryDate}</strong>
                      <span>{journalRecord.entries[entryDate].slice(0, 72)}</span>
                    </button>
                  ))
                )}
              </div>

              <div className="journal-selected-preview">
                <p className="feature-label">Selected entry</p>
                {selectedEntryPreview ? (
                  <>
                    <h4>{selectedJournalDate}</h4>
                    <p>{selectedEntryPreview}</p>
                  </>
                ) : (
                  <>
                    <h4>No saved entry selected</h4>
                    <p>Choose a date from your saved collection to read it here and load it into the editor.</p>
                  </>
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
