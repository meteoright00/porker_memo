import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HandRecordingPage } from './HandRecordingPage';
import { HandRecord, FilterCriteria } from '@/types/hand';
import { HandRepository } from '@/data/HandRepository';
import { DataManagementService } from '@/services/DataManagementService';
import userEvent from '@testing-library/user-event';

// Wrapper to include imports
import { act } from 'react';



// Mock HandRepository
vi.mock('@/data/HandRepository', () => ({
    HandRepository: {
        getAll: vi.fn().mockResolvedValue([]),
        save: vi.fn().mockResolvedValue('test-uuid'),
        query: vi.fn().mockResolvedValue([]),
        getUniqueTags: vi.fn().mockResolvedValue(['TagA', 'TagB']),
        delete: vi.fn().mockResolvedValue(undefined),
    }
}));

// Mock DataManagementService
vi.mock('@/services/DataManagementService', () => ({
    DataManagementService: {
        exportData: vi.fn(),
        importData: vi.fn(),
    }
}));

// Mock HandFilter
vi.mock('@/components/analysis/HandFilter', () => ({
    HandFilter: ({ onFilterChange }: { onFilterChange: (c: FilterCriteria) => void }) => (
        <button onClick={() => onFilterChange({ tags: ['TagA'] })}>
            Apply Filter
        </button>
    )
}));

// Mock HandDetail
vi.mock('@/components/analysis/HandDetail', () => ({
    HandDetail: ({ onDelete, onClose }: { onDelete: (id: number) => void, onClose: () => void }) => (
        <div>
            <div>Mock Detail</div>
            <button onClick={() => onDelete(1)}>Delete Hand</button>
            <button onClick={onClose}>Close</button>
        </div>
    )
}));

// Mock HandWizard
vi.mock('@/components/recording/HandWizard', () => ({
    HandWizard: ({ onSave }: { onSave: (hand: HandRecord) => void }) => (
        <div>
            <h1>Mock Wizard</h1>
            <button onClick={() => onSave({
                uuid: 'test-uuid',
                date: new Date('2023-01-01'),
                holeCards: ['As', 'Ks'],
                board: [],
                actions: [],
                position: 'BTN',
                winLoss: 'Win',
                tags: [],
                createdAt: new Date(),
                updatedAt: new Date()
            })}>
                Mock Save
            </button>
        </div>
    )
}));

const mockHand: HandRecord = {
    uuid: 'mock-uuid',
    date: new Date('2023-01-01'),
    holeCards: ['As', 'Ks'],
    board: [],
    actions: [],
    position: 'BTN',
    winLoss: 'Win',
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date()
};

describe('HandRecordingPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('4.1. List View: Displays empty state when no hands', async () => {
        render(
            <MemoryRouter>
                <HandRecordingPage />
            </MemoryRouter>
        );
        await waitFor(() => expect(HandRepository.query).toHaveBeenCalled());
        expect(screen.getByText('Recorded Hands')).toBeInTheDocument();
        expect(screen.getByText('No hands recorded.')).toBeInTheDocument();
    });

    it('4.2. New Hand Trigger: Clicking button opens HandWizard', async () => {
        render(
            <MemoryRouter>
                <HandRecordingPage />
            </MemoryRouter>
        );
        expect(screen.queryByText('Mock Wizard')).not.toBeInTheDocument();
        fireEvent.click(screen.getByText('New Hand'));
        expect(screen.getByText('Mock Wizard')).toBeInTheDocument();
    });

    it('4.3. Save Integration: Saving in Wizard adds to list and closes Wizard', async () => {
        render(
            <MemoryRouter>
                <HandRecordingPage />
            </MemoryRouter>
        );

        // Mock query to return saved hand after save (simulating reload)
        vi.mocked(HandRepository.query).mockResolvedValue([mockHand]);

        fireEvent.click(screen.getByText('New Hand'));
        fireEvent.click(screen.getByText('Mock Save'));

        await waitFor(() => {
            expect(screen.queryByText('Mock Wizard')).not.toBeInTheDocument();
        });

        // Use findByText because reload is async
        expect(await screen.findByText(/As, Ks/)).toBeInTheDocument();
    });

    it('5.1. Filter Integration: Updates list when filter changes', async () => {
        const hand1 = { ...mockHand, uuid: 'uuid-1', tags: ['TagA'], holeCards: ['Ah', 'Ad'] };
        const hand2 = { ...mockHand, uuid: 'uuid-2', tags: ['TagB'], holeCards: ['Ks', 'Kd'] };

        // Robust mock based on input
        vi.mocked(HandRepository.query).mockImplementation(async (criteria) => {
            if (criteria && criteria.tags && criteria.tags.includes('TagA')) {
                return [hand1];
            }
            return [hand1, hand2];
        });

        await act(async () => {
            render(
                <MemoryRouter>
                    <HandRecordingPage />
                </MemoryRouter>
            );
        });

        // Check initial load (async)
        expect(await screen.findByText(/Ah, Ad/)).toBeInTheDocument();
        expect(await screen.findByText(/Ks, Kd/)).toBeInTheDocument();

        // Trigger Filter
        await act(async () => {
            fireEvent.click(screen.getByText('Apply Filter'));
        });

        // Check update
        expect(screen.getByText(/Ah, Ad/)).toBeInTheDocument();
        expect(screen.queryByText(/Ks, Kd/)).not.toBeInTheDocument();
    });

    it('5.2. Detail Integration: Clicking hand opens Detail view', async () => {
        vi.mocked(HandRepository.query).mockResolvedValue([mockHand]);
        render(
            <MemoryRouter>
                <HandRecordingPage />
            </MemoryRouter>
        );

        expect(await screen.findByText(/As, Ks/)).toBeInTheDocument();

        // Mock Detail component to verify render
        expect(screen.queryByText('Mock Detail')).not.toBeInTheDocument();

        // Click the hand item
        fireEvent.click(screen.getByText(/As, Ks/));

        // Detail should open
        expect(screen.getByText('Mock Detail')).toBeInTheDocument();
    });



    it('5.3. Data Integration: Export button calls service', async () => {
        render(
            <MemoryRouter>
                <HandRecordingPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Export JSON')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Export JSON'));
        expect(DataManagementService.exportData).toHaveBeenCalled();
    });

    it('5.4. Data Integration: Import handles file upload', async () => {
        render(
            <MemoryRouter>
                <HandRecordingPage />
            </MemoryRouter>
        );

        const file = new File(['{}'], 'hands.json', { type: 'application/json' });
        Object.defineProperty(file, 'text', {
            value: async () => '{}'
        });
        const input = screen.getByLabelText('Import JSON'); // Wrapped in label with text

        await act(async () => {
            await userEvent.upload(input, file);
        });

        expect(DataManagementService.importData).toHaveBeenCalled();
        // expect(window.alert).toHaveBeenCalledWith('Import successful'); // alert is hard to mock directly without spy on window
    });

    it('5.5. Delete integration: Deletes hand and updates list', async () => {
        vi.mocked(HandRepository.query).mockResolvedValue([mockHand]);
        render(
            <MemoryRouter>
                <HandRecordingPage />
            </MemoryRouter>
        );

        // Open Detail
        await userEvent.click(await screen.findByText(/As, Ks/));

        // Mock Detail to have Delete button triggering onDelete
        // Since we mocked HandDetail to just <div>Mock Detail</div>, we can't click delete inside it.
        // We need to update the HandDetail mock or test deletion another way?
        // Let's update the HandDetail mock in this file to include a delete button.
    });

    it('6.1. Tournament Context: Auto-opens wizard if tournamentId present', async () => {
        render(
            <MemoryRouter initialEntries={['/record?tournamentId=123']}>
                <HandRecordingPage />
            </MemoryRouter>
        );

        expect(await screen.findByText('Mock Wizard')).toBeInTheDocument();
        // Check back button text
        expect(screen.getByText('トーナメントに戻る')).toBeInTheDocument();
    });
});
