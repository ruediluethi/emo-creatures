import DraggableHandCard from "./DraggableHandCard.jsx";

// Bewusst OHNE Framer Motion: die Hand ist die Drag-QUELLE, und Framer
// Motions layout-Animation auf denselben Elementen, die auch dnd-kit
// per Transform bewegt, war die wahrscheinlichste Ursache für den
// hartnäckigen Flash beim Drop. Die Eintritts-Animation läuft
// stattdessen über eine simple CSS-Keyframe-Animation (siehe
// index.css, Klasse .card-enter) — die spielt automatisch beim
// Einfügen ins DOM, ganz ohne JS-Timing-Abhängigkeiten.
export default function Hand({ cards }) {
  return (
    <div className="flex items-end" style={{ minHeight: 134 }}>
      {cards.map((card, index) => (
        <div key={card.id} className="card-enter" style={{ marginLeft: index === 0 ? 0 : -60, zIndex: index }}>
          <DraggableHandCard card={card} />
        </div>
      ))}
    </div>
  );
}
