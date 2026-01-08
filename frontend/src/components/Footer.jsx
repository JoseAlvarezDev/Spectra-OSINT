import React from 'react';

import { useLanguage } from '../context/LanguageHooks';

const Footer = ({ onOpenLicense }) => {
    const { t } = useLanguage();
    return (
        <footer className="w-full py-3 px-8 border-t border-white/5 bg-black/20 backdrop-blur-sm flex justify-between items-center text-[10px] font-mono tracking-[0.2em] text-gray-500 shrink-0">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <img src="/spectra-logo.png" alt="" className="w-3 h-3 opacity-50" />
                    <span className="text-white font-bold">SPECTRA</span>
                </div>
                <span className="text-gray-800">|</span>
                <span>© 2026</span>
                <span className="text-gray-400">{t.footer.developer}</span>
                <span className="text-gray-800">|</span>
                <button onClick={onOpenLicense} className="hover:text-cyan-400 transition-colors">{t.footer.license}</button>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse font-bold"></span>
                    <span className="text-green-500/60 uppercase">{t.footer.systemSecure}</span>
                </div>
                <span className="text-gray-800">|</span>
                <span>{t.footer.rights}</span>
            </div>
        </footer>
    );
};

export default Footer;
