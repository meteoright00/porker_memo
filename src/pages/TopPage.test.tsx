import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TopPage from './TopPage';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('TopPage', () => {
    it('renders navigation links', () => {
        render(
            <MemoryRouter>
                <TopPage />
            </MemoryRouter>
        );

        expect(screen.getByText('ポーカーの記録')).toBeInTheDocument();
        expect(screen.getByText('ハンド記録 (単発)')).toBeInTheDocument();
        expect(screen.getByText('トーナメント記録')).toBeInTheDocument();
    });
});
