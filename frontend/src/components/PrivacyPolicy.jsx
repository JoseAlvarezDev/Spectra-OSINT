import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageHooks';

export default function PrivacyPolicy({ onClose }) {
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
                className="max-w-4xl w-full max-h-[80vh] overflow-y-auto glass-panel p-8 relative border-cyan-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-black/20"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.1)] mb-4">
                        <img src={`${import.meta.env.BASE_URL}spectra-logo.png`} alt="SPECTRA" className="w-10 h-10 object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight text-center">{t.privacy.title}</h1>
                    <p className="text-xs text-cyan-400 tracking-[0.2em] font-mono uppercase mt-2">{t.privacy.lastUpdated}</p>
                </div>

                <div className="space-y-6 text-gray-300 font-mono text-sm leading-relaxed">
                    <section>
                        <h2 className="text-white font-bold mb-2 flex items-center gap-2">
                            <span className="w-1 h-4 bg-cyan-500"></span>
                            1. {t.privacy.sections.collection.title}
                        </h2>
                        <p className="pl-3 border-l border-white/10 text-gray-400">
                            {t.privacy.sections.collection.content}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-white font-bold mb-2 flex items-center gap-2">
                            <span className="w-1 h-4 bg-cyan-500"></span>
                            2. {t.privacy.sections.usage.title}
                        </h2>
                        <p className="pl-3 border-l border-white/10 text-gray-400">
                            {t.privacy.sections.usage.content}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-white font-bold mb-2 flex items-center gap-2">
                            <span className="w-1 h-4 bg-cyan-500"></span>
                            3. {t.privacy.sections.storage.title}
                        </h2>
                        <p className="pl-3 border-l border-white/10 text-gray-400">
                            {t.privacy.sections.storage.content}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-white font-bold mb-2 flex items-center gap-2">
                            <span className="w-1 h-4 bg-cyan-500"></span>
                            4. {t.privacy.sections.rights.title}
                        </h2>
                        <p className="pl-3 border-l border-white/10 text-gray-400">
                            {t.privacy.sections.rights.content}
                        </p>
                    </section>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-xs text-gray-500">{t.privacy.contact}</p>
                </div>
            </motion.div>
        </motion.div>
    );
}
