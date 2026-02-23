import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChipRecord, StructureItem } from '@/types/tournament';

const formSchema = z.object({
    chipCount: z.coerce.number().min(0, '0以上の数値を入力してください'),
    sb: z.coerce.number().min(1, '1以上の数値を入力してください'),
    bb: z.coerce.number().min(1, '1以上の数値を入力してください'),
});

type FormValues = z.infer<typeof formSchema>;

interface ChipRecordFormProps {
    onSubmit: (values: FormValues) => void;
    lastRecord?: ChipRecord;
    initialValues?: Partial<ChipRecord>;
    submitLabel?: string;
    currentBlind?: StructureItem;
}

export const ChipRecordForm: React.FC<ChipRecordFormProps> = ({
    onSubmit,
    lastRecord,
    initialValues,
    submitLabel = '記録',
    currentBlind,
}) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: initialValues || {
            // If lastRecord exists, default to empty to allow fresh input.
            // If it's the very first record (startChips), default to startChips (30000).
            chipCount: lastRecord ? ('' as any) : 30000,
            sb: currentBlind?.sb ?? 100,
            bb: currentBlind?.bb ?? 200,
        },
    });

    // Track the last applied blind structure to prevent re-applying same values on parent re-renders
    const lastAppliedRef = React.useRef<string | null>(null);

    // Update defaults when dependencies change, but only if the actual blind values are different
    useEffect(() => {
        if (!initialValues) {
            let targetSB: number | undefined;
            let targetBB: number | undefined;

            if (currentBlind) {
                targetSB = currentBlind.sb;
                targetBB = currentBlind.bb;
            } else if (lastRecord) {
                targetSB = lastRecord.sb;
                targetBB = lastRecord.bb;
            }

            if (targetSB !== undefined && targetBB !== undefined) {
                const targetStr = `${targetSB}-${targetBB}`;
                // Only apply if DIFFERENT from what we last applied automatically
                // This allows the user (or submit handler) to clear the form without it popping back
                if (lastAppliedRef.current !== targetStr) {
                    form.setValue('sb', targetSB);
                    form.setValue('bb', targetBB);
                    lastAppliedRef.current = targetStr;
                }
            }
        }
    }, [currentBlind, lastRecord, form, initialValues]);

    // Update form if initialValues change (e.g. switching edit target)
    useEffect(() => {
        if (initialValues) {
            form.reset({
                chipCount: initialValues.chipCount,
                sb: initialValues.sb,
                bb: initialValues.bb,
            });
        }
    }, [initialValues, form]);

    const chipCount = form.watch('chipCount');
    const bbValue = form.watch('bb');

    const handleSubmit = (values: FormValues) => {
        onSubmit(values);
        // Reset chip count, sb, and bb for new entry convenience
        if (!initialValues) {
            // Explicitly set to '' (empty) to clear the input visual
            form.setValue('chipCount', '' as any);
            form.setValue('sb', '' as any);
            form.setValue('bb', '' as any);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="bg-slate-100 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">現在のチップ量</div>
                    <div className="text-2xl font-bold flex items-baseline justify-center gap-2">
                        {(() => {
                            const formVal = Number(chipCount);
                            const hasFormVal = !isNaN(formVal) && (chipCount as any) !== '' && chipCount !== undefined && chipCount !== null;

                            // If input has value, use it. Otherwise fallback.
                            let displayVal = 0;
                            if (hasFormVal) {
                                displayVal = formVal;
                            } else {
                                displayVal = lastRecord?.chipCount ?? initialValues?.chipCount ?? 30000;
                            }

                            return displayVal.toLocaleString();
                        })()}
                        <span
                            data-testid="bb-display"
                            className="text-base font-normal text-gray-600"
                        >
                            {(() => {
                                const formVal = Number(chipCount);
                                const hasFormVal = !isNaN(formVal) && (chipCount as any) !== '' && chipCount !== undefined && chipCount !== null;

                                let currentChips = 0;
                                if (hasFormVal) {
                                    currentChips = formVal;
                                } else {
                                    currentChips = lastRecord?.chipCount ?? initialValues?.chipCount ?? 30000;
                                }

                                const currentBB = (() => {
                                    // Similar fallback logic for BB
                                    const formVal = Number(bbValue);
                                    const hasFormVal = !isNaN(formVal) && (bbValue as any) !== '' && bbValue !== undefined && bbValue !== null;

                                    if (hasFormVal) return formVal;
                                    return lastRecord?.bb ?? initialValues?.bb ?? currentBlind?.bb ?? 200;
                                })();
                                const bb = (currentChips / (currentBB || 1)).toFixed(1);
                                return `(${bb} BB)`;
                            })()}
                        </span>
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="chipCount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>チップ量</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    {...field}
                                    value={field.value ?? ''}
                                    placeholder="例: 30000"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="sb"
                        render={({ field }) => (
                            <FormItem className="flex-1 min-w-0">
                                <FormLabel>SB</FormLabel>
                                <FormControl>
                                    <Input type="text" inputMode="numeric" pattern="[0-9]*" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bb"
                        render={({ field }) => (
                            <FormItem className="flex-1 min-w-0">
                                <FormLabel>BB</FormLabel>
                                <FormControl>
                                    <Input type="text" inputMode="numeric" pattern="[0-9]*" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" className="w-full">{submitLabel}</Button>
            </form>
        </Form>
    );
};
