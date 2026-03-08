import { writable, get } from 'svelte/store';
import type { Invoice } from '../models/invoice';
import { v4 as uuidv4 } from 'uuid';
import { clients } from './clients';
import { settings } from './settings';
import { browser } from '$app/environment';

const STORE_KEY = 'invoicer_invoices';
const storedInvoices = browser ? localStorage.getItem(STORE_KEY) : null;

const initialInvoices: Invoice[] = [
    {
        id: uuidv4(),
        invoiceNumber: 'INV-00001',
        dateIssued: new Date(),
        dateDue: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days later
        status: 'draft',
        sender: get(settings).company,
        client: get(clients)[0],
        items: [
            {
                id: uuidv4(),
                name: 'Web Design',
                description: 'Landing page design',
                rate: 800,
                quantity: 1
            }
        ],
        taxRate: 0,
        discount: 0,
        shipping: 0,
        currency: 'USD',
        notes: 'Thanks for your business.',
        terms: 'Payment due upon receipt.'
    }
];

export const invoices = writable<Invoice[]>(storedInvoices ? JSON.parse(storedInvoices, (key, value) => {
    if (key === 'dateIssued' || key === 'dateDue') return new Date(value);
    return value;
}) : initialInvoices);

if (browser) {
    invoices.subscribe(value => {
        localStorage.setItem(STORE_KEY, JSON.stringify(value));
    });
}

export const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const id = uuidv4();
    invoices.update(i => [...i, { ...invoice, id }]);
    return id;
};

export const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    invoices.update(i => i.map(inv => inv.id === id ? { ...inv, ...updates } : inv));
};

export const deleteInvoice = (id: string) => {
    invoices.update(i => i.filter(inv => inv.id !== id));
};
