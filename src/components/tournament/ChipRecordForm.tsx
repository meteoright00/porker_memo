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
import { ChipRecord } from '@/types/tournament';

const formSchema = z.object({
    chipCount: z.coerce.number().min(0, '0以上の数値を入力してください'),
    sb: z.coerce.number().min(1, '1以上の数値を入力してください'),
    bb: z.coerce.number().min(1, '1以上の数値を入力してください'),
});

type FormValues = z.infer<typeof formSchema>;

interface ChipRecordFormProps {
    onSubmit: (values: FormValues) => void;
    lastRecord?: ChipRecord;
    initialValues?: ChipRecord;
    submitLabel?: string;
}

export const ChipRecordForm: React.FC<ChipRecordFormProps> = ({ onSubmit, lastRecord, initialValues, submitLabel = '記録' }) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            chipCount: initialValues?.chipCount,
            sb: initialValues?.sb ?? 100,
            bb: initialValues?.bb ?? 200,
        },
    });

    // Update default values when lastRecord changes, strictly for new entries (no initialValues)
    useEffect(() => {
        if (!initialValues && lastRecord) {
            form.setValue('sb', lastRecord.sb);
            form.setValue('bb', lastRecord.bb);
        }
    }, [lastRecord, form, initialValues]);

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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="chipCount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>現在のチップ量</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="例: 30000" {...field} value={field.value ?? ''} />
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
                            <FormItem className="flex-1">
                                <FormLabel>現在のSB</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bb"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>現在のBB</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} value={field.value ?? ''} />
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
