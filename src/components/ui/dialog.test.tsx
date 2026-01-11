import { render, screen } from '@testing-library/react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from './dialog';
import userEvent from '@testing-library/user-event';

describe('Dialog', () => {
    it('opens content when trigger is clicked', async () => {
        render(
            <Dialog>
                <DialogTrigger>Open Dialog</DialogTrigger>
                <DialogContent>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <p>Dialog Content</p>
                </DialogContent>
            </Dialog>
        );

        expect(screen.queryByText('Dialog Content')).not.toBeInTheDocument();

        await userEvent.click(screen.getByText('Open Dialog'));

        expect(screen.getByText('Dialog Content')).toBeInTheDocument();
        expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    });
});
