import { motion } from "framer-motion";
import BusIcon from "@/assets/BusIcon.png";

function IntroScreen({ onFinish }: { onFinish: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-[url('@/assets/banner_intro.png')] bg-cover z-50 overflow-hidden"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }} // hiển thị full
      animate={{ clipPath: "inset(0% 0% 0% 100%)" }} // thu dần từ trái sang
      transition={{ duration: 2, ease: "easeInOut", delay: 2 }}
      onAnimationComplete={onFinish}
    >
      {/* Xe khách chạy ngang */}
      <motion.img
        src={BusIcon}
        alt="Bus"
        className="w-60 h-auto absolute top-5/12 z-10"
        initial={{ left: "-1.2%" }}
        animate={{ left: "99%" }}
        transition={{ duration: 2, ease: "easeInOut", delay: 2 }}
      />

      {/* Text chào mừng */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-6xl font-extrabold text-primary"
      >
        🚍 Chào mừng đến với BusJourney
      </motion.h1>
    </motion.div>
  );
}

export default IntroScreen;
