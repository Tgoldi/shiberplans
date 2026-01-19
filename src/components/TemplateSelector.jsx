import React, { useState } from 'react';
import { useEdit } from '../context/EditContext';
import { LayoutTemplate, Check, Plus, Trash2, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export function TemplateSelector() {
    const { isEditMode, templates, loadTemplate, saveAsTemplate, deleteTemplate } = useEdit();
    const [isOpen, setIsOpen] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    if (!isEditMode) return null;

    const handleSave = () => {
        if (!newTemplateName.trim()) return;
        saveAsTemplate(newTemplateName);
        setNewTemplateName('');
        setIsCreating(false);
    };

    return (
        <div className="fixed bottom-8 left-8 z-50">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-800 text-white p-3 rounded-full shadow-lg border border-white/20 hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="ניהול תבניות"
            >
                <LayoutTemplate size={24} />
            </motion.button>

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute bottom-16 left-0 bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 w-72 shadow-xl backdrop-blur-xl flex flex-col gap-3"
                >
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <button
                            onClick={() => setIsCreating(!isCreating)}
                            className="bg-accent/20 text-accent p-1.5 rounded-lg hover:bg-accent/30 transition-colors"
                            title="צור תבנית חדשה"
                        >
                            <Plus size={16} />
                        </button>
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider">תבניות עיצוב</h3>
                    </div>

                    {isCreating && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                className="bg-green-500/20 text-green-400 p-2 rounded-lg hover:bg-green-500/30 transition-colors"
                            >
                                <Save size={16} />
                            </button>
                            <input
                                type="text"
                                value={newTemplateName}
                                onChange={(e) => setNewTemplateName(e.target.value)}
                                placeholder="שם התבנית..."
                                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white w-full focus:outline-none focus:border-accent"
                                autoFocus
                            />
                        </div>
                    )}

                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                        {templates.map((template) => (
                            <div key={template.id} className="flex items-center gap-2 group">
                                {template.isCustom && (
                                    <button
                                        onClick={() => {
                                            if (window.confirm(`למחוק את התבנית "${template.name}"?`)) {
                                                deleteTemplate(template.id);
                                            }
                                        }}
                                        className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                        title="מחק תבנית"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        loadTemplate(template.id);
                                        setIsOpen(false);
                                    }}
                                    className="flex-1 text-right p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white text-sm font-medium flex items-center justify-between"
                                >
                                    <span>{template.name}</span>
                                    {template.isCustom && <span className="text-[10px] bg-accent/20 text-accent px-1.5 rounded mr-2">אישי</span>}
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
