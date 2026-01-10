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

const formSchema = z.object({
    name: z.string().min(1, '名前を入力してください'),
    startChips: z.coerce.number().min(1, '1以上の数値を入力してください'),
    sb: z.coerce.number().min(1, '1以上の数値を入力してください'),
    bb: z.coerce.number().min(1, '1以上の数値を入力してください'),
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
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="sb"
                        render={({ field }) => (
                            <FormItem className="flex-1">
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
                            <FormItem className="flex-1">
                                <FormLabel>初期BB</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" className="w-full">作成</Button>
            </form>
        </Form>
    );
};
