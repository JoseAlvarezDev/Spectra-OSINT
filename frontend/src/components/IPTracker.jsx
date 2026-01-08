import React, { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, Server, Flag, Globe, Activity } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:8000/api';

export default function IPTracker() {
    const [ip, setIp] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!ip) return;
        setLoading(true);
        setError('');
        setData(null);

        try {
            const res = await axios.get(`${API_URL}/track/ip/${ip}`);
            setData(res.data);
        } catch {
            setError('Failed to track IP. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                    Global IP Surveillance
                </h2>
                <p className="text-gray-400">Locate and analyze network endpoints in real-time.</p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        placeholder="Enter IP Address (e.g., 8.8.8.8)"
                        className="w-full glass-panel p-4 pl-12 text-lg input-glow rounded-xl"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-cyber px-8 rounded-xl disabled:opacity-50"
                >
                    {loading ? 'Scanning...' : 'Initialize Scan'}
                </button>
            </form>

            {error && (
                <div className="p-4 border border-red-500/50 bg-red-500/10 rounded-xl text-red-200">
                    {error}
                </div>
            )}

            {data && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {/* Main Info Card */}
                    <div className="glass-panel p-6 col-span-1 md:col-span-2 lg:col-span-1 space-y-4 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-gray-400 text-sm font-mono">TARGET IDENTIFIED</h3>
                            {data.flag && <span className="text-2xl">{data.flag}</span>}
                        </div>
                        <div className="text-4xl font-mono font-bold text-white tracking-wider truncate">
                            {data.ip}
                        </div>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded border border-cyan-500/30">
                                {data.type || 'UNKNOWN'}
                            </span>
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded border border-purple-500/30">
                                ACTIVE
                            </span>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="glass-panel p-6 space-y-4">
                        <div className="flex items-center gap-3 text-purple-400">
                            <MapPin className="w-5 h-5" />
                            <h3 className="font-bold">Geo-Location</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-400">Country</span>
                                <span className="text-right">{data.country}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-400">City</span>
                                <span className="text-right">{data.city}</span>
                            </div>
                            <div className="flex justify-between text-xs font-mono text-gray-500 pt-1">
                                <span>LAT: {data.latitude}</span>
                                <span>LON: {data.longitude}</span>
                            </div>
                        </div>
                    </div>

                    {/* Network */}
                    <div className="glass-panel p-6 space-y-4">
                        <div className="flex items-center gap-3 text-green-400">
                            <Server className="w-5 h-5" />
                            <h3 className="font-bold">Network Intel</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-400">ISP</span>
                                <span className="text-right truncate max-w-[150px]">{data.isp}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-400">ASN</span>
                                <span className="text-right">{data.asn}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="text-gray-400">Status</span>
                                <span className="text-green-400 flex items-center gap-2">
                                    <Activity className="w-3 h-3" /> Online
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Map Embed */}
                    {data.latitude && data.longitude && (
                        <div className="glass-panel p-1 col-span-1 md:col-span-2 lg:col-span-3 h-64 overflow-hidden relative">
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight="0"
                                marginWidth="0"
                                src={`https://maps.google.com/maps?q=${data.latitude},${data.longitude}&z=13&output=embed`}
                                style={{ filter: 'invert(90%) hue-rotate(180deg) contrast(90%) grayscale(20%)' }}
                                title="Map"
                            />
                            <div className="absolute inset-0 pointer-events-none border border-cyan-500/20 rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
