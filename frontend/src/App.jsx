import { useState } from "react";
import Game from "./components/Game.jsx";

export default function App() {
  const [playerName, setPlayerName] = useState("");
  const [gameId, setGameId] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateGame(event) {
    event.preventDefault();

    const trimmedName = playerName.trim();
    if (!trimmedName) {
      setError("Bitte Namen eingeben.");
      return;
    }

    setIsLoading(true);
    setError("");

    const API_BASE = import.meta.env.DEV ? "http://127.0.0.1:8000" : "";

    try {
      const response = await fetch(`${API_BASE}/new_game`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player_name: trimmedName }),
      });

      console.log(response);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Spiel konnte nicht gestartet werden.");
      }

      const data = await response.json();
      setGameId(data.game_id);
    } catch (err) {
      setError(err.message || "Unbekannter Fehler beim Starten des Spiels.");
    } finally {
      setIsLoading(false);
    }
  }

  if (gameId) {
    return <Game gameId={gameId} playerName={playerName} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0512] p-6 text-white">
      <form onSubmit={handleCreateGame} className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
        <h1 className="mb-4 text-2xl font-bold">Neues Spiel</h1>

        <label className="mb-2 block text-sm text-white/70" htmlFor="playerName">
          Spielername
        </label>

        <input
          id="playerName"
          type="text"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          placeholder="Dein Name"
          className="w-full rounded-xl border border-white/10 bg-[#150a20] px-3 py-2 text-white outline-none ring-0 placeholder:text-white/30 focus:border-pink-400"
        />

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full rounded-xl bg-pink-500 px-4 py-2 font-semibold text-white transition hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Startet..." : "Spiel starten"}
        </button>
      </form>
    </main>
  );
}
