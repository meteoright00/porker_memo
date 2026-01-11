import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from './form';
import { Input } from './input';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

const TestForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(() => { })} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <button type="submit">Submit</button>
            </form>
        </Form>
    );
};

describe('Form', () => {
    it('validates input correctly', async () => {
        render(<TestForm />);

        const input = screen.getByPlaceholderText('shadcn');
        const submitButton = screen.getByText('Submit');

        // Focus and blur to trigger validation (touched) or submit
        await userEvent.type(input, 'a');
        await userEvent.click(submitButton);

        // Async wait for validation message
        expect(await screen.findByText('Username must be at least 2 characters.')).toBeInTheDocument();
    });
});
