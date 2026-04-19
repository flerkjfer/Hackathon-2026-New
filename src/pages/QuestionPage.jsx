import { questionnaireItems, questionnaireScale } from "../data/appData";

function QuestionPage({
  answers,
  onAnswerChange,
  onLogout,
  onSubmit,
  result,
  user,
}) {
  return (
    <main className="app-shell">
      <section className="questionnaire-viewport">
        <div className="home-overlay" />
        <section className="questionnaire-surface">
          <div className="home-topbar">
            <div>
              <p className="eyebrow">Check-In Quiz</p>
              <h1>Before we begin, take a quick mental health check-in.</h1>
            </div>

            <div className="button-row">
              <button type="button" onClick={onLogout}>
                Log out
              </button>
            </div>
          </div>

          <section className="questionnaire-layout">
            <article className="questionnaire-main glass-card">
              <div className="panel-heading">
                <h2>{user.name}, answer these before entering the app</h2>
                <p>Use the sample point rating below for each question.</p>
              </div>

              <div className="legend-row">
                {questionnaireScale.map((option) => (
                  <span key={option.value} className="legend-pill">
                    {option.label} = {option.description}
                  </span>
                ))}
              </div>

              <div className="question-list">
                {questionnaireItems.map((question, index) => (
                  <article key={question} className="question-card">
                    <p className="question-number">Question {index + 1}</p>
                    <h3>{question}</h3>
                    <div className="rating-row">
                      {questionnaireScale.map((option) => {
                        const inputId = `question-${index}-${option.value}`;
                        const isActive = answers[index] === option.value;

                        return (
                          <label
                            key={inputId}
                            htmlFor={inputId}
                            className={`rating-pill ${isActive ? "rating-pill-active" : ""}`}
                          >
                            <input
                              id={inputId}
                              type="radio"
                              name={`question-${index}`}
                              checked={isActive}
                              onChange={() => onAnswerChange(index, option.value)}
                            />
                            {option.label}
                          </label>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </div>

              <div className="button-row top-gap">
                <button type="button" onClick={onSubmit}>
                  Continue to home
                </button>
              </div>
            </article>

            <aside className="questionnaire-side glass-card">
              <p className="feature-label">Why we ask</p>
              <h3>A quick self-check helps tailor your starting point.</h3>
              <p className="small-note">
                This short questionnaire gives the app a sense of how you're arriving today and creates a simple
                baseline for your session.
              </p>
              <div className="quiz-box">
                <p className="small-note">
                  Sample point rating:
                </p>
                <div className="journal-tip-list">
                  {questionnaireScale.map((option) => (
                    <div key={option.value} className="journal-tip-card">
                      <strong>
                        {option.label} points
                      </strong>
                      <span>{option.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {result ? (
                <div className="questionnaire-result-card">
                  <p className="feature-label">Most recent result</p>
                  <h3>{result.level}</h3>
                  <p className="small-note">{result.message}</p>
                  {result.resources.length > 0 ? (
                    <div className="questionnaire-resource-list">
                      {result.resources.map((resource) => (
                        <div key={resource} className="journal-tip-card">
                          <span>{resource}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </aside>
          </section>
        </section>
      </section>
    </main>
  );
}

export default QuestionPage;
