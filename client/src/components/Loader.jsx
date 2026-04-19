import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Loader = ({ text = 'Reading the stars...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    >
      <Star className="text-gold-500" size={40} fill="currentColor" />
    </motion.div>
    <motion.p
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="text-gold-400/70 font-cinzel text-sm tracking-wider"
    >
      {text}
    </motion.p>
  </div>
);

export default Loader;
