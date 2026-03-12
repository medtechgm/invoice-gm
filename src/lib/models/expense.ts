export interface Expense {
    id: string;
    date: Date;
    category: string;
    amount: number;
    currency: string;
    payee?: string;
    description?: string;
    attachmentUrl?: string;
}
