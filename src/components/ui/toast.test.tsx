import { render, screen, act } from '@testing-library/react';
import { Toaster } from './toaster';
import { useToast } from './use-toast';
import { Button } from './button';
import userEvent from '@testing-library/user-event';

const TestComponent = () => {
    const { toast } = useToast();
    return (
        <Button onClick={() => toast({ title: 'Test Toast', description: 'This is a test' })}>
            Show Toast
        </Button>
    );
};

describe('Toast', () => {
    it('shows toast when triggered', async () => {
        render(
            <>
                <Toaster />
                <TestComponent />
            </>
        );

        const button = screen.getByText('Show Toast');
        await userEvent.click(button);

        expect(await screen.findByText('Test Toast')).toBeInTheDocument();
        expect(screen.getByText('This is a test')).toBeInTheDocument();
    });
});
