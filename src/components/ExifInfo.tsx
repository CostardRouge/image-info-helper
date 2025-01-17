import { motion, AnimatePresence } from "framer-motion";

import { ExifData } from "../types/types.ts"

interface ExifInfoProps {
  exifData: ExifData;
  visible: boolean;
}

const ExifInfo = ({ exifData, visible }: ExifInfoProps) => {
  if (!exifData) return null;

  const formatShutterSpeed = (speed?: number) => {
    if (!speed) return "N/A";
    return speed < 1 ? `1/${Math.round(1/speed)}` : `${speed}`;
  };

  const formatAperture = (aperture?: number) => {
    if (!aperture) return "N/A";
    return `ƒ/${aperture}`;
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex gap-8 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg"
        >
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">ISO</span>
            <span className="text-gray-700">{exifData.iso || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Shutter</span>
            <span className="text-gray-700">{formatShutterSpeed(exifData.shutterSpeed)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Aperture</span>
            <span className="text-gray-700">{formatAperture(exifData.aperture)}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExifInfo;