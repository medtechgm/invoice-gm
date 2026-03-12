import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
    const { supabase } = await parent();
    const { id } = params;

    const { data: invoice, error: fetchError } = await supabase
        .from('invoices')
        .select('*, client:clients(*), sender:profiles(*)')
        .eq('id', id)
        .single();

    if (fetchError || !invoice) {
        // Try estimates if not found in invoices
        const { data: estimate, error: estError } = await supabase
            .from('estimates')
            .select('*, client:clients(*), sender:profiles(*)')
            .eq('id', id)
            .single();

        if (estError || !estimate) {
            throw error(404, 'Document not found');
        }

        return {
            document: estimate,
            type: 'estimate'
        };
    }

    return {
        document: invoice,
        type: 'invoice'
    };
};
