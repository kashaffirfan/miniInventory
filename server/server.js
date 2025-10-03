import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Item from "./models/Item.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error(err));

// routes
app.post("/api/items", async (req, res) => {
  try {
    const { name, qty, tags } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    if (qty < 0) return res.status(400).json({ error: "Qty must be >= 0" });

    const item = new Item({ name, qty, tags });
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/items", async (req, res) => {
  try {
    const { q, tag } = req.query;
    let filter = {};

    if (q) {
      filter.name = { $regex: q, $options: "i" }; 
        }
    if (tag) {
      filter.tags = tag;
    }

    const items = await Item.find(filter);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
