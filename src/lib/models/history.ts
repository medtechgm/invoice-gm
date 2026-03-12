export interface DocumentAction {
    id: string;
    documentType: 'invoice' | 'estimate';
    documentId: string;
    action: string;
    description?: string;
    createdAt: Date;
}
