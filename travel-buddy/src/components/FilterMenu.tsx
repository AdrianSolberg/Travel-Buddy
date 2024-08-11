// FilterMenu.tsx
import React, { useState } from 'react';
import '../styles/FilterMenu.css';

interface FilterProps {
    categoryTypes: { [key: string]: string[] }; // Object containing category types as keys and corresponding categories as values
    onFilterChange: (selectedCategories: { [key: string]: string[] }) => void;
}

const FilterMenu: React.FC<FilterProps> = ({ categoryTypes, onFilterChange }) => {
    const [selectedCategoryType, setSelectedCategoryType] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<{ [key: string]: string[] }>({});

    const handleCategoryTypeChange = (categoryType: string) => {
        setSelectedCategoryType(categoryType === selectedCategoryType ? null : categoryType);
    };

    const handleCategoryChange = (category: string) => {
        const categoryType = selectedCategoryType!;
        const isSelected = selectedCategories[categoryType]?.includes(category);

        if (isSelected) {
            // Category is already selected, remove it
            setSelectedCategories({
                ...selectedCategories,
                [categoryType]: selectedCategories[categoryType]?.filter(cat => cat !== category)
            });
        } else {
            // Category is not selected, add it
            setSelectedCategories({
                ...selectedCategories,
                [categoryType]: selectedCategories[categoryType]
                    ? [...selectedCategories[categoryType], category]
                    : [category]
            });
        }
    };

    const handleApplyFilters = () => {
        onFilterChange(selectedCategories);
    };

    return (
        <div className="filter-menu">
            {Object.entries(categoryTypes).map(([categoryType, categories]) => (
                <div className="panel panel-default" key={categoryType}>
                    <div className="panel-heading" role="tab">
                        <h4 className="panel-title">
                            <a
                                role="button"
                                data-toggle="collapse"
                                href={`#collapse${categoryType.replace(/\s/g, '')}`}
                                aria-expanded={selectedCategoryType === categoryType ? 'true' : 'false'}
                                // aria-expanded={'true'}
                                onClick={() => handleCategoryTypeChange(categoryType)}
                            >
                                {categoryType}
                            </a>
                        </h4>
                    </div>
                    <div
                        id={`collapse${categoryType.replace(/\s/g, '')}`}
                        className={`panel-collapse collapse ${selectedCategoryType === categoryType ? 'in' : ''}`}
                        role="tabpanel"
                    >
                        <div className="panel-body">
                            {categories.map(category => (
                                <div className="checkbox" key={category}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={category}
                                            checked={selectedCategories[categoryType]?.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                        />
                                        {category}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
            <button className="btn btn-default" onClick={handleApplyFilters}>Apply Filters</button>
        </div>
    );
};

export default FilterMenu;