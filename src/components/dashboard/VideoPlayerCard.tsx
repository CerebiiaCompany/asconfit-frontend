import React from "react";
import { Play } from "lucide-react";

export const FounderBanner: React.FC = () => {
  return (
    <div className="rounded-2xl shadow-lg w-full aspect-video overflow-hidden cursor-pointer hover:opacity-95 transition-opacity border border-gray-200 bg-white">
      <img 
        src="/Rectangle 30316.png" 
        alt="Banner Fundador" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};
