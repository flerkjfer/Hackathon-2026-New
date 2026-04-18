import { useEffect, useState } from "react";

const STORAGE_KEY = "react-crud-starter-items";

const starterItems = [
  {
    id: crypto.randomUUID(),
    name: "Launch landing page",
    description: "Set up the first version of the homepage copy and layout.",
    status: "In Progress",
  },
  {
    id: crypto.randomUUID(),
    name: "Collect user feedback",
    description: "Interview three people and note the top pain points.",
    status: "Planned",
  },
];

const emptyForm = {
  name: "",
  description: "",
  status: "Planned",
};

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const savedItems = window.localStorage.getItem(STORAGE_KEY);

    if (savedItems) {
      setItems(JSON.parse(savedItems));
      return;
    }

    setItems(starterItems);
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      return;
    }

    if (editingId) {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === editingId ? { ...item, ...form } : item
        )
      );
      resetForm();
      return;
    }

    const newItem = {
      id: crypto.randomUUID(),
      ...form,
    };

    setItems((currentItems) => [newItem, ...currentItems]);
    resetForm();
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));

    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">React CRUD Starter</p>
        <h1>Track simple records with create, read, update, and delete actions.</h1>
        <p className="hero-copy">
          This starter app uses React and browser storage, so you can clone it,
          run it locally, and extend it into a real project or portfolio piece.
        </p>
      </section>

      <section className="content-grid">
        <article className="panel form-panel">
          <div className="panel-heading">
            <h2>{editingId ? "Edit item" : "Create item"}</h2>
            <p>{editingId ? "Update the selected record." : "Add a new record to the list."}</p>
          </div>

          <form className="crud-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter a title"
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the item"
                rows="5"
              />
            </label>

            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option>Planned</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </label>

            <div className="button-row">
              <button type="submit">{editingId ? "Save changes" : "Add item"}</button>
              <button type="button" className="secondary-button" onClick={resetForm}>
                Clear
              </button>
            </div>
          </form>
        </article>

        <article className="panel list-panel">
          <div className="panel-heading">
            <h2>Your items</h2>
            <p>{items.length} record{items.length === 1 ? "" : "s"} saved in local storage.</p>
          </div>

          <div className="item-list">
            {items.map((item) => (
              <div className="item-card" key={item.id}>
                <div className="item-meta">
                  <span className={`status-pill status-${item.status.toLowerCase().replace(" ", "-")}`}>
                    {item.status}
                  </span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="button-row">
                  <button type="button" className="secondary-button" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button type="button" className="danger-button" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

export default App;
