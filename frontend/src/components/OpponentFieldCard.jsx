import { useDroppable } from "@dnd-kit/core";
import CardFace from "./CardFace.jsx";

// Jede Gegnerkarte ist ihr EIGENES Drop-Ziel (nicht nur die ganze
// Gegner-Feld-Zone) — nur so lässt sich ein Angriff auf eine
// bestimmte Kreatur erkennen. `isOver` kommt direkt aus dem Hook,
// keine eigene App-State-Schicht nötig (jede Karte verwaltet ihren
// eigenen Hover-Zustand selbst).
export default function OpponentFieldCard({ card, isHit = false }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `opponent-${card.id}`,
    data: { type: "opponentCreature", card },
  });

  return (
    <div
      ref={setNodeRef}
      className={isHit ? "attack-impact" : ""}
      style={{
        // borderRadius: 12,
        // outline: isOver ? "2px solid rgba(248,113,113,0.85)" : "2px solid transparent",
        // outlineOffset: 3,
        // transition: "outline-color 120ms ease",

      }}
    >
      <CardFace card={card} isOverOpponentCard={isOver} />
    </div>
  );
}
