export interface Payment {
    id: string;
    invoiceId: string;
    amount: number;
    paymentDate: Date;
    paymentMethod?: string;
    referenceNumber?: string;
    notes?: string;
}
