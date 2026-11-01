import mongoose from "mongoose";
import Case from "../models/Case.js";
import { generateMystery } from "../services/geminiService.js";
import { calculateScore } from "../utils/scoring.js";

const DIFFICULTIES = { easy: "Easy", medium: "Medium", hard: "Hard" };
const WITH_SOLUTION = "+solution.culpritId +solution.explanation";

// The ONLY shape the browser sees while a case is active.
export function toPublicCase(c) {
  return {
    id: c._id,
    title: c.title,
    premise: c.premise,
    story: c.story,
    difficulty: c.difficulty,
    status: c.status,
    suspects: c.suspects,
    clues: c.clues.map((clue) => {
      const discovered = c.discoveredClues.includes(clue.id);
      return { id: clue.id, discovered, description: discovered ? clue.description : null };
    }),
    hints: c.hints.slice(0, c.hintsUsed),
    hintsUsed: c.hintsUsed,
    totalHints: c.hints.length
  };
}

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function loadCase(id, { withSolution = false } = {}) {
  if (!mongoose.isValidObjectId(id)) throw httpError(400, "Invalid case ID.");
  const query = Case.findById(id);
  if (withSolution) query.select(WITH_SOLUTION);
  const found = await query;
  if (!found) throw httpError(404, "Case not found.");
  return found;
}

export async function createCase(req, res, next) {
  try {
    const premise = String(req.body?.premise ?? "").trim();
    const difficulty = DIFFICULTIES[String(req.body?.difficulty ?? "").toLowerCase()];

    if (premise.length < 10 || premise.length > 500) {
      return res.status(400).json({ error: "Premise must be between 10 and 500 characters." });
    }
    if (!difficulty) {
      return res.status(400).json({ error: "Difficulty must be Easy, Medium or Hard." });
    }

    const mystery = await generateMystery(premise, difficulty);
    const created = await Case.create({ ...mystery, premise, difficulty });
    res.status(201).json(toPublicCase(created));
  } catch (err) {
    next(err);
  }
}

export async function getCase(req, res, next) {
  try {
    const found = await loadCase(req.params.id);
    res.json(toPublicCase(found));
  } catch (err) {
    next(err);
  }
}

export async function discoverClue(req, res, next) {
  try {
    const found = await loadCase(req.params.id);
    if (found.status !== "active") throw httpError(409, "This case is already closed.");

    const clue = found.clues.find((c) => c.id === req.params.clueId);
    if (!clue) throw httpError(404, "Clue not found.");

    // Discovering the same clue twice changes nothing and costs nothing.
    const alreadyFound = found.discoveredClues.includes(clue.id);
    if (!alreadyFound) {
      found.discoveredClues.push(clue.id);
      await found.save();
    }

    res.json({
      alreadyDiscovered: alreadyFound,
      clue: { id: clue.id, description: clue.description },
      case: toPublicCase(found)
    });
  } catch (err) {
    next(err);
  }
}

export async function requestHint(req, res, next) {
  try {
    const found = await loadCase(req.params.id);
    if (found.status !== "active") throw httpError(409, "This case is already closed.");
    if (found.hintsUsed >= found.hints.length) {
      throw httpError(400, "No hints left for this mystery.");
    }

    const hint = found.hints[found.hintsUsed];
    found.hintsUsed += 1;
    await found.save();

    res.json({ hint, case: toPublicCase(found) });
  } catch (err) {
    next(err);
  }
}

export async function accuse(req, res, next) {
  try {
    const suspectId = String(req.body?.suspectId ?? "").trim();
    const found = await loadCase(req.params.id, { withSolution: true });

    if (found.status !== "active") throw httpError(409, "This case is already closed.");
    if (!found.suspects.some((s) => s.id === suspectId)) {
      throw httpError(400, "Choose one of the suspects in this case.");
    }

    const correct = suspectId === found.solution.culpritId;
    const score = calculateScore({
      difficulty: found.difficulty,
      correct,
      cluesDiscovered: found.discoveredClues.length,
      hintsUsed: found.hintsUsed
    });

    found.accusation = suspectId;
    found.score = score;
    found.status = "completed";
    await found.save();

    res.json(buildResult(found));
  } catch (err) {
    next(err);
  }
}

export async function getResult(req, res, next) {
  try {
    const found = await loadCase(req.params.id, { withSolution: true });
    if (found.status !== "completed") {
      throw httpError(403, "Make your accusation first to see the result.");
    }
    res.json(buildResult(found));
  } catch (err) {
    next(err);
  }
}

// Only called for completed cases, so revealing the solution is safe here.
function buildResult(c) {
  const culprit = c.suspects.find((s) => s.id === c.solution.culpritId);
  return {
    id: c._id,
    title: c.title,
    difficulty: c.difficulty,
    correct: c.accusation === c.solution.culpritId,
    accusedId: c.accusation,
    culprit: { id: c.solution.culpritId, name: culprit?.name },
    explanation: c.solution.explanation,
    cluesDiscovered: c.discoveredClues.length,
    hintsUsed: c.hintsUsed,
    score: c.score
  };
}