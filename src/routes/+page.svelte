<script lang="ts">
    import { invoices } from "$lib/stores/invoices";
    import { settings } from "$lib/stores/settings";
    import StatCard from "$lib/components/StatCard.svelte";
    import DataTable from "$lib/components/DataTable.svelte";
    import StatusBadge from "$lib/components/StatusBadge.svelte";
    import AppButton from "$lib/components/AppButton.svelte";
    import { formatCurrency, formatDate } from "$lib/utils/formatters";

    $: totalInvoiced = $invoices.reduce(
        (sum, inv) => sum + calculateTotal(inv),
        0,
    );

    $: totalOwing = $invoices
        .filter((inv) => inv.status === "sent" || inv.status === "viewed")
        .reduce((sum, inv) => sum + calculateTotal(inv), 0);

    $: totalOverdue = $invoices
        .filter((inv) => inv.status === "overdue")
        .reduce((sum, inv) => sum + calculateTotal(inv), 0);

    // Helper to calculate invoice total (simplified for dashboard)
    function calculateTotal(invoice: any) {
        const subtotal = invoice.items.reduce(
            (sum: number, item: any) => sum + item.rate * item.quantity,
            0,
        );
        return subtotal + invoice.shipping - invoice.discount;
    }

    const columns = [
        { key: "invoiceNumber", label: "Number" },
        { key: "client", label: "Client" },
        { key: "status", label: "Status" },
        { key: "amount", label: "Amount", align: "right" as const },
    ];

    // Map invoices for the data table
    $: tableData = $invoices.slice(0, 5).map((inv) => ({
        raw: inv,
        invoiceNumber: inv.invoiceNumber,
        client: inv.client.companyName,
        status: inv.status,
        amount: formatCurrency(calculateTotal(inv), inv.currency),
    }));
</script>

<svelte:head>
    <title>Dashboard - Invoicer App</title>
</svelte:head>

<div class="p-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
        <div
            class="flex flex-col mb-4 md:mb-0 md:flex-row md:items-center gap-4"
        >
            <div
                class="h-12 w-12 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-800"
            >
                {($settings?.company?.name || "MY")
                    .substring(0, 2)
                    .toUpperCase()}
            </div>
            <div>
                <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
                    Good afternoon, {$settings?.company?.name || "User"}
                </h1>
                <p class="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="3"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    Free trial. 14 days remaining.
                    <a href="/settings" class="text-blue-500 hover:underline"
                        >Upgrade now and save.</a
                    >
                </p>
            </div>
        </div>

        <div class="flex items-center gap-3">
            <AppButton href="/invoices/new" variant="primary">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                New Invoice
            </AppButton>
            <AppButton href="/invoices/new" variant="primary">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                New Estimate
            </AppButton>
            <AppButton href="/clients" variant="primary">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                </svg>
                Add Client
            </AppButton>
        </div>
    </div>

    <!-- Overview Cards -->
    <div
        class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
        <div class="flex items-center gap-4">
            <h2 class="text-xl font-bold text-slate-800 tracking-tight">
                Overview
            </h2>
            <div class="relative inline-block w-40">
                <select
                    class="block w-full appearance-none bg-white border border-slate-300 text-slate-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-slate-500 shadow-sm text-sm font-medium"
                >
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>Year to Date</option>
                    <option>All Time</option>
                </select>
                <div
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700"
                >
                    <svg
                        class="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        ><path
                            d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                        /></svg
                    >
                </div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
            title="Invoiced"
            amount={totalInvoiced}
            linkText="View invoiced"
            linkHref="/invoices"
            type="invoiced"
        />
        <StatCard
            title="Owing"
            amount={totalOwing}
            linkText="View owing"
            linkHref="/invoices?status=owing"
            type="owing"
        />
        <StatCard
            title="Overdue"
            amount={totalOverdue}
            linkText="View overdue"
            linkHref="/invoices?status=overdue"
            type="overdue"
        />
    </div>

    <!-- Recent Invoices and Estimates Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
            <h2 class="text-xl font-bold text-slate-800 mb-4 tracking-tight">
                Recent Invoices
            </h2>
            <DataTable
                {columns}
                data={tableData}
                emptyMessage="You have no invoices."
            >
                <svelte:fragment slot="emptyStateAction">
                    <a
                        href="/invoices/new"
                        class="text-emerald-500 hover:text-emerald-600 font-medium mt-2"
                        >Create an invoice</a
                    >
                </svelte:fragment>
                <svelte:fragment slot="row" let:row>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a
                            href={`/invoices/${row.raw.id}/preview`}
                            class="text-blue-500 hover:text-blue-700 hover:underline"
                            >{row.invoiceNumber}</a
                        >
                    </td>
                    <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-slate-600"
                    >
                        {row.client}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={row.status} />
                    </td>
                    <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 text-right"
                    >
                        {row.amount}
                    </td>
                </svelte:fragment>
            </DataTable>
        </div>

        <div>
            <h2 class="text-xl font-bold text-slate-800 mb-4 tracking-tight">
                Recent Estimates
            </h2>
            <DataTable
                {columns}
                data={[]}
                emptyMessage="You have no estimates."
            >
                <svelte:fragment slot="emptyStateAction">
                    <a
                        href="/invoices/new"
                        class="text-blue-500 hover:text-blue-600 font-medium mt-2"
                        >create an estimate</a
                    >
                </svelte:fragment>
            </DataTable>
        </div>
    </div>

    <!-- Recent Activity Section -->
    <div class="mt-12">
        <h2 class="text-xl font-bold text-slate-800 mb-4 tracking-tight">
            Recent activity
        </h2>
        <div
            class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        >
            <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                    <tr>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >Event</th
                        >
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >Description</th
                        >
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >Document</th
                        >
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >Date</th
                        >
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-slate-100">
                    {#each $invoices.slice(0, 3) as inv}
                        <tr>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm text-slate-600"
                                >Invoice sent</td
                            >
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm text-slate-500"
                                >Invoice {inv.invoiceNumber} was delivered to {inv
                                    .client.companyName}</td
                            >
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                            >
                                <a
                                    href={`/invoices/${inv.id}/preview`}
                                    class="text-blue-500 hover:underline"
                                    >{inv.invoiceNumber}</a
                                >
                            </td>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm text-slate-500"
                                >{formatDate(inv.dateIssued)}</td
                            >
                        </tr>
                    {/each}
                    {#if $invoices.length === 0}
                        <tr>
                            <td
                                colspan="4"
                                class="px-6 py-12 text-center text-sm text-slate-400 italic"
                                >No recent activity.</td
                            >
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</div>
