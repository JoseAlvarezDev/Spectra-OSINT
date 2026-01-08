import React, { useState } from 'react';
import axios from 'axios';
import { Link2, Shield, AlertTriangle, ArrowRight, Share2, Search, Lock, Unlock } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function UrlIntell() {
    const [url, setUrl] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleScan = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const res = await axios.get(`http://localhost:8000/api/track/url?target=${encodeURIComponent(url)}`);
            setData(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to scan URL. Ensure it is accessible.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                    Malware Scanner
                </h2>
                <p className="text-gray-400">Unshorten links and detect phishing with VirusTotal.</p>
            </div>

            <form onSubmit={handleScan} className="flex gap-4">
                <div className="relative flex-1">
                    <Link2 className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter suspicious URL (e.g. bit.ly/xyz)"
                        className="w-full bg-[#0a0a0f] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-red-500/50 focus:shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all font-mono"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-500 text-white px-8 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Search className="w-5 h-5" />
                            <span>Scan</span>
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
                    <AlertTriangle className="w-5 h-5" />
                    {error}
                </motion.div>
            )}

            {data && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Main Result Card */}
                    <div className={`glass-panel p-6 border-l-4 ${data.virustotal_score > 0 ? 'border-red-500 bg-red-500/5' : 'border-green-500 bg-green-500/5'}`}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    {data.virustotal_score > 0 ? (
                                        <Shield className="w-6 h-6 text-red-500" />
                                    ) : (
                                        <Shield className="w-6 h-6 text-green-500" />
                                    )}
                                    <h3 className="font-bold text-xl text-white">
                                        {data.scanned
                                            ? (data.virustotal_score > 0 ? 'MALICIOUS DETECTED' : 'CLEAN URL')
                                            : 'REDIRECT ANALYZED'}
                                    </h3>
                                </div>
                                <p className="font-mono text-sm text-gray-400 break-all">{data.final_url}</p>
                            </div>

                            {data.scanned ? (
                                <div className="text-right">
                                    <div className={`text-3xl font-mono font-bold ${data.virustotal_score > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {data.virustotal_score} / {data.virustotal_total}
                                    </div>
                                    <div className="text-xs uppercase text-gray-500">VirusTotal Detections</div>
                                </div>
                            ) : (
                                <div className="px-4 py-2 bg-white/5 rounded border border-white/10 text-xs text-gray-400 max-w-[200px] text-center">
                                    VirusTotal Key Missing<br />Enable in backend .env
                                </div>
                            )}
                        </div>

                        {data.tags && data.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {data.tags.map((tag, i) => (
                                    <span key={i} className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30 font-mono">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Redirect Chain */}
                    <div className="glass-panel p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Share2 className="w-5 h-5 text-orange-400" />
                            <h3 className="font-bold text-lg">Redirect Trace</h3>
                        </div>

                        <div className="space-y-2">
                            {data.redirects && data.redirects.length > 0 ? (
                                data.redirects.map((hop, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono text-gray-500">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 p-3 bg-black/30 rounded border border-white/5 font-mono text-sm text-gray-300 break-all flex justify-between items-center group hover:border-orange-500/30 transition-colors">
                                            <span>{hop}</span>
                                            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-orange-400" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500 italic">No redirects found. Direct link.</div>
                            )}

                            {/* Final Destination */}
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs font-mono text-green-500">
                                    ★
                                </div>
                                <div className="flex-1 p-3 bg-green-500/10 rounded border border-green-500/30 font-mono text-sm text-green-400 break-all">
                                    {data.final_url}
                                </div>
                            </div>
                        </div>
                    </div>

                </motion.div>
            )}
        </div>
    );
}
