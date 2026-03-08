import { writable } from 'svelte/store';
import type { CompanyInfo } from '../models/company';
import { browser } from '$app/environment';

const STORE_KEY = 'invoicer_settings';
const storedSettings = browser ? localStorage.getItem(STORE_KEY) : null;

export interface AppSettings {
    company: CompanyInfo;
    defaultTaxRate: number;
    defaultCurrency: string;
    defaultNotes: string;
    defaultTerms: string;
}

const defaultSettings: AppSettings = {
    company: {
        name: 'My Company',
        email: 'hello@mycompany.com',
        phone: '',
        address: '',
        website: '',
        taxId: ''
    },
    defaultTaxRate: 0,
    defaultCurrency: 'USD',
    defaultNotes: 'Thank you for your business.',
    defaultTerms: 'Payment due upon receipt.'
};

export const settings = writable<AppSettings>(storedSettings ? JSON.parse(storedSettings) : defaultSettings);

if (browser) {
    settings.subscribe((value: AppSettings) => {
        localStorage.setItem(STORE_KEY, JSON.stringify(value));
    });
}
