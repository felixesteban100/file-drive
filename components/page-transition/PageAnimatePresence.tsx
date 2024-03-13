"use client"

import { usePathname, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import FrozenRoute from './FrozenRoute'

const PageAnimatePresence = ({ children }: { children: JSX.Element }) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    return (
        <AnimatePresence mode="wait">
            <motion.div key={pathname + searchParams}>
                <FrozenRoute>{children}</FrozenRoute>
            </motion.div>
        </AnimatePresence>
    )
}

export default PageAnimatePresence