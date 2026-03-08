import { writable } from 'svelte/store';
import type { Client } from '../models/client';
import { v4 as uuidv4 } from 'uuid';
import { browser } from '$app/environment';

const STORE_KEY = 'invoicer_clients';
const storedClients = browser ? localStorage.getItem(STORE_KEY) : null;

const initialClients: Client[] = [
    {
        id: uuidv4(),
        companyName: 'Acme Corp',
        contactName: 'John Doe',
        email: 'john@acme.com',
        phone: '555-0199',
        address: '123 Business St, City, ST 12345'
    }
];

export const clients = writable<Client[]>(storedClients ? JSON.parse(storedClients) : initialClients);

if (browser) {
    clients.subscribe(value => {
        localStorage.setItem(STORE_KEY, JSON.stringify(value));
    });
}

export const addClient = (client: Omit<Client, 'id'>) => {
    clients.update(c => [...c, { ...client, id: uuidv4() }]);
};

export const updateClient = (id: string, updates: Partial<Client>) => {
    clients.update(c => c.map(client => client.id === id ? { ...client, ...updates } : client));
};

export const deleteClient = (id: string) => {
    clients.update(c => c.filter(client => client.id !== id));
};
