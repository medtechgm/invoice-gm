<script lang="ts">
    import { settings, updateSettings } from "$lib/stores/settings";
    import { taxRates, addTaxRate, deleteTaxRate } from "$lib/stores/tax";
    import AppButton from "$lib/components/AppButton.svelte";
    import FileUpload from "$lib/components/FileUpload.svelte";
    import FormField from "$lib/components/FormField.svelte";
    import PageHeader from "$lib/components/PageHeader.svelte";
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

    const settingsTabs = [
        {
            id: "company",
            label: "Company Profile",
            icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
        },
        {
            id: "defaults",
            label: "Invoice Defaults",
            icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        },
        {
            id: "tax",
            label: "Tax Rates",
            icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
        },
    ];
</script>

<svelte:head>
    <title>Settings - Invoicer App</title>
</svelte:head>

<PageHeader
    title="Settings"
    subtitle="Manage your company profile and invoice defaults"
>
    <AppButton variant="primary" size="sm" onclick={handleSave}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-4 h-4 mr-1.5"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
            />
        </svg>
        Save Changes
    </AppButton>
</PageHeader>

<!-- Toast Notifications -->
{#if saveMessage}
    <div
        class="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-5 h-5 text-emerald-500 flex-shrink-0"
        >
            <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
            />
        </svg>
        <p class="text-sm font-medium text-emerald-700">{saveMessage}</p>
    </div>
{/if}
{#if saveError}
    <div
        class="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-5 h-5 text-red-500 flex-shrink-0"
        >
            <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clip-rule="evenodd"
            />
        </svg>
        <p class="text-sm font-medium text-red-700">{saveError}</p>
    </div>
{/if}

<div class="flex flex-col lg:flex-row gap-5">
    <!-- Sidebar Tabs -->
    <div class="w-full lg:w-56 shrink-0">
        <nav
            class="section-card overflow-hidden flex lg:flex-col"
            aria-label="Settings navigation"
        >
            {#each settingsTabs as tab}
                <button
                    onclick={() => (activeTab = tab.id)}
                    class="flex items-center gap-2.5 px-4 py-3 text-sm font-medium border-b lg:border-b-0 lg:border-l-2 transition-colors flex-1 lg:flex-initial
                    {activeTab === tab.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}"
                >
                    <svg
                        class="h-4 w-4 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d={tab.icon}
                        />
                    </svg>
                    <span class="hidden sm:inline lg:inline">{tab.label}</span>
                </button>
            {/each}
        </nav>
    </div>

    <!-- Content Area -->
    <div class="flex-1 min-w-0">
        {#if activeTab === "company"}
            <div class="section-card p-5 sm:p-6">
                <div class="mb-6">
                    <h2 class="section-title">Company Profile</h2>
                    <p class="text-muted mt-1">
                        This information appears on your invoices and estimates.
                    </p>
                </div>

                <div class="space-y-8 max-w-xl">
                    <!-- Logo Section -->
                    <div class="pb-6 border-b border-slate-100">
                        <h3 class="text-sm font-semibold text-slate-900 mb-1">
                            Company Logo
                        </h3>
                        <p class="text-muted mb-4">
                            Recommended size: 200×200px or higher.
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

                    <!-- Basic Information -->
                    <div class="pb-6 border-b border-slate-100 space-y-4">
                        <h3 class="text-sm font-semibold text-slate-900">
                            Basic Information
                        </h3>
                        <FormField
                            id="fCompanyName"
                            label="Company Name"
                            bind:value={editedSettings.company.name}
                            placeholder="e.g., Acme Corporation"
                            required
                        />
                        <FormField
                            id="fDomain"
                            label="Industry / Domain"
                            bind:value={editedSettings.company.domain}
                            placeholder="e.g., Consulting, Construction"
                        />
                    </div>

                    <!-- Contact Information -->
                    <div class="pb-6 border-b border-slate-100 space-y-4">
                        <h3 class="text-sm font-semibold text-slate-900">
                            Contact Information
                        </h3>
                        <FormField
                            id="fEmail"
                            label="Email Address"
                            type="email"
                            bind:value={editedSettings.company.email}
                            placeholder="contact@company.com"
                        />
                        <FormField
                            id="fPhone"
                            label="Phone Number"
                            type="tel"
                            bind:value={editedSettings.company.phone}
                            placeholder="+1 (555) 000-0000"
                        />
                        <FormField
                            id="fWebsite"
                            label="Website"
                            type="url"
                            bind:value={editedSettings.company.website}
                            placeholder="https://company.com"
                        />
                    </div>

                    <!-- Address & Tax -->
                    <div class="space-y-4">
                        <h3 class="text-sm font-semibold text-slate-900">
                            Address & Tax Information
                        </h3>
                        <FormField
                            id="fAddress"
                            label="Business Address"
                            type="textarea"
                            bind:value={editedSettings.company.address}
                            rows={3}
                            placeholder="123 Street Name, City, State, ZIP"
                        />
                        <FormField
                            id="fTaxId"
                            label="Tax ID / Business Number"
                            bind:value={editedSettings.company.taxId}
                            placeholder="e.g., EIN, VAT Number"
                        />
                    </div>
                </div>
            </div>
        {/if}

        {#if activeTab === "defaults"}
            <div class="section-card p-5 sm:p-6">
                <div class="mb-6">
                    <h2 class="section-title">Invoice Defaults</h2>
                    <p class="text-muted mt-1">
                        Applied automatically to all new invoices and estimates.
                    </p>
                </div>

                <div class="space-y-8 max-w-xl">
                    <!-- Billing Settings -->
                    <div class="pb-6 border-b border-slate-100 space-y-4">
                        <h3 class="text-sm font-semibold text-slate-900">
                            Billing Settings
                        </h3>
                        <div>
                            <label
                                for="fDefCurrency"
                                class="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Default Currency
                            </label>
                            <select
                                id="fDefCurrency"
                                bind:value={editedSettings.defaultCurrency}
                                class="input-base"
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
                                class="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Default Tax Rate (%)
                            </label>
                            {#if $taxRates.length > 0}
                                <select
                                    id="fDefTax"
                                    bind:value={editedSettings.defaultTaxRate}
                                    class="input-base"
                                >
                                    <option value={0}>No Tax (0%)</option>
                                    {#each $taxRates as tax}
                                        <option value={tax.rate}
                                            >{tax.name} ({tax.rate}%)</option
                                        >
                                    {/each}
                                </select>
                            {:else}
                                <div class="relative">
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
                                        class="input-base pr-8"
                                    />
                                    <span
                                        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium"
                                        >%</span
                                    >
                                </div>
                            {/if}
                            <p class="text-xs text-slate-500 mt-1.5">
                                Applied to line items by default.
                            </p>
                        </div>
                    </div>

                    <!-- Notes & Terms -->
                    <div class="space-y-4">
                        <h3 class="text-sm font-semibold text-slate-900">
                            Default Notes & Terms
                        </h3>
                        <FormField
                            id="fDefNotes"
                            label="Default Notes"
                            type="textarea"
                            bind:value={editedSettings.defaultNotes}
                            rows={3}
                            placeholder="Thank you for your business!"
                            hint="Visible to clients on invoices"
                        />
                        <FormField
                            id="fDefTerms"
                            label="Default Terms & Conditions"
                            type="textarea"
                            bind:value={editedSettings.defaultTerms}
                            rows={3}
                            placeholder="Payment due upon receipt."
                            hint="Visible to clients on invoices"
                        />
                    </div>
                </div>
            </div>
        {/if}

        {#if activeTab === "tax"}
            <div class="section-card p-5 sm:p-6">
                <div class="mb-6">
                    <h2 class="section-title">Tax Rates</h2>
                    <p class="text-muted mt-1">
                        Manage frequently used tax rates for your invoices.
                    </p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Add New Tax Rate -->
                    <div
                        class="bg-slate-50 p-5 rounded-xl border border-slate-200"
                    >
                        <h3 class="text-sm font-semibold text-slate-800 mb-4">
                            Add New Tax Rate
                        </h3>
                        <div class="space-y-4">
                            <FormField
                                id="newTaxName"
                                label="Tax Name"
                                bind:value={newTaxName}
                                placeholder="e.g., VAT, GST, Sales Tax"
                            />
                            <FormField
                                id="newTaxRate"
                                label="Rate (%)"
                                type="number"
                                bind:value={newTaxRate}
                                placeholder="0.00"
                            />
                            <div class="flex items-center gap-2.5">
                                <input
                                    id="isTaxDefault"
                                    type="checkbox"
                                    bind:checked={isTaxDefault}
                                    class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                                />
                                <label
                                    for="isTaxDefault"
                                    class="text-sm text-slate-600 cursor-pointer"
                                >
                                    Set as default for new documents
                                </label>
                            </div>
                            <AppButton
                                variant="primary"
                                size="sm"
                                class="w-full"
                                onclick={handleAddTaxRate}
                            >
                                Save Tax Rate
                            </AppButton>
                        </div>
                    </div>

                    <!-- Tax Rate List -->
                    <div>
                        <h3 class="text-sm font-semibold text-slate-800 mb-4">
                            Saved Tax Rates
                        </h3>
                        {#if $taxRates.length === 0}
                            <div
                                class="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl"
                            >
                                <p class="text-sm text-slate-400">
                                    No tax rates saved yet.
                                </p>
                            </div>
                        {:else}
                            <div class="space-y-2.5">
                                {#each $taxRates as tax}
                                    <div
                                        class="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-emerald-200 transition-colors group"
                                    >
                                        <div>
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <span
                                                    class="font-semibold text-slate-900 text-sm"
                                                    >{tax.name}</span
                                                >
                                                {#if tax.isDefault}
                                                    <span
                                                        class="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded"
                                                        >Default</span
                                                    >
                                                {/if}
                                            </div>
                                            <p
                                                class="text-xs text-slate-500 mt-0.5"
                                            >
                                                {tax.rate}%
                                            </p>
                                        </div>
                                        <button
                                            onclick={() =>
                                                deleteTaxRate(tax.id)}
                                            class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            title="Delete tax rate"
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
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
