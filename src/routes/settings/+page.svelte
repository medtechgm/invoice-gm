<script lang="ts">
    import { settings, updateSettings } from "$lib/stores/settings";
    import { taxRates, addTaxRate, deleteTaxRate } from "$lib/stores/tax";
    import AppButton from "$lib/components/AppButton.svelte";
    import FileUpload from "$lib/components/FileUpload.svelte";
    import { CURRENCIES } from "$lib/constants/currencies";

    let activeTab = $state("company");
    let saveMessage = $state("");
    let saveError = $state("");

    // Tax rate form state
    let newTaxName = $state("");
    let newTaxRate = $state(0);
    let isTaxDefault = $state(false);

    // Create local copies to edit, save on success
    let editedSettings = $state(JSON.parse(JSON.stringify($settings)));

    // Keep editedSettings in sync if $settings changes externally
    $effect(() => {
        editedSettings = JSON.parse(JSON.stringify($settings));
    });

    function handleSave() {
        if (!editedSettings.company.name.trim()) {
            saveError = "Company name is required";
            setTimeout(() => (saveError = ""), 3000);
            return;
        }

        updateSettings(editedSettings);
        saveMessage = "Settings saved successfully!";
        setTimeout(() => (saveMessage = ""), 3000);
    }

    function handleLogoUpload(url: string) {
        editedSettings.company.logo = url;
    }

    function handleLogoRemove() {
        editedSettings.company.logo = undefined;
    }

    function handleAddTaxRate() {
        if (!newTaxName.trim()) return;

        addTaxRate({
            name: newTaxName,
            rate: newTaxRate,
            isDefault: isTaxDefault,
        });

        // Reset form
        newTaxName = "";
        newTaxRate = 0;
        isTaxDefault = false;
    }
</script>

<svelte:head>
    <title>Settings - Invoicer App</title>
</svelte:head>

<div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8"
>
    <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
            <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">Settings</h1>
                <p class="text-slate-500 text-xs sm:text-sm mt-1">
                    Manage your company profile and invoice defaults
                </p>
            </div>
            <AppButton variant="primary" onclick={handleSave} class="w-full sm:w-auto">
                Save Changes
            </AppButton>
        </div>

        <!-- Notifications -->
        {#if saveMessage}
            <div
                class="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
            >
                <p class="text-sm font-medium text-emerald-700">
                    {saveMessage}
                </p>
            </div>
        {/if}
        {#if saveError}
            <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm font-medium text-red-700">{saveError}</p>
            </div>
        {/if}

        <div class="flex flex-col lg:flex-row gap-6">
            <!-- Sidebar Tabs -->
            <div
                class="w-full lg:w-64 shrink-0 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden h-fit"
            >
                <nav class="flex flex-col" aria-label="Settings tabs">
                    <button
                        onclick={() => (activeTab = "company")}
                        class="flex items-center gap-3 px-4 py-3 text-sm font-medium border-l-4 transition-colors {activeTab ===
                        'company'
                            ? 'bg-gradient-to-r from-emerald-50 to-transparent border-emerald-500 text-emerald-700'
                            : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}"
                    >
                        <svg
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                        Company Profile
                    </button>
                    <button
                        onclick={() => (activeTab = "defaults")}
                        class="flex items-center gap-3 px-4 py-3 text-sm font-medium border-l-4 transition-colors {activeTab ===
                        'defaults'
                            ? 'bg-gradient-to-r from-emerald-50 to-transparent border-emerald-500 text-emerald-700'
                            : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}"
                    >
                        <svg
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        Invoice Defaults
                    </button>
                    <button
                        onclick={() => (activeTab = "tax")}
                        class="flex items-center gap-3 px-4 py-3 text-sm font-medium border-l-4 transition-colors {activeTab ===
                        'tax'
                            ? 'bg-gradient-to-r from-emerald-50 to-transparent border-emerald-500 text-emerald-700'
                            : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}"
                    >
                        <svg
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>
                        Tax Rates
                    </button>
                </nav>
            </div>

            <!-- Content Area -->
            <div
                class="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
            >
                {#if activeTab === "company"}
                    <div class="p-6 sm:p-8">
                        <div class="mb-8">
                            <h2 class="text-2xl font-bold text-slate-900">
                                Company Profile
                            </h2>
                            <p class="text-slate-500 text-sm mt-2">
                                This information appears on your invoices and
                                estimates.
                            </p>
                        </div>

                        <div class="space-y-8 max-w-2xl">
                            <!-- Logo Section -->
                            <div class="pb-8 border-b border-slate-100">
                                <h3
                                    class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"
                                >
                                    <span
                                        class="w-1 h-1 bg-emerald-500 rounded-full"
                                    ></span>
                                    Company Logo
                                </h3>
                                <p class="text-sm text-slate-600 mb-4">
                                    Upload your company logo. Recommended size:
                                    200x200px or higher.
                                </p>
                                <FileUpload
                                    value={editedSettings.company.logo}
                                    label="Upload Logo"
                                    sublabel="PNG, JPG, or SVG"
                                    accept="image/*"
                                    formatHint="PNG, JPG, SVG"
                                    onupload={handleLogoUpload}
                                    onremove={handleLogoRemove}
                                />
                            </div>

                            <!-- Basic Information Section -->
                            <div class="pb-8 border-b border-slate-100">
                                <h3
                                    class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"
                                >
                                    <span
                                        class="w-1 h-1 bg-emerald-500 rounded-full"
                                    ></span>
                                    Basic Information
                                </h3>

                                <div class="space-y-4">
                                    <div>
                                        <label
                                            for="fCompanyName"
                                            class="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Company Name <span
                                                class="text-red-500">*</span
                                            >
                                        </label>
                                        <input
                                            id="fCompanyName"
                                            type="text"
                                            bind:value={
                                                editedSettings.company.name
                                            }
                                            placeholder="e.g., Acme Corporation"
                                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            for="fDomain"
                                            class="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Industry / Domain
                                        </label>
                                        <input
                                            id="fDomain"
                                            type="text"
                                            bind:value={
                                                editedSettings.company.domain
                                            }
                                            placeholder="e.g., Health Tech, Construction, Consulting"
                                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Contact Information Section -->
                            <div class="pb-8 border-b border-slate-100">
                                <h3
                                    class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"
                                >
                                    <span
                                        class="w-1 h-1 bg-emerald-500 rounded-full"
                                    ></span>
                                    Contact Information
                                </h3>

                                <div class="space-y-4">
                                    <div>
                                        <label
                                            for="fEmail"
                                            class="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            id="fEmail"
                                            type="email"
                                            bind:value={
                                                editedSettings.company.email
                                            }
                                            placeholder="contact@company.com"
                                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            for="fPhone"
                                            class="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            id="fPhone"
                                            type="tel"
                                            bind:value={
                                                editedSettings.company.phone
                                            }
                                            placeholder="+1 (555) 000-0000"
                                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            for="fWebsite"
                                            class="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Website
                                        </label>
                                        <input
                                            id="fWebsite"
                                            type="url"
                                            bind:value={
                                                editedSettings.company.website
                                            }
                                            placeholder="https://company.com"
                                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Address & Tax Information Section -->
                            <div>
                                <h3
                                    class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"
                                >
                                    <span
                                        class="w-1 h-1 bg-emerald-500 rounded-full"
                                    ></span>
                                    Address & Tax Information
                                </h3>

                                <div class="space-y-4">
                                    <div>
                                        <label
                                            for="fAddress"
                                            class="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Business Address
                                        </label>
                                        <textarea
                                            id="fAddress"
                                            bind:value={
                                                editedSettings.company.address
                                            }
                                            rows="3"
                                            placeholder="123 Street Name, City, State, ZIP, Country"
                                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors resize-none"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label
                                            for="fTaxId"
                                            class="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Tax ID / Business Number
                                        </label>
                                        <input
                                            id="fTaxId"
                                            type="text"
                                            bind:value={
                                                editedSettings.company.taxId
                                            }
                                            placeholder="e.g., EIN, VAT Number, Business License"
                                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}

                {#if activeTab === "defaults"}
                    <div class="p-6 sm:p-8">
                        <div class="mb-8">
                            <h2 class="text-2xl font-bold text-slate-900">
                                Invoice Defaults
                            </h2>
                            <p class="text-slate-500 text-sm mt-2">
                                These settings will be automatically applied to
                                all new invoices and estimates.
                            </p>
                        </div>

                        <div class="space-y-8 max-w-2xl">
                            <!-- Currency & Tax Section -->
                            <div class="pb-8 border-b border-slate-100">
                                <h3
                                    class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"
                                >
                                    <span
                                        class="w-1 h-1 bg-emerald-500 rounded-full"
                                    ></span>
                                    Billing Settings
                                </h3>

                                <div class="space-y-4">
                                    <div>
                                        <label
                                            for="fDefCurrency"
                                            class="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Default Currency
                                        </label>
                                        <select
                                            id="fDefCurrency"
                                            bind:value={
                                                editedSettings.defaultCurrency
                                            }
                                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors bg-white"
                                        >
                                            {#each CURRENCIES as c}
                                                <option value={c.code}
                                                    >{c.code} - {c.name}</option
                                                >
                                            {/each}
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            for="fDefTax"
                                            class="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Default Tax Rate (%)
                                        </label>
                                        <div class="relative">
                                            {#if $taxRates.length > 0}
                                                <select
                                                    id="fDefTax"
                                                    bind:value={
                                                        editedSettings.defaultTaxRate
                                                    }
                                                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors bg-white"
                                                >
                                                    <option value={0}
                                                        >No Tax (0%)</option
                                                    >
                                                    {#each $taxRates as tax}
                                                        <option value={tax.rate}
                                                            >{tax.name} ({tax.rate}%)</option
                                                        >
                                                    {/each}
                                                </select>
                                            {:else}
                                                <input
                                                    id="fDefTax"
                                                    type="number"
                                                    bind:value={
                                                        editedSettings.defaultTaxRate
                                                    }
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors"
                                                />
                                                <span
                                                    class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium"
                                                    >%</span
                                                >
                                            {/if}
                                        </div>
                                        <p class="text-xs text-slate-500 mt-1">
                                            This tax rate will be applied to
                                            line items by default.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Notes & Terms Section -->
                            <div>
                                <h3
                                    class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"
                                >
                                    <span
                                        class="w-1 h-1 bg-emerald-500 rounded-full"
                                    ></span>
                                    Invoice Notes & Terms
                                </h3>

                                <div class="space-y-4">
                                    <div>
                                        <label
                                            for="fDefNotes"
                                            class="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Default Notes
                                        </label>
                                        <p class="text-xs text-slate-500 mb-2">
                                            Visible to your clients on invoices
                                        </p>
                                        <textarea
                                            id="fDefNotes"
                                            bind:value={
                                                editedSettings.defaultNotes
                                            }
                                            rows="3"
                                            placeholder="Thank you for your business!"
                                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors resize-none"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label
                                            for="fDefTerms"
                                            class="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Default Terms & Conditions
                                        </label>
                                        <p class="text-xs text-slate-500 mb-2">
                                            Visible to your clients on invoices
                                        </p>
                                        <textarea
                                            id="fDefTerms"
                                            bind:value={
                                                editedSettings.defaultTerms
                                            }
                                            rows="3"
                                            placeholder="Payment due upon receipt."
                                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}

                {#if activeTab === "tax"}
                    <div class="p-6 sm:p-8">
                        <div class="mb-8 flex justify-between items-start">
                            <div>
                                <h2 class="text-2xl font-bold text-slate-900">
                                    Tax Rates
                                </h2>
                                <p class="text-slate-500 text-sm mt-2">
                                    Manage frequently used tax rates for your
                                    invoices.
                                </p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <!-- Add New Tax Rate -->
                            <div
                                class="bg-slate-50 p-6 rounded-xl border border-slate-200 h-fit"
                            >
                                <h3
                                    class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6"
                                >
                                    Add New Tax Rate
                                </h3>

                                <div class="space-y-4">
                                    <div>
                                        <label
                                            for="newTaxName"
                                            class="block text-xs font-semibold text-slate-500 uppercase mb-1.5"
                                        >
                                            Tax Name
                                        </label>
                                        <input
                                            id="newTaxName"
                                            type="text"
                                            bind:value={newTaxName}
                                            placeholder="e.g., VAT, GST, Sales Tax"
                                            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            for="newTaxRate"
                                            class="block text-xs font-semibold text-slate-500 uppercase mb-1.5"
                                        >
                                            Rate (%)
                                        </label>
                                        <input
                                            id="newTaxRate"
                                            type="number"
                                            step="0.01"
                                            bind:value={newTaxRate}
                                            placeholder="0.00"
                                            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <input
                                            id="isTaxDefault"
                                            type="checkbox"
                                            bind:checked={isTaxDefault}
                                            class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                                        />
                                        <label
                                            for="isTaxDefault"
                                            class="text-sm text-slate-600"
                                        >
                                            Set as default for new documents
                                        </label>
                                    </div>
                                    <AppButton
                                        variant="primary"
                                        size="sm"
                                        class="w-full mt-2"
                                        onclick={handleAddTaxRate}
                                    >
                                        Save Tax Rate
                                    </AppButton>
                                </div>
                            </div>

                            <!-- List Tax Rates -->
                            <div class="space-y-4">
                                <h3
                                    class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2"
                                >
                                    Saved Tax Rates
                                </h3>

                                {#if $taxRates.length === 0}
                                    <div
                                        class="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl"
                                    >
                                        <p class="text-slate-400 text-sm">
                                            No tax rates saved yet.
                                        </p>
                                    </div>
                                {:else}
                                    {#each $taxRates as tax}
                                        <div
                                            class="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-emerald-200 transition-colors group"
                                        >
                                            <div>
                                                <div
                                                    class="flex items-center gap-2"
                                                >
                                                    <span
                                                        class="font-semibold text-slate-900"
                                                        >{tax.name}</span
                                                    >
                                                    {#if tax.isDefault}
                                                        <span
                                                            class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded"
                                                            >Default</span
                                                        >
                                                    {/if}
                                                </div>
                                                <p
                                                    class="text-sm text-slate-500"
                                                >
                                                    {tax.rate}%
                                                </p>
                                            </div>
                                            <button
                                                onclick={() =>
                                                    deleteTaxRate(tax.id)}
                                                class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                title="Delete Tax Rate"
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
                                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
