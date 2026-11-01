
# AI Mystery Room

An AI-powered detective game. You enter a mystery idea and a difficulty, Gemini writes a complete case, and you investigate clues, use hints and accuse a suspect.

- **Live site:** https://ai-mystery-room-gray.vercel.app
- **Backend health check:** https://ai-mystery-room-api-kppi.onrender.com/api/health
- **Source code:** https://github.com/Yugesh-waran-y5/ai-mystery-room
- **Specification:** see [SPEC.md](SPEC.md)

> The backend runs on a free Render plan. If it has been idle, the first request can take about a minute.

## Features

- AI-generated mysteries (title, story, suspects, clues, hints and a hidden solution)
- Three difficulty levels
- Clue discovery, limited hints and one final accusation
- Score calculated on the server
- The culprit and explanation are never sent to the browser before the accusation
- Result page with verdict, culprit, explanation and score
- Play another mystery

## Tech stack

| Part | Technology |
|---|---|
| Frontend | React, Vite, React Router, Axios, plain CSS |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| AI | Google Gemini API (`@google/genai`) |
| Hosting | Vercel (frontend), Render (backend) |

## Difficulty and scoring

| Difficulty | Suspects | Clues | Hints | Base score |
|---|---|---|---|---|
| Easy | 3 | 5 | 2 | 100 |
| Medium | 4 | 7 | 3 | 150 |
| Hard | 5 | 9 | 3 | 200 |

Correct accusation: base score + 5 per discovered clue − 10 per hint used (minimum 0). Wrong accusation: 0.
Example: Easy, 5 clues, 0 hints = 100 + 25 = 125.

## Run locally

1. Clone the repository.
2. Backend:

```
cd server
npm install
copy .env.example .env
npm run dev
```

Open `server/.env` and fill in your own values (MongoDB connection string and Gemini API key).

3. Frontend (in a second terminal):

```
cd client
npm install
npm run dev
```

4. Open http://localhost:5173

## Environment variables (`server/.env`)

| Name | Purpose |
|---|---|
| `PORT` | Server port (default 5000) |
| `CLIENT_URL` | Allowed website address for CORS |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GEMINI_API_KEY` | Gemini API key |
| `GEMINI_MODEL` | Main Gemini model |
| `GEMINI_FALLBACK_MODEL` | Backup model if the main one is busy or out of quota |

Frontend (optional): `VITE_API_URL` = backend API address.

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Server check |
| POST | `/api/cases` | Generate and save a mystery |
| GET | `/api/cases/:id` | Get the active case (no solution) |
| POST | `/api/cases/:id/clues/:clueId/discover` | Discover a clue |
| POST | `/api/cases/:id/hints` | Use the next hint |
| POST | `/api/cases/:id/accuse` | Accuse a suspect |
| GET | `/api/cases/:id/result` | Final result (only after the accusation) |

## Security

Secrets are kept in environment variables and are not committed. The culprit and explanation are stored with `select: false` and are returned only after the case is completed. Gemini output is validated (exact counts, unique IDs, valid culprit) before it is saved.

## Screenshots

Add your images to a `screenshots` folder, then list them here:

```
![Home](screenshots/home.png)
![Investigation](screenshots/game.png)
![Result](screenshots/result.png)
```