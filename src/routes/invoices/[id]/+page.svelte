<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { v4 as uuidv4 } from "uuid";

    import { settings } from "$lib/stores/settings";
    import { clients } from "$lib/stores/clients";
    import { invoices, updateInvoice } from "$lib/stores/invoices";

    import AppButton from "$lib/components/AppButton.svelte";
    import FormField from "$lib/components/FormField.svelte";
    import LineItemRow from "$lib/components/LineItemRow.svelte";
    import { formatCurrency } from "$lib/utils/formatters";

    import type { Invoice, InvoiceItem } from "$lib/models/invoice";
    import type { Client } from "$lib/models/client";
    import type { CompanyInfo } from "$lib/models/company";

    $: invoiceId = $page.params.id;
    $: invoice = $invoices.find((inv) => inv.id === invoiceId);

    // Form state
    let invoiceNumber = "";
    let poNumber = "";
    let dateIssued = "";
    let dateDue = "";
    let sender: CompanyInfo = { ...$settings.company };

    let selectedClientId = "";
    let items: InvoiceItem[] = [];
    let taxRate = 0;
    let discount = 0;
    let shipping = 0;
    let currency = "USD";
    let notes = "";
    let terms = "";

    onMount(() => {
        if (invoice) {
            invoiceNumber = invoice.invoiceNumber;
            poNumber = invoice.poNumber || "";
            // Handle dates correctly
            dateIssued =
                invoice.dateIssued instanceof Date
                    ? invoice.dateIssued.toISOString().split("T")[0]
                    : new Date(invoice.dateIssued).toISOString().split("T")[0];
            dateDue =
                invoice.dateDue instanceof Date
                    ? invoice.dateDue.toISOString().split("T")[0]
                    : new Date(invoice.dateDue).toISOString().split("T")[0];

            sender = { ...invoice.sender };
            selectedClientId = invoice.client.id;
            items = invoice.items.map((item) => ({ ...item }));
            taxRate = invoice.taxRate;
            discount = invoice.discount;
            shipping = invoice.shipping;
            currency = invoice.currency;
            notes = invoice.notes || "";
            terms = invoice.terms || "";
        }
    });

    $: subtotal = items.reduce(
        (sum, item) => sum + item.rate * item.quantity,
        0,
    );
    $: taxAmount = subtotal * (taxRate / 100);
    $: total = subtotal + taxAmount + shipping - discount;

    function addNewItem() {
        items = [
            ...items,
            { id: uuidv4(), name: "", description: "", rate: 0, quantity: 1 },
        ];
    }

    function handleItemUpdate(event: CustomEvent<InvoiceItem>) {
        const updatedItem = event.detail;
        items = items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item,
        );
    }

    function handleItemRemove(event: CustomEvent<string>) {
        const idToRemove = event.detail;
        if (items.length > 1) {
            items = items.filter((item) => item.id !== idToRemove);
        }
    }

    function handleSave(
        status: Invoice["status"] = invoice?.status || "draft",
        preview = false,
    ) {
        if (!invoice) return;

        const finalClient =
            $clients.find((c) => c.id === selectedClientId) || invoice.client;

        const updates: Partial<Invoice> = {
            invoiceNumber,
            poNumber,
            dateIssued: new Date(dateIssued),
            dateDue: new Date(dateDue),
            sender,
            client: finalClient,
            items,
            taxRate,
            discount,
            shipping,
            currency,
            notes,
            terms,
            status,
        };

        updateInvoice(invoice.id, updates);

        if (preview) {
            goto(`/invoices/${invoice.id}/preview`);
        } else {
            goto("/invoices");
        }
    }
</script>

<svelte:head>
    <title>Edit Invoice {invoiceNumber} - Invoicer App</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 pb-20">
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
                Exit
            </a>
            <div class="h-6 w-px bg-slate-200 mx-2"></div>
            <h1 class="text-xl font-black text-slate-900 tracking-tight">
                Edit <span class="text-emerald-500">{invoiceNumber}</span>
            </h1>
        </div>

        <div class="flex items-center gap-3">
            <AppButton
                variant="secondary"
                size="md"
                on:click={() => handleSave(invoice?.status, true)}
            >
                Preview PDF
            </AppButton>
            <AppButton
                variant="primary"
                size="md"
                on:click={() => handleSave(invoice?.status, false)}
            >
                Save Changes
            </AppButton>
        </div>
    </div>

    <div class="max-w-5xl mx-auto mt-8">
        {#if !invoice}
            <div
                class="bg-white p-12 rounded-2xl shadow-xl text-center border border-slate-200"
            >
                <h3
                    class="text-2xl font-black text-slate-900 mb-2 tracking-tight"
                >
                    Invoice Not Found
                </h3>
                <p class="text-slate-500 mb-8">
                    The invoice you're trying to edit doesn't exist.
                </p>
                <AppButton variant="primary" href="/invoices"
                    >Return to List</AppButton
                >
            </div>
        {:else}
            <!-- Paper-like Form -->
            <div
                class="bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200 ring-1 ring-slate-900/5 animate-in slide-in-from-bottom-4 duration-700"
            >
                <!-- Invoice Form Content (Simplified for brevity, similar to new page) -->
                <div class="p-12 border-b border-slate-100">
                    <div class="flex justify-between items-start gap-12">
                        <!-- Left Side: From -->
                        <div class="flex-1 space-y-6">
                            {#if sender.logo}
                                <img
                                    src={sender.logo}
                                    alt="Logo"
                                    class="h-16 w-auto mb-6 grayscale hover:grayscale-0 transition-all cursor-pointer"
                                />
                            {:else}
                                <div
                                    class="w-16 h-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 mb-6"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="w-8 h-8"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                        />
                                    </svg>
                                </div>
                            {/if}

                            <div class="space-y-1">
                                <label
                                    class="block text-[10px] font-bold uppercase tracking-widest text-slate-400"
                                    >From</label
                                >
                                <div class="font-black text-2xl text-slate-900">
                                    {sender.name}
                                </div>
                                <div
                                    class="text-sm text-slate-500 whitespace-pre-wrap"
                                >
                                    {sender.address}
                                </div>
                            </div>
                        </div>

                        <!-- Right Side: Details -->
                        <div class="w-72 space-y-4">
                            <div class="text-right mb-8">
                                <h2
                                    class="text-5xl font-black text-slate-900 tracking-tighter uppercase opacity-10"
                                >
                                    Invoice
                                </h2>
                            </div>

                            <div class="space-y-4">
                                <div
                                    class="flex items-center justify-between gap-4 border-b border-slate-50 pb-2"
                                >
                                    <label
                                        class="text-[10px] font-bold uppercase tracking-widest text-slate-400"
                                        >Number</label
                                    >
                                    <input
                                        bind:value={invoiceNumber}
                                        class="text-right border-none p-0 text-slate-900 focus:ring-0 font-bold text-sm w-32"
                                    />
                                </div>
                                <div
                                    class="flex items-center justify-between gap-4 border-b border-slate-50 pb-2"
                                >
                                    <label
                                        class="text-[10px] font-bold uppercase tracking-widest text-slate-400"
                                        >Date</label
                                    >
                                    <input
                                        type="date"
                                        bind:value={dateIssued}
                                        class="text-right border-none p-0 text-slate-900 focus:ring-0 font-bold text-sm"
                                    />
                                </div>
                                <div
                                    class="flex items-center justify-between gap-4 border-b border-slate-50 pb-2"
                                >
                                    <label
                                        class="text-[10px] font-bold uppercase tracking-widest text-slate-400"
                                        >Due Date</label
                                    >
                                    <input
                                        type="date"
                                        bind:value={dateDue}
                                        class="text-right border-none p-0 text-slate-900 focus:ring-0 font-bold text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Client Section -->
                <div class="p-12 bg-slate-50/30 border-b border-slate-100">
                    <div class="w-full">
                        <label
                            class="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4"
                            >Bill To</label
                        >
                        <select
                            bind:value={selectedClientId}
                            class="block w-full border-none p-0 bg-transparent text-slate-900 focus:ring-0 font-black text-3xl placeholder:text-slate-200 transition-all cursor-pointer"
                        >
                            {#each $clients as client}
                                <option value={client.id}
                                    >{client.companyName}</option
                                >
                            {/each}
                        </select>
                        <div
                            class="mt-4 text-sm text-slate-500 whitespace-pre-wrap"
                        >
                            {$clients.find((c) => c.id === selectedClientId)
                                ?.address || ""}
                        </div>
                    </div>
                </div>

                <!-- Line Items -->
                <div class="p-12 pb-4">
                    <div
                        class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4"
                    >
                        <div class="col-span-1"></div>
                        <div class="col-span-6">Description</div>
                        <div class="col-span-2 text-right">Rate</div>
                        <div class="col-span-1 text-center">Qty</div>
                        <div class="col-span-2 text-right pr-12">Amount</div>
                    </div>

                    <div class="flex flex-col">
                        {#each items as item (item.id)}
                            <LineItemRow
                                {item}
                                {currency}
                                on:update={handleItemUpdate}
                                on:remove={handleItemRemove}
                            />
                        {/each}
                    </div>

                    <div class="pt-6 pb-2">
                        <AppButton
                            variant="secondary"
                            size="sm"
                            on:click={addNewItem}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2.5"
                                stroke="currentColor"
                                class="w-4 h-4 mr-2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                            Add Line Item
                        </AppButton>
                    </div>
                </div>

                <!-- Totals Section -->
                <div class="p-12 pt-0 grid grid-cols-1 md:grid-cols-2 gap-24">
                    <div class="space-y-8 pt-8">
                        <div class="space-y-2">
                            <label
                                class="block text-[10px] font-bold uppercase tracking-widest text-slate-400"
                                >Notes</label
                            >
                            <textarea
                                bind:value={notes}
                                rows="3"
                                class="block w-full border-none p-0 text-slate-600 focus:ring-0 text-sm placeholder:text-slate-200 resize-none"
                            ></textarea>
                        </div>
                        <div class="space-y-2">
                            <label
                                class="block text-[10px] font-bold uppercase tracking-widest text-slate-400"
                                >Terms</label
                            >
                            <textarea
                                bind:value={terms}
                                rows="2"
                                class="block w-full border-none p-0 text-slate-600 focus:ring-0 text-sm placeholder:text-slate-200 resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div class="pt-8 space-y-4">
                        <div
                            class="flex justify-between items-center py-1 text-sm text-slate-400"
                        >
                            <span
                                class="font-bold uppercase tracking-widest text-[10px]"
                                >Subtotal</span
                            >
                            <span class="font-bold text-slate-800"
                                >{formatCurrency(subtotal, currency)}</span
                            >
                        </div>
                        <div
                            class="flex justify-between items-center py-1 text-sm text-slate-400"
                        >
                            <span
                                class="font-bold uppercase tracking-widest text-[10px]"
                                >Tax ({taxRate}%)</span
                            >
                            <span class="font-bold text-slate-800"
                                >{formatCurrency(taxAmount, currency)}</span
                            >
                        </div>
                        <div
                            class="pt-4 mt-4 border-t border-slate-100 flex justify-between items-end"
                        >
                            <div class="text-right w-full">
                                <span
                                    class="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1"
                                    >Total Due</span
                                >
                                <span
                                    class="font-black text-5xl tracking-tighter text-slate-900"
                                    >{formatCurrency(total, currency)}</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
