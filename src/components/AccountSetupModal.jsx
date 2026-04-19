const profileFields = [
  { key: "birthDate", label: "When were you born?", type: "date" },
  { key: "location", label: "Where are you from?", type: "text", placeholder: "City, state, or country" },
  { key: "gender", label: "What is your gender?", type: "text", placeholder: "How you identify" },
  { key: "occupation", label: "What is your occupation?", type: "text", placeholder: "Student, designer, engineer..." },
];

function AccountSetupModal({ form, onChange, onClose, onSubmit }) {
  return (
    <div className="modal-backdrop">
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="account-setup-title">
        <button type="button" className="modal-close-button" aria-label="Skip setup" onClick={onClose}>
          x
        </button>

        <div className="panel-heading">
          <h2 id="account-setup-title">Finish setting up your account</h2>
          <p>Answer these questions once now, or skip and finish them later from the avatar menu.</p>
        </div>

        <form className="crud-form top-gap" onSubmit={onSubmit}>
          {profileFields.map((field) => (
            <label key={field.key}>
              {field.label}
              <input
                type={field.type}
                name={field.key}
                value={form[field.key]}
                placeholder={field.placeholder}
                onChange={onChange}
              />
            </label>
          ))}

          <button type="submit">Save account details</button>
        </form>
      </section>
    </div>
  );
}

export default AccountSetupModal;
