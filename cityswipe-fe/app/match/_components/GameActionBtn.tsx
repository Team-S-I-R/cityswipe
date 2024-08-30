"use client";
import { motion } from "framer-motion";
import BadIcon from "./BadIcon";
import GoodIcon from "./GoodIcon";

import { IsDragOffBoundary } from "@/lib/games.type";

const actionPropsMatrix = {
  left: {
    ariaLabel: "Swipe Left",
    bgColorClass: "bg-gradient-to-t from-pink-500 to-red-400",
    icon: BadIcon,
    iconBaseColorClass: "text-white",
  },
  right: {
    ariaLabel: "Swipe Right",
    bgColorClass: "bg-gradient-to-t from-cyan-500 to-green-400",
    icon: GoodIcon,
    iconBaseColorClass: "text-white",
  },
};

type Props = {
  ariaLabel: string;
  scale: number;
  direction: "left" | "right";
  isDragOffBoundary: IsDragOffBoundary;
  onClick: () => void;
};

const GameActionBtn = ({
  scale,
  direction,
  isDragOffBoundary = null,
  onClick,
}: Props) => {
  const Icon: React.ElementType = actionPropsMatrix[direction!].icon;

  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.9 }}>
      <motion.div
        className={`flex items-center justify-center p-2 rounded-full ${actionPropsMatrix[direction].bgColorClass} shadow`}
        style={{ scale: scale }}
      >
        <Icon
          className={`scale-[60%] duration-100 ease-out ${
            isDragOffBoundary != null && isDragOffBoundary === direction
              ? "text-white"
              : actionPropsMatrix[direction!].iconBaseColorClass
          }`}
        />
      </motion.div>
    </motion.button>
  );
};

export default GameActionBtn;
