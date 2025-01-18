import { motion, AnimatePresence } from "framer-motion";

import { ExifData } from "../types/types.ts"

interface ExifInfoProps {
  exifData: ExifData;
  visible: boolean;
}

const ExifInfo = ({ exifData, visible }: ExifInfoProps) => {
  if (![exifData.iso, exifData.shutterSpeed, exifData.aperture].every(Boolean)) return null;

  const formatShutterSpeed = (speed?: ExifData["shutterSpeed"]) => {
    const [ numerator, denominator ] = speed.value;

    if (numerator > 1) {
      return `${speed.description}"`
    }

    if (numerator === 1 && denominator === 1) {
      return `1"`
    }

    return `${numerator}/${denominator}s`
  };

  return (
    <AnimatePresence>
      {visible && (
          <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: 20}}
              className="flex gap-8 bg-white/80 backdrop-blur-sm px-6 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-700">{exifData.focalLength.description.toUpperCase()}</span>
            </div>

            <div className="flex items-center gap-2">
              {/*<span className="text-gray-500 font-medium">Aperture</span>*/}
              <span className="text-gray-700">{`ƒ/${exifData.aperture}`}</span>
            </div>

            <div className="flex items-center gap-2">
              {/*<span className="text-gray-500 font-medium">Shutter</span>*/}
              <span className="text-gray-700">{formatShutterSpeed(exifData.shutterSpeed)}</span>
            </div>

            <div className="flex items-center gap-2">
              {/*<span className="text-gray-500 font-medium">ISO</span>*/}
              <span className="text-gray-700">ISO {exifData.iso}</span>
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExifInfo;