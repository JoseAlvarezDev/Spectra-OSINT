import React, { useState } from 'react';
import axios from 'axios';
import { Search, Wallet, ArrowDownLeft, ArrowUpRight, Activity, AlertTriangle } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function CryptoTracker() {
    const [address, setAddress] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!address) return;

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const res = await axios.get(`http://localhost:8000/api/track/crypto/${address}`);
            if (!res.data.found) {
                setError('Address not found or invalid format.');
            } else {
                setData(res.data);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch blockchain data. Check network.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                    Crypto Hunter
                </h2>
                <p className="text-gray-400">Trace Bitcoin (BTC) and Ethereum (ETH) assets on the blockchain.</p>
            </div>

            <form onSubmit={handleTrack} className="flex gap-4">
                <div className="relative flex-1">
                    <Wallet className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter Wallet Address (0x... or 1/3...)"
                        className="w-full bg-[#0a0a0f] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-green-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all font-mono"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-500 text-white px-8 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(22,163,74,0.3)]"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Search className="w-5 h-5" />
                            <span>Trace</span>
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
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    {/* Main Wallet Card */}
                    <div className={`col-span-1 lg:col-span-2 glass-panel p-8 relative overflow-hidden ${data.currency === 'ETH' ? 'border-purple-500/20' : 'border-orange-500/20'}`}>
                        <div className={`absolute top-0 right-0 p-4 opacity-10 ${data.currency === 'ETH' ? 'text-purple-500' : 'text-orange-500'}`}>
                            <Wallet className="w-32 h-32" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6">
                                <span className={`px-3 py-1 rounded text-xs font-bold ${data.currency === 'ETH' ? 'bg-purple-500 text-purple-950' : 'bg-orange-500 text-orange-950'}`}>
                                    {data.currency}
                                </span>
                                <span className="text-gray-500 font-mono text-xs truncate max-w-[200px] md:max-w-none">{data.address}</span>
                            </div>

                            <div className="mb-2 text-gray-400 text-sm uppercase tracking-widest">Current Balance</div>
                            <div className="text-5xl font-mono font-bold text-white mb-8">
                                {data.balance.toFixed(8)} <span className="text-lg text-gray-500">{data.currency}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <div className="flex items-center gap-2 text-green-400 mb-1">
                                        <ArrowDownLeft className="w-4 h-4" />
                                        <span className="text-xs uppercase">Total Received</span>
                                    </div>
                                    <div className="text-xl font-mono text-white">{data.total_received.toFixed(4)}</div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-red-400 mb-1">
                                        <ArrowUpRight className="w-4 h-4" />
                                        <span className="text-xs uppercase">Total Sent</span>
                                    </div>
                                    <div className="text-xl font-mono text-white">{data.total_sent.toFixed(4)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR Code & Stats */}
                    <div className="glass-panel p-6 flex flex-col items-center justify-center space-y-6 text-center">
                        <div className="bg-white p-2 rounded-lg">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data.address}`}
                                alt="Wallet QR"
                                className="w-32 h-32"
                            />
                        </div>
                        <div className="w-full">
                            <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-3">
                                <span className="text-gray-500 text-sm">Total Txns</span>
                                <span className="font-mono text-white flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-green-500" />
                                    {data.transactions}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Status</span>
                                <span className="font-mono text-green-400 text-xs px-2 py-1 bg-green-500/10 rounded">ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
