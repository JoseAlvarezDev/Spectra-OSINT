import React, { useState, useEffect } from 'react';
import { translations } from '../utils/translations';
import { LanguageContext } from './LanguageHooks';

export const LanguageProvider = ({ children }) => {
    // Default to Spanish as requested, but check localStorage
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('spectra_language');
        if (saved) return saved;

        const systemLang = navigator.language || navigator.userLanguage;
        return systemLang.startsWith('es') ? 'es' : 'en';
    });

    useEffect(() => {
        localStorage.setItem('spectra_language', language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'es' : 'en');
    };

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
