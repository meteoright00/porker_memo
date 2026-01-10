import React from 'react';
import { ChipRecord } from '@/types/tournament';
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface ChipHistoryListProps {
    records: ChipRecord[];
    startChips: number;
}

export const ChipHistoryList: React.FC<ChipHistoryListProps> = ({ records, startChips }) => {
    // Helper to calculate diff
    const getDiff = (index: number) => {
        const current = records[index].chipCount;
        const previous = index === 0 ? startChips : records[index - 1].chipCount;
        const diff = current - previous;
        return diff > 0 ? `+${diff.toLocaleString()}` : diff === 0 ? '±0' : diff.toLocaleString();
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>時間</TableHead>
                    <TableHead>SB / BB</TableHead>
                    <TableHead>チップ量</TableHead>
                    <TableHead>増減</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {records.map((record, index) => (
                    <TableRow key={record.id}>
                        <TableCell>
                            {format(record.timestamp, 'HH:mm')}
                        </TableCell>
                        <TableCell>
                            {record.sb} / {record.bb}
                        </TableCell>
                        <TableCell>
                            {record.chipCount.toLocaleString()}
                        </TableCell>
                        <TableCell className={
                            getDiff(index).startsWith('+')
                                ? 'text-green-600 font-bold'
                                : getDiff(index).startsWith('-')
                                    ? 'text-red-600 font-bold'
                                    : ''
                        }>
                            {getDiff(index)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
