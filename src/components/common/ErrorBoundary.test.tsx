import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';
import { vi } from 'vitest';

const ThrowError = () => {
    throw new Error('Test Error');
};

describe('ErrorBoundary', () => {
    it('renders children when no error works', () => {
        render(
            <ErrorBoundary>
                <div>Safe Content</div>
            </ErrorBoundary>
        );
        expect(screen.getByText('Safe Content')).toBeInTheDocument();
    });

    it('renders error UI when error is thrown', () => {
        // Suppress console.error for this test as it's expected
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Test Error')).toBeInTheDocument();

        consoleSpy.mockRestore();
    });
});
