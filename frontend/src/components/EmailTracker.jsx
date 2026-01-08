import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Shield, Server, AlertTriangle, User, CheckCircle, XCircle } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function EmailTracker() {
    const [email, setEmail] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const res = await axios.get(`http://localhost:8000/api/track/email/${email}`);
            setData(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to analyze email. Check format or network.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                    Email Recon
                </h2>
                <p className="text-gray-400">Analyze legitimacy, infrastructure, and existence of email addresses.</p>
            </div>

            <form onSubmit={handleTrack} className="flex gap-4">
                <div className="relative flex-1">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="target@example.com"
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
                            <Shield className="w-5 h-5" />
                            <span>Verify</span>
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
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {/* Status Card */}
                    <div className={`glass-panel p-6 space-y-4 border-l-4 ${data.disposable ? 'border-red-500 bg-red-500/5' : 'border-green-500 bg-green-500/5'}`}>
                        <div className="flex items-center gap-3">
                            {data.disposable ? <AlertTriangle className="w-6 h-6 text-red-500" /> : <CheckCircle className="w-6 h-6 text-green-500" />}
                            <h3 className="font-bold text-lg">{data.disposable ? 'High Risk' : 'Legitimate'}</h3>
                        </div>
                        <div className="text-sm text-gray-300">
                            {data.disposable
                                ? 'This is a disposable/temporary email used for anonymity.'
                                : 'This appears to be a valid, permanent email address.'}
                        </div>
                        <div className="pt-2">
                            <span className={`px-2 py-1 rounded text-xs font-mono font-bold uppercase ${data.disposable ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                {data.provider_type}
                            </span>
                        </div>
                    </div>

                    {/* Infrastructure */}
                    <div className="glass-panel p-6 space-y-4 border-blue-500/20">
                        <div className="flex items-center gap-3 text-blue-400">
                            <Server className="w-5 h-5" />
                            <h3 className="font-bold">Infrastructure</h3>
                        </div>
                        <div className="space-y-3 font-mono text-sm">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-500">Domain</span>
                                <span>{data.domain}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-500">MX Server</span>
                                <span className="truncate max-w-[150px]" title={data.mx_records}>{data.mx_records || 'None'}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-500">Server Loc</span>
                                <span className="text-cyan-400">{data.country || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="text-gray-500">Server IP</span>
                                <span className="font-mono text-xs">{data.server_ip || 'Hidden'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Profile / Avatar */}
                    <div className="glass-panel p-6 flex flex-col items-center justify-center space-y-4 border-purple-500/20">
                        <div className="relative">
                            {data.gravatar_url ? (
                                <div className="relative">
                                    <img src={data.gravatar_url} alt="Profile" className="w-24 h-24 rounded-full border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
                                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-[#0a0a0f] rounded-full"></div>
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                    <User className="w-10 h-10 text-gray-600" />
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-bold text-white mb-1">Public Profile</div>
                            {data.gravatar_url ? (
                                <a href={data.gravatar_url} target="_blank" rel="noreferrer" className="text-xs text-purple-400 hover:text-purple-300 underline">
                                    View Avatar
                                </a>
                            ) : (
                                <span className="text-xs text-gray-500">No public avatar found</span>
                            )}
                        </div>
                    </div>

                </motion.div>
            )}
        </div>
    );
}
