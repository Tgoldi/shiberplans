import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Film } from 'lucide-react';

export function VideoGallery({ isOpen, onClose, videos }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
                >
                    {/* Backdrop with Blur */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        // NEW: Dark Glow Modal Style with Massive Radius
                        className="relative w-full max-w-6xl max-h-[90vh] bg-[#111] border border-white/10 rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.2)] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
                            <h2 className="text-3xl font-black text-white flex items-center gap-3 drop-shadow-md">
                                <Play className="text-accent fill-accent shadow-[0_0_20px_var(--color-accent)]" size={28} />
                                גלריית עבודות
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors hover:rotate-90 duration-300 border border-white/5"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Video Grid */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-black/40">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {videos.map((video, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group relative aspect-video rounded-3xl overflow-hidden bg-white/5 shadow-2xl cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-white/5 hover:border-accent/50"
                                    >
                                        {/* Placeholder or Thumbnail */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${video.color || 'from-gray-900 to-black'} opacity-80 group-hover:opacity-100 transition-opacity duration-500`} />

                                        {/* Play Overlay */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:bg-accent group-hover:text-white transition-colors duration-300"
                                            >
                                                <Play size={36} className="ml-1 fill-current" />
                                            </motion.div>
                                            <h3 className="font-bold text-xl drop-shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 px-6 text-center">{video.title}</h3>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {videos.length === 0 && (
                                <div className="flex flex-col items-center justify-center p-20 text-gray-500">
                                    <Film size={64} className="mb-6 opacity-30" />
                                    <p className="text-xl">אין סרטונים זמינים בגלריה זו כרגע.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
