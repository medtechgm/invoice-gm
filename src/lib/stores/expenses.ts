import { writable } from 'svelte/store';
import type { Expense } from '../models/expense';
import { v4 as uuidv4 } from 'uuid';

export const expenses = writable<Expense[]>([]);

let supabaseClient: any;
let userId: string;

export const initExpenses = async (supabase: any, uid: string) => {
    supabaseClient = supabase;
    userId = uid;

    const { data, error } = await supabaseClient
        .from('expenses')
        .select('*')
        .eq('user_id', userId);

    if (!error && data) {
        const mapped = data.map((e: any) => ({
            id: e.id,
            date: new Date(e.date),
            category: e.category,
            amount: e.amount,
            currency: e.currency,
            payee: e.payee,
            description: e.description,
            attachmentUrl: e.attachment_url
        }));
        expenses.set(mapped);
    }
};

export const addExpense = (expense: Omit<Expense, 'id'>) => {
    const id = uuidv4();
    const newExpense = { ...expense, id };

    expenses.update(e => [...e, newExpense]);

    if (supabaseClient && userId) {
        supabaseClient.from('expenses').insert([{
            id,
            user_id: userId,
            date: expense.date.toISOString(),
            category: expense.category,
            amount: expense.amount,
            currency: expense.currency,
            payee: expense.payee || null,
            description: expense.description || null,
            attachment_url: expense.attachmentUrl || null
        }]).then(({ error }: any) => {
            if (error) console.error('Failed to save expense:', error);
        });
    }
};

export const deleteExpense = (id: string) => {
    expenses.update(e => e.filter(expense => expense.id !== id));

    if (supabaseClient) {
        supabaseClient.from('expenses').delete().eq('id', id).then(({ error }: any) => {
            if (error) console.error('Failed to delete expense:', error);
        });
    }
};
