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

<div
    class="grid grid-cols-12 gap-4 items-start py-6 border-b border-slate-100 hover:bg-slate-50/50 transition-all group px-4 -mx-4 rounded-xl"
>
    <!-- Drag Handle -->
    <div
        class="col-span-1 flex items-center justify-center pt-2 text-slate-200 group-hover:text-slate-400 transition-colors cursor-move"
    >
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

    <!-- Item Details -->
    <div class="col-span-6 space-y-1">
        <input
            type="text"
            bind:value={item.name}
            on:input={handleUpdate}
            placeholder="Item name"
            class="block w-full border-none p-0 text-slate-800 focus:ring-0 font-bold text-base placeholder:text-slate-200 transition-all bg-transparent"
        />
        <textarea
            bind:value={item.description}
            on:input={handleUpdate}
            placeholder="Item description"
            rows="1"
            class="block w-full border-none p-0 text-slate-500 focus:ring-0 text-sm resize-none placeholder:text-slate-300 transition-all bg-transparent"
        ></textarea>
    </div>

    <!-- Rate -->
    <div class="col-span-2 pt-1 text-right">
        <div class="flex items-center justify-end">
            <span class="text-slate-300 text-sm font-bold mr-1">$</span>
            <input
                type="number"
                bind:value={item.rate}
                on:input={handleUpdate}
                min="0"
                step="0.01"
                class="block w-24 border-none p-0 text-slate-800 focus:ring-0 font-bold text-base text-right transition-all bg-transparent"
            />
        </div>
        <button
            type="button"
            on:click={toggleTax}
            class="text-[10px] font-bold text-blue-500 hover:text-blue-600 transition-colors mt-1"
        >
            Add tax
        </button>
    </div>

    <!-- Quantity -->
    <div class="col-span-1 pt-1">
        <input
            type="number"
            bind:value={item.quantity}
            on:input={handleUpdate}
            min="1"
            step="1"
            class="block w-full border-none p-0 text-slate-800 focus:ring-0 font-bold text-base text-center transition-all bg-transparent"
        />
    </div>

    <!-- Total -->
    <div class="col-span-2 flex items-center justify-between pt-1">
        <div class="w-full text-right pr-4">
            <span class="font-black text-base text-slate-900"
                >{formatCurrency(total, currency)}</span
            >
        </div>

        <button
            type="button"
            on:click={handleRemove}
            class="text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-50"
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
