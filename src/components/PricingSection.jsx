import React, { useState } from 'react';
import { Check, Film, Package, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEdit } from '../context/EditContext';
import { EditableText } from './EditableText';
import { VideoGallery } from './VideoGallery';

export function PricingSection() {
    const { content, isEditMode, addItem, removeItem } = useEdit();
    const [selectedGallery, setSelectedGallery] = useState(null);

    return (
        <div className="w-full max-w-7xl z-10 perspective-1000 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                {content.plans.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 50, rotateX: 10 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
                        whileHover={{
                            scale: 1.02,
                            boxShadow: "0 0 50px rgba(59, 130, 246, 0.25)"
                        }}
                        // NEW: Dark Glow Card Style
                        className={`
                          relative p-8 pb-16 flex flex-col mb-12 md:mb-0
                          bg-white/5 backdrop-blur-xl border border-white/10
                          scroll-smooth rounded-[40px] shadow-2xl
                          transition-all duration-300
                          ${plan.popular ? 'border-accent shadow-[0_0_30px_rgba(59,130,246,0.3)]' : ''}
                          ${index === 1 ? 'md:-mt-8 md:mb-8 z-20' : 'z-10'}
                        `}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-accent text-white px-6 py-2 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.6)] uppercase tracking-wider z-30 ring-4 ring-[#0a0a0a]">
                                פופולרי
                            </div>
                        )}

                        <div className="text-center mb-8 mt-4">
                            <h3 className="text-4xl font-black mb-2 tracking-tight text-white drop-shadow-lg">
                                <EditableText value={plan.name} path={`plans[${index}].name`} />
                            </h3>
                            <div className="text-gray-400 text-sm mb-6 min-h-[40px] font-medium">
                                <EditableText value={plan.description} path={`plans[${index}].description`} multiline />
                            </div>
                            <div className="text-6xl font-black text-white tracking-tight drop-shadow-xl inline-block bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
                                <EditableText value={plan.price} path={`plans[${index}].price`} />
                                <span className="text-xl font-bold text-gray-500 ml-2">/ יחידה</span>
                            </div>
                        </div>

                        {/* Packages Section */}
                        <div className="mb-8 bg-black/20 rounded-3xl p-6 border border-white/5">
                            <h4 className="flex items-center justify-between font-bold text-gray-300 mb-4 text-sm uppercase tracking-wide">
                                <span className="flex items-center gap-2"><Package size={16} className="text-accent" /> חבילות:</span>
                                {isEditMode && (
                                    <button onClick={() => addItem(`plans[${index}].packages`)} className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-colors">
                                        <Plus size={14} />
                                    </button>
                                )}
                            </h4>
                            <ul className="space-y-3">
                                {plan.packages.map((pkg, i) => (
                                    <li key={i} className="text-sm font-bold text-white/90 flex items-start gap-3 group/item relative pl-8">
                                        <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5 shadow-[0_0_10px_var(--color-accent)]"></span>
                                        <div className="flex-1">
                                            <EditableText value={pkg} path={`plans[${index}].packages[${i}]`} />
                                        </div>
                                        {isEditMode && (
                                            <button
                                                onClick={() => removeItem(`plans[${index}].packages`, i)}
                                                className="absolute left-0 top-0 text-red-400 hover:text-red-500 opacity-60 hover:opacity-100 transition-all p-1 z-50 pointer-events-auto bg-black/50 rounded-full"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Features Section */}
                        <div className="flex-1 flex flex-col relative">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-gray-400 text-xs uppercase">מה כלול:</h4>
                                {isEditMode && (
                                    <button onClick={() => addItem(`plans[${index}].features`)} className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-colors z-20 relative">
                                        <Plus size={14} />
                                    </button>
                                )}
                            </div>
                            <ul className="space-y-4">
                                {plan.features.map((feature, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-3 group/item relative pl-8"
                                    >
                                        <span className="bg-white/10 rounded-full p-1 text-accent shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                            <Check size={14} strokeWidth={3} />
                                        </span>
                                        <span className="text-gray-300 font-medium leading-tight pt-0.5 flex-1 relative z-10">
                                            <EditableText value={feature} path={`plans[${index}].features[${i}]`} />
                                        </span>
                                        {isEditMode && (
                                            <button onClick={() => removeItem(`plans[${index}].features`, i)} className="absolute left-0 top-0 text-red-400 hover:text-red-500 opacity-60 hover:opacity-100 transition-all p-1 z-50 pointer-events-auto bg-black/50 rounded-full">
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* Breaking the Border Button */}
                        <button
                            onClick={() => setSelectedGallery(plan.videos)}
                            className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-[85%] py-4 rounded-full bg-accent text-white font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(59,130,246,0.5)] group overflow-hidden border border-white/20 z-30"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            <div className="flex items-center justify-center gap-3">
                                <Film size={22} className="text-white group-hover:rotate-12 transition-transform" />
                                <span className="drop-shadow-sm">לצפייה בגלריה</span>
                            </div>
                        </button>

                    </motion.div>
                ))}
            </div>

            <VideoGallery
                isOpen={!!selectedGallery}
                onClose={() => setSelectedGallery(null)}
                videos={selectedGallery || []}
            />
        </div>
    );
}
