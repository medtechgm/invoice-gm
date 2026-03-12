import { writable } from 'svelte/store';
import type { DocumentAction } from '../models/history';
import { v4 as uuidv4 } from 'uuid';

export const documentHistory = writable<DocumentAction[]>([]);

let supabaseClient: any;
let userId: string;

export const initHistory = async (supabase: any, uid: string) => {
    supabaseClient = supabase;
    userId = uid;

    const { data, error } = await supabaseClient
        .from('document_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (!error && data) {
        const mapped = data.map((h: any) => ({
            id: h.id,
            documentType: h.document_type,
            documentId: h.document_id,
            action: h.action,
            description: h.description || '',
            createdAt: new Date(h.created_at)
        }));
        documentHistory.set(mapped);
    }
};

export const logDocumentAction = (action: Omit<DocumentAction, 'id' | 'createdAt'>) => {
    const id = uuidv4();
    const createdAt = new Date();
    const newAction = { ...action, id, createdAt };

    // Update local store
    documentHistory.update(h => [newAction, ...h]);

    if (supabaseClient && userId) {
        supabaseClient.from('document_history').insert([{
            id,
            user_id: userId,
            document_type: action.documentType,
            document_id: action.documentId,
            action: action.action,
            description: action.description
        }]).then(({ error }: any) => {
            if (error) {
                console.error('Failed to log document action to Supabase:', error);
            }
        });
    }
};
