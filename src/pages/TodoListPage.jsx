import { useEffect, useMemo, useState } from "react";
import { todoListKeyPrefix } from "../data/appData";

const priorityOptions = [
  "Highest priority",
  "Worth Focusing On",
  "Can Take Your Time",
  "No Pressure",
];

const defaultPriority = "Worth Focusing On";

const starterTasks = [
  "Drink a full glass of water",
  "Step outside for five minutes",
  "Write down one thought you want to let go of",
  "Stretch your shoulders and neck",
  "Send one kind message to someone",
];

function getTodoKey(email) {
  return `${todoListKeyPrefix}:${email.toLowerCase()}`;
}

function loadTodoState(email) {
  const savedState = window.localStorage.getItem(getTodoKey(email));

  if (savedState) {
    const parsedState = JSON.parse(savedState);
    return {
      tasks: (parsedState.tasks ?? []).map((task) => ({
        ...task,
        priority: task.priority ?? defaultPriority,
        description: task.description ?? "",
      })),
    };
  }

  return {
    tasks: starterTasks.map((title, index) => ({
      id: `starter-${index + 1}`,
      title,
      description: "",
      priority: priorityOptions[index % priorityOptions.length],
      completed: false,
      completedAt: null,
    })),
  };
}

function saveTodoState(email, state) {
  window.localStorage.setItem(getTodoKey(email), JSON.stringify(state));
}

function formatCompletedAt(value) {
  return new Date(value).toLocaleDateString();
}

function TodoListPage({ onBackHome, onLogout, onTaskCompleted, user }) {
  const [todoState, setTodoState] = useState({ tasks: [] });
  const [statusMessage, setStatusMessage] = useState("Complete a task to move it into Victories.");
  const [animatedVictoryId, setAnimatedVictoryId] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: defaultPriority,
  });

  useEffect(() => {
    setTodoState(loadTodoState(user.email));
  }, [user.email]);

  const openTasks = useMemo(
    () => todoState.tasks.filter((task) => !task.completed),
    [todoState.tasks]
  );
  const victories = useMemo(
    () =>
      todoState.tasks
        .filter((task) => task.completed)
        .sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt)),
    [todoState.tasks]
  );

  const updateTodoState = (nextState) => {
    setTodoState(nextState);
    saveTodoState(user.email, nextState);
  };

  const handleCreateTask = (event) => {
    event.preventDefault();

    if (!newTask.title.trim()) {
      setStatusMessage("Please enter a task title first.");
      return;
    }

    const createdTask = {
      id: crypto.randomUUID(),
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      priority: newTask.priority,
      completed: false,
      completedAt: null,
    };

    const nextState = {
      tasks: [createdTask, ...todoState.tasks],
    };

    updateTodoState(nextState);
    setNewTask({
      title: "",
      description: "",
      priority: defaultPriority,
    });
    setStatusMessage(`${createdTask.title} added.`);
  };

  const getPriorityClassName = (priority) =>
    `todo-kicker todo-priority-${(priority ?? defaultPriority).toLowerCase().replace(/[^a-z]+/g, "-")}`;

  const handleCompleteTask = (taskId) => {
    const completedAt = new Date().toISOString();
    let completedTaskTitle = "";

    const nextState = {
      tasks: todoState.tasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        completedTaskTitle = task.title;
        return {
          ...task,
          completed: true,
          completedAt,
        };
      }),
    };

    updateTodoState(nextState);
    setStatusMessage(`${completedTaskTitle} completed.`);
    setAnimatedVictoryId(taskId);
    onTaskCompleted(completedTaskTitle);

    window.setTimeout(() => {
      setAnimatedVictoryId((current) => (current === taskId ? null : current));
    }, 900);
  };

  return (
    <main className="app-shell">
      <section className="mindmap-viewport">
        <div className="home-overlay" />
        <section className="mindmap-surface">
          <div className="home-topbar">
            <div>
              <p className="eyebrow">To Do List</p>
              <h1>Small tasks that turn into visible wins.</h1>
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

          <section className="todo-layout">
            <article className="todo-main glass-card">
              <div className="panel-heading">
                <h2>Today's tasks</h2>
                <p>Simple actions users can complete and check off.</p>
              </div>

              <form className="todo-create-form top-gap" onSubmit={handleCreateTask}>
                <div className="todo-create-copy">
                  <p className="feature-label">Create Task</p>
                  <h3>Add a task that feels meaningful right now.</h3>
                  <p className="small-note">
                    Keep it simple, give it a priority, and add context only if it helps.
                  </p>
                </div>

                <div className="todo-create-fields">
                  <label className="todo-create-title">
                    Task title
                    <input
                      value={newTask.title}
                      onChange={(event) =>
                        setNewTask((current) => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      placeholder="Write a task you want to finish"
                    />
                  </label>

                  <label className="todo-create-description">
                    Description
                    <textarea
                      value={newTask.description}
                      onChange={(event) =>
                        setNewTask((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      placeholder="Add a little context or reminder"
                      rows="3"
                    />
                  </label>
                </div>

                <div className="todo-create-actions">
                  <label className="todo-create-priority">
                    Priority
                    <select
                      value={newTask.priority}
                      onChange={(event) =>
                        setNewTask((current) => ({
                          ...current,
                          priority: event.target.value,
                        }))
                      }
                    >
                      {priorityOptions.map((priority) => (
                        <option key={priority}>{priority}</option>
                      ))}
                    </select>
                  </label>

                  <button type="submit" className="todo-add-button">Add task</button>
                </div>
              </form>

              <p className="small-note top-gap">{statusMessage}</p>

              <div className="todo-list">
                {openTasks.length === 0 ? (
                  <div className="todo-card">
                    <p className="small-note">Everything is complete. Nice work.</p>
                  </div>
                ) : (
                  openTasks.map((task) => (
                    <div key={task.id} className="todo-card">
                      <div>
                        <p className={getPriorityClassName(task.priority)}>
                          {task.priority ?? defaultPriority}
                        </p>
                        <h3>{task.title}</h3>
                        {task.description ? <p className="todo-description">{task.description}</p> : null}
                      </div>
                      <button
                        type="button"
                        className="todo-complete-button"
                        onClick={() => handleCompleteTask(task.id)}
                      >
                        Completed
                      </button>
                    </div>
                  ))
                )}
              </div>
            </article>

            <aside className="todo-victories glass-card">
              <div className="panel-heading">
                <h2>Victories</h2>
                <p>Completed tasks rise into this list.</p>
              </div>

              <div className="victory-list">
                {victories.length === 0 ? (
                  <div className="victory-card">
                    <p className="small-note">No completed tasks yet.</p>
                  </div>
                ) : (
                  victories.map((task) => (
                    <div
                      key={task.id}
                      className={`victory-card ${animatedVictoryId === task.id ? "victory-card-pop" : ""}`}
                    >
                      <strong>{task.title}</strong>
                      <p className={getPriorityClassName(task.priority)}>
                        {task.priority ?? defaultPriority}
                      </p>
                      {task.description ? <p className="todo-description">{task.description}</p> : null}
                      <span>Completed {formatCompletedAt(task.completedAt)}</span>
                    </div>
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

export default TodoListPage;
