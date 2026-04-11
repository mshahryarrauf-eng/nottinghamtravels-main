import { motion } from "framer-motion"

interface Props {
  searchType: string
  setSearchType: (value: any) => void
}

export default function SearchTabs({ searchType, setSearchType }: Props) {
  return (
    <motion.div
      className="mt-8 flex justify-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      {["flights", "hotels", "packages"].map((type) => (
        <motion.button
          key={type}
          onClick={() => setSearchType(type)}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-2 rounded-full font-medium transition-all
          ${searchType === type
              ? "bg-white text-black shadow-xl"
              : "bg-white/10 text-white hover:bg-white/20"
            }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </motion.button>
      ))}
    </motion.div>
  )
}
