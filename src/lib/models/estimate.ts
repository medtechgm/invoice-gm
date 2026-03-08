import type { CompanyInfo } from './company';
import type { Client } from './client';
import type { InvoiceItem } from './invoice';

export type EstimateStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';

export interface Estimate {
    id: string;
    estimateNumber: string;
    referenceNumber?: string;
    dateIssued: Date;
    dateValidUntil: Date;
    status: EstimateStatus;
    sender: CompanyInfo;
    client: Client;
    items: InvoiceItem[];
    taxRate: number;
    discount: number;
    shipping: number;
    currency: string;
    notes: string;
    terms: string;
}
