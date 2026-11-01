# AI Mystery Room: Specification

## A. Project requirements

**Overview.** AI Mystery Room is a web game. The player gives a mystery idea and a difficulty, Gemini writes a complete case (story, suspects, clues, hints and a hidden solution), and the player investigates and accuses a suspect.

**Problem.** Detective games usually have fixed cases. This project generates a new, logically consistent mystery on demand.

**Target users.** Casual players who enjoy puzzles and detective stories.

**Core features.**
- AI-generated mysteries at three difficulty levels
- Clue discovery, limited hints and one accusation
- Score calculated on the server
- Result page with verdict, culprit and explanation
- Play another mystery

**Technology stack.** React, Vite, React Router, Axios, plain CSS | Node.js, Express | MongoDB Atlas, Mongoose | Google Gemini API (`@google/genai`). Plain CSS is used instead of Tailwind to keep the styling small and fully custom.

**Limitations.** Gemini free-tier quota (about 20 requests per day per model), so mysteries are generated on demand and saved. The free Render backend sleeps after inactivity, so the first request can take about a minute. There are no user accounts; a case is opened by its link.

**Deliverables.** GitHub repository, live website, this SPEC.md and a README.

## B. User flow

1. The user opens the website.
2. The user enters a mystery premise and selects a difficulty.
3. Gemini generates the mystery, suspects, clues and hints, and the case is saved.
4. The user investigates and discovers clues.
5. The user requests hints if needed (each costs 10 points).
6. The user accuses a suspect.
7. The application shows the verdict, culprit, explanation and score.
8. The user can start another mystery.

## C. UI and page specifications

| Page | Route | Purpose and main elements |
|---|---|---|
| Home / Create Mystery | `/` | Introduction, premise box (10 to 500 characters), difficulty selector, Create Mystery button |
| Investigation Room | `/game/:id` | Title, story, suspect cards, clue cards (Investigate), hint panel, Make your accusation button |
| Accusation | on `/game/:id` | Select a suspect, confirm, one submission only |
| Results | `/result/:id` | Verdict, score, culprit, explanation, Play again / New mystery |

- **Loading states:** the Create Mystery button shows "The AI is writing your mystery..." while Gemini works.
- **Errors:** readable messages for invalid input, an unreachable server, and an overloaded or limited AI service.
- **Navigation:** the logo returns home; creating a case opens its game page; accusing opens the result page; a finished case redirects to its result.
- **Responsive behavior:** cards use a CSS grid that wraps on small screens.

## D. Backend and database design

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Server check |
| POST | `/api/cases` | Generate and save a mystery |
| GET | `/api/cases/:id` | Retrieve an active case (no solution) |
| POST | `/api/cases/:id/clues/:clueId/discover` | Discover a clue |
| POST | `/api/cases/:id/hints` | Use the next hint |
| POST | `/api/cases/:id/accuse` | Submit an accusation `{ "suspectId": "suspect_1" }` |
| GET | `/api/cases/:id/result` | Completed result |

**Validation and errors.** Premise 10 to 500 characters and a valid difficulty (400); invalid or unknown case (400/404); unknown clue (404); no hints left (400); closed case (409); result before accusation (403); AI failure (502 with a readable message).

**Case model.** title, premise, story, difficulty, suspects[{id, name, description}], clues[{id, description}], hints[], solution{culpritId, explanation}, discoveredClues[], hintsUsed, accusation, score, status (active or completed), timestamps.

**Security.** The culprit and explanation use `select: false` and are loaded only in the accuse and result handlers. Active cases are returned through a public mapper that sends clue text only for discovered clues and only the hints already used. API keys and the database URI are environment variables and are never committed.

## E. AI behavior and scoring rules

**Output format.** Gemini is asked for JSON only (title, story, suspects, clues, hints, culpritId, explanation). The output is validated before saving: exact counts, unique IDs, non-empty text, and a culpritId that matches a suspect. Invalid or overloaded responses are retried; a fallback model is used if the main one is unavailable or out of quota.

| Difficulty | Suspects | Clues | Hints | Base score |
|---|---|---|---|---|
| Easy | 3 | 5 | 2 | 100 |
| Medium | 4 | 7 | 3 | 150 |
| Hard | 5 | 9 | 3 | 200 |

**Scoring (backend only).** Correct: base + 5 per discovered clue − 10 per hint used, minimum 0. Wrong: 0.
Example: Easy, 5 clues, 0 hints = 100 + 25 = 125.

The prompt requires one guilty suspect, red herrings, and clues that let a careful player identify the culprit logically.

## F. Acceptance criteria

- [x] Mysteries can be generated (Easy tested on the live site)
- [ ] Medium and Hard counts verified (4/7/3 and 5/9/3)
- [x] Players can investigate, request hints and submit accusations
- [x] The solution is not revealed before the accusation
- [x] Scores are calculated and validated by the backend
- [x] Results show the correct culprit and explanation
- [x] The application works on the deployed website

## Deployment

- Frontend (Vercel): https://ai-mystery-room-gray.vercel.app
- Backend (Render): https://ai-mystery-room-api-kppi.onrender.com
- Source code: https://github.com/Yugesh-waran-y5/ai-mystery-room
- Database: MongoDB Atlas