import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

// Updates to vi.mock to match standard vitest/jest pattern for default exports if needed, 
// usually this works for simple components.
vi.mock('./pages/TopPage', () => ({ default: () => <div>MockTopPage</div> }));
vi.mock('./pages/HandRecordingPage', () => ({ HandRecordingPage: () => <div>MockHandRecordingPage</div> }));
// Note: HandRecordingPage is exported as named export in current file: "export { HandRecordingPage } from..." or "export const..." 
// I need to check how HandRecordingPage is exported. App.tsx imports { HandRecordingPage }.

vi.mock('./pages/TournamentListPage', () => ({ default: () => <div>MockTournamentListPage</div> }));

describe('App Routing', () => {
    it('renders TopPage on default route', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('MockTopPage')).toBeInTheDocument();
    });

    it('renders HandRecordingPage on /record', () => {
        render(
            <MemoryRouter initialEntries={['/record']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('MockHandRecordingPage')).toBeInTheDocument();
    });

    it('renders TournamentListPage on /tournaments', () => {
        render(
            <MemoryRouter initialEntries={['/tournaments']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('MockTournamentListPage')).toBeInTheDocument();
    });
});
