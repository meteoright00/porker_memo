import { render, screen } from '@testing-library/react';
import { Textarea } from './textarea';
import userEvent from '@testing-library/user-event';

describe('Textarea', () => {
    it('renders and accepts text', async () => {
        render(<Textarea placeholder="Type here" />);
        const textarea = screen.getByPlaceholderText('Type here');
        await userEvent.type(textarea, 'Hello World');
        expect(textarea).toHaveValue('Hello World');
    });
});
