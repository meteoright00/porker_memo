import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
    it('renders with default size h-12 (md)', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        // Expecting the default class to include h-12 (since we are changing default h-10 to h-12)
        // or we can just check if it contains the class string if we rely on cva
        expect(button.className).toContain('h-12');
    });

    it('renders with sm size h-10', () => {
        render(<Button size="sm">Small</Button>);
        const button = screen.getByRole('button', { name: /small/i });
        expect(button.className).toContain('h-10');
    });
});
