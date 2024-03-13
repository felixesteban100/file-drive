// "use client"
// import { motion } from "framer-motion"

// const scale = {
//   hidden: { scale: 0 },
//   enter: { scale: 1 },
//   out: { scale: 0 },
// }

// //opacity, x, y, scale, skew, rotate

// export default function Template({ children }: { children: React.ReactNode }) {
//   return (
//     <motion.main
//       variants={scale}
//       initial="hidden"
//       animate="enter"
//       exit="out"
//       transition={{ type: 'linear', duration: 0.5, delay: 0.1 }}
//       key="AI_SAAS"
//       layout
//     >
//       {children}
//     </motion.main>
//   )
// }