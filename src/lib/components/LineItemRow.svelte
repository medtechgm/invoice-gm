<script lang="ts">
    import type { InvoiceItem } from "$lib/models/invoice";
    import { formatCurrency } from "$lib/utils/formatters";
    import { createEventDispatcher } from "svelte";

    export let item: InvoiceItem;
    export let currency: string = "USD";

    const dispatch = createEventDispatcher();

    $: total = item.rate * item.quantity;

    function handleUpdate() {
        dispatch("update", item);
    }

    function handleRemove() {
        dispatch("remove", item.id);
    }

    function toggleTax() {
        // Toggle tax implementation could be added here
        // For now just a UI placeholder
    }
</script>

<div class="grid grid-cols-12 gap-3 items-start py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors group px-1">
    <!-- Drag Handle -->
    <div class="col-span-1 flex items-center justify-center text-slate-300 group-hover:text-slate-400 cursor-move pt-1">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-5 h-5"
        >
            <path
                d="M7 2a2 2 0 100 4 2 2 0 000-4zM7 8a2 2 0 100 4 2 2 0 000-4zM7 14a2 2 0 100 4 2 2 0 000-4zM13 2a2 2 0 100 4 2 2 0 000-4zM13 8a2 2 0 100 4 2 2 0 000-4zM13 14a2 2 0 100 4 2 2 0 000-4z"
            />
        </svg>
    </div>

    <!-- Item Details (Name + Description) -->
    <div class="col-span-5 space-y-2">
        <input
            id="item-name-{item.id}"
            type="text"
            bind:value={item.name}
            oninput={handleUpdate}
            placeholder="Item name"
            class="block w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-sm font-medium transition-colors"
        />
        <textarea
            id="item-desc-{item.id}"
            bind:value={item.description}
            oninput={handleUpdate}
            placeholder="Item description"
            rows="2"
            class="block w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-600 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-sm resize-none transition-colors"
        ></textarea>
    </div>

    <!-- Rate -->
    <div class="col-span-2 flex items-center gap-1 pt-1">
        <span class="text-slate-400 text-sm">$</span>
        <input
            id="item-rate-{item.id}"
            type="number"
            bind:value={item.rate}
            oninput={handleUpdate}
            min="0"
            step="0.01"
            placeholder="0.00"
            class="block w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-sm text-right transition-colors"
        />
    </div>

    <!-- Quantity -->
    <div class="col-span-1 flex items-center pt-1">
        <input
            id="item-qty-{item.id}"
            type="number"
            bind:value={item.quantity}
            oninput={handleUpdate}
            min="1"
            step="1"
            placeholder="1"
            class="block w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-sm text-center transition-colors"
        />
    </div>

    <!-- Total -->
    <div class="col-span-2 flex items-center justify-end pt-1 pr-2">
        <span class="font-semibold text-slate-900">{formatCurrency(total, currency)}</span>
    </div>

    <!-- Delete Button -->
    <div class="col-span-1 flex items-center justify-end pt-1">
        <button
            type="button"
            onclick={handleRemove}
            class="text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 p-1"
            title="Remove item"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-4 h-4"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>
    </div>
</div>
