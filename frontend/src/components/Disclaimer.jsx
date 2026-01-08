import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

import { useLanguage } from '../context/LanguageHooks';

const SESSION_ID = Math.random().toString(36).substring(7).toUpperCase();

export default function Disclaimer({ onAccept }) {
    const { t } = useLanguage();
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#050508]/90 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="max-w-2xl w-full glass-panel p-8 relative overflow-hidden border-cyan-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

                <div className="flex flex-col items-center mb-8">
                    <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.1)] mb-4">
                        <img src={`${import.meta.env.BASE_URL}spectra-logo.png`} alt="SPECTRA" className="w-16 h-16 object-contain drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">{t.disclaimer.title}</h1>
                        <p className="text-xs text-cyan-400 tracking-[0.3em] font-mono uppercase">{t.disclaimer.subtitle}</p>
                    </div>

                    <div className="space-y-4 text-gray-400 text-sm leading-relaxed text-left bg-black/40 p-6 rounded-xl border border-white/5 font-mono">
                        <p className="flex gap-3">
                            <span className="text-cyan-500 font-bold">[!]</span>
                            {t.disclaimer.p1}
                        </p>
                        <p className="flex gap-3">
                            <span className="text-cyan-500 font-bold">[!]</span>
                            {t.disclaimer.p2}
                        </p>
                        <p className="flex gap-3">
                            <span className="text-cyan-500 font-bold">[!]</span>
                            {t.disclaimer.p3}
                        </p>
                        <p className="flex gap-3">
                            <span className="text-cyan-500 font-bold">[!]</span>
                            {t.disclaimer.p4}
                        </p>
                    </div>

                    <button
                        onClick={onAccept}
                        className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(0,180,255,0.2)] hover:shadow-[0_0_40px_rgba(0,180,255,0.4)]"
                    >
                        <Check className="w-5 h-5 group-hover:scale-125 transition-transform" />
                        <span>{t.disclaimer.button}</span>
                    </button>

                    <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                        {t.disclaimer.session}: {SESSION_ID}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
