import { writable } from 'svelte/store';
import type { Estimate } from '../models/estimate';
import { v4 as uuidv4 } from 'uuid';
import { browser } from '$app/environment';

const STORE_KEY = 'invoicer_estimates';
const storedEstimates = browser ? localStorage.getItem(STORE_KEY) : null;

export const estimates = writable<Estimate[]>(storedEstimates ? JSON.parse(storedEstimates, (key, value) => {
    if (key === 'dateIssued' || key === 'dateValidUntil') return new Date(value);
    return value;
}) : []);

if (browser) {
    estimates.subscribe(value => {
        localStorage.setItem(STORE_KEY, JSON.stringify(value));
    });
}

export const addEstimate = (estimate: Omit<Estimate, 'id'>) => {
    const id = uuidv4();
    estimates.update(e => [...e, { ...estimate, id }]);
    return id;
};

export const updateEstimate = (id: string, updates: Partial<Estimate>) => {
    estimates.update(e => e.map(est => est.id === id ? { ...est, ...updates } : est));
};

export const deleteEstimate = (id: string) => {
    estimates.update(e => e.filter(est => est.id !== id));
};
