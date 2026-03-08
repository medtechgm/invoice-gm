import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

export interface Item {
    id: string;
    name: string;
    description: string;
    rate: number;
}

const initialItems: Item[] = [
    {
        id: uuidv4(),
        name: 'Web Design',
        description: 'Custom website design services',
        rate: 1000
    },
    {
        id: uuidv4(),
        name: 'Consulting',
        description: 'Hourly technology consulting',
        rate: 150
    }
];

export const items = writable<Item[]>(initialItems);

export const addItem = (item: Omit<Item, 'id'>) => {
    items.update(i => [...i, { ...item, id: uuidv4() }]);
};

export const updateItem = (id: string, updates: Partial<Item>) => {
    items.update(i => i.map(item => item.id === id ? { ...item, ...updates } : item));
};

export const deleteItem = (id: string) => {
    items.update(i => i.filter(item => item.id !== id));
};
