import { render, screen } from '@testing-library/react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './select';

describe('Select', () => {
    it('renders trigger', () => {
        render(
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                </SelectContent>
            </Select>
        );
        expect(screen.getByText('Select an option')).toBeInTheDocument();
    });
});
