import { motion } from "framer-motion";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

export default function ResumoCard({ titulo, valor, icon, color, onClick, trend, percentage }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 shadow-2xl 
        cursor-pointer transform transition-all duration-300 hover:shadow-3xl
        ${onClick ? 'hover:brightness-110' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{titulo}</p>
          <h3 className="text-3xl font-bold text-white">{valor}</h3>
          {percentage && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-white/70 text-sm">{percentage}</span>
              {trend === "up" && <FiTrendingUp className="text-green-300" />}
              {trend === "down" && <FiTrendingDown className="text-red-300" />}
            </div>
          )}
        </div>
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
          {icon}
        </div>
      </div>
      <div className="h-1 w-full bg-white/30 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage ? parseFloat(percentage) : 100}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full bg-white"
        />
      </div>
    </motion.div>
  );
}