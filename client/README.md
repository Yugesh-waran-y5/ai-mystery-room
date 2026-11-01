# AI Mystery Room

An AI-powered detective game. The player enters a mystery idea and a difficulty, Gemini writes a complete case, and the player investigates clues, uses hints and accuses a suspect.

**Live site:** <your Vercel URL>
**Backend API:** <your Render URL>/api/health

## Features
- AI-generated mysteries (title, story, suspects, clues, hints, hidden solution)
- Three difficulty levels
- Clue discovery, limited hints and a final accusation
- Score calculated on the server
- The solution is never sent to the browser before the accusation

## Tech stack
React, Vite, React Router, Axios | Node.js, Express | MongoDB Atlas, Mongoose | Google Gemini API

## Difficulty settings
| Difficulty | Base score | Suspects | Clues | Hints |
|---|---|---|---|---|
| Easy | 100 | 3 | 5 | 2 |
| Medium | 150 | 4 | 7 | 3 |
| Hard | 200 | 5 | 9 | 3 |

Score for a correct accusation = base + 5 per discovered clue − 10 per hint (minimum 0). A wrong accusation scores 0.

## Run locally
1. Clone the repo.
2. Backend:
   ```
   cd server
   npm install
   copy .env.example .env   (then fill in your values)
   npm run dev
   ```
3. Frontend:
   ```
   cd client
   npm install
   npm run dev
   ```
4. Open http://localhost:5173

## API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/health | Server check |
| POST | /api/cases | Generate and save a mystery |
| GET | /api/cases/:id | Get the active case (no solution) |
| POST | /api/cases/:id/clues/:clueId/discover | Discover a clue |
| POST | /api/cases/:id/hints | Use a hint |
| POST | /api/cases/:id/accuse | Accuse a suspect |
| GET | /api/cases/:id/result | Final result (only after accusation) |

## Security
Secrets live in `.env` files and are not committed. The culprit and explanation are stored with `select: false` and returned only after the case is completed.