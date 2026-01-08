import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

import { useLanguage } from '../context/LanguageHooks';

export default function SplashScreen({ onComplete }) {
    const { t } = useLanguage();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500); // Wait a bit after 100%
                    return 100;
                }
                return prev + 2; // Speed of loading
            });
        }, 40);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050508] text-white overflow-hidden"
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative mb-8"
                >
                    {/* Logo Glow Effect */}
                    <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full"></div>

                    <img
                        src={`${import.meta.env.BASE_URL}spectra-logo.png`}
                        alt="SPECTRA Logo"
                        className="w-32 h-32 md:w-48 md:h-48 relative z-10 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                    />
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-4xl md:text-5xl font-bold tracking-[0.2em] mb-2 font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
                >
                    SPECTRA
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-xs text-cyan-500/60 font-mono tracking-widest mb-12"
                >
                    {t.splashScreen.initializing}
                </motion.p>

                {/* Loading Bar */}
                <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden relative">
                    <motion.div
                        className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="mt-2 text-xs font-mono text-gray-500">
                    {progress}% {t.splashScreen.completed}
                </div>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-lg"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-purple-500/30 rounded-br-lg"></div>
        </motion.div>
    );
}
