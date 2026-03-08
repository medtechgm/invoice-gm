<script lang="ts">
    import { goto } from "$app/navigation";
    import { addInvoice } from "$lib/stores/invoices";
    import InvoiceForm from "$lib/components/InvoiceForm.svelte";
    import type { Invoice } from "$lib/models/invoice";

    function handleSave(event: CustomEvent<any>) {
        const invoiceData = event.detail;
        const id = addInvoice(invoiceData);
        goto("/invoices");
    }
</script>

<svelte:head>
    <title>New Invoice - Invoicer App</title>
</svelte:head>

<!-- Sticky Header Toolbar -->
<div
    class="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm"
>
    <div class="flex items-center gap-4">
        <a
            href="/invoices"
            class="group text-slate-500 hover:text-slate-800 flex items-center gap-2 font-medium text-sm transition-all"
        >
            <div
                class="p-1 rounded-full group-hover:bg-slate-100 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2.5"
                    stroke="currentColor"
                    class="w-4 h-4"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                </svg>
            </div>
            Back to Invoices
        </a>
        <div class="h-6 w-px bg-slate-300 mx-2"></div>
        <h1
            class="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2"
        >
            New Invoice
        </h1>
    </div>
</div>

<div class="px-8 py-10 max-w-5xl mx-auto">
    <InvoiceForm type="invoice" on:save={handleSave} />
</div>
