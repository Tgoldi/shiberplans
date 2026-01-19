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

    // Load state from URL if present
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const encodedData = params.get('data');
        if (encodedData) {
            try {
                const decompressed = LZString.decompressFromEncodedURIComponent(encodedData);
                if (decompressed) {
                    const parsedContent = JSON.parse(decompressed);
                    setContent(parsedContent);
                }
            } catch (error) {
                console.error("Failed to parse content from URL:", error);
            }
        }
    }, []);

    const saveContent = () => {
        try {
            // Encode content to URL
            const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(content));
            const newUrl = `${window.location.pathname}?data=${compressed}`;

            // Update URL without reload
            window.history.pushState({ path: newUrl }, '', newUrl);

            // Copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert("הקישור נשמר והועתק ללוח! שלח אותו כדי לשתף את העריכות.");
            }).catch(err => {
                console.error("Failed to copy URL:", err);
                alert("הקישור נוצר בשורת הכתובת. העתק אותו כדי לשתף.");
            });

        } catch (error) {
            console.error("Failed to save content:", error);
            alert("שגיאה בשמירת התוכן.");
        }
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
