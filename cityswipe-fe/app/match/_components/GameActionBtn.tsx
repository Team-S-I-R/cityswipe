"use client";
import { motion } from "framer-motion";
import BadIcon from "../../../components/ui/BadIcon";
import GoodIcon from "../../../components/ui/GoodIcon";

import { IsDragOffBoundary } from "@/lib/destinationSet.type";

const actionPropsMatrix = {
  left: {
    ariaLabel: "Swipe Left",
    bgColorClass: "bg-[#F75064]",
    icon: BadIcon,
    iconBaseColorClass: "text-[#701823]",
  },
  right: {
    ariaLabel: "Swipe Right",
    bgColorClass: "bg-[#82D350]",
    icon: GoodIcon,
    iconBaseColorClass: "text-[#2C5B10]",
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
        className={`flex items-center justify-center w-[60px] h-[60px] rounded-full ${actionPropsMatrix[direction].bgColorClass} shadow`}
        style={{ scale: scale }}
      >
        <Icon
          className={`w-[24px] h-[24px] duration-100 ease-out ${
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
