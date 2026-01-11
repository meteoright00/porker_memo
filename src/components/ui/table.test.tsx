import { render, screen } from '@testing-library/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

describe('Table', () => {
    it('renders table structure correctly', () => {
        render(
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Header 1</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Cell 1</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
        expect(screen.getByText('Header 1')).toBeInTheDocument();
        expect(screen.getByText('Cell 1')).toBeInTheDocument();
    });
});
