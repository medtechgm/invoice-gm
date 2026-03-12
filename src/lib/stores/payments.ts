import { writable, get } from 'svelte/store';
import type { Payment } from '../models/payment';
import { v4 as uuidv4 } from 'uuid';
import { invoices } from './invoices';
import { logDocumentAction } from './history';

export const payments = writable<Payment[]>([]);

let supabaseClient: any;
let userId: string;

export const initPayments = async (supabase: any, uid: string) => {
    supabaseClient = supabase;
    userId = uid;

    const { data, error } = await supabaseClient
        .from('payments')
        .select('*')
        .eq('user_id', userId);

    if (!error && data) {
        const mapped = data.map((p: any) => ({
            id: p.id,
            invoiceId: p.invoice_id,
            amount: Number(p.amount),
            paymentDate: new Date(p.payment_date),
            paymentMethod: p.payment_method || '',
            referenceNumber: p.reference_number || '',
            notes: p.notes || ''
        }));
        payments.set(mapped);
    }
};

export const addPayment = (payment: Omit<Payment, 'id'>) => {
    const id = uuidv4();
    const newPayment = { ...payment, id };

    // Optimistic UI update
    payments.update(p => [...p, newPayment]);

    // Automatically update invoice status if fully paid?
    // We can do this here or on the UI layer. For now, just save payment.

    logDocumentAction({
        documentType: 'invoice',
        documentId: payment.invoiceId,
        action: 'payment_recorded',
        description: `Payment of ${payment.amount} recorded.`
    });

    if (supabaseClient && userId) {
        supabaseClient.from('payments').insert([{
            id,
            user_id: userId,
            invoice_id: payment.invoiceId,
            amount: payment.amount,
            payment_date: payment.paymentDate.toISOString(),
            payment_method: payment.paymentMethod,
            reference_number: payment.referenceNumber,
            notes: payment.notes
        }]).then(({ error }: any) => {
            if (error) {
                console.error('Failed to save payment to Supabase:', error);
            }
        });
    }

    return id;
};

export const deletePayment = (id: string) => {
    payments.update(p => p.filter(payment => payment.id !== id));

    if (supabaseClient) {
        supabaseClient.from('payments').delete().eq('id', id).then(({ error }: any) => {
            if (error) {
                console.error('Failed to delete payment from Supabase:', error);
            }
        });
    }
};
