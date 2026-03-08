<script lang="ts">
    import { estimates } from "$lib/stores/estimates";
    import DataTable from "$lib/components/DataTable.svelte";
    import StatusBadge from "$lib/components/StatusBadge.svelte";
    import AppButton from "$lib/components/AppButton.svelte";
    import { formatCurrency, formatDate } from "$lib/utils/formatters";
    import type { EstimateStatus } from "$lib/models/estimate";

    let currentFilter: EstimateStatus | "all" = "all";

    const filterTabs = [
        { value: "all", label: "All Estimates" },
        { value: "draft", label: "Draft" },
        { value: "sent", label: "Sent" },
        { value: "viewed", label: "Viewed" },
        { value: "accepted", label: "Accepted" },
        { value: "declined", label: "Declined" },
        { value: "expired", label: "Expired" },
    ];

    // Helper to calculate estimate total
    function calculateTotal(estimate: any) {
        const subtotal = estimate.items.reduce(
            (sum: number, item: any) => sum + item.rate * item.quantity,
            0,
        );
        const taxAmount = subtotal * (estimate.taxRate / 100);
        return subtotal + taxAmount + estimate.shipping - estimate.discount;
    }

    const columns = [
        { key: "estimateNumber", label: "Number" },
        { key: "client", label: "Client" },
        { key: "status", label: "Status" },
        { key: "amount", label: "Amount", align: "right" as const },
        { key: "dateIssued", label: "Date", align: "right" as const },
    ];

    // Filter and map estimates for the data table
    $: filteredEstimates = $estimates.filter(
        (est) => currentFilter === "all" || est.status === currentFilter,
    );

    $: tableData = filteredEstimates.map((est) => ({
        raw: est,
        estimateNumber: est.estimateNumber,
        client: est.client.companyName,
        status: est.status,
        amount: formatCurrency(calculateTotal(est), est.currency),
        dateIssued: formatDate(est.dateIssued),
    }));
</script>

<svelte:head>
    <title>Estimates - Invoicer App</title>
</svelte:head>

<div class="p-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div
        class="flex items-center justify-between mb-8 flex-col sm:flex-row gap-4"
    >
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
            Estimates
        </h1>
        <AppButton href="/estimates/new" variant="primary">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-4 h-4 mr-2"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                />
            </svg>
            New Estimate
        </AppButton>
    </div>

    <!-- Filter Tabs -->
    <div class="mb-6 overflow-x-auto">
        <div class="border-b border-slate-200">
            <nav class="-mb-px flex space-x-8 min-w-max" aria-label="Tabs">
                {#each filterTabs as tab}
                    <button
                        on:click={() =>
                            (currentFilter = tab.value as
                                | EstimateStatus
                                | "all")}
                        class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none
              {currentFilter === tab.value
                            ? 'border-emerald-500 text-emerald-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}"
                    >
                        {tab.label}
                        {#if tab.value === "all"}
                            <span
                                class="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2.5 rounded-full text-xs"
                            >
                                {$estimates.length}
                            </span>
                        {:else}
                            {@const count = $estimates.filter(
                                (e) => e.status === tab.value,
                            ).length}
                            {#if count > 0}
                                <span
                                    class="ml-2 {currentFilter === tab.value
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-slate-100 text-slate-600'} py-0.5 px-2.5 rounded-full text-xs"
                                >
                                    {count}
                                </span>
                            {/if}
                        {/if}
                    </button>
                {/each}
            </nav>
        </div>
    </div>

    <!-- Data Table -->
    <DataTable
        {columns}
        data={tableData}
        emptyMessage={`No ${currentFilter === "all" ? "" : currentFilter + " "}estimates found.`}
    >
        <svelte:fragment slot="emptyStateAction">
            <AppButton
                href="/estimates/new"
                variant="primary"
                size="sm"
                class="mt-4"
            >
                Create your first estimate
            </AppButton>
        </svelte:fragment>

        <svelte:fragment slot="row" let:row>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a
                    href={`/estimates/${row.raw.id}/preview`}
                    class="text-blue-500 hover:text-blue-700 hover:underline"
                    >{row.estimateNumber}</a
                >
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600"
                >{row.client}</td
            >
            <td class="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={row.status} />
            </td>
            <td
                class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 text-right"
                >{row.amount}</td
            >
            <td
                class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right"
                >{row.dateIssued}</td
            >
        </svelte:fragment>
    </DataTable>
</div>
