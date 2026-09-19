import React, { createContext, useState, useContext, useEffect } from 'react';
import defaultContent from '../data/content.json';
import templatesData from '../data/templates.json';
import LZString from 'lz-string';

const EditContext = createContext();

export function EditProvider({ children }) {
    const [content, setContent] = useState(defaultContent);
    const [isEditMode, setIsEditMode] = useState(false);
    const [templates, setTemplates] = useState(templatesData.templates);

    // Toggle edit mode with Cmd+E (Mac) or Ctrl+E (Windows)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
                e.preventDefault();
                setIsEditMode(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Load custom templates from localStorage on mount
    useEffect(() => {
        const savedTemplates = localStorage.getItem('shiberplans_custom_templates');
        if (savedTemplates) {
            try {
                const parsed = JSON.parse(savedTemplates);
                setTemplates([...templatesData.templates, ...parsed]);
            } catch (e) {
                console.error("Failed to load templates", e);
            }
        }
    }, []);

    const updateContent = (path, value) => {
        setContent(prev => {
            const newData = JSON.parse(JSON.stringify(prev)); // Deep clone

            // Navigate to the nested key
            const keys = path.split('.');
            let current = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                // Handle array indices
                if (keys[i].includes('[')) {
                    const [arrayName, index] = keys[i].split('[');
                    const idx = parseInt(index.replace(']', ''));
                    current = current[arrayName][idx];
                } else {
                    current = current[keys[i]];
                }
            }

            const lastKey = keys[keys.length - 1];
            if (lastKey.includes('[')) {
                const [arrayName, index] = lastKey.split('[');
                const idx = parseInt(index.replace(']', ''));
                current[arrayName][idx] = value;
            } else {
                current[lastKey] = value;
            }

            return newData;
        });
    };

    const addItem = (path, defaultValue = "פריט חדש") => {
        setContent(prev => {
            const newData = JSON.parse(JSON.stringify(prev));

            const keys = path.split('.');
            let current = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                // Handle array indices if needed, though usually path points to the array itself
                if (keys[i].includes('[')) {
                    const [arrayName, index] = keys[i].split('[');
                    const idx = parseInt(index.replace(']', ''));
                    current = current[arrayName][idx];
                } else {
                    current = current[keys[i]];
                }
            }

            const lastKey = keys[keys.length - 1];
            if (Array.isArray(current[lastKey])) {
                current[lastKey].push(defaultValue);
            }

            return newData;
        });
    };

    const removeItem = (path, indexToRemove) => {
        setContent(prev => {
            const newData = JSON.parse(JSON.stringify(prev));

            const keys = path.split('.');
            let current = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                // Handle array indices if needed
                if (keys[i].includes('[')) {
                    const [arrayName, index] = keys[i].split('[');
                    const idx = parseInt(index.replace(']', ''));
                    current = current[arrayName][idx];
                } else {
                    current = current[keys[i]];
                }
            }

            const lastKey = keys[keys.length - 1];
            if (Array.isArray(current[lastKey])) {
                current[lastKey].splice(indexToRemove, 1);
            }

            return newData;
        });
    };

    // Load Template Function
    const loadTemplate = (templateId) => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            setContent(template.content);
        }
    };

    // Save current content as new template
    const saveAsTemplate = (name) => {
        const newTemplate = {
            id: 'custom-' + Date.now(),
            name: name,
            content: JSON.parse(JSON.stringify(content)),
            isCustom: true
        };

        setTemplates(prevTemplates => {
            const updatedTemplates = [...prevTemplates, newTemplate];
            // Persist only custom templates
            const customTemplates = updatedTemplates.filter(t => t.isCustom);
            localStorage.setItem('shiberplans_custom_templates', JSON.stringify(customTemplates));
            return updatedTemplates;
        });
    };

    // Delete template
    const deleteTemplate = (id) => {
        setTemplates(prevTemplates => {
            const updatedTemplates = prevTemplates.filter(t => t.id !== id);

            const customTemplates = updatedTemplates.filter(t => t.isCustom);
            localStorage.setItem('shiberplans_custom_templates', JSON.stringify(customTemplates));
            return updatedTemplates;
        });
    };

    // NOTE: Loading arbitrary business content (prices, terms, contact info) from the
    // URL is unsafe because it allows anyone to fabricate/alter documents by crafting
    // a URL (invoice fraud). Content must instead be sourced from the backend/local
    // templates only, keyed by a safe identifier (e.g. template name/id), never from
    // raw JSON embedded in the URL. Therefore URL-based content loading/sharing has
    // been disabled here.
    const saveContent = () => {
        alert("שיתוף תוכן מלא דרך קישור אינו נתמך מטעמי אבטחה. השתמש בשמירת תבנית.");
    };

    return (
        <EditContext.Provider value={{
            content,
            isEditMode,
            updateContent,
            addItem,
            removeItem,
            saveContent,
            templates,
            loadTemplate,
            saveAsTemplate,
            deleteTemplate
        }}>
            {children}
        </EditContext.Provider>
    );
}

export function useEdit() {
    return useContext(EditContext);
}
