import React, { useState } from 'react';
import '../styles/FilterPanel.css';

interface FilterProps {
    categories: { [key: string]: string[] }; // Object containing category types as keys and corresponding categories as values
    onFilterChange: (selectedTags: string[]) => void;
}

const FilterPanel: React.FC<FilterProps> = ({categories, onFilterChange}) => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleTagClick = (tag: string) => {
        const isSelected = selectedTags.includes(tag);
        const newSelectedTags = isSelected
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];
        setSelectedTags(newSelectedTags);
        onFilterChange(newSelectedTags);
    };

    return (
        <div id="filterPanel-container">
            {Object.entries(categories).map(([category, tags]) => (
                <div id="menu-container" key={category}>
                <h4>{category}</h4>
                <div id="checkbox-container">
                    {
                        tags.map((tag, i) => (
                            // do we need a div for each checkbox?
                            <label key={i}>
                                <input
                                    type="checkbox"
                                    value={tag}
                                    checked={selectedTags.includes(tag)}
                                    // onClick={() => handleTagClick(tag)}
                                    onChange={() => handleTagClick(tag)}
                                />
                                {tag}
                            </label>
                        ))
                    }
                </div>
                </div>
                ))}
        </div>
    )
};

export default FilterPanel
