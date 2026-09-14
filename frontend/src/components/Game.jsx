import { useState } from "react";
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, DragOverlay, pointerWithin } from "@dnd-kit/core";
import Hand from "./Hand.jsx";
import Field from "./Field.jsx";
import OpponentField from "./OpponentField.jsx";
import DeckButton from "./DeckButton.jsx";
import DebugAddOpponentCardButton from "./DebugAddOpponentCardButton.jsx";
import CardFace from "./CardFace.jsx";
import { drawRandomCard } from "../data/cardTemplates.js";

/**
 * Zwei unterschiedliche Drag-Quellen, unterschieden über
 * `active.data.current.type`:
 *   - "handCard"        -> Hand.jsx / DraggableHandCard, Ziel: Feld (spielen)
 *   - "playerFieldCard" -> Field.jsx / PlayerFieldCard, Ziel: einzelne
 *                          Gegnerkarte (Angriff)
 *
 * Beide bleiben bewusst beim reinen dnd-kit-Muster ohne Framer Motion
 * auf den Drag-Quellen selbst (siehe Kommentare in den jeweiligen
 * Komponenten) — das war die Lektion aus den vorherigen Bugs.
 *
 * Angriff hat aktuell KEINE Kampf-Logik (kein Schaden, keine
 * entfernten Kreaturen) — nur die Interaktion + visuelles Feedback
 * (Lunge beim Angreifer, Impact-Puls beim Ziel). Die eigentliche
 * Regelauswertung kommt später vom Server.
 */
export default function Game({ gameId, playerName }) {
  const [hand, setHand] = useState(() => [drawRandomCard(), drawRandomCard(), drawRandomCard()]);
  const [field, setField] = useState([]);
  const [opponentField, setOpponentField] = useState([]);

  const [activeCard, setActiveCard] = useState(null);
  const [activeSource, setActiveSource] = useState(null); // "handCard" | "playerFieldCard"
  const [isOverField, setIsOverField] = useState(false);
  const [isOverOpponentCard, setIsOverOpponentCard] = useState(false);

  // Transiente visuelle Angriffs-Rückmeldung, nicht Teil des
  // eigentlichen Spielzustands — läuft nach kurzer Zeit automatisch ab.
  const [attackFlash, setAttackFlash] = useState(null); // { attackerId, targetId }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } })
  );

  const handleDraw = () => {
    setHand((prev) => [...prev, drawRandomCard()]);
  };

  const handleDebugAddOpponentCard = () => {
    setOpponentField((prev) => [...prev, drawRandomCard()]);
  };

  const handleDragStart = (event) => {
    const { type, card } = event.active.data.current ?? {};
    setActiveCard(card ?? null);
    setActiveSource(type ?? null);
  };

  // Vorschau am Feld-Ende gilt nur beim Spielen einer Handkarte, nicht
  // beim Angreifen (sonst würde sie kurz aufblitzen, während man mit
  // einer Feldkarte über das eigene Feld startet).
  const handleDragOver = (event) => {
    setIsOverOpponentCard(event.over?.id?.startsWith("opponent-card") ?? false);
    if (activeSource !== "handCard") {
      setIsOverField(false);
      return;
    }
    setIsOverField(event.over?.id === "field");
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const source = activeSource;
    setActiveCard(null);
    setActiveSource(null);
    setIsOverField(false);

    if (!over) return;

    if (source === "handCard" && over.id === "field") {
      const card = hand.find((c) => c.id === active.id);
      if (!card) return;
      setHand((prev) => prev.filter((c) => c.id !== active.id));
      setField((prev) => [...prev, card]);
      return;
    }

    if (source === "playerFieldCard" && over.data.current?.type === "opponentCreature") {
      const targetId = over.data.current.card.id;
      setAttackFlash({ attackerId: active.id, targetId });
      window.setTimeout(() => setAttackFlash(null), 320);
    }
  };

	return (
		<>
		{/* <div className="mb-3 flex items-center justify-between px-6 pt-4 text-sm text-white/70">
			<div>
			<span className="font-semibold text-white">Spieler:</span> {playerName}
			</div>
			<div>
			<span className="font-semibold text-white">Game ID:</span> {gameId}
			</div>
		</div> */}

		<DndContext
			sensors={sensors}
			collisionDetection={pointerWithin}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			<div className="relative flex h-screen w-full flex-col overflow-hidden bg-[radial-gradient(ellipse_at_50%_50%,_#e2e2e2_0%,_#e2e2e2_50%,_#a5a5a5_100%)] text-white">
				{/* Gegnerbereich */}
				<div className="flex h-2/5 min-h-0 flex-col items-center justify-end gap-3 overflow-hidden pb-6">
					<OpponentField cards={opponentField} hitCardId={attackFlash?.targetId ?? null} />
				</div>

				{/* Trennlinie zwischen den Spielhälften */}
				<div className="relative h-[3px] w-full shrink-0 bg-gradient-to-r from-transparent via-white/100 to-transparent" />

				{/* Spielerbereich */}
				<div className="flex h-3/5 min-h-0 flex-col items-center justify-start overflow-hidden pt-8">
					<Field
						cards={field}
						previewCard={isOverField ? activeCard : null}
						attackingCardId={attackFlash?.attackerId ?? null}
					/>
				</div>
			</div>

			{/* hand karten */}
			<div className="fixed bottom-0 left-0 z-20 flex w-full items-end justify-between gap-6 px-3 py-3">
				<div className="flex items-end justify-start">
					<Hand cards={hand} />
				</div>
				<DeckButton onDraw={handleDraw} />
			</div>

			<div className="fixed top-0 left-1/2 z-20 flex -translate-x-1/2 items-end justify-center gap-6 px-6 pt-1">
				<DebugAddOpponentCardButton onAdd={handleDebugAddOpponentCard} />
			</div>

			<DragOverlay dropAnimation={null}>
			{activeCard ? (
				<CardFace
				card={activeCard}
				isDragging={true}
				isOverOpponentCard={isOverOpponentCard}
				//   className={`shadow-2xl ring-2 ${activeSource === "playerFieldCard" ? "ring-red-400/50" : "ring-white/30"}`}
				/>
			) : null}
			</DragOverlay>
		</DndContext>
		</>
	);
}
