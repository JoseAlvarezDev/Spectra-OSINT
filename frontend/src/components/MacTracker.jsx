import React, { useState } from 'react';
import axios from 'axios';
import { Cpu, Search, Server, Shield, AlertCircle, CheckCircle } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function MacTracker() {
    const [mac, setMac] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!mac) return;

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const res = await axios.get(`http://localhost:8000/api/track/mac/${encodeURIComponent(mac)}`);
            setData(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to lookup MAC address. Check format or network.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
                    MAC Hunter
                </h2>
                <p className="text-gray-400">Identify hardware manufacturers from MAC addresses.</p>
            </div>

            <form onSubmit={handleTrack} className="flex gap-4">
                <div className="relative flex-1">
                    <Cpu className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        value={mac}
                        onChange={(e) => setMac(e.target.value)}
                        placeholder="00:1A:2B:3C:4D:5E"
                        className="w-full bg-[#0a0a0f] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all font-mono"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Search className="w-5 h-5" />
                            <span>Lookup</span>
                        </>
                    )}
                </button>
            </form>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3"
                >
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </motion.div>
            )}

            {data && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl mx-auto"
                >
                    <div className="glass-panel p-8 relative overflow-hidden border-blue-500/20">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Cpu className="w-24 h-24" />
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div>
                                <h3 className="text-xs text-blue-400 font-mono tracking-widest mb-1 uppercase">Hardware Identifier</h3>
                                <div className="text-4xl font-mono text-white tracking-tighter">{data.mac}</div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Server className="w-5 h-5 text-cyan-400" />
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Manufacturer / Vendor</span>
                                    </div>
                                    <div className="text-2xl font-bold text-white">
                                        {data.vendor}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 px-4 py-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                                    {data.found ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <span className="text-sm text-green-400 font-medium">Valid OUI Range Detected</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                                            <span className="text-sm text-yellow-400 font-medium">Unknown or Randomized MAC</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
