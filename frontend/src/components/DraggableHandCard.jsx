import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import CardFace from "./CardFace.jsx";

// Reines dnd-kit-Standardmuster (siehe dnd-kit-Doku, "Drag Overlay"):
// Quelle blendet sich während des Ziehens aus (isDragging direkt aus
// dem Hook), DragOverlay in App.jsx zeigt die Karte separat am
// Zeiger. Keine eigene State-Schicht mehr obendrauf.
export default function DraggableHandCard({ card }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    data: { type: "handCard", card },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0 : 1,
        touchAction: "none", // wichtig für Touch: verhindert Scroll-Konflikt mit dem Drag-Gesture
      }}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <CardFace card={card} />
    </div>
  );
}
