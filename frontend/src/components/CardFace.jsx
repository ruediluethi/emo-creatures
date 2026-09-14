export const CARD_WIDTH = 143;
export const CARD_HEIGHT = 200;

// Bewusst "dumm" gehalten: kennt weder dnd-kit noch Framer Motion.
// Drag-Verhalten und Animation kommen von den umgebenden Komponenten
// (HandCard, FieldCard), damit CardFace unabhängig wiederverwendbar bleibt
// (z. B. auch für eine reine Vorschau/Detailansicht ohne Drag).
export default function CardFace({ 
	card, 
	className = "", 
	style = {}, 
	isDragging = false,
	isOverOpponentCard = false 
}) {
	return (
		<div
		className={`select-none ${className}`} 
		style={{
			width: CARD_WIDTH,
			height: CARD_HEIGHT,
			borderRadius: 8,
			boxShadow: isDragging ? 
				(isOverOpponentCard
					? "0 0 30px 0px rgba(192, 15, 34, 0.9), -5px 10px 15px -3px rgba(0,0,0,0.4)" 
					: "0 0 30px -5px rgba(253, 198, 0, 0.6), -5px 10px 15px -3px rgba(0,0,0,0.4)" 
				) : (isOverOpponentCard
					?  "0 0 15px -5px rgba(192, 15, 34, 0.9), 0 10px 15px -3px rgba(0,0,0,0.1)"
					: "0 10px 15px -3px rgba(0,0,0,0.1)"
				),
			transition: "box-shadow 120ms ease, background-color 120ms ease",
			backgroundColor: isOverOpponentCard ? "rgb(192, 15, 34)" : "rgba(255, 255, 255, 0.0)",
			// objectFit: "cover",
			...style,
		}}
		>
		<img
			src={card.imageUrl}
			alt={card.name}
			draggable={false}
			
			style={{
			width: CARD_WIDTH,
			height: CARD_HEIGHT,
			opacity: isOverOpponentCard ? 0.8 : 1,
			transition: "opacity 120ms ease",
			}}
		/>
		</div>
	);
}
