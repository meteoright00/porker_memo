import React from 'react';
import { FilterCriteria } from '@/types/hand';

interface HandFilterProps {
    onFilterChange: (criteria: FilterCriteria) => void;
    availableTags: string[];
}

export const HandFilter: React.FC<HandFilterProps> = ({ onFilterChange, availableTags }) => {
    const [criteria, setCriteria] = React.useState<FilterCriteria>({});

    const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
        const newCriteria = {
            ...criteria,
            [field]: value ? new Date(value) : undefined
        };
        setCriteria(newCriteria);
        onFilterChange(newCriteria);
    };

    const handleTagChange = (tag: string, checked: boolean) => {
        const currentTags = criteria.tags || [];
        let newTags;
        if (checked) {
            newTags = [...currentTags, tag];
        } else {
            newTags = currentTags.filter(t => t !== tag);
        }

        const newCriteria = {
            ...criteria,
            tags: newTags.length > 0 ? newTags : undefined
        };
        setCriteria(newCriteria);
        onFilterChange(newCriteria);
    };

    return (
        <div className="flex flex-col gap-4 p-4 border rounded bg-white shadow-sm">
            <h2 className="font-bold">Filter Hands</h2>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col w-full sm:w-auto">
                    <label htmlFor="startDate" className="text-sm">Start Date</label>
                    <input
                        type="date"
                        id="startDate"
                        className="border rounded p-1 w-full"
                        onChange={(e) => handleDateChange('startDate', e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full sm:w-auto">
                    <label htmlFor="endDate" className="text-sm">End Date</label>
                    <input
                        type="date"
                        id="endDate"
                        className="border rounded p-1 w-full"
                        onChange={(e) => handleDateChange('endDate', e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <span className="text-sm font-bold">Included Tags (Filter)</span>
                <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                        <label key={tag} className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                value={tag}
                                onChange={(e) => handleTagChange(tag, e.target.checked)}
                            />
                            {tag}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};
