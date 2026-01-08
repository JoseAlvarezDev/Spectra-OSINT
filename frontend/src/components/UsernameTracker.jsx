import React, { useState } from 'react';
import axios from 'axios';
import { User, ExternalLink, ShieldCheck, ShieldAlert, Loader } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:8000/api';

export default function UsernameTracker() {
    const [username, setUsername] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!username) return;
        setLoading(true);
        setResults([]);
        try {
            const res = await axios.get(`${API_URL}/track/username/${username}`);
            setResults(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
                    Digital Footprint Hunter
                </h2>
                <p className="text-gray-400">Scan social networks for username usage.</p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter Username (e.g. hunxbyts)"
                        className="w-full glass-panel p-4 pl-12 text-lg input-glow rounded-xl"
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-cyber px-8 rounded-xl disabled:opacity-50 border-green-500/50 text-green-400 hover:border-green-400"
                >
                    {loading ? 'Hunting...' : 'Start Hunt'}
                </button>
            </form>

            {loading && (
                <div className="flex justify-center items-center py-12">
                    <Loader className="w-12 h-12 text-green-500 animate-spin" />
                </div>
            )}

            {results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((res, idx) => (
                        <motion.a
                            key={idx}
                            href={res.found ? res.url : '#'}
                            target={res.found ? "_blank" : "_self"}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`glass-panel p-4 flex items-center justify-between group transition-all duration-300 ${res.found
                                ? 'border-green-500/30 bg-green-500/5 hover:bg-green-500/10 cursor-pointer'
                                : 'border-white/5 opacity-50 grayscale cursor-not-allowed'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${res.found ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-600'}`}>
                                    {res.found ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                                </div>
                                <div>
                                    <div className="font-bold text-lg">{res.site}</div>
                                    <div className="text-xs text-gray-500 font-mono">{res.status}</div>
                                </div>
                            </div>

                            {res.found && <ExternalLink className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </motion.a>
                    ))}
                </div>
            )}
        </div>
    );
}
