import React, { useState } from 'react';
import { Check, Film, Package, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEdit } from '../context/EditContext';
import { EditableText } from './EditableText';
import { VideoGallery } from './VideoGallery';
import { ComparisonSlider } from './ComparisonSlider';

export function PricingSection() {
    const { content, isEditMode, addItem, removeItem } = useEdit();
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [selectedColorGrading, setSelectedColorGrading] = useState(null);

    const mainPlans = content.plans.filter(p => !p.isAddon);
    const addons = content.plans.filter(p => p.isAddon);

    return (
        <div className="w-full px-4 md:px-8 z-10 perspective-1000 pb-40">
            {/* Main Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-6 mb-24 max-w-[1600px] mx-auto">
                {mainPlans.map((plan, index) => (
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
                          relative px-4 py-8 flex flex-col
                          bg-white/5 backdrop-blur-xl border border-white/10
                          scroll-smooth rounded-[32px] shadow-2xl
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

                        <div className="text-center mb-6 mt-2">
                            <h3 className="font-black mb-3 text-white drop-shadow-lg min-h-[64px] flex flex-col items-center justify-center direction-rtl leading-tight px-1">
                                <span className="text-2xl xl:text-3xl tracking-tighter whitespace-nowrap block">
                                    <EditableText value={plan.name} path={`plans[${index}].name`} />
                                </span>
                                {plan.englishName && (
                                    <span className="text-lg xl:text-xl tracking-tight opacity-90 block mt-1 dir-ltr">
                                        <EditableText value={plan.englishName} path={`plans[${index}].englishName`} />
                                    </span>
                                )}
                            </h3>

                            {/* GOAL Section */}
                            {plan.goal && (
                                <div className="text-accent text-sm font-bold mb-4 px-2 min-h-[60px] flex items-center justify-center border-b border-white/5 pb-4">
                                    <EditableText value={plan.goal} path={`plans[${index}].goal`} multiline />
                                </div>
                            )}

                            <div className="text-gray-400 text-sm mb-4 font-medium hidden">
                                <EditableText value={plan.description} path={`plans[${index}].description`} multiline />
                            </div>

                            <div className="text-5xl font-black text-white tracking-tight drop-shadow-xl inline-block bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400 mb-2">
                                <EditableText value={plan.price} path={`plans[${index}].price`} />
                                <span className="text-lg font-bold text-gray-500 ml-2">/ יחידה</span>
                            </div>
                        </div>

                        {/* Packages Section */}
                        {plan.packages && plan.packages.length > 0 && (
                            <div className="mb-6 bg-black/20 rounded-2xl p-4 border border-white/5">
                                <h4 className="flex items-center justify-between font-bold text-gray-300 mb-3 text-xs uppercase tracking-wide">
                                    <span className="flex items-center gap-2"><Package size={14} className="text-accent" /> חבילות:</span>
                                    {isEditMode && (
                                        <button onClick={() => addItem(`plans[${index}].packages`)} className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-colors">
                                            <Plus size={14} />
                                        </button>
                                    )}
                                </h4>
                                <ul className="space-y-2">
                                    {plan.packages.map((pkg, i) => (
                                        <li key={i} className="text-sm font-bold text-white/90 flex items-start gap-3 group/item relative pl-4">
                                            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5 shadow-[0_0_10px_var(--color-accent)]"></span>
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
                        )}

                        {/* Features Section */}
                        <div className="flex-1 flex flex-col relative text-right">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-gray-400 text-xs uppercase">מה כלול:</h4>
                                {isEditMode && (
                                    <button onClick={() => addItem(`plans[${index}].features`)} className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-colors z-20 relative">
                                        <Plus size={14} />
                                    </button>
                                )}
                            </div>
                            <ul className="space-y-3">
                                {plan.features.map((feature, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-3 group/item relative pl-6"
                                    >
                                        <span className="bg-white/10 rounded-full p-1 text-accent shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.3)] mt-0.5">
                                            <Check size={12} strokeWidth={3} />
                                        </span>
                                        <span className="text-gray-300 text-sm font-medium leading-relaxed flex-1 relative z-10">
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

                            {/* Extra Sections (e.g. Upgrade Rec) */}
                            {plan.extraSections && plan.extraSections.map((section, sIdx) => (
                                <div key={sIdx} className="mt-6 pt-6 border-t border-white/10">
                                    <h5 className="text-accent font-bold text-sm mb-2">
                                        <EditableText value={section.title} path={`plans[${index}].extraSections[${sIdx}].title`} />
                                    </h5>
                                    <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-line">
                                        <EditableText value={section.content} path={`plans[${index}].extraSections[${sIdx}].content`} multiline />
                                    </p>
                                </div>
                            ))}

                            {/* Suitable For */}
                            {plan.suitableFor && (
                                <div className="mt-6 pt-4 border-t border-white/10">
                                    <p className="text-gray-400 text-xs italic">
                                        <EditableText value={plan.suitableFor} path={`plans[${index}].suitableFor`} multiline />
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Breaking the Border Button - Only if videos exist */}
                        {plan.videos && plan.videos.length > 0 && (
                            <button
                                onClick={() => setSelectedGallery(plan.videos)}
                                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] py-3 rounded-full bg-accent text-white font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(59,130,246,0.5)] group overflow-hidden border border-white/20 z-30"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                <div className="flex items-center justify-center gap-2">
                                    <Film size={20} className="text-white group-hover:rotate-12 transition-transform" />
                                    <span className="drop-shadow-sm text-base">לצפייה בגלריה</span>
                                </div>
                            </button>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Add-ons Section */}
            {addons.map((plan, localIndex) => {
                // Find the original index for EditableText paths
                const realIndex = content.plans.findIndex(p => p.id === plan.id);

                return (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-full px-4 mb-8"
                    >
                        <div className={`
                          relative p-6 md:p-10 flex flex-col gap-8
                          bg-gradient-to-r from-palette-card to-palette-main backdrop-blur-xl 
                          border border-palette-primary/30
                          rounded-[40px] shadow-[0_0_50px_rgba(5,131,242,0.15)]
                          overflow-hidden
                        `}>
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-palette-primary/20 via-transparent to-transparent pointer-events-none" />

                            {/* Top Section: Info & Price */}
                            <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-10 items-start w-full relative z-10">
                                <div className="flex-1 text-right w-full">
                                    <h3 className="text-2xl md:text-3xl font-black mb-4 text-white drop-shadow-xl flex items-center justify-end gap-3">
                                        <span className="px-3 py-1 bg-palette-primary/20 text-palette-accent text-xs rounded-full border border-palette-primary/30">תוספת</span>
                                        <EditableText value={plan.name} path={`plans[${realIndex}].name`} />
                                    </h3>

                                    {plan.goal && (
                                        <div className="text-blue-400 font-bold text-lg mb-6 border-b border-white/5 pb-4">
                                            <EditableText value={plan.goal} path={`plans[${realIndex}].goal`} multiline />
                                        </div>
                                    )}

                                    <h4 className="font-bold text-gray-400 text-xs uppercase mb-4">יתרונות השדרוג:</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                                <span className="bg-blue-400/20 p-1 rounded-full text-blue-300 shrink-0 mt-0.5">
                                                    <Check size={12} strokeWidth={3} />
                                                </span>
                                                <span className="text-gray-200 text-sm font-medium">
                                                    <EditableText value={feature} path={`plans[${realIndex}].features[${i}]`} />
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {plan.suitableFor && (
                                        <div className="mt-6 pt-6 border-t border-white/5 text-gray-400 italic text-sm">
                                            <EditableText value={plan.suitableFor} path={`plans[${realIndex}].suitableFor`} multiline />
                                        </div>
                                    )}
                                </div>

                                <div className="w-full md:w-1/3 flex flex-col p-4 bg-white/5 rounded-[32px] border border-white/10 shrink-0 relative group hover:bg-white/10 transition-all duration-500">
                                    {/* Thumbnail / Visual Area */}
                                    <div
                                        onClick={() => plan.galleryIds && setSelectedColorGrading(plan.galleryIds)}
                                        className={`w-full aspect-[16/10] rounded-[24px] overflow-hidden mb-5 relative shadow-lg bg-black/50 border border-white/5 group-hover:shadow-2xl transition-all duration-500 ${plan.galleryIds ? 'cursor-pointer hover:scale-[1.02] active:scale-95' : ''}`}
                                    >
                                        {plan.image ? (
                                            <>
                                                <img
                                                    src={plan.image}
                                                    alt={plan.name}
                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                />
                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />

                                                {/* Text Overlay for Gallery */}
                                                {plan.galleryIds && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 text-white p-4">
                                                        <div className="bg-accent p-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                                                            <Film size={24} className="text-white drop-shadow-md" />
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="font-black text-lg drop-shadow-lg leading-tight">צפה בגלריה</div>
                                                            <div className="text-[10px] font-medium text-gray-200 drop-shadow-md bg-black/50 px-2 py-0.5 rounded-full inline-block mt-1">
                                                                {plan.galleryIds.length} דוגמאות
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Glossy Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-white/10 rounded-[24px]" />
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-white/0">
                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-palette-primary to-palette-card flex items-center justify-center shadow-xl shadow-palette-accent/20 group-hover:scale-110 transition-transform duration-500">
                                                    <Plus size={32} className="text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Area */}
                                    <div className="text-center pb-2">
                                        <div className="flex items-center justify-center gap-1 mb-2">
                                            <div className="text-5xl font-black text-white tracking-tighter drop-shadow-xl">
                                                <EditableText value={plan.price} path={`plans[${realIndex}].price`} />
                                            </div>
                                            <span className="text-xl text-white/40 font-bold mt-2">₪</span>
                                        </div>
                                        <div className="inline-flex">
                                            <p className="text-gray-400 text-[10px] font-semibold tracking-wide bg-white/5 px-3 py-1.5 rounded-full border border-white/5 group-hover:border-white/10 transition-colors">
                                                בנוסף למחיר החבילה
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                );
            })}

            {/* Video Gallery Modal */}
            <VideoGallery
                isOpen={!!selectedGallery}
                onClose={() => setSelectedGallery(null)}
                videos={selectedGallery || []}
            />

            {/* Color Grading Gallery Modal */}
            {
                selectedColorGrading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedColorGrading(null)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-5xl max-h-[90vh] bg-[#0C2059] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 z-10 relative">
                                <h3 className="text-2xl font-bold text-white">השוואת עריכת צבע</h3>
                                <button onClick={() => setSelectedColorGrading(null)} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar" dir="ltr">
                                <div className="flex flex-col gap-12 max-w-4xl mx-auto">
                                    {selectedColorGrading.map((id) => (
                                        <div key={id} className="flex flex-col gap-4">
                                            <ComparisonSlider
                                                beforeImage={`/color-grade/rec709/${id}.png`}
                                                afterImage={`/color-grade/final/${id}.png`}
                                                beforeLabel="תיקון צבעים בסיס"
                                                afterLabel=" תיקון צבעים מתקדם"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )
            }
        </div >
    );
}
