<script lang="ts">
    import { invoices } from "$lib/stores/invoices";
    import { clients } from "$lib/stores/clients";
    import { settings } from "$lib/stores/settings";
    import { estimates } from "$lib/stores/estimates";
    import StatusBadge from "$lib/components/StatusBadge.svelte";
    import AppButton from "$lib/components/AppButton.svelte";
    import { formatCurrency, formatDate } from "$lib/utils/formatters";
    import { fade, slide, fly } from "svelte/transition";
    import { goto } from "$app/navigation";

    let { data } = $props();
    let { session } = $derived(data);

    // Derived statistics
    let totalInvoiced = $derived(
        $invoices.reduce((sum, inv) => sum + calculateTotal(inv), 0),
    );
    let totalPaid = $derived(
        $invoices
            .filter((inv) => inv.status === "paid")
            .reduce((sum, inv) => sum + calculateTotal(inv), 0),
    );
    let totalPending = $derived(
        $invoices
            .filter((inv) => inv.status === "sent" || inv.status === "viewed")
            .reduce((sum, inv) => sum + calculateTotal(inv), 0),
    );
    let totalOverdue = $derived(
        $invoices
            .filter((inv) => inv.status === "overdue")
            .reduce((sum, inv) => sum + calculateTotal(inv), 0),
    );

    let recentInvoices = $derived(
        [...$invoices].sort((a, b) => new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime())
    );

    function calculateTotal(invoice: any) {
        const subtotal = (invoice.items || []).reduce(
            (sum: number, item: any) =>
                sum + (item.rate || 0) * (item.quantity || 0),
            0,
        );
        const taxAmount = subtotal * ((invoice.taxRate || 0) / 100);
        return (
            subtotal +
            taxAmount +
            (invoice.shipping || 0) -
            (invoice.discount || 0)
        );
    }

    // Chart data simulation
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const revenueData = [4500, 5200, 4800, 6100, 5900, 7200];
    const maxRevenue = Math.max(...revenueData);

    let hoveringBar = $state<number | null>(null);

    function handleInvoiceClick(id: string) {
        goto(`/invoices/${id}/preview`);
    }
</script>

<svelte:head>
    <title>Dashboard | Invoicer App</title>
</svelte:head>

<div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-10"
    in:fade={{ duration: 400 }}
>
    <div class="max-w-7xl mx-auto">
    </div>
        <!-- Main Content -->
        <div class="space-y-8">
            <!-- Greeting & Overview Section -->
            <div>
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-slate-900">Good afternoon</h1>
                        <p class="text-slate-500 text-sm mt-2">
                            <span class="inline-flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path fill-rule="evenodd" d="M8.603 3.799A4.823 4.823 0 0112 2.25c1.357 0 2.573.455 3.397 1.226.243.264.585.42.92.42.338 0 .678-.156.92-.42A4.823 4.823 0 0121.75 2.25h.007a.75.75 0 01.75.75V5a6 6 0 00-6-6h-.007a.75.75 0 00-.75.75v.003zM12 12a6 6 0 016-6H12a6 6 0 00-6 6v6a6 6 0 006 6h6a6 6 0 006-6v-.007a.75.75 0 01.75-.75H21a.75.75 0 01.75.75v.007a7.5 7.5 0 01-7.5 7.5h-6a7.5 7.5 0 01-7.5-7.5V12Z" clip-rule="evenodd" />
                                </svg>
                                Free trial. 14 days remaining.
                            </span>
                            <span class="text-blue-500 font-medium">Upgrade now and save.</span>
                        </p>
                    </div>

                    <div class="flex items-center gap-3">
                        <AppButton
                            href="/invoices/new"
                            variant="primary"
                            class="!rounded-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            New Invoice
                        </AppButton>
                        <AppButton
                            href="/estimates/new"
                            variant="primary"
                            class="!rounded-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            New Estimate
                        </AppButton>
                        <AppButton
                            href="/clients/new"
                            variant="primary"
                            class="!rounded-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Add Client
                        </AppButton>
                    </div>
                </div>

                <!-- Overview with filter -->
                <div class="flex items-center gap-4 mb-6">
                    <h2 class="text-xl font-bold text-slate-900">Overview</h2>
                    <button class="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Last 30 Days
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- 3-Column Metrics Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Invoiced Card -->
                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 class="text-sm font-medium text-slate-600">Invoiced</h3>
                    </div>
                    <p class="text-3xl font-bold text-slate-900 mb-4">{formatCurrency(totalInvoiced, $settings.defaultCurrency)}</p>
                    <a href="/invoices" class="text-sm text-blue-500 hover:text-blue-600 font-medium">View invoiced →</a>
                </div>

                <!-- Owing/Pending Card -->
                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 class="text-sm font-medium text-slate-600">Owing</h3>
                    </div>
                    <p class="text-3xl font-bold text-slate-900 mb-4">{formatCurrency(totalPending, $settings.defaultCurrency)}</p>
                    <a href="/invoices?status=pending" class="text-sm text-blue-500 hover:text-blue-600 font-medium">View owing →</a>
                </div>

                <!-- Overdue Card -->
                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 class="text-sm font-medium text-slate-600">Overdue</h3>
                    </div>
                    <p class="text-3xl font-bold text-slate-900 mb-4">{formatCurrency(totalOverdue, $settings.defaultCurrency)}</p>
                    <a href="/invoices?status=overdue" class="text-sm text-blue-500 hover:text-blue-600 font-medium">View overdue →</a>
                </div>
            </div>

            <!-- Side-by-side Tables Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Recent Invoices Table -->
                <div class="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div class="px-6 py-4 border-b border-slate-200 bg-white">
                        <h2 class="text-lg font-bold text-slate-900">Recent Invoices</h2>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-slate-200 bg-slate-50">
                                    <th class="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Number</th>
                                    <th class="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Client</th>
                                    <th class="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                    <th class="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                {#each recentInvoices.slice(0, 5) as invoice (invoice.id)}
                                    <tr class="hover:bg-slate-50 transition-colors">
                                        <td class="px-6 py-3 text-sm font-semibold text-slate-900">
                                            <a href="/invoices/{invoice.id}" class="text-blue-500 hover:text-blue-600">
                                                {invoice.invoiceNumber || `INV-${invoice.id.slice(0, 6)}`}
                                            </a>
                                        </td>
                                        <td class="px-6 py-3 text-sm text-slate-600">
                                            {invoice.client?.companyName || "Unknown"}
                                        </td>
                                        <td class="px-6 py-3 text-sm">
                                            <StatusBadge status={invoice.status} />
                                        </td>
                                        <td class="px-6 py-3 text-sm font-bold text-slate-900 text-right">
                                            {formatCurrency(calculateTotal(invoice), invoice.currency)}
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>

                        {#if recentInvoices.length === 0}
                            <div class="px-6 py-8 text-center text-slate-500">
                                <p class="text-sm">No invoices yet. <a href="/invoices/new" class="text-blue-500 hover:text-blue-600 font-medium">Create one now</a></p>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Recent Estimates Table -->
                <div class="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div class="px-6 py-4 border-b border-slate-200 bg-white">
                        <h2 class="text-lg font-bold text-slate-900">Recent Estimates</h2>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-slate-200 bg-slate-50">
                                    <th class="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Number</th>
                                    <th class="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Client</th>
                                    <th class="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                    <th class="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                {#each $estimates.slice(0, 5) as estimate (estimate.id)}
                                    <tr class="hover:bg-slate-50 transition-colors">
                                        <td class="px-6 py-3 text-sm font-semibold text-slate-900">
                                            <a href="/estimates/{estimate.id}" class="text-blue-500 hover:text-blue-600">
                                                {estimate.estimateNumber || `EST-${estimate.id.slice(0, 6)}`}
                                            </a>
                                        </td>
                                        <td class="px-6 py-3 text-sm text-slate-600">
                                            {estimate.client?.companyName || "Unknown"}
                                        </td>
                                        <td class="px-6 py-3 text-sm">
                                            <StatusBadge status={estimate.status} />
                                        </td>
                                        <td class="px-6 py-3 text-sm font-bold text-slate-900 text-right">
                                            {formatCurrency(calculateTotal(estimate), estimate.currency)}
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>

                        {#if $estimates.length === 0}
                            <div class="px-6 py-8 text-center text-slate-500">
                                <p class="text-sm">You have no estimates yet. <a href="/estimates/new" class="text-blue-500 hover:text-blue-600 font-medium">Create an estimate</a></p>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Recent Activity Section -->
            <div class="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-200 bg-white">
                    <h2 class="text-lg font-bold text-slate-900">Recent activity</h2>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-slate-200 bg-slate-50">
                                <th class="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Event</th>
                                <th class="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</th>
                                <th class="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Document</th>
                                <th class="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            {#each recentInvoices.slice(0, 3) as invoice (invoice.id)}
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-3 text-sm font-medium text-slate-900">
                                        {#if invoice.status === 'viewed'}
                                            Invoice PDF viewed
                                        {:else if invoice.status === 'paid'}
                                            Invoice marked paid
                                        {:else if invoice.status === 'sent'}
                                            Invoice sent
                                        {:else}
                                            Invoice {invoice.status}
                                        {/if}
                                    </td>
                                    <td class="px-6 py-3 text-sm text-slate-600">
                                        Invoice {invoice.invoiceNumber || `INV-${invoice.id.slice(0, 6)}`} was {invoice.status} by {invoice.client?.contactName || 'client'}
                                    </td>
                                    <td class="px-6 py-3 text-sm">
                                        <a href="/invoices/{invoice.id}" class="text-blue-500 hover:text-blue-600 font-medium">
                                            {invoice.invoiceNumber || `INV-${invoice.id.slice(0, 6)}`}
                                        </a>
                                    </td>
                                    <td class="px-6 py-3 text-sm text-slate-600">
                                        {formatDate(new Date(invoice.dateIssued))}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>

                    {#if recentInvoices.length === 0}
                        <div class="px-6 py-12 text-center text-slate-500">
                            <p class="text-sm">No activity yet. Create your first invoice to get started.</p>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
</div>

