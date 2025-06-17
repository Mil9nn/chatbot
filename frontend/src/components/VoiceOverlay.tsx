import { Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceOverlayProps {
  isListening: boolean;
}

const VoiceOverlay: React.FC<VoiceOverlayProps> = ({ isListening }) => {
  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed bottom-25 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg border border-white/20 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 z-50"
        >
          <div className="relative w-10 h-10">
            <span className="absolute animate-ping w-full h-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-10 w-10 bg-blue-500">
              <Mic className="text-white m-auto" />
            </span>
          </div>
          <div className="text-base font-medium">Listening...</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceOverlay;
