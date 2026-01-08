import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Camera, Upload, Map, Cpu, Layers, AlertCircle, CheckCircle } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:8000/api';

export default function ImageIntel() {
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (selectedFile) => {
        setFile(selectedFile);
        setLoading(true);
        setData(null);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const res = await axios.post(`${API_URL}/track/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
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
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                    EXIF Forensics
                </h2>
                <p className="text-gray-400">Extract hidden metadata and geolocation from images.</p>
            </div>

            {/* Drop Zone */}
            <div
                className={`relative border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden
          ${dragActive ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-700 hover:border-yellow-400/50 hover:bg-white/5'}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept="image/*"
                />

                {loading ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-yellow-400 font-mono animate-pulse">EXTRACTING METADATA...</span>
                    </div>
                ) : file ? (
                    <div className="flex flex-col items-center gap-4 p-8">
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="h-32 object-contain rounded-lg shadow-lg border border-white/10"
                        />
                        <span className="font-mono text-sm text-gray-400">{file.name}</span>
                    </div>
                ) : (
                    <>
                        <div className="p-4 rounded-full bg-yellow-400/10 mb-4">
                            <Upload className="w-8 h-8 text-yellow-400" />
                        </div>
                        <p className="text-lg font-medium">Drop Evidence Here</p>
                        <p className="text-sm text-gray-500 font-mono">or click to upload</p>
                    </>
                )}
            </div>

            {data && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {/* General Info */}
                    <div className="glass-panel p-6 space-y-4 border-yellow-500/20">
                        <div className="flex items-center gap-3 text-yellow-400">
                            <Camera className="w-5 h-5" />
                            <h3 className="font-bold">Device Data</h3>
                        </div>
                        <div className="space-y-3 font-mono text-sm">
                            {data.make === 'Unknown' && data.device === 'Unknown' ? (
                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs text-center">
                                    <AlertCircle className="w-4 h-4 mx-auto mb-1" />
                                    METADATA STRIPPED / SANITIZED
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-gray-500">Make</span>
                                        <span>{data.make}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-gray-500">Model</span>
                                        <span>{data.device}</span>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-between pt-1">
                                <span className="text-gray-500">Software</span>
                                <span className="truncate max-w-[120px] text-gray-400">{data.software}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tech Specs */}
                    <div className="glass-panel p-6 space-y-4 border-orange-500/20">
                        <div className="flex items-center gap-3 text-orange-400">
                            <Layers className="w-5 h-5" />
                            <h3 className="font-bold">Attributes</h3>
                        </div>
                        <div className="space-y-3 font-mono text-sm">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-500">Date</span>
                                <span>{data.date}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-500">Resolution</span>
                                <span>{data.size ? `${data.size[0]} x ${data.size[1]}` : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="text-gray-500">GPS Found</span>
                                {data.has_gps ? (
                                    <span className="text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> YES</span>
                                ) : (
                                    <span className="text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> NO</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* GPS Map */}
                    {data.latitude && data.longitude ? (
                        <div className="glass-panel p-1 col-span-1 md:col-span-2 lg:col-span-1 lg:row-span-2 h-full min-h-[250px] relative overflow-hidden group">
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                src={`https://maps.google.com/maps?q=${data.latitude},${data.longitude}&z=14&output=embed`}
                                style={{ filter: 'invert(90%) hue-rotate(180deg) contrast(90%) grayscale(20%)', height: '100%', minHeight: '300px' }}
                                title="Map"
                            />
                            <div className="absolute top-4 right-4 bg-black/80 text-yellow-400 px-3 py-1 rounded-full text-xs font-mono border border-yellow-500/30">
                                {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
                            </div>
                        </div>
                    ) : (
                        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center space-y-3 opacity-50 border-dashed">
                            <Map className="w-10 h-10 text-gray-600" />
                            <div className="text-gray-500">No Geolocation Data Embedded</div>
                        </div>
                    )}

                </motion.div>
            )}
        </div>
    );
}
