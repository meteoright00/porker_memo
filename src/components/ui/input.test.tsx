import { render, screen } from '@testing-library/react';
import { Input } from './input';
import userEvent from '@testing-library/user-event';

describe('Input', () => {
    it('renders and accepts text', async () => {
        render(<Input placeholder="Type here" />);
        const input = screen.getByPlaceholderText('Type here');
        await userEvent.type(input, 'Hello World');
        expect(input).toHaveValue('Hello World');
    });
});
