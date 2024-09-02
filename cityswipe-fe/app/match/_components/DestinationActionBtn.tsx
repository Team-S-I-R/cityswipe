"use client";
import { motion } from "framer-motion";
import BadIcon from "../../../components/ui/BadIcon";
import GoodIcon from "../../../components/ui/GoodIcon";

import { IsDragOffBoundary } from "@/lib/destinationSet.type";

const actionPropsMatrix = {
  left: {
    ariaLabel: "Swipe Left",
    bgColorClass: "bg-gradient-to-t from-red-400/30 to-orange-400/30 text-red-400 hover:text-white hover:from-red-400 hover:to-orange-400",
    icon: BadIcon,
    iconBaseColorClass: "text-white",
  },
  right: {
    ariaLabel: "Swipe Right",
    bgColorClass: "bg-gradient-to-t from-cyan-400/30 to-green-400/30 text-green-400 hover:text-white hover:from-cyan-400 hover:to-green-400",
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

const DestinationActionBtn = ({
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

export default DestinationActionBtn;
