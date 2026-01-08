import React, { useState } from 'react';
import axios from 'axios';
import { Phone, CheckCircle, XCircle, Globe, Radio, AlertTriangle, Shield, ExternalLink } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:8000/api';

export default function PhoneTracker() {
    const [number, setNumber] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!number) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/track/phone/${encodeURIComponent(number)}`);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
                    Signal Intercept
                </h2>
                <p className="text-gray-400">Analyze MSISDN/PSTN numbers and carrier data.</p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Enter Phone Number with Country Code (e.g. +14155552671)"
                        className="w-full glass-panel p-4 pl-12 text-lg input-glow rounded-xl"
                    />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-cyber px-8 rounded-xl disabled:opacity-50 border-purple-500/50 text-purple-400 hover:border-purple-400"
                >
                    {loading ? 'Tracing...' : 'Trace Signal'}
                </button>
            </form>

            {data && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-8 max-w-2xl mx-auto border-purple-500/20"
                >
                    <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-4">
                        <div>
                            <h3 className="text-xs text-purple-400 font-mono tracking-widest mb-1">TARGET MSISDN</h3>
                            <div className="text-4xl font-mono text-white">{data.number}</div>
                        </div>
                        {data.valid ? (
                            <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                                <CheckCircle className="w-4 h-4" /> <span className="text-xs font-bold">VALID</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                                <XCircle className="w-4 h-4" /> <span className="text-xs font-bold">INVALID</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-white/5">
                                    <Globe className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase">Location</div>
                                    <div className="text-lg font-medium">{data.location || 'Unknown'}</div>
                                    <div className="text-xs text-gray-600 font-mono">Country Code: +{data.country_code}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-white/5">
                                    <Radio className="w-6 h-6 text-pink-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase">Carrier (Original Assignment)</div>
                                    <div className="text-lg font-medium">{data.carrier || 'Unknown / Landline'}</div>
                                    <div className="text-xs text-yellow-500/80 font-mono mt-1">* Does not detect portability</div>
                                    <div className="text-xs text-gray-600 font-mono">{data.type}</div>
                                </div>
                            </div>

                            {/* Bizum Detector (Spain + Mobile) */}
                            {data.country_code === 34 && data.type === 'Mobile' && (
                                <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                                            BZ
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase">Payment Network</div>
                                            <div className="text-sm font-bold text-blue-400">Bizum Compatible</div>
                                        </div>
                                    </div>
                                    <div className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-mono">
                                        HIGH PROBABILITY
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-sm font-mono space-y-2">
                            <div className="text-gray-500 border-b border-white/5 pb-1 mb-2">RAW_DATA_DUMP</div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Region:</span>
                                <span className="text-blue-300">{data.location}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Type:</span>
                                <span className="text-yellow-300">{data.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Timezones:</span>
                            </div>
                            <div className="text-xs text-gray-500 break-words">
                                {data.timezone}
                            </div>
                        </div>
                    </div>


                    {/* Reputation / Spam Check */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        {data.spam_score > 0 ? (
                            <div className="bg-red-500/10 border border-red-500/40 p-4 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
                                    <div>
                                        <div className="text-red-400 font-bold text-lg">SPAM DETECTED</div>
                                        <div className="text-xs text-red-300/70">
                                            Flagged in anti-spam databases (Score: {data.spam_score})
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-mono font-bold text-red-500">{data.spam_reports}</div>
                                    <div className="text-xs text-red-400 uppercase">Reports</div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Shield className="w-6 h-6 text-green-500" />
                                    <div>
                                        <div className="text-green-400 font-bold">Clean Reputation</div>
                                        <div className="text-xs text-green-300/50">
                                            No database matches found.
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href={`https://www.google.com/search?q="${data.number}" OR "${data.number.replace('+', '')}" spam fraud scam`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs text-gray-400 flex items-center gap-2 transition-all"
                                >
                                    <span>Manual Audit</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        )}
                    </div>

                </motion.div>
            )}
        </div>
    );
}
