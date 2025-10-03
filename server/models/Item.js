import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true, min: 0 },
  tags: { type: [String], default: [] },
});

export default mongoose.model("Item", itemSchema);
