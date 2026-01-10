import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TournamentChart } from './TournamentChart';
import { ChipRecord } from '@/types/tournament';

// Mock Recharts since it's hard to test in JSDOM (Canvas/SVG)
// We will verify if data is passed correctly to the mocked component
vi.mock('recharts', () => {
    const OriginalModule = vi.importActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
        LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
        Line: () => <div data-testid="line" />,
        XAxis: () => <div data-testid="x-axis" />,
        YAxis: () => <div data-testid="y-axis" />,
        CartesianGrid: () => <div data-testid="cartesian-grid" />,
        Tooltip: () => <div data-testid="tooltip" />,
        Legend: () => <div data-testid="legend" />,
    };
});

describe('TournamentChart', () => {
    const mockRecords: ChipRecord[] = [
        { id: 1, tournamentId: 1, chipCount: 30000, sb: 100, bb: 200, timestamp: new Date('2023-01-01T10:00:00') },
        { id: 2, tournamentId: 1, chipCount: 40000, sb: 200, bb: 400, timestamp: new Date('2023-01-01T11:00:00') },
    ];

    it('renders chart components', () => {
        render(<TournamentChart records={mockRecords} startChips={30000} />);

        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        // Check for 2 lines (Chips and BB)
        expect(screen.getAllByTestId('line')).toHaveLength(2);
    });

    it('handles empty data', () => {
        render(<TournamentChart records={[]} startChips={30000} />);
        expect(screen.getByText(/データがありません/i)).toBeInTheDocument();
    });
});
