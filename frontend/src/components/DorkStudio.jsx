import React, { useState } from 'react';
import { Search, FileText, Lock, Database, Camera, Server, Eye, Globe } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function DorkStudio() {
    const [target, setTarget] = useState('');

    const dorks = [
        {
            id: 'confidential',
            title: 'Confidential Docs',
            desc: 'Find leaked PDF, Excel, and Doc files.',
            icon: FileText,
            query: (domain) => `site:${domain} ext:pdf OR ext:xls OR ext:xlsx OR ext:doc OR ext:docx "confidential" OR "private"`
        },
        {
            id: 'config',
            title: 'Config Files',
            desc: 'Exposed env, config, and install files.',
            icon: Server,
            query: (domain) => `site:${domain} ext:xml OR ext:conf OR ext:cnf OR ext:reg OR ext:inf OR ext:rdp OR ext:cfg OR ext:txt OR ext:ini`
        },
        {
            id: 'db',
            title: 'Database Backups',
            desc: 'Leaked SQL dumps and backup files.',
            icon: Database,
            query: (domain) => `site:${domain} ext:sql OR ext:dbf OR ext:mdb`
        },
        {
            id: 'login',
            title: 'Login Portals',
            desc: 'Hidden admin and login pages.',
            icon: Lock,
            query: (domain) => `site:${domain} inurl:admin OR inurl:login OR inurl:portal OR inurl:cpanel`
        },
        {
            id: 'cameras',
            title: 'Open Cameras',
            desc: 'Direct access to unprotected webcams.',
            icon: Camera,
            // Cameras are not usually domain specific, but we try path or generic search if no domain
            query: (domain) => domain ? `site:${domain} intitle:"webcam 7" OR intitle:"live view"` : `intitle:"webcam 7" OR intitle:"live view" -inurl:htm -inurl:html`
        },
        {
            id: 'indexes',
            title: 'Directory Listing',
            desc: 'Exposed server directories (Index of /).',
            icon: Eye,
            query: (domain) => `site:${domain} intitle:"index of"`
        }
    ];

    const handleDork = (dork) => {
        // If no domain provided for generic searches, use broad search
        const domain = target.trim();
        if (!domain && dork.id !== 'cameras') {
            alert("Please enter a target domain first (e.g., tesla.com)");
            return;
        }

        const q = dork.query(domain);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, '_blank');
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-500">
                    Dork Studio
                </h2>
                <p className="text-gray-400">Advanced Google Hacking made simple. Uncover hidden intelligence.</p>
            </div>

            <div className="flex gap-4 p-6 glass-panel border-teal-500/20">
                <div className="relative flex-1">
                    <Globe className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="Target Domain (e.g. nasa.gov)"
                        className="w-full bg-[#0a0a0f] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-teal-500/50 focus:shadow-[0_0_15px_rgba(20,184,166,0.1)] transition-all font-mono"
                    />
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {dorks.map((dork) => (
                    <button
                        key={dork.id}
                        onClick={() => handleDork(dork)}
                        className="glass-panel p-6 text-left group hover:bg-teal-500/5 border hover:border-teal-500/30 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <dork.icon className="w-24 h-24" />
                        </div>

                        <div className="relative z-10">
                            <div className="p-3 bg-white/5 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                                <dork.icon className="w-6 h-6 text-teal-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{dork.title}</h3>
                            <p className="text-sm text-gray-400 mb-4 h-10">{dork.desc}</p>

                            <div className="text-xs text-teal-500/70 font-mono flex items-center gap-2 group-hover:text-teal-400">
                                <Search className="w-3 h-3" />
                                <span>EXECUTE QUERY</span>
                            </div>
                        </div>
                    </button>
                ))}
            </motion.div>
        </div>
    );
}
