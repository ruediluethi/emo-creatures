import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import CardFace from "./CardFace.jsx";

// Gleiches Muster wie DraggableHandCard: nur `isDragging` aus dem Hook
// steuert das Ausblenden, kein Framer Motion auf dieser Drag-Quelle
// (siehe Hand.jsx-Kommentar zur Begründung).
export default function PlayerFieldCard({ card, isAttacking = false }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    data: { type: "playerFieldCard", card },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0 : 1,
        touchAction: "none",
      }}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing ${isAttacking ? "attack-lunge" : ""}`}
    >
      <CardFace card={card} />
    </div>
  );
}
