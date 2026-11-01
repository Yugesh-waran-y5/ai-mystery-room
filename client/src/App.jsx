import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Fingerprint } from "lucide-react";
import "./index.css";
import Home from "./pages/Home.jsx";
import Game from "./pages/Game.jsx";
import Result from "./pages/Result.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <Link to="/" className="brand">
            <Fingerprint size={30} />
            <span>MYSTERY<span className="highlight">ROOM</span></span>
          </Link>
          <span className="nav-label">AI DETECTIVE EXPERIENCE</span>
        </nav>

        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="/result/:id" element={<Result />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;