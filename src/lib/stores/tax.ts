import { writable } from 'svelte/store';
import type { TaxRate } from '../models/tax';
import { v4 as uuidv4 } from 'uuid';

export const taxRates = writable<TaxRate[]>([]);

let supabaseClient: any;
let userId: string;

export const initTaxRates = async (supabase: any, uid: string) => {
    supabaseClient = supabase;
    userId = uid;

    const { data, error } = await supabaseClient
        .from('tax_rates')
        .select('*')
        .eq('user_id', userId);

    if (!error && data) {
        const mapped = data.map((t: any) => ({
            id: t.id,
            name: t.name,
            rate: t.rate,
            isDefault: t.is_default
        }));
        taxRates.set(mapped);
    }
};

export const addTaxRate = (taxRate: Omit<TaxRate, 'id'>) => {
    const id = uuidv4();
    const newRate = { ...taxRate, id };

    taxRates.update(t => [...t, newRate]);

    if (supabaseClient && userId) {
        supabaseClient.from('tax_rates').insert([{
            id,
            user_id: userId,
            name: taxRate.name,
            rate: taxRate.rate,
            is_default: taxRate.isDefault
        }]).then(({ error }: any) => {
            if (error) console.error('Failed to save tax rate:', error);
        });
    }
};

export const deleteTaxRate = (id: string) => {
    taxRates.update(t => t.filter(rate => rate.id !== id));

    if (supabaseClient) {
        supabaseClient.from('tax_rates').delete().eq('id', id).then(({ error }: any) => {
            if (error) console.error('Failed to delete tax rate:', error);
        });
    }
};
