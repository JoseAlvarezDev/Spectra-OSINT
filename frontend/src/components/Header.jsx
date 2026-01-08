import React, { useState } from 'react';
import { Menu, X, Shield, Globe, AlertTriangle, MoreVertical } from 'lucide-react';

import { useLanguage } from '../context/LanguageHooks';

const Header = ({ onOpenPrivacy, onOpenDisclaimer, onOpenMobileMenu }) => {
    const { t, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);

    return (
        <header className="w-full flex justify-between items-center py-4 px-8 border-b border-white/5 bg-black/10 backdrop-blur-md z-[100] relative">
            <div className="flex items-center gap-4">
                <button
                    onClick={onOpenMobileMenu}
                    className="md:hidden p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">{t.header.encryptionMode}</span>
                    <span className="text-[11px] text-cyan-400 font-mono font-bold">{t.header.encryptionStatus}</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-2 ${isOpen
                            ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                            }`}
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <MoreVertical className="w-5 h-5" />}
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute top-full right-0 mt-3 w-56 glass-panel border border-cyan-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
                            <div className="p-2 border-b border-white/5 bg-white/5">
                                <p className="text-[9px] text-gray-500 font-mono uppercase px-3 py-1">{t.header.quickActions}</p>
                            </div>
                            <div className="p-1">
                                <div>
                                    <button
                                        onClick={() => setIsLangOpen(!isLangOpen)}
                                        className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-gray-400 hover:text-white hover:bg-cyan-500/10 rounded-lg transition-all group font-mono"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-4 h-4 group-hover:text-cyan-400" />
                                            {t.header.languages}
                                        </div>
                                        <div className={`transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`}>
                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>

                                    {isLangOpen && (
                                        <div className="pl-10 pr-2 space-y-1 my-1">
                                            <button
                                                onClick={() => {
                                                    setLanguage('es');
                                                    setIsLangOpen(false);
                                                }}
                                                className="w-full text-left px-3 py-2 text-[10px] text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/5 rounded-md transition-all font-mono border-l border-white/10 hover:border-cyan-500/50"
                                            >
                                                ESPAÑOL
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setLanguage('en');
                                                    setIsLangOpen(false);
                                                }}
                                                className="w-full text-left px-3 py-2 text-[10px] text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/5 rounded-md transition-all font-mono border-l border-white/10 hover:border-cyan-500/50"
                                            >
                                                ENGLISH
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        onOpenPrivacy();
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-gray-400 hover:text-white hover:bg-cyan-500/10 rounded-lg transition-all group font-mono"
                                >
                                    <Shield className="w-4 h-4 group-hover:text-cyan-400" />
                                    {t.header.privacy}
                                </button>
                                <button
                                    onClick={() => {
                                        onOpenDisclaimer();
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-gray-400 hover:text-white hover:bg-cyan-500/10 rounded-lg transition-all group font-mono"
                                >
                                    <AlertTriangle className="w-4 h-4 group-hover:text-cyan-400" />
                                    {t.header.disclaimer}
                                </button>
                            </div>
                        </div>
                    )}
                </div>


            </div>
        </header>
    );
};

export default Header;
