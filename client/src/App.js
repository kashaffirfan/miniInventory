import { useState, useEffect } from "react";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [qty, setQty] = useState(0);
  const [tags, setTags] = useState("");
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  // Fetch items
  const fetchItems = async () => {
    let url = `${API_URL}/api/items?`;
    if (search) url += `q=${search}&`;
    if (tagFilter) url += `tag=${tagFilter}`;
    const res = await fetch(url);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, [search, tagFilter]);

  // Add item
  const addItem = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        qty: Number(qty),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    setName("");
    setQty(0);
    setTags("");
    fetchItems(); 
  };

  
  const allTags = [...new Set(items.flatMap((i) => i.tags || []))];

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>Mini Inventory</h2>

      {/* Add Form */}
      <form onSubmit={addItem} style={{ marginBottom: 20 }}>
        <input
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          min="0"
        />
        <input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button type="submit">Add Item</button>
      </form>

      {/* Search & Filter */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        >
          <option value="">All Tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Items List */}
      <ul>
        {items.map((item) => (
          <li key={item._id || item.name}>
            <strong>{item.name}</strong> — Qty: {item.qty} — Tags:{" "}
            {item.tags?.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
