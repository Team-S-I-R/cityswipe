import { Loader2 } from "lucide-react";
import * as React from "react";

interface props {
  show: boolean;
  text?: string;
}

const LoadingModal = ({show, text = ""}: props) => {
  return (
    show && (
      <>
        <div className="fixed inset-0 z-30 backdrop-blur-sm"></div>
        <div className="z-40 p-6 bg-white shadow-sm rounded-lg flex flex-col items-center justify-center absolute self-center place-items-center place-content-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="text-[22px] sm:text-[26px] animate-pulse font-bold text-center">
            {text}
          </span>
        </div>
      </>
    )
  );
};

export default LoadingModal;
