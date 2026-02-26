import React from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
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
    const [anteSameAsBB, setAnteSameAsBB] = React.useState(false);

    const handleAdd = () => {
        const newItem: StructureItem = { sb: 100, bb: 200, ante: anteSameAsBB ? 200 : 200, duration: 15, isBreak: false };
        onChange([...value, newItem]);
    };

    const handleRemove = (index: number) => {
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    };

    const parseNumericInput = (raw: string): number | undefined => {
        if (raw === '') return undefined;
        const n = Number(raw);
        return isNaN(n) ? undefined : n;
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
            newValue[index].ante = anteSameAsBB ? 200 : 200;
            newValue[index].label = undefined;
        }

        // Sync ante with bb when anteSameAsBB is enabled
        if (anteSameAsBB && field === 'bb' && !newValue[index].isBreak) {
            newValue[index].ante = val;
        }

        onChange(newValue);
    };

    const handleAnteSameAsBBToggle = (checked: boolean) => {
        setAnteSameAsBB(checked);
        if (checked && value.length > 0) {
            const newValue = value.map(item => {
                if (item.isBreak) return item;
                return { ...item, ante: item.bb };
            });
            onChange(newValue);
        }
    };

    const csvInputRef = React.useRef<HTMLInputElement>(null);

    const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
                if (lines.length === 0) {
                    alert('CSVファイルが空です');
                    return;
                }

                // Detect header row
                let startIndex = 0;
                const firstLine = lines[0].split(',');
                if (firstLine.length > 0 && isNaN(Number(firstLine[0].trim()))) {
                    startIndex = 1; // Skip header
                }

                const items: StructureItem[] = [];
                for (let i = startIndex; i < lines.length; i++) {
                    const cols = lines[i].split(',').map(c => c.trim());
                    const sb = Number(cols[0]) || 0;
                    const bb = Number(cols[1]) || 0;
                    const ante = cols[2] ? Number(cols[2]) || undefined : undefined;
                    const duration = Number(cols[3]) || 15;
                    const label = cols[4] || undefined;
                    const isBreak = sb === 0 && bb === 0;
                    items.push({ sb, bb, ante, duration, isBreak, label: isBreak ? (label || '休憩') : label });
                }

                if (items.length === 0) {
                    alert('有効なデータが見つかりませんでした');
                    return;
                }

                if (value.length > 0) {
                    if (!confirm(`既存の${value.length}レベルを${items.length}レベルで上書きしますか？`)) {
                        return;
                    }
                }

                onChange(items);
            } catch {
                alert('CSVの解析に失敗しました。フォーマット: SB,BB,Ante,Duration');
            }
        };
        reader.readAsText(file);
        // Reset input so the same file can be re-uploaded
        event.target.value = '';
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h3 className="text-sm font-medium whitespace-nowrap">ストラクチャー設定</h3>
                <div className="flex items-center gap-2 flex-wrap">
                    <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none">
                        <Checkbox
                            checked={anteSameAsBB}
                            onCheckedChange={(checked) => handleAnteSameAsBBToggle(!!checked)}
                            id="ante-same-as-bb"
                        />
                        AnteをBBと同じにする
                    </label>
                    <input
                        ref={csvInputRef}
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleCSVImport}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => csvInputRef.current?.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        CSV読込
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
                        <Plus className="h-4 w-4 mr-2" />
                        レベル追加
                    </Button>
                </div>
            </div>

            <div className="border rounded-md overflow-x-auto w-full">
                <Table className="min-w-[500px]">
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
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={item.sb ?? ''}
                                            onChange={(e) => handleChange(index, 'sb', parseNumericInput(e.target.value))}
                                            className="w-full h-8 text-xs px-2"
                                        />
                                    )}
                                </TableCell>
                                <TableCell className="p-1">
                                    {!item.isBreak && (
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={item.bb ?? ''}
                                            onChange={(e) => handleChange(index, 'bb', parseNumericInput(e.target.value))}
                                            className="w-full h-8 text-xs px-2"
                                        />
                                    )}
                                </TableCell>
                                <TableCell className="p-1">
                                    {!item.isBreak && (
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={item.ante ?? ''}
                                            onChange={(e) => handleChange(index, 'ante', parseNumericInput(e.target.value))}
                                            placeholder="-"
                                            readOnly={anteSameAsBB}
                                            className={`w-full h-8 text-xs px-2 ${anteSameAsBB ? 'bg-gray-100 text-gray-500' : ''}`}
                                        />
                                    )}
                                </TableCell>
                                <TableCell className="p-1">
                                    <Input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={item.duration ?? ''}
                                        onChange={(e) => handleChange(index, 'duration', parseNumericInput(e.target.value))}
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
