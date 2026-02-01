import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { StructureItem } from '@/types/tournament';

interface StructureEditorProps {
    value?: StructureItem[];
    onChange: (value: StructureItem[]) => void;
}

export const StructureEditor: React.FC<StructureEditorProps> = ({ value = [], onChange }) => {
    const handleAdd = () => {
        onChange([
            ...value,
            { sb: 100, bb: 200, ante: 200, duration: 15, isBreak: false }
        ]);
    };

    const handleRemove = (index: number) => {
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    };

    const handleChange = (index: number, field: keyof StructureItem, val: any) => {
        const newValue = [...value];
        newValue[index] = { ...newValue[index], [field]: val };

        // If toggling break, clear or set defaults
        if (field === 'isBreak' && val === true) {
            newValue[index].sb = 0;
            newValue[index].bb = 0;
            newValue[index].ante = undefined;
            newValue[index].label = '休憩';
        } else if (field === 'isBreak' && val === false) {
            newValue[index].sb = 100;
            newValue[index].bb = 200;
            newValue[index].ante = 200;
            newValue[index].label = undefined;
        }

        onChange(newValue);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">ストラクチャー設定</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    レベル追加
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px] text-center h-8 px-1 text-xs">休憩</TableHead>
                            <TableHead className="min-w-[70px] h-8 px-2 text-xs">SB</TableHead>
                            <TableHead className="min-w-[70px] h-8 px-2 text-xs">BB</TableHead>
                            <TableHead className="min-w-[60px] h-8 px-2 text-xs">Ant</TableHead>
                            <TableHead className="min-w-[60px] h-8 px-2 text-xs">Min</TableHead>
                            <TableHead className="w-[40px] h-8 px-1"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {value.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="p-1">
                                    <div className="flex items-center justify-center">
                                        <Checkbox
                                            checked={item.isBreak}
                                            onCheckedChange={(checked) => handleChange(index, 'isBreak', checked)}
                                            aria-label={`休憩 ${index + 1}`}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="p-1">
                                    {item.isBreak ? (
                                        <Input
                                            value={item.label || ''}
                                            onChange={(e) => handleChange(index, 'label', e.target.value)}
                                            placeholder="休憩名"
                                            className="w-full h-8 text-xs px-2"
                                        />
                                    ) : (
                                        <Input
                                            type="number"
                                            value={item.sb}
                                            onChange={(e) => handleChange(index, 'sb', Number(e.target.value))}
                                            className="w-full h-8 text-xs px-2"
                                        />
                                    )}
                                </TableCell>
                                <TableCell className="p-1">
                                    {!item.isBreak && (
                                        <Input
                                            type="number"
                                            value={item.bb}
                                            onChange={(e) => handleChange(index, 'bb', Number(e.target.value))}
                                            className="w-full h-8 text-xs px-2"
                                        />
                                    )}
                                </TableCell>
                                <TableCell className="p-1">
                                    {!item.isBreak && (
                                        <Input
                                            type="number"
                                            value={item.ante || ''}
                                            onChange={(e) => handleChange(index, 'ante', e.target.value ? Number(e.target.value) : undefined)}
                                            placeholder="-"
                                            className="w-full h-8 text-xs px-2"
                                        />
                                    )}
                                </TableCell>
                                <TableCell className="p-1">
                                    <Input
                                        type="number"
                                        value={item.duration}
                                        onChange={(e) => handleChange(index, 'duration', Number(e.target.value))}
                                        className="w-full h-8 text-xs px-2"
                                    />
                                </TableCell>
                                <TableCell className="p-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleRemove(index)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {value.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                                    レベルが追加されていません
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
