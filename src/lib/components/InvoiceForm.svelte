<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";
    import { v4 as uuidv4 } from "uuid";
    import { slide, fade } from "svelte/transition";
    import { dndzone } from "svelte-dnd-action";
    import SendModal from "$lib/components/SendModal.svelte";

    import { settings } from "$lib/stores/settings";
    import { clients } from "$lib/stores/clients";
    import AppButton from "$lib/components/AppButton.svelte";
    import LineItemRow from "$lib/components/LineItemRow.svelte";
    import FileUpload from "$lib/components/FileUpload.svelte";
    import { formatCurrency } from "$lib/utils/formatters";

    import type { Invoice, InvoiceItem } from "$lib/models/invoice";
    import type { Estimate } from "$lib/models/estimate";
    import type { Client } from "$lib/models/client";
    import type { CompanyInfo } from "$lib/models/company";

    const dispatch = createEventDispatcher();

    export let type: "invoice" | "estimate" = "invoice";
    export let initialData: Partial<Invoice | Estimate> = {};

    // Form state
    let docNumber =
        (initialData as any).invoiceNumber ||
        (initialData as any).estimateNumber ||
        "";
    let referenceNumber =
        (initialData as any).poNumber ||
        (initialData as any).referenceNumber ||
        "";
    let dateIssued = (
        initialData.dateIssued ? new Date(initialData.dateIssued) : new Date()
    )
        .toISOString()
        .split("T")[0];
    let dateDue = (
        (initialData as any).dateDue
            ? new Date((initialData as any).dateDue)
            : (initialData as any).dateValidUntil
              ? new Date((initialData as any).dateValidUntil)
              : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    )
        .toISOString()
        .split("T")[0];

    let sender: CompanyInfo = initialData.sender
        ? { ...initialData.sender }
        : { ...$settings.company };
    let selectedClientId =
        initialData.client?.id || ($clients.length > 0 ? $clients[0].id : "");
    let items: InvoiceItem[] = initialData.items
        ? initialData.items.map((i) => ({ ...i }))
        : [{ id: uuidv4(), name: "", description: "", rate: 0, quantity: 1 }];

    let taxRate = initialData.taxRate ?? $settings.defaultTaxRate;
    let discount = initialData.discount ?? 0;
    let shipping = initialData.shipping ?? 0;
    let currency = initialData.currency ?? $settings.defaultCurrency;
    let notes = initialData.notes ?? $settings.defaultNotes;
    let terms = initialData.terms ?? $settings.defaultTerms;

    // UI state
    let activeClientTab: "billed" | "shipped" = "billed";
    let showShipping = shipping > 0;
    let showDiscount = discount > 0;
    let showTax = taxRate > 0;

    // Computed
    $: subtotal = items.reduce(
        (sum, item) => sum + item.rate * item.quantity,
        0,
    );
    $: taxAmount = subtotal * (taxRate / 100);
    $: total = subtotal + taxAmount + shipping - discount;

    function handleDndConsider(e: CustomEvent) {
        items = e.detail.items;
    }

    function handleDndFinalize(e: CustomEvent) {
        items = e.detail.items;
    }

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

    function onSave(status: any = "draft") {
        const client = $clients.find((c) => c.id === selectedClientId);
        if (!client) return;

        const data: any = {
            dateIssued: new Date(dateIssued),
            sender: { ...sender },
            client: { ...client },
            items: items.filter((i) => i.name.trim() !== ""),
            taxRate,
            discount,
            shipping,
            currency,
            notes,
            terms,
            status,
        };

        if (type === "invoice") {
            data.invoiceNumber = docNumber;
            data.poNumber = referenceNumber;
            data.dateDue = new Date(dateDue);
        } else {
            data.estimateNumber = docNumber;
            data.referenceNumber = referenceNumber;
            data.dateValidUntil = new Date(dateDue);
        }

        dispatch("save", data);
    }

    let showSendModal = false;

    function handleSaveAndSend() {
        showSendModal = true;
    }

    function onSend(event: CustomEvent) {
        const details = event.detail;
        console.log(`Sending ${type} via ${details.method}`, details);
        // In a real app, we'd trigger the email/whatsapp service here
        onSave("sent");
    }
</script>

<div
    class="bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200 ring-1 ring-slate-900/5 transition-all"
>
    <!-- Header: Logo & From Info -->
    <div
        class="p-12 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-12"
    >
        <div class="w-full md:w-1/3">
            <FileUpload
                value={sender.logo}
                on:upload={(e) => (sender.logo = e.detail)}
                on:remove={() => (sender.logo = "")}
                label="Add your logo"
            />
        </div>

        <div class="flex-1 text-right space-y-4">
            <h2
                class="text-7xl font-black text-slate-900 tracking-tighter uppercase opacity-[0.07] select-none pointer-events-none absolute right-12 top-8"
            >
                {type}
            </h2>
            <div class="space-y-1">
                <input
                    bind:value={sender.name}
                    placeholder="Your Company Name"
                    class="block w-full text-right border-none p-0 text-slate-900 focus:ring-0 font-bold text-xl placeholder:text-slate-200"
                />
                <textarea
                    bind:value={sender.address}
                    placeholder="Address, Phone, Email"
                    rows="4"
                    class="block w-full text-right border-none p-0 text-slate-500 focus:ring-0 text-sm resize-none placeholder:text-slate-300"
                ></textarea>
            </div>
        </div>
    </div>

    <!-- Middle: Client & Document Details -->
    <div
        class="flex flex-col lg:flex-row border-b border-slate-100 bg-slate-50/20"
    >
        <!-- Client Section -->
        <div
            class="lg:w-1/2 p-12 border-b lg:border-b-0 lg:border-r border-slate-100"
        >
            <div class="flex gap-4 mb-6">
                <button
                    class="text-[10px] font-black uppercase tracking-widest {activeClientTab ===
                    'billed'
                        ? 'text-emerald-600 border-b-2 border-emerald-500'
                        : 'text-slate-400'} pb-1 transition-all"
                    on:click={() => (activeClientTab = "billed")}
                >
                    Billed To
                </button>
                <button
                    class="text-[10px] font-black uppercase tracking-widest {activeClientTab ===
                    'shipped'
                        ? 'text-emerald-600 border-b-2 border-emerald-500'
                        : 'text-slate-400'} pb-1 transition-all"
                    on:click={() => (activeClientTab = "shipped")}
                >
                    Shipped To
                </button>
                <div class="flex-1 text-right">
                    <AppButton variant="ghost" size="sm" href="/clients/new"
                        >+ New client</AppButton
                    >
                </div>
            </div>

            <select
                bind:value={selectedClientId}
                class="block w-full border-none p-0 bg-transparent text-slate-900 focus:ring-0 font-black text-3xl placeholder:text-slate-200 transition-all cursor-pointer mb-4"
            >
                {#each $clients as client}
                    <option value={client.id}>{client.companyName}</option>
                {/each}
            </select>

            {#if selectedClientId}
                {@const activeClient = $clients.find(
                    (c) => c.id === selectedClientId,
                )}
                {#if activeClient}
                    <div
                        class="text-sm text-slate-500 whitespace-pre-wrap leading-relaxed"
                    >
                        {activeClient.address}
                    </div>
                {/if}
            {/if}
        </div>

        <!-- Document Info Section -->
        <div class="lg:w-1/2 p-12 grid grid-cols-2 gap-x-8 gap-y-6">
            <div class="space-y-1">
                <label
                    for="date-issued"
                    class="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1"
                    >Date Issued</label
                >
                <input
                    id="date-issued"
                    type="date"
                    bind:value={dateIssued}
                    class="block w-full border-none p-0 text-slate-900 focus:ring-0 font-bold text-sm"
                />
            </div>
            <div class="space-y-1">
                <label
                    for="date-due"
                    class="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1"
                    >{type === "invoice" ? "Date Due" : "Valid Until"}</label
                >
                <input
                    id="date-due"
                    type="date"
                    bind:value={dateDue}
                    class="block w-full border-none p-0 text-slate-900 focus:ring-0 font-bold text-sm"
                />
            </div>
            <div class="space-y-1">
                <label
                    for="currency-select"
                    class="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1"
                    >Currency</label
                >
                <select
                    id="currency-select"
                    bind:value={currency}
                    class="block w-full border-none p-0 text-slate-900 focus:ring-0 font-bold text-sm bg-transparent appearance-none"
                >
                    <option value="USD">USD ($ - United States Dollar)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                </select>
            </div>
            <div class="space-y-1">
                <label
                    for="doc-number"
                    class="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1"
                    >{type === "invoice" ? "Invoice" : "Estimate"} Number</label
                >
                <input
                    id="doc-number"
                    type="text"
                    bind:value={docNumber}
                    class="block w-full border-none p-0 text-slate-900 focus:ring-0 font-bold text-sm"
                />
            </div>
            <div class="space-y-1 col-span-2">
                <label
                    for="ref-number"
                    class="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1"
                    >{type === "invoice" ? "PO Number" : "Reference #"}</label
                >
                <input
                    id="ref-number"
                    type="text"
                    bind:value={referenceNumber}
                    placeholder="Enter value (eg PO#)"
                    class="block w-full border-none p-0 text-slate-900 focus:ring-0 font-bold text-sm placeholder:text-slate-200"
                />
            </div>
        </div>
    </div>

    <!-- Line Items Section -->
    <div class="p-12 pb-4">
        <div
            class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4"
        >
            <div class="col-span-1"></div>
            <div class="col-span-6">Item</div>
            <div class="col-span-2 text-right">Rate</div>
            <div class="col-span-1 text-center">Qty</div>
            <div class="col-span-2 text-right pr-12">Line Total</div>
        </div>

        <div
            use:dndzone={{
                items,
                dragDisabled: items.length <= 1,
                flipDurationMs: 200,
            }}
            on:consider={handleDndConsider}
            on:finalize={handleDndFinalize}
            class="flex flex-col"
        >
            {#each items as item (item.id)}
                <div transition:slide={{ duration: 200 }}>
                    <LineItemRow
                        {item}
                        {currency}
                        on:update={handleItemUpdate}
                        on:remove={handleItemRemove}
                    />
                </div>
            {/each}
        </div>

        <div class="pt-6 pb-2">
            <button
                type="button"
                on:click={addNewItem}
                class="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-bold text-sm transition-all"
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
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
                Add line item
            </button>
        </div>
    </div>

    <!-- Footer: Totals & Notes -->
    <div class="p-12 pt-0 grid grid-cols-1 md:grid-cols-2 gap-24">
        <div class="space-y-8 pt-8">
            <div class="space-y-4">
                <h3
                    class="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2"
                >
                    Notes
                </h3>
                <textarea
                    bind:value={notes}
                    rows="3"
                    placeholder="Notes or payment details (optional)..."
                    class="block w-full border-none p-0 text-slate-600 focus:ring-0 text-sm placeholder:text-slate-200 resize-none font-medium leading-relaxed"
                ></textarea>
            </div>
            <div class="space-y-4">
                <h3
                    class="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2"
                >
                    Terms
                </h3>
                <textarea
                    bind:value={terms}
                    rows="2"
                    placeholder="Terms and conditions."
                    class="block w-full border-none p-0 text-slate-600 focus:ring-0 text-sm placeholder:text-slate-200 resize-none font-medium leading-relaxed"
                ></textarea>
            </div>
        </div>

        <div class="pt-8 space-y-6">
            <div class="flex justify-between items-center py-1 group">
                <span
                    class="font-bold text-slate-500 uppercase tracking-widest text-[10px]"
                    >Subtotal</span
                >
                <span class="font-bold text-slate-900"
                    >{formatCurrency(subtotal, currency)}</span
                >
            </div>

            {#if showShipping}
                <div
                    class="flex justify-between items-center py-1 text-sm transition-all"
                    transition:slide
                >
                    <span
                        class="font-bold text-slate-500 uppercase tracking-widest text-[10px]"
                        >Shipping</span
                    >
                    <input
                        type="number"
                        bind:value={shipping}
                        class="w-24 text-right border-none p-0 focus:ring-0 font-bold text-slate-900 bg-transparent"
                    />
                </div>
            {/if}

            {#if showDiscount}
                <div
                    class="flex justify-between items-center py-1 text-sm transition-all"
                    transition:slide
                >
                    <span
                        class="font-bold text-slate-500 uppercase tracking-widest text-[10px]"
                        >Discount</span
                    >
                    <input
                        type="number"
                        bind:value={discount}
                        class="w-24 text-right border-none p-0 focus:ring-0 font-bold text-slate-900 bg-transparent"
                    />
                </div>
            {/if}

            {#if showTax}
                <div
                    class="flex justify-between items-center py-1 text-sm transition-all"
                    transition:slide
                >
                    <span
                        class="font-bold text-slate-500 uppercase tracking-widest text-[10px]"
                        >Tax ({taxRate}%)</span
                    >
                    <input
                        type="number"
                        bind:value={taxRate}
                        class="w-16 text-right border-none p-0 focus:ring-0 font-bold text-slate-900 bg-transparent"
                    />
                </div>
            {/if}

            <!-- Action Links -->
            <div
                class="flex flex-col items-end gap-2 border-t border-slate-50 pt-4"
            >
                {#if !showShipping}
                    <button
                        class="text-xs font-bold text-blue-500 hover:text-blue-600"
                        on:click={() => (showShipping = true)}
                        >Add shipping cost</button
                    >
                {/if}
                {#if !showDiscount}
                    <button
                        class="text-xs font-bold text-blue-500 hover:text-blue-600"
                        on:click={() => (showDiscount = true)}
                        >Add discount</button
                    >
                {/if}
                {#if !showTax}
                    <button
                        class="text-xs font-bold text-blue-500 hover:text-blue-600"
                        on:click={() => (showTax = true)}>Add tax</button
                    >
                {/if}
            </div>

            <div
                class="pt-4 mt-4 border-t-4 border-slate-900 flex justify-between items-center"
            >
                <span
                    class="font-black text-xl uppercase tracking-widest text-slate-900"
                    >Total</span
                >
                <span
                    class="font-black text-4xl tracking-tighter text-slate-900 uppercase"
                    >{formatCurrency(total, currency)}</span
                >
            </div>

            <div class="pt-4 flex justify-end gap-3 no-print">
                <AppButton
                    variant="secondary"
                    size="md"
                    on:click={() => onSave("draft")}>Save as Draft</AppButton
                >
                <AppButton
                    variant="primary"
                    size="md"
                    on:click={handleSaveAndSend}>Save & Send</AppButton
                >
            </div>
        </div>
    </div>

    {#if selectedClientId}
        {@const activeClient = $clients.find((c) => c.id === selectedClientId)}
        <SendModal
            bind:open={showSendModal}
            title={`Send ${type === "invoice" ? "Invoice" : "Estimate"}`}
            {type}
            initialClientName={activeClient?.companyName || ""}
            initialClientEmail={activeClient?.email || ""}
            on:send={onSend}
        />
    {/if}
</div>
