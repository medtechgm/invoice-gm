<script lang="ts">
    import { goto } from "$app/navigation";
    import { addItem } from "$lib/stores/items";
    import AppButton from "$lib/components/AppButton.svelte";

    let name = "";
    let sku = "";
    let category = "";
    let description = "";
    let rate = 0;
    let unit = "pcs";

    function handleSubmit() {
        if (!name) return;

        addItem({
            name,
            sku,
            category,
            description,
            rate,
            unit,
        });

        goto("/items");
    }
</script>

<svelte:head>
    <title>New Item - Invoicer App</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <div class="flex items-center gap-4 mb-8">
            <a
                href="/items"
                class="p-2 hover:bg-white rounded-lg transition-colors"
                aria-label="Back to Items"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2.5"
                    stroke="currentColor"
                    class="w-5 h-5 text-slate-500 hover:text-slate-800"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                </svg>
            </a>
            <div>
                <h1 class="text-3xl font-bold text-slate-900">New Item</h1>
                <p class="text-slate-500 text-sm mt-0.5">Add a new item to your library</p>
            </div>
        </div>

        <!-- Main Form Card -->
        <form
            on:submit|preventDefault={handleSubmit}
            class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
        >
            <!-- Basic Information Section -->
            <div class="p-6 sm:p-8 border-b border-slate-100">
                <h2 class="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                    <span class="w-1 h-1 bg-emerald-500 rounded-full"></span>
                    Basic Information
                </h2>

                <div class="space-y-4">
                    <div>
                        <label
                            for="name"
                            class="block text-sm font-medium text-slate-700 mb-2"
                        >
                            Item Name <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            bind:value={name}
                            required
                            placeholder="e.g., Graphic Design Service"
                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors"
                        />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                for="sku"
                                class="block text-sm font-medium text-slate-700 mb-2"
                            >
                                SKU / Item Code
                            </label>
                            <input
                                id="sku"
                                type="text"
                                bind:value={sku}
                                placeholder="e.g., GD-001"
                                class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors"
                            />
                        </div>
                        <div>
                            <label
                                for="category"
                                class="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Category
                            </label>
                            <input
                                id="category"
                                type="text"
                                bind:value={category}
                                placeholder="e.g., Services"
                                class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Details Section -->
            <div class="p-6 sm:p-8 border-b border-slate-100">
                <h2 class="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                    <span class="w-1 h-1 bg-emerald-500 rounded-full"></span>
                    Description & Pricing
                </h2>

                <div class="space-y-4">
                    <div>
                        <label
                            for="description"
                            class="block text-sm font-medium text-slate-700 mb-2"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            bind:value={description}
                            rows="3"
                            placeholder="Briefly describe the product or service"
                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors resize-none"
                        ></textarea>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                for="rate"
                                class="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Default Rate
                            </label>
                            <div class="relative">
                                <span
                                    class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium"
                                    >$</span
                                >
                                <input
                                    id="rate"
                                    type="number"
                                    step="0.01"
                                    bind:value={rate}
                                    placeholder="0.00"
                                    class="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                for="unit"
                                class="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Unit
                            </label>
                            <select
                                id="unit"
                                bind:value={unit}
                                class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors bg-white"
                            >
                                <option value="pcs">pcs (Pieces)</option>
                                <option value="hrs">hrs (Hours)</option>
                                <option value="days">days (Days)</option>
                                <option value="kg">kg (Kilograms)</option>
                                <option value="unit">unit</option>
                                <option value="m">m (Meters)</option>
                                <option value="job">job</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="px-6 sm:px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <AppButton
                    type="button"
                    variant="secondary"
                    onclick={() => goto("/items")}>Cancel</AppButton
                >
                <AppButton type="submit" variant="primary">Add Item</AppButton>
            </div>
        </form>
    </div>
</div>
