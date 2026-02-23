import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'; // Import everything to handle enum issue or just named import
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

import { Checkbox } from '@/components/ui/checkbox';

import { StructureEditor } from './StructureEditor';

const formSchema = z.object({
    name: z.string().min(1, '名前を入力してください'),
    startChips: z.coerce.number().min(1, '1以上の数値を入力してください'),
    sb: z.coerce.number().min(1, '1以上の数値を入力してください'),
    bb: z.coerce.number().min(1, '1以上の数値を入力してください'),
    isPending: z.boolean().default(false),
    structure: z.array(z.any()).optional().refine(
        (items) => {
            if (!items || items.length === 0) return true;
            return items.every((item: any) => {
                if (item.isBreak) return item.duration != null && item.duration > 0;
                return (
                    item.sb != null && item.sb > 0 &&
                    item.bb != null && item.bb > 0 &&
                    item.duration != null && item.duration > 0
                );
            });
        },
        { message: 'ストラクチャーの各レベルにはSB, BB, 時間を入力してください' }
    ),
});

type FormValues = z.infer<typeof formSchema>;

interface TournamentFormProps {
    onSubmit: (values: FormValues) => void;
}

export const TournamentForm: React.FC<TournamentFormProps> = ({ onSubmit }) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: '',
            startChips: 30000,
            sb: 100,
            bb: 200,
            isPending: false,
            structure: [],
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>トーナメント名</FormLabel>
                            <FormControl>
                                <Input placeholder="例: House Tournament" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startChips"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>開始チップ量</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="sb"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>初期SB</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bb"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>初期BB</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="structure"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <StructureEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isPending"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    後で開始する（Pending状態）
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    {form.watch('isPending') ? '作成のみを行う' : '作成して開始'}
                </Button>
            </form>
        </Form>
    );
};
