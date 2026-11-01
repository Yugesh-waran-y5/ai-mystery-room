import mongoose from "mongoose";

const suspectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true }
  },
  { _id: false }
);

const clueSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    description: { type: String, required: true }
  },
  { _id: false }
);

const caseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    premise: { type: String, required: true },
    story: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true
    },
    suspects: [suspectSchema],
    clues: [clueSchema],
    hints: [String],

    solution: {
      culpritId: { type: String, required: true, select: false },
      explanation: { type: String, required: true, select: false }
    },

    discoveredClues: { type: [String], default: [] },
    hintsUsed: { type: Number, default: 0 },
    accusation: { type: String, default: null },
    score: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "completed"], default: "active" }
  },
  { timestamps: true }
);

export default mongoose.model("Case", caseSchema);