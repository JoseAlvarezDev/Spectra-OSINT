import { createContext, useContext } from 'react';

export const LanguageContext = createContext();

export function useLanguage() {
    return useContext(LanguageContext);
}
