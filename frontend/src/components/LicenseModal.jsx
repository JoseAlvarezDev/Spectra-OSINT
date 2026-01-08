import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { X, FileText } from 'lucide-react';

import { useLanguage } from '../context/LanguageHooks';

export default function LicenseModal({ onClose }) {
    const { language } = useLanguage();

    const licenseTextEn = `MIT License

Copyright (c) 2026 Jose Alvarez Dev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

    const licenseTextEs = `Licencia MIT

Copyright (c) 2026 Jose Alvarez Dev

Por la presente se otorga permiso, sin cargo, a cualquier persona que obtenga una copia
de este software y los archivos de documentación asociados (el "Software"), para utilizar
el Software sin restricciones, incluyendo sin limitación los derechos de
usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender
copias del Software, y para permitir a las personas a las que se les proporcione el Software
que lo hagan, sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas las
copias o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O
IMPLÍCITA, INCLUYENDO PERO NO LIMITADO A LAS GARANTÍAS DE COMERCIABILIDAD,
IDONEIDAD PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN. EN NINGÚN CASO LOS
AUTORES O TITULARES DEL COPYRIGHT SERÁN RESPONSABLES DE NINGUNA RECLAMACIÓN, DAÑOS U OTRA
RESPONSABILIDAD, YA SEA EN UNA ACCIÓN DE CONTRATO, AGRAVIO O DE OTRO TIPO, QUE SURJA DE,
FUERA DE O EN CONEXIÓN CON EL SOFTWARE O EL USO U OTROS TRATOS EN EL
SOFTWARE.`;

    const licenseText = language === 'es' ? licenseTextEs : licenseTextEn;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#050508]/90 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="max-w-3xl w-full max-h-[80vh] overflow-y-auto glass-panel p-8 relative border-cyan-500/20 shadow-[0_0_50px_rgba(0,240,255,0.15)] scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-black/20"
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
                        <FileText className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight text-center">{language === 'es' ? 'LICENCIA MIT' : 'MIT LICENSE'}</h1>
                    <p className="text-xs text-cyan-400 tracking-[0.2em] font-mono uppercase mt-2">OPEN SOURCE SOFTWARE</p>
                </div>

                <div className="p-6 bg-black/40 rounded-xl border border-white/5 font-mono text-xs md:text-sm text-gray-400 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {licenseText}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-xs text-gray-500">SPECTRA OSINT PLATFORM v1.0.0</p>
                </div>
            </motion.div>
        </motion.div>
    );
}
