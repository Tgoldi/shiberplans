import React, { useState, useEffect } from 'react';
import { useEdit } from '../context/EditContext';

export function EditableText({
    value,
    path,
    as: Component = 'span',
    className = '',
    multiline = false
}) {
    const { isEditMode, updateContent } = useEdit();
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    if (!isEditMode) {
        return <Component className={className}>{localValue}</Component>;
    }

    const handleChange = (e) => {
        setLocalValue(e.target.value);
        updateContent(path, e.target.value);
    };

    if (multiline) {
        return (
            <textarea
                value={localValue}
                onChange={handleChange}
                className={`w-full bg-navy-800/50 border border-accent/50 rounded p-2 text-white placeholder-gray-400 focus:outline-none focus:border-accent ${className}`}
                rows={3}
            />
        );
    }

    return (
        <input
            type="text"
            value={localValue}
            onChange={handleChange}
            className={`bg-navy-800/50 border border-accent/50 rounded px-2 w-full text-white placeholder-gray-400 focus:outline-none focus:border-accent ${className}`}
        />
    );
}
