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

import { Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChipHistoryListProps {
    records: ChipRecord[];
    startChips: number;
    onEdit?: (record: ChipRecord) => void;
    onDelete?: (record: ChipRecord) => void;
}

export const ChipHistoryList: React.FC<ChipHistoryListProps> = ({ records, startChips, onEdit, onDelete }) => {
    // Helper to calculate diff
    const getDiff = (index: number) => {
        const current = records[index].chipCount;
        const previous = index === 0 ? startChips : records[index - 1].chipCount;
        const diff = current - previous;
        return diff > 0 ? `+${diff.toLocaleString()}` : diff === 0 ? '±0' : diff.toLocaleString();
    };

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>時間</TableHead>
                        <TableHead>SB / BB</TableHead>
                        <TableHead>チップ量</TableHead>
                        <TableHead>増減</TableHead>
                        <TableHead className="w-[100px]">操作</TableHead>
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
                            <TableCell>
                                <div className="flex gap-2">
                                    {onEdit && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(record)}
                                            className="h-8 w-8 text-gray-500 hover:text-blue-600"
                                            aria-label="記録を編集"
                                            data-testid="record-edit-btn"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(record)}
                                            className="h-8 w-8 text-gray-500 hover:text-red-600"
                                            aria-label="記録を削除"
                                            data-testid="record-delete-btn"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
