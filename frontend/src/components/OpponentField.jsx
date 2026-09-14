import OpponentFieldCard from "./OpponentFieldCard.jsx";

// Bewusst KEINE einzelne Drop-Zone für das ganze Gegnerfeld (anders
// als beim Spielerfeld) — jede Gegnerkarte ist ihr eigenes Drop-Ziel,
// weil ein Angriff eine bestimmte Kreatur trifft, nicht "das Feld"
// allgemein. Kein Framer Motion, gleiches CSS-Keyframe-Muster wie
// Hand/Field.
export default function OpponentField({ cards, hitCardId = null }) {
  return (
    <div className="flex min-h-[150px] w-full items-end justify-center">
      <div className="flex gap-3 rounded-2xl px-4 py-3">
        {cards.length === 0 && (
          <div className="flex h-[134px] w-[220px] items-center justify-center rounded-xl border border-dashed border-white/10 text-xs text-white/25">
            Gegnerfeld leer
          </div>
        )}
        {cards.map((card) => (
          <div key={card.id} className="card-enter">
            <OpponentFieldCard card={card} isHit={card.id === hitCardId} />
          </div>
        ))}
      </div>
    </div>
  );
}
