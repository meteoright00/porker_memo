import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChipHistoryList } from './ChipHistoryList';
import { ChipRecord } from '@/types/tournament';

describe('ChipHistoryList', () => {
    const mockRecords: ChipRecord[] = [
        { id: 1, tournamentId: 1, chipCount: 30000, sb: 100, bb: 200, timestamp: new Date('2023-01-01T10:00:00') },
        { id: 2, tournamentId: 1, chipCount: 35000, sb: 100, bb: 200, timestamp: new Date('2023-01-01T10:30:00') },
        { id: 3, tournamentId: 1, chipCount: 28000, sb: 200, bb: 400, timestamp: new Date('2023-01-01T11:00:00') },
    ];

    it('renders list of records', () => {
        render(<ChipHistoryList records={mockRecords} startChips={30000} />);

        expect(screen.getByText('30,000')).toBeInTheDocument();
        expect(screen.getByText('35,000')).toBeInTheDocument();
        expect(screen.getByText('28,000')).toBeInTheDocument();
    });

    it('calculates diff correctly', () => {
        render(<ChipHistoryList records={mockRecords} startChips={30000} />);

        // 1st record: 30000 -> Diff 0 (vs StartChips)
        // 2nd record: 35000 -> Diff +5000 (vs 30000)
        // 3rd record: 28000 -> Diff -7000 (vs 35000)

        expect(screen.getByText('+5,000')).toBeInTheDocument();
        expect(screen.getByText('-7,000')).toBeInTheDocument();
    });
});
