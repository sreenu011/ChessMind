import { motion } from "framer-motion";
import { StaticMiniPieceFallback } from "./static-chess-fallback";

interface MiniSceneProps {
  isHovered?: boolean;
}

export function MiniKnightScene({ isHovered = false }: MiniSceneProps) {
  return (
    <motion.div
      animate={{
        scale: isHovered ? 1.1 : 1,
        rotate: isHovered ? 6 : 0,
        y: isHovered ? -2 : 0,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="cursor-pointer"
    >
      <StaticMiniPieceFallback type="knight" />
    </motion.div>
  );
}

export function MiniRookScene({ isHovered = false }: MiniSceneProps) {
  return (
    <motion.div
      animate={{
        scale: isHovered ? 1.1 : 1,
        rotate: isHovered ? -6 : 0,
        y: isHovered ? -2 : 0,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="cursor-pointer"
    >
      <StaticMiniPieceFallback type="rook" />
    </motion.div>
  );
}
