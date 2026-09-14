import { useDroppable } from "@dnd-kit/core";
import CardFace, { CARD_HEIGHT, CARD_WIDTH } from "./CardFace.jsx";
import PlayerFieldCard from "./PlayerFieldCard.jsx";

/**
 * Feldkarten sind jetzt selbst Drag-Quellen (Angriff auf eine
 * Gegnerkarte) — deshalb bewusst OHNE Framer Motion auf den Karten
 * selbst (siehe Hand.jsx: dieselbe Kombination hat dort einen
 * hartnäckigen Flash-Bug verursacht). Reine CSS-Keyframe (.card-enter)
 * für den Eintritt, sonst nichts.
 */
export default function Field({ cards, previewCard = null, attackingCardId = null }) {
  const { setNodeRef, isOver } = useDroppable({ id: "field" });

  return (
    <div ref={setNodeRef} className={`flex w-full items-start justify-center`}>
      <div
        className="flex gap-3 rounded-2xl px-4 py-3"
        style={{
          background: isOver ? "rgba(255,255,255,1.0)" : "rgba(255,255,255,0.4)",

          // outline: isOver ? "3px dashed rgba(255,255,255,1.0)" : "3px dashed transparent",
          // outlineOffset: 6,
          boxShadow: isOver ? "0 0 20px 5px rgba(255,255,255,1.0)" : "none",
          transition: "background 120ms ease, box-shadow 120ms ease",
        }}
      >
        {cards.length === 0 && !previewCard && (
          <div
            className="flex items-center justify-center rounded-xl border border-dashed border-white/10 text-xs text-black/25"
            style={{ width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT}px` }}
          >
            Karte hierher ziehen
          </div>
        )}
        {cards.map((card) => (
          <div key={card.id} className="card-enter">
            <PlayerFieldCard card={card} isAttacking={card.id === attackingCardId} />
          </div>
        ))}

        {/* Transluzente Vorschau am Feld-Ende, solange man mit einer
            Handkarte über dem Feld hängt — rein visuell, rührt die
            eigentlichen Karten-Arrays nicht an. */}
        {previewCard && (
          <div className="preview-card">
            <CardFace card={previewCard} />
          </div>
        )}
      </div>
    </div>
  );
}
