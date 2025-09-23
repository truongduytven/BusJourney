import { motion } from "framer-motion";

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
}

export default function FadeInSection({ children, delay = 0 }: FadeInSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay }}
      viewport={{ amount: 0.3, once: true }}
    >
      {children}
    </motion.div>
  );
}
