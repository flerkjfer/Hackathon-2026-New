function SettingsModal({ settings, onChange, onClose, onSubmit }) {
  return (
    <div className="modal-backdrop">
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <button type="button" className="modal-close-button" aria-label="Close" onClick={onClose}>
          x
        </button>

        <div className="panel-heading">
          <h2 id="settings-title">Settings</h2>
          <p>Small visual tweaks. No pressure.</p>
        </div>

        <form className="crud-form top-gap" onSubmit={onSubmit}>
          <fieldset className="settings-fieldset">
            <legend>UI shape</legend>
            <label className="settings-choice">
              <input
                type="radio"
                name="cornerStyle"
                value="rounded"
                checked={settings.cornerStyle === "rounded"}
                onChange={(event) => onChange({ cornerStyle: event.target.value })}
              />
              Rounded
            </label>
            <label className="settings-choice">
              <input
                type="radio"
                name="cornerStyle"
                value="sharp"
                checked={settings.cornerStyle === "sharp"}
                onChange={(event) => onChange({ cornerStyle: event.target.value })}
              />
              Sharp
            </label>
          </fieldset>

          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={settings.calmMode}
              onChange={(event) => onChange({ calmMode: event.target.checked })}
            />
            Calm mode (softer colors + reduced brightness)
          </label>

          <button type="submit">Save settings</button>
        </form>
      </section>
    </div>
  );
}

export default SettingsModal;
