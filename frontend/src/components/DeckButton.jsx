import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { CARD_WIDTH, CARD_HEIGHT } from "./CardFace.jsx";

export default function DeckButton({ onDraw }) {
  return (
    <motion.button
      onClick={onDraw}
      whileTap={{ scale: 0.94 }}
      className="group relative flex flex-col items-center justify-center gap-1 rounded-xl bg-black/20 backdrop-blur-sm"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      <div className="pointer-events-none absolute inset-0">
        {/* <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-xl bg-gray-500/50" />
        <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 rounded-xl bg-gray-500/70" /> */}
      </div>
      <Layers className="relative h-6 w-6 text-white" />
      <span className="relative text-[11px] font-medium tracking-wide text-white">Deck</span>
    </motion.button>
  );
}
