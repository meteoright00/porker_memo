import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from './card';

describe('Card', () => {
    it('renders with content', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
            </Card>
        );
        expect(screen.getByText('Card Title')).toBeInTheDocument();
        expect(screen.getByText('Card Content')).toBeInTheDocument();
    });
});
